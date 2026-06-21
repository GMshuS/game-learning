<template>
  <div class="question-type connector-question">
    <p class="question-prompt">{{ question.prompt || '选择正确的连词连接句子' }}</p>

    <div class="sentences-display">
      <div class="sentence-block">
        <span class="sentence-label">句子 A：</span>
        <span class="sentence-text">{{ question.sentences?.[0] || '' }}</span>
      </div>
      <div class="connector-slot">
        <span class="slot-label">连词：</span>
        <span class="slot-value">{{ selectedConjunction || '?' }}</span>
      </div>
      <div class="sentence-block">
        <span class="sentence-label">句子 B：</span>
        <span class="sentence-text">{{ question.sentences?.[1] || '' }}</span>
      </div>
    </div>

    <p class="action-hint">选择正确的连词：</p>

    <div class="options-grid">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-btn"
        :class="{
          selected: selectedConjunction === opt && !answered,
          correct: answered && opt === question.answer,
          wrong: answered && selectedConjunction === opt && opt !== question.answer
        }"
        :disabled="answered"
        @click="selectConjunction(opt)"
      >
        {{ opt }}
      </button>
    </div>

    <div v-if="answered && !isCorrect" class="feedback-wrong">
      正确答案: <strong>{{ question.answer }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  question: { type: Object, required: true },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['answer']);

const answered = ref(false);
const isCorrect = ref(false);
const selectedConjunction = ref(null);
const startTime = ref(Date.now());

onMounted(() => {
  startTime.value = Date.now();
});

function selectConjunction(opt) {
  if (answered.value || props.disabled) return;

  selectedConjunction.value = opt;
  answered.value = true;
  isCorrect.value = opt === props.question.answer;

  const timeUsed = Math.round((Date.now() - startTime.value) / 1000);
  emit('answer', { answer: opt, timeUsed });
}
</script>

<style scoped>
.connector-question {
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

.sentences-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-radius: 14px;
}

.sentence-block {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  line-height: 1.6;
}

.sentence-label {
  font-size: 0.85rem;
  opacity: 0.6;
  white-space: nowrap;
}

.sentence-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e8c8ff;
}

.connector-slot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(180, 120, 255, 0.1);
  border: 2px dashed rgba(180, 120, 255, 0.3);
  border-radius: 10px;
  align-self: center;
  min-width: 120px;
  justify-content: center;
}

.slot-label {
  font-size: 0.85rem;
  opacity: 0.6;
}

.slot-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fbbf24;
  min-width: 30px;
  text-align: center;
}

.action-hint {
  font-size: 0.95rem;
  opacity: 0.7;
  text-align: center;
  margin: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  width: 100%;
  max-width: 400px;
}

.option-btn {
  padding: 1rem 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(180, 120, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-btn:hover:not(:disabled) {
  background: rgba(180, 120, 255, 0.2);
  border-color: #b078ff;
  transform: translateY(-2px);
}

.option-btn:disabled {
  cursor: default;
  opacity: 0.85;
}

.option-btn.selected {
  border-color: #b078ff;
  background: rgba(180, 120, 255, 0.2);
}

.option-btn.correct {
  background: rgba(52, 211, 153, 0.3);
  border-color: #34d399;
  animation: correctFlash 0.5s ease;
}

.option-btn.wrong {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  animation: shake 0.4s ease;
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

@keyframes correctFlash {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
}
</style>
