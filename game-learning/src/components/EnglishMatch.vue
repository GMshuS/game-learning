<template>
  <div class="question-type match-question">
    <p class="question-prompt">{{ question.prompt || '将左右列正确配对' }}</p>

    <div class="match-area">
      <!-- 左列 -->
      <div class="match-column">
        <div
          v-for="item in leftItems"
          :key="item.id"
          class="match-item"
          :class="{
            selected: selectedLeft === item.id,
            matched: getPairForLeft(item.id),
            correct: answered && getPairForLeft(item.id) && isPairCorrect(item.id, getPairForLeft(item.id)),
            wrong: answered && getPairForLeft(item.id) && !isPairCorrect(item.id, getPairForLeft(item.id))
          }"
          @click="selectLeft(item.id)"
        >
          <span class="item-text">{{ item.text }}</span>
          <span v-if="getPairForLeft(item.id)" class="matched-indicator">✓</span>
        </div>
        <div v-if="leftItems.length === 0" class="column-placeholder">左列</div>
      </div>

      <!-- 右列 -->
      <div class="match-column">
        <div
          v-for="item in rightItems"
          :key="item.id"
          class="match-item"
          :class="{
            selected: selectedRight === item.id,
            matched: getPairForRight(item.id),
            correct: answered && getPairForRight(item.id) && isPairCorrect(getPairForRight(item.id), item.id),
            wrong: answered && getPairForRight(item.id) && !isPairCorrect(getPairForRight(item.id), item.id)
          }"
          @click="selectRight(item.id)"
        >
          <span class="item-text">{{ item.text }}</span>
          <span v-if="getPairForRight(item.id)" class="matched-indicator">✓</span>
        </div>
        <div v-if="rightItems.length === 0" class="column-placeholder">右列</div>
      </div>
    </div>

    <!-- 已配对列表 -->
    <div v-if="pairList.length > 0" class="pair-list">
      <div
        v-for="(pair, idx) in pairList"
        :key="idx"
        class="pair-tag"
        :class="{
          correct: answered && isPairCorrect(pair.left, pair.right),
          wrong: answered && !isPairCorrect(pair.left, pair.right)
        }"
        @click="removePair(idx)"
      >
        <span class="pair-left">{{ getItemText(pair.left) }}</span>
        <span class="pair-arrow">⟷</span>
        <span class="pair-right">{{ getItemText(pair.right) }}</span>
        <span v-if="!answered" class="pair-remove">✕</span>
      </div>
    </div>

    <!-- 提交按钮 -->
    <button
      v-if="allLeftMatched && !answered"
      class="btn-check"
      :disabled="answered"
      @click="submitAnswer"
    >
      ✅ 检查答案
    </button>

    <div v-if="answered && !isAnswerCorrect" class="feedback-wrong">
      再检查一下配对关系
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  question: { type: Object, required: true },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['answer']);

// 配对状态: { leftId: rightId }
const pairs = ref({});
const selectedLeft = ref(null);
const selectedRight = ref(null);
const answered = ref(false);
const isAnswerCorrect = ref(false);
const startTime = ref(Date.now());

onMounted(() => {
  startTime.value = Date.now();
});

const leftItems = computed(() => {
  return (props.question.pairs || []).map(p => ({
    id: String(p.left).toLowerCase().replace(/\s+/g, '_'),
    text: p.left
  })).filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
});

const rightItems = computed(() => {
  return (props.question.pairs || []).map(p => ({
    id: String(p.right).toLowerCase().replace(/\s+/g, '_'),
    text: p.right
  })).filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
});

// 正确答案映射: { left: right }
const correctAnswerMap = computed(() => {
  const answerStr = props.question.answer || '';
  const map = {};
  const parts = answerStr.split('|');
  for (const part of parts) {
    const [l, r] = part.split('-');
    if (l && r) {
      map[l.trim()] = r.trim();
    }
  }
  return map;
});

// 已配对列表
const pairList = computed(() => {
  return Object.entries(pairs.value).map(([left, right]) => ({ left, right }));
});

const allLeftMatched = computed(() => {
  if (leftItems.value.length === 0) return false;
  return leftItems.value.every(item => pairs.value[item.id]);
});

function getItemText(id) {
  const all = [...leftItems.value, ...rightItems.value];
  const item = all.find(i => i.id === id);
  return item ? item.text : id;
}

function getPairForLeft(leftId) {
  return pairs.value[leftId] || null;
}

