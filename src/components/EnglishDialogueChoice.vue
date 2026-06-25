<template>
  <div class="dialogue-choice">
    <!-- 场景描述 -->
    <div class="scene-banner">
      <span class="scene-icon">🎭</span>
      <span class="scene-text">{{ question.scene || '情景对话' }}</span>
    </div>

    <!-- 对话区域 -->
    <div class="dialogue-container">
      <!-- 上下文提示 -->
      <div v-if="question.context" class="context-bubble">
        <span class="context-label">💡 提示</span>
        <p class="context-text">{{ question.context }}</p>
      </div>

      <!-- 对话气泡 -->
      <div class="dialogue-bubble">
        <div class="speaker-avatar">{{ speakerAvatar }}</div>
        <div class="speaker-info">
          <span class="speaker-name">{{ question.speaker || '你' }}</span>
          <div class="speaker-line">
            <template v-if="question.dialogue">
              <span class="dialogue-before">{{ dialogueBefore }}</span>
              <span class="dialogue-blank">______</span>
              <span class="dialogue-after">{{ dialogueAfter }}</span>
            </template>
            <span v-else class="dialogue-question">请选择恰当的回应：</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 选项 -->
    <div class="dialogue-options">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        class="dialogue-option-btn"
        :class="{
          correct: disabled && opt === question.answer,
          wrong: disabled && selectedAnswer === opt && opt !== question.answer
        }"
        :disabled="disabled"
        @click="selectOption(opt)"
      >
        <span class="option-letter">{{ letters[i] }}</span>
        <span class="option-text">{{ opt }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['answer']);

const selectedAnswer = ref(null);

const letters = ['A', 'B', 'C', 'D'];

const speakerAvatar = computed(() => {
  const speaker = props.question.speaker || '';
  // 注意：更具体的匹配条件放在前面，避免部分匹配误判
  if (speaker.includes('医生') || speaker.includes('护士')) return '👨‍⚕️';
  if (speaker.includes('店员') || speaker.includes('售货')) return '👩‍💼';
  if (speaker.includes('老师')) return '👨‍🏫';
  if (speaker.includes('同学') || speaker.includes('朋友')) return '🧒';
  if (speaker.includes('你') || speaker.includes('我')) return '🧑';
  return '💬';
});

const dialogueBefore = computed(() => {
  const d = props.question.dialogue || '';
  const idx = d.indexOf('___');
  return idx >= 0 ? d.substring(0, idx) : d;
});

const dialogueAfter = computed(() => {
  const d = props.question.dialogue || '';
  const idx = d.indexOf('___');
  return idx >= 0 ? d.substring(idx + 3) : '';
});

function selectOption(opt) {
  if (props.disabled) return;
  selectedAnswer.value = opt;
  emit('answer', { answer: opt });
}
</script>

<style scoped>
.dialogue-choice {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

/* ========== 场景横幅 ========== */
.scene-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 10px;
}

.scene-icon {
  font-size: 1.3rem;
}

.scene-text {
  font-size: 1rem;
  font-weight: bold;
  color: #a78bfa;
}

/* ========== 对话容器 ========== */
.dialogue-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* 上下文提示 */
.context-bubble {
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}

.context-label {
  font-size: 0.8rem;
  color: #fbbf24;
  font-weight: bold;
}

.context-text {
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.5;
}

/* 对话气泡 */
.dialogue-bubble {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(180, 120, 255, 0.2);
  border-radius: 14px;
  animation: fadeIn 0.4s ease-out;
}

.speaker-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.speaker-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.speaker-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: #a78bfa;
}

.speaker-line {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e8c8ff;
  word-break: break-word;
}

.dialogue-before {
  color: #e8c8ff;
}

.dialogue-blank {
  display: inline-block;
  min-width: 80px;
  border-bottom: 3px solid #fbbf24;
  color: #fbbf24;
  font-weight: bold;
  margin: 0 0.2rem;
}

.dialogue-after {
  color: #e8c8ff;
}

.dialogue-question {
  font-style: italic;
  opacity: 0.8;
}

/* ========== 选项 ========== */
.dialogue-options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.dialogue-option-btn {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(180, 120, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.5;
}

.dialogue-option-btn:hover:not(:disabled) {
  background: rgba(180, 120, 255, 0.15);
  border-color: rgba(180, 120, 255, 0.4);
  transform: translateX(5px);
}

.dialogue-option-btn:disabled {
  cursor: default;
  opacity: 0.85;
}

.dialogue-option-btn.correct {
  background: rgba(52, 211, 153, 0.2);
  border-color: #34d399;
  animation: correctFlash 0.5s ease;
}

.dialogue-option-btn.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  animation: shake 0.4s ease;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: bold;
  color: #a78bfa;
  flex-shrink: 0;
  margin-top: 2px;
}

.dialogue-option-btn.correct .option-letter {
  background: rgba(52, 211, 153, 0.3);
  border-color: #34d399;
  color: #34d399;
}

.dialogue-option-btn.wrong .option-letter {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  color: #ef4444;
}

.option-text {
  flex: 1;
}

/* ========== 动画 ========== */
@keyframes correctFlash {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-3px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .dialogue-choice {
    max-width: 100%;
  }

  .speaker-line {
    font-size: 1rem;
  }

  .dialogue-option-btn {
    font-size: 0.85rem;
    padding: 0.7rem 0.8rem;
  }

  .dialogue-blank {
    min-width: 60px;
  }
}
</style>
