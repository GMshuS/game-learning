<template>
  <div class="settings-overlay" @click="$emit('close')">
    <div class="settings-panel" @click.stop>
      <div class="settings-header">
        <h2>⚙️ 设置</h2>
        <button class="btn-close" @click="$emit('close')">×</button>
      </div>

      <!-- 选项卡 -->
      <div class="settings-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="settings-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-name">{{ tab.name }}</span>
        </button>
      </div>

      <!-- 设置内容 -->
      <div class="settings-content">
        <!-- 通用设置 -->
        <div v-show="activeTab === 'general'" class="settings-section">
          <h3>语言和年级</h3>
          
          <div class="setting-item range-setting">
            <label>年级区间</label>
            <GradeRangeSelector
              :model-value="localSettings.gradeRange"
              @update:model-value="onGradeRangeUpdate"
            />
          </div>
          
          <div class="setting-item">
            <label>语言</label>
            <select v-model="localSettings.language" @change="updateSetting('language', localSettings.language)">
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>
          
          <div class="setting-item">
            <label>
              <input
                v-model="localSettings.showTutorial"
                type="checkbox"
                @change="updateSetting('showTutorial', localSettings.showTutorial)"
              >
              显示教程提示
            </label>
          </div>
        </div>

        <!-- 音频设置 -->
        <div v-show="activeTab === 'audio'" class="settings-section">
          <h3>音量和音效</h3>
          
          <div class="setting-item">
            <label>
              <input
                v-model="localSettings.music"
                type="checkbox"
                @change="updateSetting('music', localSettings.music)"
              >
              背景音乐
            </label>
            <span class="toggle-icon">{{ localSettings.music ? '🔊' : '🔇' }}</span>
          </div>
          
          <div v-if="localSettings.music" class="setting-item slider">
            <label>背景音乐音量</label>
            <input
              v-model="localSettings.musicVolume"
              type="range"
              min="0"
              max="100"
              @change="updateSetting('musicVolume', localSettings.musicVolume)"
            >
            <span class="slider-value">{{ localSettings.musicVolume }}%</span>
          </div>
          
          <div class="setting-item">
            <label>
              <input
                v-model="localSettings.sound"
                type="checkbox"
                @change="updateSetting('sound', localSettings.sound)"
              >
              音效
            </label>
            <span class="toggle-icon">{{ localSettings.sound ? '🔊' : '🔇' }}</span>
          </div>
          
          <div v-if="localSettings.sound" class="setting-item slider">
            <label>音效音量</label>
            <input
              v-model="localSettings.soundVolume"
              type="range"
              min="0"
              max="100"
              @change="updateSetting('soundVolume', localSettings.soundVolume)"
            >
            <span class="slider-value">{{ localSettings.soundVolume }}%</span>
          </div>
        </div>

        <!-- 游戏设置 -->
        <div v-show="activeTab === 'game'" class="settings-section">
          <h3>难度设置</h3>
          
          <div class="difficulty-cards">
            <div
              v-for="diff in difficulties"
              :key="diff.value"
              class="difficulty-card"
              :class="{ selected: localSettings.difficulty === diff.value }"
              @click="updateSetting('difficulty', diff.value)"
            >
              <div class="difficulty-icon">
                {{ diff.value === 'easy' ? '🌱' : diff.value === 'normal' ? '🌿' : '🌵' }}
              </div>
              <h4>{{ diff.label }}</h4>
              <p>{{ diff.description }}</p>
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div v-show="activeTab === 'data'" class="settings-section">
          <h3>数据管理</h3>
          
          <div class="data-actions">
            <button class="action-btn export" @click="$emit('export')">
              📤 导出数据
            </button>
            <button class="action-btn import" @click="$emit('import')">
              📥 导入数据
            </button>
          </div>
          
          <div class="danger-zone">
            <h4>⚠️ 危险操作</h4>
            <p>这些操作不可撤销，请谨慎使用</p>
            <button class="btn-danger" @click="$emit('reset')">
              🗑️ 重置游戏进度
            </button>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="settings-footer">
        <button class="btn-reset" @click="resetSettings">
          🔄 恢复默认
        </button>
        <button class="btn-close-panel" @click="$emit('close')">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSettingsStore } from '../store/settingsStore';
