<template>
  <div class="grade-range-selector">
    <!-- 当前区间文案 -->
    <div class="range-label">
      当前范围：{{ modelValue.min }}年级 ~ {{ modelValue.max }}年级
    </div>

    <!-- 双滑块 -->
    <div class="range-sliders">
      <div class="slider-group">
        <label class="slider-label">起始</label>
        <input
          type="range"
          :min="1"
          :max="6"
          :value="modelValue.min"
          @input="onMinChange"
          class="range-slider min-slider"
        />
        <span class="slider-value">{{ modelValue.min }}</span>
      </div>
      <div class="slider-group">
        <label class="slider-label">结束</label>
        <input
          type="range"
          :min="1"
          :max="6"
          :value="modelValue.max"
          @input="onMaxChange"
          class="range-slider max-slider"
        />
        <span class="slider-value">{{ modelValue.max }}</span>
      </div>
    </div>

    <!-- 快捷区间按钮 -->
    <div class="quick-buttons">
      <button
        v-for="preset in presets"
        :key="`${preset.min}-${preset.max}`"
        class="quick-btn"
        :class="{ active: modelValue.min === preset.min && modelValue.max === preset.max }"
        @click="setRange(preset)"
      >
        {{ preset.min }}~{{ preset.max }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ min: 1, max: 1 })
  }
});

const emit = defineEmits(['update:modelValue']);

const presets = [
  { min: 1, max: 2 },
  { min: 2, max: 3 },
  { min: 3, max: 4 },
  { min: 4, max: 5 },
  { min: 5, max: 6 },
  { min: 1, max: 6 }
];

function onMinChange(e) {
  let newMin = Number(e.target.value);
  // min 不能超过 max
  if (newMin > props.modelValue.max) {
    newMin = props.modelValue.max;
  }
  emit('update:modelValue', { ...props.modelValue, min: newMin });
}

function onMaxChange(e) {
  let newMax = Number(e.target.value);
  // max 不能小于 min
  if (newMax < props.modelValue.min) {
    newMax = props.modelValue.min;
  }
  emit('update:modelValue', { ...props.modelValue, max: newMax });
}

function setRange(preset) {
  emit('update:modelValue', { min: preset.min, max: preset.max });
}
</script>

<style scoped>
.grade-range-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.range-label {
  color: #fbbf24;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
}

.range-sliders {
  display: flex;
  gap: 1.5rem;
}

.slider-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.slider-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.range-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  appearance: none;
  cursor: pointer;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.range-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.range-slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.slider-value {
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.5rem;
  border-radius: 6px;
  min-width: 1.5rem;
  text-align: center;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
}

.quick-btn {
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.quick-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-1px);
}

.quick-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: #fff;
  font-weight: bold;
}
</style>
