<template>
  <div class="game-app">
    <header class="game-header">
      <h1>🏰 数学王国大冒险</h1>
    </header>

    <!-- 导航栏 -->
    <GameNavbar
      v-if="currentView !== 'menu'"
      :currentMode="currentMode"
      :playerName="playerInfo.name"
      :playerCoins="playerInfo.coins"
      :playerGems="playerInfo.gems"
      :playerStars="playerInfo.stars"
      :playerLevel="playerInfo.level"
      @navigate="goBack"
      @openMenu="goToMenu"
      @openSettings="openSettings"
    />

    <!-- 主内容区 -->
    <main class="game-main">
      <!-- 主菜单 -->
      <MainMenu
        v-if="currentView === 'menu'"
        :playerName="playerInfo.name"
        :playerLevel="playerInfo.level"
        :playerCoins="playerInfo.coins"
        @startAdventure="startAdventure"
        @startShop="startShop"
        @startChallengeCenter="startChallengeCenter"
        @openAchievements="openAchievements"
        @openSettings="openSettings"
      />

      <!-- 冒险地图 -->
      <AdventureMap
        v-if="currentView === 'adventure'"
        :unlockedAreas="unlockedAreas"
        :currentAreaId="currentAreaId"
        @areaSelect="startBattle"
        @back="goBack"
      />

      <!-- 战斗游戏 -->
      <BattleGame
        v-if="currentView === 'battle'"
        @battleEnd="onBattleEnd"
        @back="goBack"
      />

      <!-- 商店视图 -->
      <ShopView
        v-if="currentView === 'shop'"
        :playerCoins="playerInfo.coins"
        :inventory="playerInventory"
        @buy="handleBuy"
        @startCashier="startCashier"
        @back="goBack"
      />

      <!-- 收银游戏 -->
      <CashierGame
        v-if="currentView === 'cashier'"
        @complete="onCashierComplete"
        @back="goBack"
      />

      <!-- 成就视图 -->
      <AchievementView
        v-show="showAchievements"
        :unlockedAchievements="[]"
        :totalRewards="{ coins: 0, exp: 0 }"
        :completionRate="0"
        @close="closeAchievements"
      />

      <!-- 设置面板 -->
      <SettingsPanel
        v-show="showSettings"
        :settings="settings"
        @close="closeSettings"
        @update="updateSettings"
      />

      <!-- 挑战中心/游戏大厅 -->
      <GameHall
        v-if="currentView === 'challenge'"
        @startSpeedChallenge="startSpeedChallenge"
        @startWorkshop="startWorkshop"
        @startCardBattle="startCardBattle"
        @openLeaderboard="openLeaderboard"
        @back="goBack"
      />

      <!-- 速算竞技场 -->
      <SpeedChallenge
        v-if="currentView === 'speedChallenge'"
        @challengeEnd="onChallengeEnd"
        @back="goBack"
      />

      <!-- 数学工坊 -->
      <Workshop
        v-if="currentView === 'workshop'"
        @back="goBack"
      />

      <!-- 卡牌对战 -->
      <CardBattle
        v-if="currentView === 'cardBattle'"
        @battleEnd="onCardBattleEnd"
        @openCollection="openCardCollection"
        @back="goBack"
      />

      <!-- 卡牌收藏 -->
      <CardCollection
        v-if="currentView === 'cardCollection'"
        @back="goBack"
        @openPack="openCardPack"
      />

      <!-- 开卡包 -->
      <CardPack
        v-if="currentView === 'cardPack'"
        @packOpened="onPackOpened"
        @back="goBack"
      />

      <!-- 排行榜 -->
      <Leaderboard
        v-if="currentView === 'leaderboard'"
        @back="goBack"
      />
    </main>

    <!-- 音频控制器 -->
    <AudioControls />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../store/gameStore'
import { useAudioStore } from '../store/audioStore'
import { useSettingsStore } from '../store/settingsStore'

