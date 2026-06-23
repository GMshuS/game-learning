<template>
  <nav class="game-navbar">
    <div class="navbar-left">
      <button class="btn-back" title="返回主菜单" @click="openMenu">
        ← 菜单
      </button>
      <span class="mode-label">{{ displayTitle }}</span>
    </div>

    <div class="navbar-center">
      <div class="player-status">
        <span class="player-name">{{ playerName }}</span>
        <span class="player-level">Lv.{{ playerLevel }}</span>
      </div>
    </div>

    <div class="navbar-right">
      <div class="coins-display">
        <span class="coin-icon">💰</span>
        <span class="coin-amount">{{ playerCoins }}</span>
      </div>
      <button class="btn-backpack" title="背包" @click="openInventory">
        🎒
      </button>
      <button class="btn-settings" title="设置" @click="openSettings">
        ⚙️
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentMode: {
    type: String,
    default: 'menu'
  },
  viewTitle: {
    type: String,
    default: ''
  },
  playerName: {
    type: String,
    default: '冒险者'
  },
  playerCoins: {
    type: Number,
    default: 0
  },
  playerLevel: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['navigate', 'openMenu', 'openSettings', 'openInventory']);

const modeLabels = {
  menu: '主菜单',
  adventure: '冒险模式',
  shop: '经营商店',
  battle: '战斗中',
  cashier: '收银游戏',
  challenge_center: '数学乐园',
  inventory: '背包',
  english: '英语乐园'
};

const currentModeLabel = computed(() => {
  return modeLabels[props.currentMode] || '未知模式';
});

const displayTitle = computed(() => {
  return props.viewTitle || currentModeLabel.value;
});

// navigate(mode) 函数已移除：模板中使用 openMenu 等具体事件，无需中间函数包装

const openMenu = () => {
  emit('openMenu');
};

const openSettings = () => {
  emit('openSettings');
};

const openInventory = () => {
  emit('openInventory');
};
</script>

<style scoped>
.game-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.btn-back {
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

.mode-label {
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
}

.player-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.player-name {
  font-weight: bold;
}

.player-level {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 0.2rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  color: #000;
  font-weight: bold;
}

.coin-icon {
  font-size: 1.1rem;
}

.btn-backpack {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-backpack:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.btn-settings {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-settings:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(30deg);
}
</style>
