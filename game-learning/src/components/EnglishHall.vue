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

    <!-- 冒险模式入口 -->
    <div class="adventure-entrance" @click="$emit('startAdventure')">
      <div class="entrance-icon">🕹️</div>
      <h3>冒险模式</h3>
      <p>探索英语世界，收集语法精灵！</p>
      <div class="adventure-stats">
        <div class="spirit-progress">
          <div class="spirit-progress-bar">
            <div
              class="spirit-progress-fill"
              :style="{ width: spiritProgressPercent + '%' }"
            />
          </div>
          <span class="spirit-progress-text">
            收集进度: {{ spiritCollectedCount }}/{{ spiritTotalCount }}
          </span>
        </div>
        <div v-if="currentRegionName" class="current-region">
          当前区域: {{ currentRegionName }}
        </div>
      </div>
    </div>

    <!-- 语法城堡入口 -->
    <div class="grammar-entrance" @click="$emit('enterGrammar')">
      <div class="entrance-icon">🏰</div>
      <h3>语法城堡</h3>
      <p>闯语法塔，掌握英语语法！</p>
      <div class="entrance-stats">
        ⭐ {{ grammarStars }} / {{ maxStars }} 星
        <span v-if="grammarKeys > 0"> · 🔑 {{ grammarKeys }} 把钥匙</span>
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
import { grammarTowers } from '../config/english/grammar';
import { useEnglishSpiritStore } from '../store/englishSpiritStore';
import { useEnglishAdventureStore } from '../store/englishAdventureStore';
import { getAllEnglishRegions } from '../config/english/adventure';

defineEmits(['startSpeedSpell', 'back', 'enterGrammar', 'startAdventure']);

const settingsStore = useSettingsStore();
const gameStore = useGameStore();
const spiritStore = useEnglishSpiritStore();

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

const grammarStars = computed(() => {
  const progress = gameStore.grammarProgress?.towerProgress || {};
  let total = 0;
  for (const tower of grammarTowers) {
    const tp = progress[tower.id];
    if (tp) {
      total += Object.values(tp.floorStars || {}).reduce((s, v) => s + v, 0);
    }
  }
  return total;
});

const maxStars = computed(() => {
  return grammarTowers.reduce((sum, tower) => {
    return sum + (tower.floors?.length || 0) * 3;
  }, 0);
});

const grammarKeys = computed(() => gameStore.grammarProgress?.totalKeys || 0);

// ====== 冒险模式 ======
const adventureStore = useEnglishAdventureStore();

const spiritCollectedCount = computed(() => spiritStore.collectedCount);
const spiritTotalCount = computed(() => spiritStore.totalSpirits);
const spiritProgressPercent = computed(() => {
  if (spiritTotalCount.value === 0) return 0;
  return Math.round((spiritCollectedCount.value / spiritTotalCount.value) * 100);
});
const currentRegionName = computed(() => {
  const regionId = adventureStore.currentRegion;
  if (!regionId) return '';
  const regions = getAllEnglishRegions();
  const region = regions.find(r => r.id === regionId);
  return region ? region.name : '';
});
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

.adventure-entrance {
  margin-top: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.adventure-entrance:hover {
  transform: translateY(-3px);
  border-color: #10b981;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
}

.adventure-stats {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spirit-progress {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  max-width: 280px;
}

.spirit-progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  overflow: hidden;
  min-width: 60px;
}

.spirit-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.spirit-progress-text {
  font-size: 0.85rem;
  color: #34d399;
  font-weight: bold;
  white-space: nowrap;
}

.current-region {
  font-size: 0.8rem;
  opacity: 0.6;
  color: #94a3b8;
}

.grammar-entrance {
  margin-top: 2rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(180, 120, 255, 0.2));
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgba(180, 120, 255, 0.3);
}

.grammar-entrance:hover {
  transform: translateY(-3px);
  border-color: #b078ff;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
}

.entrance-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.grammar-entrance h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #e8c8ff;
}

.grammar-entrance p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.entrance-stats {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: #ffd700;
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
