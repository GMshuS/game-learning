<template>
  <div class="question-type categorize-question">
    <p class="question-prompt">{{ question.prompt || '将下列单词分类' }}</p>

    <!-- 类别区域（可点击放置） -->
    <div class="category-areas">
      <div
        v-for="cat in question.categories"
        :key="cat.id"
        class="category-area"
        :class="{ 'category-active': activeCategory === cat.id }"
        @click="onCategoryClick(cat.id)"
      >
        <div class="category-header">
          <span class="category-icon">{{ cat.icon || '📁' }}</span>
          <span class="category-label">{{ cat.label }}</span>
        </div>
        <div class="category-items">
          <span
            v-for="(item, idx) in getItemsInCategory(cat.id)"
            :key="idx"
            class="categorized-item"
            :class="{
              correct: answered && isItemCorrect(item, cat.id),
              wrong: answered && !isItemCorrect(item, cat.id)
            }"
            @click.stop="removeFromCategory(cat.id, item)"
          >
            {{ item }}
            <span class="remove-hint">✕</span>
          </span>
          <span v-if="getItemsInCategory(cat.id).length === 0" class="category-placeholder">
            点击下方单词放入此处
          </span>
        </div>
      </div>
    </div>

    <!-- 待分类单词区 -->
    <div class="word-pool">
      <span
        v-for="(word, idx) in unassignedWords"
        :key="idx"
        class="pool-word"
        :class="{
          correct: answered && isItemCorrect(word, getItemCategory(word)),
          wrong: answered && !isItemCorrect(word, getItemCategory(word))
        }"
        @click="assignWord(word)"
      >
        {{ word }}
      </span>
      <span v-if="unassignedWords.length === 0 && !answered" class="pool-placeholder">
        所有单词已分类，点击检查答案
      </span>
    </div>

    <!-- 提交按钮 -->
    <button
      v-if="allAssigned && !answered"
      class="btn-check"
      :disabled="answered"
      @click="submitAnswer"
    >
      ✅ 检查答案
    </button>

    <div v-if="answered && !isAnswerCorrect" class="feedback-wrong">
      再想想正确的分类方式
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

// 记录每个单词的分类: { word: categoryId }
const assignments = ref({});
const activeCategory = ref(null);
const answered = ref(false);
const isAnswerCorrect = ref(false);
const startTime = ref(Date.now());

onMounted(() => {
  startTime.value = Date.now();
});

// 所有单词的扁平列表
const allItems = computed(() => props.question.items || []);

// 未分配的单词
const unassignedWords = computed(() => {
  return allItems.value.filter(w => !assignments.value[w]);
});

// 是否所有单词都已分类
const allAssigned = computed(() => {
  return allItems.value.length > 0 && unassignedWords.value.length === 0;
});

// 解析正确答案映射
const correctMapping = computed(() => {
  const answerStr = props.question.answer || '';
  const pairs = answerStr.split(',');
  const map = {};
  for (const pair of pairs) {
    const [word, cat] = pair.split(':');
    if (word && cat) map[word.trim()] = cat.trim();
  }
  return map;
});

function getItemsInCategory(catId) {
  const items = [];
  for (const [word, category] of Object.entries(assignments.value)) {
    if (category === catId) {
      items.push(word);
    }
  }
  return items;
}

function getItemCategory(word) {
  return assignments.value[word] || null;
}

function isItemCorrect(word, catId) {
  return correctMapping.value[word] === catId;
}

function onCategoryClick(catId) {
  if (answered.value) return;
  activeCategory.value = activeCategory.value === catId ? null : catId;
}

function assignWord(word) {
  if (answered.value) return;
  if (!activeCategory.value) return;
  assignments.value = { ...assignments.value, [word]: activeCategory.value };
}

function removeFromCategory(catId, word) {
  if (answered.value) return;
  const newAssignments = { ...assignments.value };
  delete newAssignments[word];
  assignments.value = newAssignments;
}

function submitAnswer() {
  if (answered.value || props.disabled) return;

  // 编码答案: word1:cat1,word2:cat2,...
  const entries = Object.entries(assignments.value);
  entries.sort((a, b) => allItems.value.indexOf(a[0]) - allItems.value.indexOf(b[0]));
  const answerStr = entries.map(([w, c]) => `${w}:${c}`).join(',');

  const timeUsed = Math.round((Date.now() - startTime.value) / 1000);
  answered.value = true;
  isAnswerCorrect.value = answerStr === (props.question.answer || '');

  emit('answer', { answer: answerStr, timeUsed });
}
</script>

<style scoped>
.categorize-question {
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

.category-areas {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
}

.category-area {
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.06);
  border: 2px dashed rgba(180, 120, 255, 0.25);
  border-radius: 14px;
  min-height: 60px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-area:hover {
  background: rgba(255, 255, 255, 0.1);
}

.category-active {
  border-color: #b078ff;
  background: rgba(180, 120, 255, 0.15);
  box-shadow: 0 0 15px rgba(180, 120, 255, 0.2);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.category-icon {
  font-size: 1.3rem;
}

.category-label {
  font-size: 1rem;
  font-weight: bold;
  color: #fbbf24;
}

.category-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-height: 32px;
}

.categorized-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.3rem 0.8rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 16px;
  font-size: 0.95rem;
  color: #5eead4;
  cursor: pointer;
  transition: all 0.2s;
}

.categorized-item:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.categorized-item.correct {
  background: rgba(52, 211, 153, 0.25);
  border-color: #34d399;
}

.categorized-item.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.remove-hint {
  font-size: 0.7rem;
  opacity: 0.6;
}

.category-placeholder {
  font-size: 0.8rem;
  opacity: 0.3;
  color: #d4b8ff;
  align-self: center;
}

.word-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 2px dashed rgba(180, 120, 255, 0.2);
  border-radius: 12px;
  width: 100%;
  min-height: 50px;
}

.pool-word {
  padding: 0.5rem 1rem;
  background: rgba(180, 120, 255, 0.15);
  border: 1px solid rgba(180, 120, 255, 0.4);
  border-radius: 20px;
  font-size: 1rem;
  color: #e8c8ff;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.pool-word:hover {
  background: rgba(180, 120, 255, 0.3);
  transform: translateY(-2px);
}

.pool-word.correct {
  background: rgba(52, 211, 153, 0.2);
  border-color: #34d399;
}

.pool-word.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.pool-placeholder {
  font-size: 0.9rem;
  opacity: 0.35;
  color: #d4b8ff;
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
