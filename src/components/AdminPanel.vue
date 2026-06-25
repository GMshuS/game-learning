<template>
  <div class="admin-panel">
    <!-- ===== 错题管理 ===== -->
    <div class="admin-section">
      <h3>📝 错题管理</h3>

      <h4 class="subject-label">数学</h4>
      <div class="stats-table">
        <div v-for="node in mathStats" :key="node.id" class="stats-row">
          <span class="stat-icon">{{ node.icon }}</span>
          <span class="stat-name">{{ node.label }}</span>
          <span class="stat-counts">
            {{ node.totalAttempts }} 次答题 · {{ node.wrongCount }} 次错误
          </span>
          <span class="stat-accuracy" :class="accuracyClass(node.accuracy)">
            {{ node.accuracy }}%
          </span>
          <button class="btn-reset-node" @click="resetNode('math', node.id)">重置</button>
        </div>
        <div v-if="mathStats.length === 0" class="stats-empty">暂无数据</div>
      </div>

      <h4 class="subject-label">英语</h4>
      <div class="stats-table">
        <div v-for="node in englishStats" :key="node.id" class="stats-row">
          <span class="stat-icon">{{ node.icon }}</span>
          <span class="stat-name">{{ node.label }}</span>
          <span class="stat-counts">
            {{ node.totalAttempts }} 次答题 · {{ node.wrongCount }} 次错误
          </span>
          <span class="stat-accuracy" :class="accuracyClass(node.accuracy)">
            {{ node.accuracy }}%
          </span>
          <button class="btn-reset-node" @click="resetNode('english', node.id)">重置</button>
        </div>
        <div v-if="englishStats.length === 0" class="stats-empty">暂无数据</div>
      </div>

      <div class="admin-subsection">
        <h4>错题反馈门槛</h4>
        <p class="setting-desc">
          某题型答题次数未达阈值前，错题反馈不生效（防止新手偶然答错导致题型权重暴涨）。
          当前：{{ minAttempts }} 次
        </p>
        <div class="min-attempts-slider">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            :value="minAttempts"
            class="weight-slider"
            @input="updateMinAttempts(parseInt($event.target.value))"
          >
          <span class="slider-value">{{ minAttempts }}</span>
        </div>
      </div>

      <div class="admin-actions">
        <button class="btn-reset-all" @click="resetAllKnowledge">🗑️ 重置全部知识数据</button>
      </div>
    </div>

    <!-- ===== 权重调节 ===== -->
    <div class="admin-section">
      <h3>⚖️ 题型权重调节</h3>
      <p class="section-desc">设置各年级各题型的默认相对权重，修改后立即生效。</p>

      <div class="grade-selector">
        <label>年级：</label>
        <select v-model="weightGrade" class="grade-select">
          <option v-for="g in 6" :key="g" :value="g">{{ g }} 年级</option>
        </select>
      </div>

      <div class="weight-list">
        <div v-for="item in currentGradeWeights" :key="item.type" class="weight-row">
          <span class="weight-label">{{ item.label }}</span>
          <div class="weight-slider-group">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              :value="item.currentWeight"
              class="weight-slider"
              @input="updateWeight(item.type, parseInt($event.target.value))"
            >
            <span class="weight-value">{{ item.currentWeight }}</span>
            <span v-if="item.isOverridden" class="weight-badge">已覆盖</span>
          </div>
        </div>
        <div v-if="currentGradeWeights.length === 0" class="stats-empty">该年级无题型配置</div>
      </div>

      <div class="weight-actions">
        <button class="btn-reset-grade" @click="resetGradeWeights">恢复该年级默认</button>
        <button class="btn-reset-all-weights" @click="resetAllWeights">恢复全部默认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMathKnowledgeStore } from '../store/mathKnowledgeStore';
import { useEnglishKnowledgeStore } from '../store/englishKnowledgeStore';
import { mathKnowledgeNodes, englishKnowledgeNodes } from '../config/knowledge';
import { gradeQuestionWeights } from '../config/gradeQuestionWeights';
import storageManager, { STORAGE_KEYS } from '../utils/storage';
import { loadKnowledgeConfig } from '../config/knowledgeWeights';

const mathKnowledgeStore = useMathKnowledgeStore();
const englishKnowledgeStore = useEnglishKnowledgeStore();

const minAttempts = ref(loadKnowledgeConfig().minAttempts || 3);

const weightGrade = ref(1);

// ---- 错题统计 ----
function buildNodeStats(nodes, records) {
  return nodes.map(node => {
    const rec = records[node.id];
    const totalAttempts = rec?.totalAttempts || 0;
    const wrongCount = rec?.wrongCount || 0;
    const accuracy = totalAttempts > 0 ? Math.round((1 - wrongCount / totalAttempts) * 100) : 0;
    return { ...node, totalAttempts, wrongCount, accuracy };
  }).filter(n => n.totalAttempts > 0);
}

const mathStats = computed(() => buildNodeStats(mathKnowledgeNodes, mathKnowledgeStore.records));
const englishStats = computed(() => buildNodeStats(englishKnowledgeNodes, englishKnowledgeStore.records));

function accuracyClass(accuracy) {
  if (accuracy >= 80) return 'acc-high';
  if (accuracy >= 50) return 'acc-mid';
  return 'acc-low';
}