// 导入组件
import MainMenu from './MainMenu.vue'
import GameNavbar from './GameNavbar.vue'
import AdventureMap from './AdventureMap.vue'
import BattleGame from './BattleGame.vue'
import ShopView from './ShopView.vue'
import CashierGame from './CashierGame.vue'
import AchievementView from './AchievementView.vue'
import SettingsPanel from './SettingsPanel.vue'
import AudioControls from './AudioControls.vue'
import GameHall from './GameHall.vue'
import SpeedChallenge from './SpeedChallenge.vue'
import Workshop from './Workshop.vue'
import CardBattle from './CardBattle.vue'
import CardCollection from './CardCollection.vue'
import CardPack from './CardPack.vue'
import Leaderboard from './Leaderboard.vue'

const gameStore = useGameStore()
const audioStore = useAudioStore()
const settingsStore = useSettingsStore()

const currentView = ref('menu')
const previousView = ref(null)
const showSettings = ref(false)
const showAchievements = ref(false)
const unlockedAreas = ref(['area_1'])
const currentAreaId = ref('area_1')

// 玩家库存（用于商店显示）
const playerInventory = computed(() => {
  return gameStore.items || []
})

// 获取设置对象
const settings = computed(() => ({
  sound: settingsStore.sound,
  music: settingsStore.music,
  musicVolume: settingsStore.musicVolume * 100,
  soundVolume: settingsStore.soundVolume * 100,
  difficulty: settingsStore.difficulty,
  grade: settingsStore.grade,
  language: settingsStore.language,
  showTutorial: settingsStore.showTutorial
}))

// 玩家信息
const playerInfo = computed(() => ({
  name: gameStore.playerName,
  level: gameStore.playerLevel,
  coins: gameStore.playerCoins,
  gems: gameStore.playerGems,
  stars: gameStore.playerStars,
  grade: gameStore.playerGrade
}))

// 当前模式
const currentMode = computed(() => {
  if (currentView.value === 'adventure' || currentView.value === 'battle') {
    return 'adventure'
  }
  if (currentView.value === 'shop' || currentView.value === 'cashier') {
    return 'shop'
  }
  if (currentView.value === 'challenge' || currentView.value === 'speedChallenge' ||
      currentView.value === 'workshop' || currentView.value === 'cardBattle' ||
      currentView.value === 'cardCollection' || currentView.value === 'cardPack' ||
      currentView.value === 'leaderboard') {
    return 'challenge_center'
  }
  return 'menu'
})

// 导航到冒险模式
const startAdventure = () => {
  previousView.value = currentView.value
  currentView.value = 'adventure'
  gameStore.setGameMode('adventure')
  audioStore.playBgm('adventure')
}

// 导航到商店模式
const startShop = () => {
  previousView.value = currentView.value
  currentView.value = 'shop'
  gameStore.setGameMode('shop')
  audioStore.playBgm('shop')
}

// 处理购买
const handleBuy = ({ items, total }) => {
  // items 是包含多个商品的数组：[{ product, quantity }, ...]
  
  // 检查金币是否足够
  if (gameStore.playerCoins < total) {
    alert('金币不足！')
    return
  }
  
  // 消费金币
  const spent = gameStore.spendCoins(total)
  if (!spent) {
    alert('购买失败！')
    return
  }
  
  // 添加所有物品到库存
  if (gameStore.inventory) {
    items.forEach(({ product, quantity }) => {
      gameStore.inventory.addItem({
        id: product.id,
        name: product.name,
        icon: product.icon,
        quantity: quantity
      })
    })
  }
  
  // 保存游戏
  gameStore.saveGame()
  
  // 播放音效
  audioStore.playSfx('victory')
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  alert(`成功购买 ${itemCount} 件商品！`)
}

// 开始战斗
const startBattle = () => {
  previousView.value = currentView.value
  currentView.value = 'battle'
  audioStore.playBgm('battle')
}

// 开始收银游戏
const startCashier = () => {
  previousView.value = currentView.value
  currentView.value = 'cashier'
}

// 打开成就
const openAchievements = () => {
  showAchievements.value = true
}

// 打开设置
const openSettings = () => {
  showSettings.value = true
}

// 关闭设置
const closeSettings = () => {
  showSettings.value = false
}