import GradeRangeSelector from './GradeRangeSelector.vue';
const settingsStore = useSettingsStore();

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({
      sound: true,
      music: true,
      musicVolume: 50,
      soundVolume: 70,
      difficulty: 'normal',
      gradeRange: { min: 1, max: 1 },
      language: 'zh-CN',
      showTutorial: true
    })
  }
});

const emit = defineEmits(['update', 'close', 'export', 'import', 'reset']);

const activeTab = ref('general');
const localSettings = ref({ ...props.settings });

watch(() => props.settings, (newSettings) => {
  Object.keys(newSettings).forEach(key => {
    if (key === 'musicVolume' || key === 'soundVolume') {
      localSettings.value[key] = Math.round(newSettings[key]);
    } else {
      localSettings.value[key] = newSettings[key];
    }
  });
}, { deep: true });

const tabs = [
  { id: 'general', name: '通用设置', icon: '⚙️' },
  { id: 'audio', name: '音频设置', icon: '🔊' },
  { id: 'game', name: '游戏设置', icon: '🎮' },
  { id: 'data', name: '数据管理', icon: '💾' }
];

const difficulties = [
  { value: 'easy', label: '简单', description: '适合初学者' },
  { value: 'normal', label: '普通', description: '标准难度' },
  { value: 'hard', label: '困难', description: '挑战性更高' }
];

const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' }
];

const onGradeRangeUpdate = (range) => {
  localSettings.value.gradeRange = range;
  updateSetting('gradeRange', range);
};

const updateSetting = (key, value) => {
  localSettings.value[key] = value;
  // 仅 emit 给父组件，由父组件统一处理值转换和持久化
  emit('update', { ...localSettings.value });
};

const resetSettings = () => {
  const defaults = {
    sound: true,
    music: true,
    musicVolume: 50,
    soundVolume: 70,
    difficulty: 'normal',
    gradeRange: { min: 1, max: 1 },
    language: 'zh-CN',
    showTutorial: true
  };
  localSettings.value = { ...defaults };
  emit('update', { ...localSettings.value });
  // 显式持久化到 localStorage，不依赖父组件转发
  Object.entries(defaults).forEach(([key, value]) => {
    // musicVolume/soundVolume 组件中存 0-100，store 存 0-1
    const storeValue = (key === 'musicVolume' || key === 'soundVolume') ? value / 100 : value;
    settingsStore.updateSetting(key, storeValue);
  });
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.settings-panel {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header h2 {
  margin: 0;
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.settings-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
}

.settings-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.8rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.settings-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-name {
  font-size: 0.8rem;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.settings-section h3 {
  margin: 0 0 1rem 0;
  color: #fbbf24;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.range-setting {
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.setting-item.range-setting label {
  margin-bottom: 0.25rem;
  align-self: flex-start;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #fff;
  font-size: 1rem;
}

.setting-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.setting-item select {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-item select:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.setting-item select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.setting-item select option {
  color: #fff;
  background: #1a1a2e;
}

.setting-item.slider {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.setting-item.slider input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  appearance: none;
  cursor: pointer;
}

.setting-item.slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
}

.slider-value {
  color: #fbbf24;
  font-weight: bold;
}

.toggle-icon {
  font-size: 1.5rem;
}

.difficulty-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.difficulty-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-card:hover {
  transform: translateY(-3px);
}

.difficulty-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.difficulty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.difficulty-card h4 {
  margin: 0 0 0.3rem 0;
  color: #fff;
}

.difficulty-card p {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.data-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.export {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
}

.action-btn.import {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.danger-zone {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 15px;
  padding: 1rem;
}

.danger-zone h4 {
  margin: 0 0 0.5rem 0;
  color: #ef4444;
}

.danger-zone p {
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
  opacity: 0.7;
}

.btn-danger {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-reset,
.btn-close-panel {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-close-panel {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}
</style>
