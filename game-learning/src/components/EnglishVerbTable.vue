<template>
  <div class="question-type verb-table-question">
    <p class="question-prompt">{{ question.prompt || '将动词原形与对应变形配对' }}</p>

    <div class="verb-table">
      <div class="table-header">
        <span class="header-col">原形</span>
        <span class="header-sep"></span>
        <span class="header-col">变形</span>
      </div>

      <div
        v-for="(row, idx) in tableRows"
        :key="idx"
        class="table-row"
        :class="{
          correct: answered && row.isCorrect,
          wrong: answered && !row.isCorrect
        }"
      >
        <span class="row-base">{{ row.base }}</span>
        <span class="row-arrow">→</span>
        <span
          class="row-target"
          :class="{ selected: selectedBase === row.base }"
          @click="selectBase(row.base)"
        >
          {{ row.matchedForm || '?' }}
        </span>
      </div>
    </div>

    <!-- 选项池（打乱的变形） -->
    <div class="form-pool">
      <span
        v-for="(form, idx) in availableForms"
        :key="idx"
        class="form-chip"
        :class="{ used: isFormUsed(form) }"
        @click="assignForm(form)"
      >
        {{ form }}
      </span>
    </div>

    <!-- 提交 -->
    <button
      v-if="allMatched && !answered"
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

// 配对状态: { baseForm: pastForm }
const assignments = ref({});
const selectedBase = ref(null);
const answered = ref(false);
const isAnswerCorrect = ref(false);
const startTime = ref(Date.now());

onMounted(() => {
  startTime.value = Date.now();
});

const baseForms = computed(() => props.question.baseForms || []);
const pastForms = computed(() => props.question.pastForms || []);

const tableRows = computed(() => {
  return baseForms.value.map(base => ({
    base,
    matchedForm: assignments.value[base] || null,
    isCorrect: assignments.value[base] === getCorrectForm(base)
  }));
});

// 已使用的变形（已被分配给某个原形）
const usedForms = computed(() => Object.values(assignments.value));

// 还可用的变形
const availableForms = computed(() => {
  return pastForms.value.filter(f => !usedForms.value.includes(f));
});

const allMatched = computed(() => {
  return baseForms.value.length > 0 && baseForms.value.every(b => assignments.value[b]);
});

function getCorrectForm(base) {
  const answerStr = props.question.answer || '';
  const parts = answerStr.split('|');
  for (const part of parts) {
    const [b, f] = part.split('-');
    if (b && f && b.trim() === base) return f.trim();
  }
  return null;
}

function isFormUsed(form) {
  return usedForms.value.includes(form);
}

function selectBase(base) {
  if (answered.value) return;
  selectedBase.value = selectedBase.value === base ? null : base;
}

function assignForm(form) {
  if (answered.value || !selectedBase.value) return;
  if (isFormUsed(form)) {
    // 从之前的分配中移除
    const newAssignments = { ...assignments.value };
    for (const [b, f] of Object.entries(newAssignments)) {
      if (f === form) {
        delete newAssignments[b];
      }
    }
    newAssignments[selectedBase.value] = form;
    assignments.value = newAssignments;
  } else {
    assignments.value = { ...assignments.value, [selectedBase.value]: form };
  }
  selectedBase.value = null;
}

function submitAnswer() {
  if (answered.value || props.disabled) return;

  const sorted = baseForms.value.map(b => `${b}-${assignments.value[b]}`);
  const answerStr = sorted.join('|');

  const timeUsed = Math.round((Date.now() - startTime.value) / 1000);
  answered.value = true;
  isAnswerCorrect.value = answerStr === (props.question.answer || '');

  emit('answer', { answer: answerStr, timeUsed });
}
</script>

<style scoped>
.verb-table-question {
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

.verb-table {
  width: 100%;
  max-width: 400px;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(180, 120, 255, 0.1);
  border-radius: 10px 10px 0 0;
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-bottom: none;
}

.header-col {
  flex: 1;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-sep {
  width: 40px;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(180, 120, 255, 0.15);
  border-top: none;
  transition: all 0.2s;
}

.table-row:last-child {
  border-radius: 0 0 10px 10px;
}

.table-row.correct {
  background: rgba(52, 211, 153, 0.12);
  border-color: rgba(52, 211, 153, 0.3);
}

.table-row.wrong {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
}

.row-base {
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #5eead4;
}

.row-arrow {
  width: 40px;
  text-align: center;
  opacity: 0.4;
  font-size: 1.1rem;
}

.row-target {
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fbbf24;
  padding: 0.3rem 0.8rem;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.row-target:hover {
  border-color: #b078ff;
  background: rgba(180, 120, 255, 0.1);
}

.row-target.selected {
  border-color: #b078ff;
  background: rgba(180, 120, 255, 0.2);
  box-shadow: 0 0 10px rgba(180, 120, 255, 0.3);
}

.form-pool {
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

.form-chip {
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

.form-chip:hover:not(.used) {
  background: rgba(180, 120, 255, 0.3);
  transform: translateY(-2px);
}

.form-chip.used {
  opacity: 0.3;
  cursor: default;
  text-decoration: line-through;
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

.feedback-wrong strong {
  color: #fbbf24;
}
</style>
