<template>
  <div class="grammar-hall">
    <!-- 顶部标题栏 -->
    <header class="grammar-header">
      <div class="header-left">
        <h2>🏰 语法城堡</h2>
        <p class="level-info">Level {{ effectiveLevel }} · {{ levelTheme }}</p>
      </div>
      <div class="header-actions">
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </header>

    <p class="subtitle">选择一座语法塔开始闯关！</p>

    <!-- 总结信息 -->
    <div class="summary-bar">
      <span>⭐ 总星星: {{ totalStars }} / {{ maxStars }}</span>
      <span>🔑 语法钥匙: {{ totalKeys }} 把</span>
    </div>

    <!-- 语法塔卡片列表 -->
    <div class="tower-list">
      <div
        v-for="tower in towers"
        :key="tower.id"
        class="tower-card"
        :class="{ locked: !isTowerUnlocked(tower) }"
        @click="onTowerClick(tower)"
      >
        <div class="tower-icon">{{ tower.icon }}</div>
        <h3>{{ tower.name }}</h3>
        <p>{{ tower.description }}</p>
        <!-- 8层星级进度 -->
        <div class="floor-stars">
          <span
            v-for="f in getTowerFloorCount(tower.id)"
            :key="f"
            :class="['star-dot', getFloorStarClass(tower.id, f)]"
          >⭐</span>
        </div>
        <div class="tower-star-count">
          {{ getTowerStars(tower.id) }} / {{ getTowerMaxStars(tower.id) }} ⭐
        </div>
        <div v-if="isTowerCleared(tower.id)" class="cleared-badge">
          ✅ 已通关
        </div>
        <div v-if="!isTowerUnlocked(tower)" class="lock-overlay">🔒</div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="towers.length === 0" class="empty-state">
      <p>暂无语法塔数据</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { grammarTowers, getTowerById } from '../config/english/grammar';
import { englishGradesConfig } from '../config/english/grades';

const emit = defineEmits(['enterTower', 'back']);

const gameStore = useGameStore();
const settingsStore = useSettingsStore();

const effectiveLevel = computed(() => settingsStore.getEffectiveEnglishLevel);

const levelTheme = computed(() => {
  const cfg = englishGradesConfig[effectiveLevel.value];
  return cfg ? cfg.theme : '';
});

// 语法塔列表：显示所有塔，解锁由 isTowerUnlocked 控制
const towers = computed(() => {
  return grammarTowers;
});

// 获取某塔的星星总数
function getTowerStars(towerId) {
  const progress = gameStore.grammarProgress?.towerProgress?.[towerId];
  if (!progress) return 0;
  return Object.values(progress.floorStars || {}).reduce(
    (sum, s) => sum + s,
    0
  );
}

// 获取塔的楼层数
function getTowerFloorCount(towerId) {
  const tower = getTowerById(towerId);
  return tower?.floors?.length || 0;
}

// 获取塔的最大星数
function getTowerMaxStars(towerId) {
  return getTowerFloorCount(towerId) * 3;
}

// 获取某层星星样式
function getFloorStarClass(towerId, floorNum) {
  const progress = gameStore.grammarProgress?.towerProgress?.[towerId];
  const star = progress?.floorStars?.[floorNum];
  if (star && star >= 1) return 'earned';
  return 'empty';
}

// 检查塔是否解锁（按英语等级 unlockLevel）
function isTowerUnlocked(tower) {
  return tower.unlockLevel <= effectiveLevel.value;
}

// 检查塔是否已通关
function isTowerCleared(towerId) {
  return gameStore.grammarProgress?.towerProgress?.[towerId]?.cleared === true;
}

// 总星星数
const totalStars = computed(() => {
  let sum = 0;
  for (const tower of grammarTowers) {
    sum += getTowerStars(tower.id);
  }
  return sum;
});

// 最大星星数（动态计算）
const maxStars = computed(() => {
  return grammarTowers.reduce((sum, tower) => {
    return sum + (tower.floors?.length || 0) * 3;
  }, 0);
});

// 语法钥匙总数
const totalKeys = computed(
  () => gameStore.grammarProgress?.totalKeys || 0
);

function onTowerClick(tower) {
  if (!isTowerUnlocked(tower)) return;
  emit('enterTower', tower.id);
}
</script>

<style scoped>
.grammar-hall {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
  background: linear-gradient(
    180deg,
    rgba(30, 10, 60, 1) 0%,
    rgba(20, 5, 40, 1) 100%
  );
}

/* ---- 标题栏 ---- */
.grammar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.header-left h2 {
  margin: 0;
  font-size: 1.8rem;
  text-shadow: 0 0 12px rgba(180, 120, 255, 0.5);
  background: linear-gradient(135deg, #e8c8ff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.level-info {
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
  opacity: 0.8;
  color: #c8a0ff;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-back {
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(180, 120, 255, 0.3);
  border-radius: 20px;
  color: #d4b8ff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(180, 120, 255, 0.25);
  border-color: #b078ff;
}

/* ---- 副标题 ---- */
.subtitle {
  margin: 0 0 1rem;
  opacity: 0.7;
  font-size: 0.95rem;
}

/* ---- 总结信息条 ---- */
.summary-bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(180, 120, 255, 0.1);
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #d4b8ff;
  flex-wrap: wrap;
}

.summary-bar span {
  white-space: nowrap;
}

/* ---- 语法塔卡片列表 ---- */
.tower-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.tower-card {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(100, 50, 180, 0.25),
    rgba(180, 120, 50, 0.2)
  );
  border: 2px solid rgba(180, 120, 255, 0.25);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.tower-card:hover {
  transform: translateY(-4px);
  border-color: #b078ff;
  box-shadow: 0 8px 30px rgba(140, 80, 255, 0.3);
}

.tower-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.6);
}

.tower-card.locked:hover {
  transform: none;
  border-color: rgba(180, 120, 255, 0.25);
  box-shadow: none;
}

.tower-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.tower-card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
  color: #e8c8ff;
}

.tower-card p {
  margin: 0 0 1rem;
  opacity: 0.75;
  font-size: 0.85rem;
  line-height: 1.3;
}

/* ---- 8 层星级进度 ---- */
.floor-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 0.5rem;
}

.star-dot {
  font-size: 0.85rem;
  transition: all 0.2s;
}

.star-dot.earned {
  filter: none;
  opacity: 1;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
}

.star-dot.empty {
  filter: grayscale(1) brightness(0.4);
  opacity: 0.4;
}

.tower-star-count {
  font-size: 0.85rem;
  color: #ffd700;
  font-weight: bold;
}

/* ---- 已通关标记 ---- */
.cleared-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  background: rgba(52, 211, 153, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.4);
  border-radius: 8px;
  color: #34d399;
}

/* ---- 锁定遮罩 ---- */
.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 14px;
  pointer-events: none;
}

/* ---- 空状态 ---- */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  opacity: 0.5;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .grammar-hall {
    padding: 1rem;
  }

  .grammar-header {
    flex-direction: column;
    gap: 0.8rem;
  }

  .header-actions {
    align-self: flex-end;
  }

  .tower-list {
    grid-template-columns: 1fr;
  }

  .summary-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
