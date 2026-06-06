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
        @startChallengeCenter="startChallengeCenter"
        @openAchievements="openAchievements"
        @openSettings="openSettings"
      />

      <!-- 冒险地图 -->
      <AdventureMap
        v-if="currentView === 'adventure'"
        :unlockedAreas="unlockedAreas"
        :currentAreaId="currentAreaId"
        @areaSelect="showLevelSelect"
        @back="goBack"
      />

      <!-- 关卡选择 -->
      <LevelSelect
        v-if="currentView === 'levelSelect'"
        :area="selectedArea"
        :completedLevels="gameStore.progress?.completedLevels || []"
        :stars="gameStore.progress?.stars || {}"
        @levelSelect="onLevelSelect"
        @back="goBack"
      />

      <!-- 战斗游戏 -->
      <BattleGame
        v-if="currentView === 'battle'"
        :player="battlePlayer"
        :monster="battleMonster"
        :grade="battleGrade"
        :streak="battleStreak"
        :difficultyScale="battleDifficultyScale"
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
        @export="handleExport"
        @import="handleImport"
        @reset="handleReset"
      />

      <!-- 挑战中心/游戏大厅 -->
      <GameHall
        v-if="currentView === 'challenge'"
        @startSpeedChallenge="startSpeedChallenge"
        @startWorkshop="startWorkshop"
        @startCardBattle="startCardBattle"
        @startAdventure="startAdventureFromHall"
        @startShop="startShopFromHall"
        @startCashier="startCashierFromHall"
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
import { useBattleStore } from '../store/battleStore'
import { useShopStore } from '../store/shopStore'
import { useAchievementStore } from '../store/achievementStore'
import { useEquipmentStore } from '../store/equipmentStore'
import { useSpeedChallengeStore } from '../store/speedChallengeStore'
import { useCashierStore } from '../store/cashierStore'
import { useSaveDataStore } from '../store/saveDataStore'
import { useQuestionStore } from '../store/questionStore'
import { useWorkshopStore } from '../store/workshopStore'
import { useCardStore } from '../store/cardStore'
import storageManager from '../utils/storage'
import adventureConfig from '../config/adventure'
import { getGameConfig } from '../utils/gameContext'

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
import LevelSelect from './LevelSelect.vue'

const gameStore = useGameStore()
const audioStore = useAudioStore()
const settingsStore = useSettingsStore()
const battleStore = useBattleStore()
const shopStore = useShopStore()
const achievementStore = useAchievementStore()
const equipmentStore = useEquipmentStore()
const speedChallengeStore = useSpeedChallengeStore()
const cashierStore = useCashierStore()
const saveDataStore = useSaveDataStore()
const questionStore = useQuestionStore()
const workshopStore = useWorkshopStore()
const cardStore = useCardStore()

const currentView = ref('menu')
const previousView = ref(null)
const showSettings = ref(false)
const showAchievements = ref(false)
const unlockedAreas = ref(['area_1'])
const currentAreaId = ref('area_1')
const selectedArea = ref(null)
const selectedLevel = ref(null)

// 战斗数据（用于传递给 BattleGame）
const battlePlayer = computed(() => ({
  name: gameStore.playerName,
  hp: gameStore.player?.hp || 100,
  maxHp: gameStore.player?.maxHp || 100,
  attack: gameStore.player?.attack || 10,
  defense: gameStore.player?.defense || 5,
  luck: gameStore.player?.luck || 0,
  equipmentBonus: gameStore.player?.equipmentBonus || {}
}))

const battleMonster = ref(null)
const battleGrade = ref(1)
const battleStreak = ref(0)
const battleDifficultyScale = ref(null)

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
  grade: settingsStore.grade
}))

// 当前模式
const currentMode = computed(() => {
  if (currentView.value === 'adventure' || currentView.value === 'battle' || currentView.value === 'levelSelect') {
    return 'adventure'
  }
  if (currentView.value === 'shop') {
    return 'shop'
  }
  if (currentView.value === 'cashier') {
    return 'cashier'
  }
  if (currentView.value === 'challenge' || currentView.value === 'speedChallenge' ||
      currentView.value === 'workshop' || currentView.value === 'cardBattle' ||
      currentView.value === 'cardCollection' || currentView.value === 'cardPack' ||
      currentView.value === 'leaderboard') {
    return 'challenge_center'
  }
  return 'menu'
})

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

// 显示关卡选择界面
const showLevelSelect = (area) => {
  previousView.value = currentView.value
  selectedArea.value = area
  currentView.value = 'levelSelect'
}

// 从关卡选择进入战斗
const onLevelSelect = ({ area, level }) => {
  selectedLevel.value = level
  startBattle(area, level)
}

// 开始战斗
const startBattle = (area, level) => {
  previousView.value = currentView.value
  
  // 根据区域和关卡计算怪物和年级
  const grade = area.gradeRange[0]
  const monsterDifficulty = Math.min(5, Math.ceil(level.number / 2))
  
  // 从配置中获取怪物
  const monsters = adventureConfig.monsters
  const monsterIndex = Math.min(monsters.length - 1, monsterDifficulty - 1)
  const baseMonster = monsters[monsterIndex]
  
  // 根据关卡调整怪物血量
  battleMonster.value = {
    ...baseMonster,
    hp: 20 + level.number * 5,
    currentHp: 20 + level.number * 5,
    attack: 5 + level.number * 2,
    defense: Math.max(1, Math.floor(level.number / 3)),
    difficulty: monsterDifficulty,
    color: area.color,
    maxHp: 20 + level.number * 5,
    icon: baseMonster.id === 'slime' ? '🟢' : baseMonster.id === 'goblin' ? '👺' : baseMonster.id === 'orc' ? '👹' : '🐉'
  }
  
  // 获取难度配置并应用到怪物
  const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty)
  const scale = gameConfig.scale

  battleMonster.value = {
    ...battleMonster.value,
    hp: Math.floor((20 + level.number * 5) * scale.monsterHpRatio),
    currentHp: Math.floor((20 + level.number * 5) * scale.monsterHpRatio),
    attack: Math.floor((5 + level.number * 2) * scale.monsterAttackRatio)
  }
  battleDifficultyScale.value = scale
  
  battleGrade.value = grade
  battleStreak.value = 0
  
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