// 关闭成就
const closeAchievements = () => {
  showAchievements.value = false
}

// 返回
const goBack = () => {
  if (previousView.value) {
    currentView.value = previousView.value
    previousView.value = null
  } else {
    currentView.value = 'menu'
  }
  audioStore.playBgm('main')
}

// 返回主菜单
const goToMenu = () => {
  previousView.value = currentView.value
  currentView.value = 'menu'
  gameStore.setGameMode(null)
  audioStore.playBgm('main')
}

// 更新设置
const updateSettings = (newSettings) => {
  Object.entries(newSettings).forEach(([key, value]) => {
    // 转换音量值
    if ((key === 'musicVolume' || key === 'soundVolume') && typeof value === 'number') {
      value = value / 100
    }
    settingsStore.updateSetting(key, value)
  })
}

// 战斗结束处理
const onBattleEnd = (result) => {
  if (result.result === 'victory') {
    audioStore.playSfx('victory')
    gameStore.addExp(result.rewards.exp)
    gameStore.addCoins(result.rewards.coins)
  }
  goBack()
}

// 收银游戏完成处理
const onCashierComplete = (result) => {
  if (result.status === 'success') {
    if (result.rewards && result.rewards.coins) {
      gameStore.addCoins(result.rewards.coins)
      gameStore.addExp(result.rewards.exp)
    } else {
      const coins = result.stars * 10
      const exp = result.stars * 5 + Math.max(0, 30 - result.timeUsed)
      gameStore.addCoins(coins)
      gameStore.addExp(exp)
    }
  }
}

// 导航到挑战中心
const startChallengeCenter = () => {
  previousView.value = currentView.value
  currentView.value = 'challenge'
  gameStore.setGameMode('challenge_center')
  audioStore.playBgm('main')
}

// 导航到速算竞技
const startSpeedChallenge = () => {
  previousView.value = currentView.value
  currentView.value = 'speedChallenge'
}

// 导航到数学工坊
const startWorkshop = () => {
  previousView.value = currentView.value
  currentView.value = 'workshop'
}

// 导航到卡牌对战
const startCardBattle = () => {
  previousView.value = currentView.value
  currentView.value = 'cardBattle'
}

// 打开卡牌收藏
const openCardCollection = () => {
  previousView.value = currentView.value
  currentView.value = 'cardCollection'
}

// 打开卡包
const openCardPack = () => {
  previousView.value = currentView.value
  currentView.value = 'cardPack'
}

// 打开排行榜
const openLeaderboard = () => {
  previousView.value = currentView.value
  currentView.value = 'leaderboard'
}

// 速算结束处理
const onChallengeEnd = (result) => {
  if (result.rewards) {
    if (result.rewards.coins) gameStore.addCoins(result.rewards.coins)
    if (result.rewards.gems) gameStore.addGems(result.rewards.gems)
    if (result.rewards.exp) gameStore.addExp(result.rewards.exp)
  }
  goBack()
}

// 卡牌对战结束处理
const onCardBattleEnd = (result) => {
  if (result.rewards) {
    if (result.rewards.coins) gameStore.addCoins(result.rewards.coins)
    if (result.rewards.gems) gameStore.addGems(result.rewards.gems)
  }
}

// 卡包开启处理
const onPackOpened = (cards) => {
  // 卡牌已添加到收藏，刷新显示
}

onMounted(async () => {
  // 初始化游戏 - 等待完成
  const loaded = await gameStore.initGame()
  console.log('GameApp onMounted - game loaded:', loaded, 'player:', gameStore.player)
  
  // 如果没有存档，创建新游戏
  if (!loaded || !gameStore.player) {
    console.log('No saved game, creating new game')
    await gameStore.newGame('冒险者', 1)
    console.log('New game created - player:', gameStore.player)
  }
  
  audioStore.init()
  settingsStore.loadSettings()
  
  // 播放主菜单音乐
  audioStore.playBgm('main')
})
</script>

<style scoped>
.game-app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-header {
  padding: 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

.game-header h1 {
  margin: 0;
  color: #fff;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.game-main {
  flex: 1;
  overflow: hidden;
}
</style>
