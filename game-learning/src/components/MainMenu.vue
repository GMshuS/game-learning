<template>
  <div class="main-menu">
    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner">🏰</div>
      <p>正在加载...</p>
    </div>

    <!-- 主菜单内容 -->
    <div v-else class="menu-content">
      <!-- 玩家信息 -->
      <div class="player-info">
        <div class="player-avatar">🧙</div>
        <div class="player-details">
          <h2 class="player-name">{{ playerInfo.name }}</h2>
          <div class="player-stats">
            <span class="level">Lv.{{ playerInfo.level }}</span>
            <span class="coins">💰 {{ playerInfo.coins }}</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: expPercent + '%' }" />
          </div>
        </div>
      </div>

      <!-- 菜单选项 -->
      <div class="menu-options">
        <div
          v-for="option in menuOptions"
          :key="option.id"
          class="menu-option"
          :class="{ selected: selectedOption?.id === option.id }"
          :style="{ background: selectedOption?.id === option.id ? option.gradient : 'rgba(255,255,255,0.1)' }"
          @click="selectOption(option)"
          @dblclick="confirmOption()"
        >
          <div class="option-icon">{{ option.icon }}</div>
          <div class="option-info">
            <h3 class="option-label">{{ option.label }}</h3>
            <p class="option-description">{{ option.description }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="menu-actions">
        <button class="btn btn-confirm" :disabled="!selectedOption" @click="confirmOption">
          确认选择
        </button>
        <button class="btn btn-quit" @click="quit">
          退出游戏
        </button>
      </div>

      <!-- 快捷提示 -->
      <p class="quick-tip">💡 双击选项可快速开始</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  playerName: {
    type: String,
    default: '冒险者'
  },
  playerLevel: {
    type: Number,
    default: 1
  },
  playerCoins: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['startChallengeCenter', 'openSettings', 'openAchievements', 'quit', 'startEnglishHall', 'startAdmin', 'startCardWorld']);

const isLoading = ref(true);
const selectedOption = ref(null);

const menuOptions = computed(() => [
  {
    id: 'challenge',
    label: '数学乐园',
    icon: '🧮',
    description: '速算竞技、针对性训练、数学工坊',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
  },
  {
    id: 'achievements',
    label: '成就系统',
    icon: '🏆',
    description: '查看你的成就和奖励',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
  },
  {
    id: 'settings',
    label: '设置',
    icon: '⚙️',
    description: '调整游戏设置和管理存档',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b 0%, #334155 100%)'
  },
  {
    id: 'cardWorld',
    label: '卡牌世界',
    icon: '🃏',
    description: '卡牌对战、收藏、开卡包',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
  },
  {
    id: 'english',
    label: '英语乐园',
    icon: '🎓',
    description: '单词速拼、英语冒险',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
  },
  {
    id: 'admin',
    label: '管理模式',
    icon: '🔐',
    description: '错题管理、权重调节、自定义模板',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
]);

const playerInfo = computed(() => ({
  name: props.playerName,
  level: props.playerLevel,
  coins: props.playerCoins,
  expNeeded: props.playerLevel * 100
}));

const expPercent = computed(() => {
  return 0; // 简化版本，暂时显示 0
});

const selectOption = (option) => {
  selectedOption.value = option;
};

const confirmOption = () => {
  if (selectedOption.value) {
    switch (selectedOption.value.id) {
    case 'challenge':
      emit('startChallengeCenter');
      break;
    case 'achievements':
      emit('openAchievements');
      break;
    case 'settings':
      emit('openSettings');
      break;
    case 'cardWorld':
      emit('startCardWorld');
      break;
    case 'english':
      emit('startEnglishHall');
      break;
    case 'admin':
      emit('startAdmin');
      break;
    }
  }
};

const quit = () => {
  emit('quit');
};

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
.main-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease;
}

.loading-spinner {
  font-size: 4rem;
  animation: bounce 1s infinite;
}

.loading p {
  margin-top: 1rem;
  font-size: 1.2rem;
  opacity: 0.8;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.menu-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.player-avatar {
  font-size: 3rem;
}

.player-details {
  flex: 1;
}

.player-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.player-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.level {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
}

.coins {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  color: #000;
}

.exp-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  transition: width 0.3s ease;
}

.menu-options {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.menu-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.menu-option.selected {
  border-color: #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.option-icon {
  font-size: 2.5rem;
}

.option-info {
  flex: 1;
}

.option-label {
  margin: 0 0 0.3rem 0;
  font-size: 1.2rem;
}

.option-description {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.menu-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-quit {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-quit:hover {
  background: rgba(255, 255, 255, 0.3);
}

.quick-tip {
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