// 导出数据
const handleExport = () => {
  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      settings: {
        sound: settingsStore.sound,
        music: settingsStore.music,
        musicVolume: settingsStore.musicVolume,
        soundVolume: settingsStore.soundVolume,
        difficulty: settingsStore.difficulty,
        grade: settingsStore.grade,
        language: settingsStore.language,
        showTutorial: settingsStore.showTutorial
      },
      player: gameStore.player,
      progress: gameStore.progress,
      items: gameStore.items,
      playerName: gameStore.playerName,
      playerCoins: gameStore.playerCoins,
      playerGems: gameStore.playerGems,
      playerLevel: gameStore.playerLevel
    }
    
    const jsonStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    a.href = url
    a.download = `math-game-backup-${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('数据导出成功！')
  } catch (error) {
    console.error('Export failed:', error)
    alert('数据导出失败：' + error.message)
  }
}

// 导入数据
const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      // 验证数据格式
      if (!importData.version || !importData.settings) {
        throw new Error('无效的数据文件格式')
      }
      
      // 导入设置
      if (importData.settings) {
        Object.entries(importData.settings).forEach(([key, value]) => {
          // 归一化音量值：如果值 > 1，说明是百分比格式，需要转换为 0-1 范围
          if ((key === 'musicVolume' || key === 'soundVolume') && typeof value === 'number') {
            while (value > 1) {
              value = value / 100
            }
            value = Math.max(0, Math.min(1, value))
          }
          settingsStore.updateSetting(key, value)
        })
      }
      
      // 导入玩家数据
      if (importData.player) {
        gameStore.player = importData.player
      }
      if (importData.progress) {
        gameStore.progress = importData.progress
      }
      if (importData.items) {
        gameStore.items = importData.items
      }
      if (importData.playerName) {
        gameStore.playerName = importData.playerName
      }
      if (importData.playerCoins !== undefined) {
        gameStore.playerCoins = importData.playerCoins
      }
      if (importData.playerGems !== undefined) {
        gameStore.playerGems = importData.playerGems
      }
      if (importData.playerLevel !== undefined) {
        gameStore.playerLevel = importData.playerLevel
      }
      
      // 保存游戏
      gameStore.saveGame()
      settingsStore.saveSettings()
      
      alert('数据导入成功！页面将刷新。')
      location.reload()
    } catch (error) {
      console.error('Import failed:', error)
      alert('数据导入失败：' + (error.message || '文件格式不正确'))
    }
  }
  input.click()
}

// 重置游戏进度
const handleReset = () => {
  if (confirm('确定要重置游戏进度吗？此操作不可撤销！\n\n您的设置将保留，但所有游戏进度（关卡、金币、宝石等）将被清除。')) {
    try {
      // 清除所有游戏进度数据（保留设置）
      storageManager.resetGameKeepSettings()

      // 创建新的初始存档
      const playerName = gameStore.playerName || '冒险者'
      const grade = settingsStore.grade || 1
      storageManager.createNewGame(playerName, grade)

      // 重置所有 Pinia store 到初始状态
      gameStore.$reset()
      battleStore.$reset()
      shopStore.$reset()
      achievementStore.$reset()
      equipmentStore.$reset()
      speedChallengeStore.$reset()
      cashierStore.$reset()
      saveDataStore.$reset()
      questionStore.$reset()
      workshopStore.$reset()
      cardStore.$reset()

      alert('游戏进度已重置！页面将刷新。')
      location.reload()
    } catch (error) {
      console.error('Reset failed:', error)
      alert('重置失败：' + error.message)
    }
  }
}

// 战斗结束处理
const onBattleEnd = (result) => {
  if (result.result === 'victory') {
    audioStore.playSfx('victory')
    gameStore.addExp(result.rewards.exp)
    gameStore.addCoins(result.rewards.coins)
    
    // 保存关卡进度
    if (selectedArea.value && selectedLevel.value) {
      const levelId = `${selectedArea.value.id}_level_${selectedLevel.value.number}`
      // 根据战斗表现计算星级（这里简化为1星，可根据时间/连击等优化）
      const stars = result.streak >= 5 ? 3 : result.streak >= 3 ? 2 : 1
      gameStore.completeLevel(levelId, stars)
    }
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

// 从挑战中心进入冒险模式
const startAdventureFromHall = () => {
  previousView.value = 'challenge'
  currentView.value = 'adventure'
  gameStore.setGameMode('adventure')
  audioStore.playBgm('adventure')
}

// 从挑战中心进入经营商店
const startShopFromHall = () => {
  previousView.value = 'challenge'
  currentView.value = 'shop'
  gameStore.setGameMode('shop')
  audioStore.playBgm('shop')
}

// 从挑战中心进入收银游戏
const startCashierFromHall = () => {
  previousView.value = 'challenge'
  currentView.value = 'cashier'
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
