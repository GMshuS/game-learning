<template>
  <div class="battle-game">
    <!-- 冒险模式玩法说明 -->
    <GameTutorial
      v-if="showTutorial"
      title="⚔️ 冒险模式玩法说明"
      :steps="adventureTutorialSteps"
      @close="closeTutorial"
    />
    
    <!-- 返回按钮 -->
    <button class="btn-back" @click="back">← 返回</button>
    
    <!-- 玩法说明按钮 -->
    <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
    
    <!-- Phaser 游戏容器 -->
    <div ref="gameContainer" class="phaser-container" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import BattleScene from '../scenes/BattleScene';
import { getRandomMonster } from '../config/monsters';
import GameTutorial from './GameTutorial.vue';
import { useInventoryStore } from '../store/inventoryStore';

const showTutorial = ref(false);

const adventureTutorialSteps = [
  {
    title: '选择关卡',
    description: '在世界地图上选择已解锁的区域进入关卡，每个区域有不同的难度等级。'
  },
  {
    title: '回答数学问题',
    description: '屏幕会显示数学题目和 4 个选项，点击正确答案对怪物造成伤害。'
  },
  {
    title: '战斗机制',
    description: '答对题目对怪物造成 10 点伤害，答错自己受到 5 点伤害。在 60 秒内答对题目可以获得额外连击奖励！'
  },
  {
    title: '连击奖励',
    description: '连续答对题目可以增加连击数，连击数越高，获胜后获得的经验和金币奖励越多！'
  },
  {
    title: '取得胜利',
    description: '将怪物的血量归零即可获胜，获得经验和金币奖励。如果自己的血量归零或时间用完则挑战失败。'
  }
];

const closeTutorial = () => {
  showTutorial.value = false;
};

const props = defineProps({
  player: {
    type: Object,
    default: () => ({
      name: '冒险者',
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      luck: 0,
      equipmentBonus: {}
    })
  },
  monster: {
    type: Object,
    default: null
  },
  grade: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  difficultyScale: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['battleEnd', 'back']);

const inventoryStore = useInventoryStore();

const gameContainer = ref(null);
let game = null;

onMounted(() => {
  if (gameContainer.value) {
    const monster = props.monster || getRandomMonster(props.grade);
    
    // 从 inventoryStore 读取已装备的战斗道具
    const battleItems = inventoryStore.getEquippedBattleItems;
    
    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.value,
      width: 800,
      height: 600,
      backgroundColor: '#1a1a2e',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [BattleScene]
    };
    
    game = new Phaser.Game(config);
    
    game.scene.start('BattleScene', {
      player: props.player,
      monster,
      grade: props.grade,
      streak: props.streak,
      difficultyScale: props.difficultyScale,
      battleItems,
      onBattleEnd: (battleResult) => {
        emit('battleEnd', battleResult);
      },
      onItemUsed: (itemId) => {
        inventoryStore.consumeBattleItem(itemId);
      }
    });
  }
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});

const back = () => {
  emit('back');
};
</script>

<style scoped>
.battle-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.phaser-container {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.btn-back {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-help {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-help:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>
