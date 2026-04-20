<template>
  <div class="achievement-overlay" @click="$emit('close')">
    <div class="achievement-view" @click.stop>
      <div class="achievement-header">
        <h2>🏆 成就系统</h2>
        <button class="btn-close" @click="$emit('close')">×</button>
      </div>

      <!-- 统计信息 -->
      <div class="achievement-stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ completionRate }}%</span>
            <span class="stat-label">完成率</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ unlockedAchievements.length }}/{{ getAllAchievements().length }}</span>
            <span class="stat-label">已解锁</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-value">{{ safeTotalRewards.coins }}</span>
            <span class="stat-label">奖励金币</span>
          </div>
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-tab"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </div>

      <!-- 成就列表 -->
      <div class="achievement-list">
        <div
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: isUnlocked(achievement.id) }"
          :style="getAchievementStyle(achievement)"
          @click="selectAchievement(achievement)"
        >
          <div class="achievement-icon">
            {{ isUnlocked(achievement.id) ? achievement.icon : '🔒' }}
          </div>
          <div class="achievement-info">
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-desc">{{ achievement.description }}</p>
            <div class="achievement-meta">
              <span class="achievement-rarity" :style="{ color: getRarityColor(achievement.rarity) }">
                {{ getRarityLabel(achievement.rarity) }}
              </span>
              <span class="achievement-reward">
                💰 {{ achievement.reward?.coins ?? 0 }} 📖 {{ achievement.reward?.exp ?? 0 }}
              </span>
            </div>
          </div>
          <div class="achievement-status">
            <span v-if="isUnlocked(achievement.id)" class="status-unlocked">✓</span>
            <span v-else class="status-locked">🔒</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAllAchievements, getAchievementsByCategory, getRarityConfig } from '../config/achievements'

const props = defineProps({
  unlockedAchievements: {
    type: Array,
    default: () => []
  },
  totalRewards: {
    type: Object,
    default: () => ({ coins: 0, exp: 0 })
  },
  completionRate: {
    type: Number,
    default: 0
  }
})

// 安全的计算属性，防止 undefined 错误
const safeTotalRewards = computed(() => ({
  coins: props.totalRewards?.coins ?? 0,
  exp: props.totalRewards?.exp ?? 0
}))

const emit = defineEmits(['select', 'close'])

const selectedCategory = ref('all')

const achievementConfig = {
  categories: [
    { id: 'progress', name: '进度', icon: '📈' },
    { id: 'battle', name: '战斗', icon: '⚔️' },
    { id: 'shop', name: '商店', icon: '🏪' },
    { id: 'special', name: '特殊', icon: '⭐' }
  ]
}

const categories = computed(() => {
  return [
    { id: 'all', name: '全部', icon: '🏆' },
    ...achievementConfig.categories
  ]
})

const filteredAchievements = computed(() => {
  const all = getAllAchievements()
  if (selectedCategory.value === 'all') {
    return all
  }
  return getAchievementsByCategory(selectedCategory.value)
})

const isUnlocked = (achievementId) => {
  return props.unlockedAchievements.includes(achievementId)
}

const getRarityStyle = (rarity) => {
  const config = getRarityConfig(rarity)
  return {
    border: `2px solid ${config.color}`,
    bg: `${config.color}20`
  }
}

const getRarityColor = (rarity) => {
  const config = getRarityConfig(rarity)
  return config?.color || '#888'
}

const getRarityLabel = (rarity) => {
  const labels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return labels[rarity] || rarity
}

const getAchievementStyle = (achievement) => {
  const rarity = achievement.rarity
  const config = getRarityConfig(rarity)
  const isUn = isUnlocked(achievement.id)
  
  return {
    background: isUn ? `linear-gradient(135deg, ${config.color}20, ${config.color}10)` : 'rgba(0,0,0,0.2)',
    border: `1px solid ${isUn ? config.color : 'rgba(255,255,255,0.1)'}`,
    opacity: isUn ? 1 : 0.7
  }
}

const selectAchievement = (achievement) => {
  emit('select', achievement)
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.achievement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.achievement-view {
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-header h2 {
  margin: 0;
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.achievement-stats {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fbbf24;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.7;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.category-tab:hover {
  transform: translateY(-2px);
}

.achievement-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.achievement-item:hover {
  transform: translateX(5px);
}

.achievement-item.unlocked:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.achievement-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
}

.achievement-desc {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  opacity: 0.7;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-rarity {
  font-size: 0.8rem;
  font-weight: bold;
}

.achievement-reward {
  font-size: 0.85rem;
}

.achievement-status {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.status-unlocked {
  color: #4ade80;
}

.status-locked {
  opacity: 0.5;
}
</style>
