<template>
  <div class="question-type image-choice-question">
    <!-- Emoji 场景展示 -->
    <div class="scene-display">
      <span class="scene-emoji">{{ question.emoji || '📷' }}</span>
    </div>

    <p class="question-sentence">{{ question.sentence || '' }}</p>

    <div class="options-grid">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-btn"
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
.image-choice-question {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.scene-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(180, 120, 255, 0.25);
  border-radius: 20px;
}

.scene-emoji {
  font-size: 4rem;
  line-height: 1;
}

.question-sentence {
  font-size: 1.4rem;
  text-align: center;
  font-weight: bold;
  color: #e8c8ff;
  line-height: 1.6;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-radius: 14px;
  width: 100%;
  word-break: break-word;
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
  font-size: 1.3rem;
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
