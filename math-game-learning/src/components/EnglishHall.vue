<template>
  <div class="english-hall">
    <!-- 顶部标题 -->
    <div class="header">
      <div class="header-left">
        <h2>🎓 英语乐园</h2>
        <p class="level-info">
          Level {{ effectiveLevel }} · {{ levelTheme }}
        </p>
      </div>
      <div class="header-actions">
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </div>

    <p class="subtitle">选择模式开始英语单词挑战！</p>

    <!-- 模式卡片 -->
    <div class="mode-cards">
      <div
        v-for="mode in modes"
        :key="mode.id"
        class="mode-card"
        @click="$emit('startSpeedSpell', mode.id)"
      >
        <div class="mode-icon">{{ mode.icon }}</div>
        <h3>{{ mode.name }}</h3>
        <p>{{ mode.description }}</p>
        <div v-if="bestScores[mode.id]" class="mode-best">
          最佳: {{ bestScores[mode.id].score }}分 ({{ bestScores[mode.id].rating }})
        </div>
        <div v-else class="mode-best empty">
          暂无记录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '../store/settingsStore';
import { useGameStore } from '../store/gameStore';
import { speedSpellConfig } from '../config/english/speedSpell';
import { englishGradesConfig } from '../config/english/grades';

const emit = defineEmits(['startSpeedSpell', 'back']);

const settingsStore = useSettingsStore();
const gameStore = useGameStore();

const effectiveLevel = computed(() => settingsStore.getEffectiveEnglishLevel);

const levelTheme = computed(() => {
  const cfg = englishGradesConfig[effectiveLevel.value];
  return cfg ? cfg.theme : '';
});

const modes = Object.values(speedSpellConfig.modes).map(m => ({
  id: m.id,
  icon: m.icon,
  name: m.name,
  description: m.description
}));

const bestScores = computed(() => gameStore.englishSpeedSpell?.bestScores || {});
</script>

<style scoped>
.english-hall {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.header-left h2 {
  margin: 0;
  font-size: 1.8rem;
}

.level-info {
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-back {
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
}

.subtitle {
  margin: 0 0 2rem;
  opacity: 0.7;
  font-size: 0.95rem;
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.mode-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.mode-card:hover {
  transform: translateY(-3px);
  border-color: #34d399;
  box-shadow: 0 8px 25px rgba(52, 211, 153, 0.2);
}

.mode-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.mode-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.mode-card p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.mode-best {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #34d399;
}

.mode-best.empty {
  color: rgba(255, 255, 255, 0.35);
}

@media (max-width: 768px) {
  .english-hall {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 0.8rem;
  }

  .header-actions {
    align-self: flex-end;
  }

  .mode-cards {
    grid-template-columns: 1fr;
  }
}
</style>