function getPairForRight(rightId) {
  for (const [l, r] of Object.entries(pairs.value)) {
    if (r === rightId) return l;
  }
  return null;
}

function isPairCorrect(leftId, rightId) {
  return correctAnswerMap.value[leftId] === rightId;
}

function selectLeft(id) {
  if (answered.value) return;
  selectedLeft.value = selectedLeft.value === id ? null : id;
  // 如果已有右列选中，直接配对
  if (selectedLeft.value && selectedRight.value) {
    createPair(selectedLeft.value, selectedRight.value);
  }
}

function selectRight(id) {
  if (answered.value) return;
  selectedRight.value = selectedRight.value === id ? null : id;
  // 如果已有左列选中，直接配对
  if (selectedLeft.value && selectedRight.value) {
    createPair(selectedLeft.value, selectedRight.value);
  }
}

function createPair(leftId, rightId) {
  if (pairs.value[leftId]) {
    // 左列已配对，先移除旧的
    const newPairs = { ...pairs.value };
    delete newPairs[leftId];
    pairs.value = newPairs;
  }
  // 移除右列在其他配对中的引用
  const newPairs = { ...pairs.value };
  for (const [l, r] of Object.entries(newPairs)) {
    if (r === rightId) {
      delete newPairs[l];
    }
  }
  newPairs[leftId] = rightId;
  pairs.value = newPairs;
  selectedLeft.value = null;
  selectedRight.value = null;
}

function removePair(index) {
  if (answered.value) return;
  const pair = pairList.value[index];
  if (!pair) return;
  const newPairs = { ...pairs.value };
  delete newPairs[pair.left];
  pairs.value = newPairs;
}

function submitAnswer() {
  if (answered.value || props.disabled) return;

  // 编码答案: 按 leftItems 原始顺序排序，确保答案顺序确定
  const entries = Object.entries(pairs.value);
  entries.sort((a, b) => {
    const ia = leftItems.value.findIndex(item => item.id === a[0]);
    const ib = leftItems.value.findIndex(item => item.id === b[0]);
    return ia - ib;
  });
  const answerStr = entries.map(([l, r]) => `${l}-${r}`).join('|');

  const timeUsed = Math.round((Date.now() - startTime.value) / 1000);
  answered.value = true;
  isAnswerCorrect.value = answerStr === (props.question.answer || '');

  emit('answer', { answer: answerStr, timeUsed });
}
</script>

<style scoped>
.match-question {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.question-prompt {
  font-size: 1.1rem;
  color: #e8c8ff;
  text-align: center;
  margin: 0;
  font-weight: bold;
}

.match-area {
  display: flex;
  gap: 2rem;
  width: 100%;
  justify-content: center;
}

.match-column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  max-width: 220px;
}

.match-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(180, 120, 255, 0.25);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
}

.match-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(180, 120, 255, 0.4);
}

.match-item.selected {
  border-color: #b078ff;
  background: rgba(180, 120, 255, 0.2);
  box-shadow: 0 0 12px rgba(180, 120, 255, 0.3);
}

.match-item.matched {
  border-style: solid;
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.1);
}

.match-item.correct {
  border-color: #34d399;
  background: rgba(52, 211, 153, 0.2);
}

.match-item.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.item-text {
  font-size: 1rem;
}

.matched-indicator {
  font-size: 0.9rem;
  color: #34d399;
}

.column-placeholder {
  font-size: 0.85rem;
  opacity: 0.3;
  text-align: center;
  padding: 1rem;
}

.pair-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.pair-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(180, 120, 255, 0.25);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #e8c8ff;
  cursor: pointer;
  transition: all 0.2s;
}

.pair-tag:hover {
  background: rgba(255, 255, 255, 0.15);
}

.pair-tag.correct {
  border-color: #34d399;
  background: rgba(52, 211, 153, 0.15);
}

.pair-tag.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.pair-left {
  color: #5eead4;
  font-weight: bold;
}

.pair-arrow {
  opacity: 0.6;
}

.pair-right {
  color: #fbbf24;
  font-weight: bold;
}

.pair-remove {
  font-size: 0.7rem;
  opacity: 0.5;
  margin-left: 0.2rem;
}

.btn-check {
  padding: 0.7rem 2rem;
  background: linear-gradient(135deg, #06b6d4, #10b981);
  border: none;
  border-radius: 25px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-check:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
}

.btn-check:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.feedback-wrong {
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.95rem;
}
</style>
