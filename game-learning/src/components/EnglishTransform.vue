<template>
  <div class="question-type transform-question">
    <p class="question-prompt">{{ question.prompt || '选择正确的疑问句形式' }}</p>

    <div class="statement-display">
      <span class="statement-label">陈述句：</span>
      <span class="statement-text">{{ question.sentence }}</span>
    </div>

    <p class="action-hint">请选择对应的疑问句：</p>

    <div class="options-grid">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-btn transform-option"
        :class="{
          correct: answered && opt === question.answer,
          wrong: answered && selected === opt && opt !== question.answer
        }"
        :disabled="answered"
        @click="selectOption(opt)"
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
const selected = ref(null);
const startTime = ref(Date.now());

onMounted(() => {
  startTime.value = Date.now();
});

function selectOption(opt) {
  if (answered.value || props.disabled) return;

  selected.value = opt;
  answered.value = true;
  isCorrect.value = opt === props.question.answer;

  const timeUsed = Math.round((Date.now() - startTime.value) / 1000);
  emit('answer', { answer: opt, timeUsed });
}
</script>

<style scoped>
.transform-question {
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

.statement-display {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-radius: 14px;
  text-align: center;
  line-height: 1.6;
}

.statement-label {
  font-size: 0.85rem;
  opacity: 0.6;
  margin-right: 0.5rem;
}

.statement-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e8c8ff;
}

.action-hint {
  font-size: 0.95rem;
  opacity: 0.7;
  text-align: center;
  margin: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  width: 100%;
  max-width: 500px;
}

.option-btn {
  padding: 1rem 0.8rem;
  font-size: 1.1rem;
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

.transform-option {
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
  padding: 1rem 1.2rem;
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