// ---- 错题操作 ----
function resetNode(subject, nodeId) {
  if (!confirm(`确定要重置该知识点的全部记录吗？`)) return;
  const store = subject === 'math' ? mathKnowledgeStore : englishKnowledgeStore;
  if (store.records[nodeId]) {
    store.$patch((state) => {
      const newRecords = { ...state.records };
      delete newRecords[nodeId];
      state.records = newRecords;
    });
    // 直接写回 localStorage
    try {
      const key = subject === 'math' ? STORAGE_KEYS.MATH_KNOWLEDGE : STORAGE_KEYS.ENGLISH_KNOWLEDGE;
      storageManager._safeSetItem(key, JSON.stringify(store.records));
    } catch (e) {
      console.warn('保存知识记录失败:', e.message);
    }
  }
}

function resetAllKnowledge() {
  if (!confirm('确定要重置全部知识记录吗？此操作不可撤销！')) return;
  mathKnowledgeStore.reset();
  englishKnowledgeStore.reset();
}

function updateMinAttempts(value) {
  minAttempts.value = value;
  try {
    const config = loadKnowledgeConfig();
    config.minAttempts = value;
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('保存知识配置失败:', e.message);
  }
}

// ---- 权重调节 ----
const weightOverrides = ref(loadOverrides());

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_OVERRIDES);
    return raw ? JSON.parse(raw) : { grades: {}, globalSettings: {} };
  } catch {
    return { grades: {}, globalSettings: {} };
  }
}

function saveOverrides() {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_OVERRIDES, JSON.stringify(weightOverrides.value));
  } catch (e) {
    console.warn('保存权重覆盖失败:', e.message);
  }
}

const currentGradeWeights = computed(() => {
  const grade = weightGrade.value;
  const defaults = gradeQuestionWeights[grade] || {};
  const overrides = weightOverrides.value.grades?.[grade] || {};

  // 找题型名称映射
  const typeLabels = {};
  for (const node of mathKnowledgeNodes) {
    typeLabels[node.id] = node.label;
  }

  return Object.entries(defaults).map(([type, defaultWeight]) => {
    const isOverridden = overrides[type] !== undefined;
    return {
      type,
      label: typeLabels[type] || type,
      defaultWeight,
      currentWeight: isOverridden ? overrides[type] : defaultWeight,
      isOverridden
    };
  });
});

function updateWeight(type, value) {
  const grade = weightGrade.value;
  if (!weightOverrides.value.grades[grade]) {
    weightOverrides.value.grades[grade] = {};
  }
  weightOverrides.value.grades[grade][type] = value;
  saveOverrides();
}

function resetGradeWeights() {
  if (!confirm(`确定恢复 ${weightGrade.value} 年级的权重为默认值吗？`)) return;
  if (weightOverrides.value.grades[weightGrade.value]) {
    delete weightOverrides.value.grades[weightGrade.value];
    saveOverrides();
  }
}

function resetAllWeights() {
  if (!confirm('确定恢复全部年级的权重为默认值吗？')) return;
  weightOverrides.value = { grades: {}, globalSettings: {} };
  saveOverrides();
}
</script>

<style scoped>
.admin-panel {
  padding: 0.5rem 0;
}

.admin-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin-section:last-child {
  border-bottom: none;
}

.admin-section h3 {
  margin: 0 0 1rem 0;
  color: #fbbf24;
  font-size: 1.1rem;
}

.section-desc {
  font-size: 0.85rem;
  opacity: 0.6;
  margin: -0.5rem 0 1rem 0;
}

.subject-label {
  margin: 0.8rem 0 0.5rem 0;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
}

.stats-table {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 1.2rem;
  width: 1.5rem;
  text-align: center;
}

.stat-name {
  font-weight: bold;
  min-width: 3rem;
}

.stat-counts {
  flex: 1;
  font-size: 0.8rem;
  opacity: 0.7;
}

.stat-accuracy {
  font-weight: bold;
  min-width: 3rem;
  text-align: right;
}

.acc-high { color: #4ade80; }
.acc-mid { color: #f59e0b; }
.acc-low { color: #ef4444; }

.stats-empty {
  text-align: center;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}

.btn-reset-node {
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(239,68,68,0.4);
  border-radius: 6px;
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-reset-node:hover {
  background: rgba(239,68,68,0.25);
}

.admin-actions {
  margin-top: 1rem;
}

.btn-reset-all {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid rgba(239,68,68,0.3);
  border-radius: 10px;
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.btn-reset-all:hover {
  background: rgba(239,68,68,0.2);
}

/* 权重调节 */
.grade-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.grade-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  cursor: pointer;
}

.grade-select:focus {
  outline: none;
  border-color: #667eea;
}

.weight-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.weight-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.weight-label {
  min-width: 4rem;
  font-weight: bold;
  font-size: 0.9rem;
}

.weight-slider-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.weight-slider {
  flex: 1;
  height: 6px;
  appearance: none;
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  outline: none;
}

.weight-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
}

.weight-value {
  min-width: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.95rem;
  color: #fbbf24;
}

.weight-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  background: rgba(245,158,11,0.2);
  color: #f59e0b;
}

.weight-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-reset-grade,
.btn-reset-all-weights {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.btn-reset-grade:hover,
.btn-reset-all-weights:hover {
  background: rgba(255,255,255,0.15);
}

/* 错题反馈门槛 */
.admin-subsection {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.setting-desc {
  font-size: 13px;
  color: #999;
  margin: 5px 0 10px;
}

.min-attempts-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-value {
  font-size: 16px;
  font-weight: bold;
  min-width: 24px;
}
</style>
