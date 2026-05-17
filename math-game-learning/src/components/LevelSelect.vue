<template>
  <div class="level-select">
    <div class="level-header" :style="{ borderColor: area.color }">
      <h2 :style="{ color: area.color }">{{ areaIcon }} {{ area.name }}</h2>
      <button class="btn-back" @click="emit('back')">← 返回地图</button>
    </div>
    
    <p class="level-description">{{ area.description }}</p>
    
    <div class="level-grid">
      <div
        v-for="level in levels"
        :key="level.number"
        class="level-card"
        :class="{
          'level-locked': level.locked,
          'level-completed': level.completed
        }"
        :style="{ borderColor: level.locked ? '#444' : area.color }"
        @click="selectLevel(level)"
      >
        <div class="level-number" :style="{ backgroundColor: level.locked ? '#444' : area.color }">
          {{ level.number }}
        </div>
        
        <div class="level-stars">
          <span v-for="star in 3" :key="star" class="star" :class="{ active: star <= level.stars }">
            {{ star <= level.stars ? '⭐' : '☆' }}
          </span>
        </div>
        
        <div v-if="level.locked" class="lock-overlay">
          <span class="lock-icon">🔒</span>
        </div>
        
        <div v-if="level.completed" class="completed-badge">✓</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  area: {
    type: Object,
    required: true
  },
  completedLevels: {
    type: Array,
    default: () => []
  },
  stars: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['levelSelect', 'back'])

const areaIcon = computed(() => {
  const icons = { 'area_1': '🌲', 'area_2': '🏔️', 'area_3': '🏰', 'area_4': '🏝️', 'area_5': '👑' }
  return icons[props.area.id] || '⭐'
})

const selectLevel = (level) => {
  if (level.locked) return
  emit('levelSelect', { area: props.area, level })
}

const levels = computed(() => {
  const result = []
  const totalLevels = props.area.levels || 10
  
  for (let i = 1; i <= totalLevels; i++) {
    const levelId = `${props.area.id}_level_${i}`
    const isCompleted = props.completedLevels.includes(levelId)
    const levelStars = props.stars[levelId] || 0
    
    // Level 1 is always unlocked if area is unlocked
    // Subsequent levels unlock when previous level is completed
    const isLocked = i > 1 && !props.completedLevels.includes(`${props.area.id}_level_${i - 1}`)
    
    result.push({
      number: i,
      id: levelId,
      locked: isLocked,
      completed: isCompleted,
      stars: levelStars
    })
  }
  
  return result
})
</script>

<style scoped>
.level-select {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  color: #fff;
  overflow-y: auto;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid;
}

.level-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.level-description {
  color: #cccccc;
  margin-bottom: 1.5rem;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.level-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  user-select: none;
}

.level-card > * {
  pointer-events: none;
}

.level-card:not(.level-locked):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.level-card.level-locked {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #444 !important;
}

.level-card.level-completed {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.level-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.level-stars {
  display: flex;
  gap: 2px;
  font-size: 0.9rem;
}

.star.active {
  color: #fbbf24;
}

.star:not(.active) {
  color: #444;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  pointer-events: auto !important;
}

.lock-icon {
  font-size: 2rem;
}

.completed-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4ade80;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  color: #fff;
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
</style>
