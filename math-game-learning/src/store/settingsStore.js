/**
 * 设置 Store
 */
import { defineStore } from 'pinia'
import storageManager from '../utils/storage'
import Settings from '../models/Settings'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sound: true,
    music: true,
    musicVolume: 0.5,
    soundVolume: 0.7,
    difficulty: 'normal',
    grade: 1,
    language: 'zh-CN',
    showTutorial: true,
    notifications: true,
    autoSave: true,
    showDamageNumbers: true,
    quickMode: false
  }),

  getters: {
    // 获取难度标签
    difficultyLabel: (state) => {
      const labels = {
        easy: '简单',
        normal: '普通',
        hard: '困难'
      }
      return labels[state.difficulty] || '普通'
    },

    // 获取年级标签
    gradeLabel: (state) => {
      return `${state.grade}年级`
    }
  },

  actions: {
    /**
     * 加载设置
     */
    loadSettings() {
      const settings = storageManager.loadSettings()
      if (settings) {
        this.sound = settings.sound ?? true
        this.music = settings.music ?? true
        this.musicVolume = settings.musicVolume ?? 0.5
        this.soundVolume = settings.soundVolume ?? 0.7
        this.difficulty = settings.difficulty ?? 'normal'
        this.grade = settings.grade ?? 1
        this.language = settings.language ?? 'zh-CN'
        this.showTutorial = settings.showTutorial ?? true
      }
    },

    /**
     * 保存设置
     */
    saveSettings() {
      const settings = new Settings({
        sound: this.sound,
        music: this.music,
        musicVolume: this.musicVolume,
        soundVolume: this.soundVolume,
        difficulty: this.difficulty,
        grade: this.grade,
        language: this.language,
        showTutorial: this.showTutorial
      })
      storageManager.saveSettings(settings)
    },

    /**
     * 更新设置
     */
    updateSetting(key, value) {
      if (this.hasOwnProperty(key)) {
        this[key] = value
        this.saveSettings()
      }
    },

    /**
     * 设置难度
     */
    setDifficulty(difficulty) {
      if (['easy', 'normal', 'hard'].includes(difficulty)) {
        this.difficulty = difficulty
        this.saveSettings()
      }
    },

    /**
     * 设置年级
     */
    setGrade(grade) {
      if (grade >= 1 && grade <= 6) {
        this.grade = grade
        this.saveSettings()
      }
    },

    /**
     * 切换音效
     */
    toggleSound() {
      this.sound = !this.sound
      this.saveSettings()
    },

    /**
     * 切换音乐
     */
    toggleMusic() {
      this.music = !this.music
      this.saveSettings()
    },

    /**
     * 切换教程
     */
    toggleTutorial() {
      this.showTutorial = !this.showTutorial
      this.saveSettings()
    },

    /**
     * 重置设置
     */
    resetSettings() {
      this.sound = true
      this.music = true
      this.musicVolume = 0.5
      this.soundVolume = 0.7
      this.difficulty = 'normal'
      this.grade = 1
      this.language = 'zh-CN'
      this.showTutorial = true
      this.saveSettings()
    }
  }
})

export default useSettingsStore
