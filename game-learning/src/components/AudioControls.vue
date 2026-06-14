<template>
  <div class="audio-controls" :class="{ compact: compact }">
    <!-- 快捷按钮 -->
    <div class="audio-buttons">
      <button class="audio-btn" :title="bgmEnabled ? '关闭背景音乐' : '开启背景音乐'" @click="toggleBgm">
        {{ bgmIcon }}
      </button>
      <button class="audio-btn" :title="sfxEnabled ? '关闭音效' : '开启音效'" @click="toggleSfx">
        {{ sfxIcon }}
      </button>
    </div>

    <!-- 展开面板 -->
    <div v-if="showPanel" class="audio-panel">
      <div class="audio-slider">
        <label>背景音乐</label>
        <input
          v-model="bgmVolume"
          type="range"
          min="0"
          max="100"
          @input="updateBgmVolume(bgmVolume)"
        >
        <span class="volume-value">{{ bgmVolume }}%</span>
      </div>
      <div class="audio-slider">
        <label>音效</label>
        <input
          v-model="sfxVolume"
          type="range"
          min="0"
          max="100"
          @input="updateSfxVolume(sfxVolume)"
        >
        <span class="volume-value">{{ sfxVolume }}%</span>
      </div>
    </div>

    <!-- 展开/收起按钮 -->
    <button class="toggle-panel" @click="togglePanel">
      {{ showPanel ? '▲' : '▼' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import audioManager from '../utils/audioManager';
import { useSettingsStore } from '../store/settingsStore';

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
});

const bgmEnabled = ref(audioManager.bgmEnabled);
const sfxEnabled = ref(audioManager.sfxEnabled);
const bgmVolume = ref(audioManager.bgmVolume * 100);
const sfxVolume = ref(audioManager.sfxVolume * 100);
const showPanel = ref(false);

const toggleBgm = () => {
  bgmEnabled.value = audioManager.toggleBgm();
  // 通过 settingsStore 持久化
  const settingsStore = useSettingsStore();
  settingsStore.music = audioManager.bgmEnabled;
  settingsStore.saveSettings();
};

const toggleSfx = () => {
  sfxEnabled.value = audioManager.toggleSfx();
  // 通过 settingsStore 持久化
  const settingsStore = useSettingsStore();
  settingsStore.sound = audioManager.sfxEnabled;
  settingsStore.saveSettings();
};

const updateBgmVolume = (value) => {
  bgmVolume.value = value;
  audioManager.setBgmVolume(value / 100);
  // 通过 settingsStore 持久化
  const settingsStore = useSettingsStore();
  settingsStore.musicVolume = audioManager.bgmVolume;
  settingsStore.saveSettings();
};

const updateSfxVolume = (value) => {
  sfxVolume.value = value;
  audioManager.setSfxVolume(value / 100);
  // 通过 settingsStore 持久化
  const settingsStore = useSettingsStore();
  settingsStore.soundVolume = audioManager.sfxVolume;
  settingsStore.saveSettings();
};

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

const bgmIcon = computed(() => {
  if (!bgmEnabled.value) return '🔇';
  if (bgmVolume.value < 30) return '🔈';
  if (bgmVolume.value < 70) return '🔉';
  return '🔊';
});

const sfxIcon = computed(() => {
  if (!sfxEnabled.value) return '🔇';
  if (sfxVolume.value < 30) return '🔈';
  if (sfxVolume.value < 70) return '🔉';
  return '🔊';
});

onMounted(() => {
  // 初始化音频系统
  audioManager.init();
});
</script>

<style scoped>
.audio-controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.audio-controls.compact {
  padding: 0.5rem;
}

.audio-buttons {
  display: flex;
  gap: 0.5rem;
}

.audio-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.audio-panel {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  min-width: 150px;
}

.audio-slider {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.audio-slider label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.audio-slider input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  appearance: none;
  cursor: pointer;
}

.audio-slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
}

.volume-value {
  font-size: 0.75rem;
  color: #fbbf24;
  text-align: right;
}

.toggle-panel {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.2rem;
  transition: all 0.3s ease;
}

.toggle-panel:hover {
  color: #fff;
}
</style>
