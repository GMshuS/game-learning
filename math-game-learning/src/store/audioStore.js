/**
 * 音频 Store
 */
import { defineStore } from 'pinia';
import audioManager from '../utils/audioManager';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    bgmEnabled: true,
    sfxEnabled: true,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    currentBgm: null,
    isMuted: false
  }),

  getters: {
    // 获取图标
    bgmIcon: (state) => {
      if (!state.bgmEnabled) return '🔇';
      if (state.bgmVolume < 0.3) return '🔈';
      if (state.bgmVolume < 0.7) return '🔉';
      return '🔊';
    },
    
    sfxIcon: (state) => {
      if (!state.sfxEnabled) return '🔇';
      if (state.sfxVolume < 0.3) return '🔈';
      if (state.sfxVolume < 0.7) return '🔉';
      return '🔊';
    }
  },

  actions: {
    /**
     * 初始化
     */
    init() {
      const status = audioManager.getStatus();
      this.bgmEnabled = status.bgmEnabled;
      this.sfxEnabled = status.sfxEnabled;
      this.bgmVolume = status.bgmVolume;
      this.sfxVolume = status.sfxVolume;
      this.currentBgm = status.currentBgm;
    },

    /**
     * 播放音效
     */
    playSfx(key) {
      if (this.sfxEnabled && !this.isMuted) {
        audioManager.playSfx(key);
      }
    },

    /**
     * 播放 BGM
     */
    playBgm(key) {
      if (this.bgmEnabled && !this.isMuted) {
        audioManager.playBgm(key);
        this.currentBgm = key;
      }
    },

    /**
     * 停止 BGM
     */
    stopBgm() {
      audioManager.stopBgm();
      this.currentBgm = null;
    },

    /**
     * 切换 BGM
     */
    toggleBgm() {
      this.bgmEnabled = audioManager.toggleBgm();
    },

    /**
     * 切换 SFX
     */
    toggleSfx() {
      this.sfxEnabled = audioManager.toggleSfx();
    },

    /**
     * 设置 BGM 音量
     */
    setBgmVolume(volume) {
      this.bgmVolume = volume;
      audioManager.setBgmVolume(volume);
    },

    /**
     * 设置 SFX 音量
     */
    setSfxVolume(volume) {
      this.sfxVolume = volume;
      audioManager.setSfxVolume(volume);
    },

    /**
     * 静音
     */
    mute() {
      this.isMuted = true;
      audioManager.muteAll();
    },

    /**
     * 取消静音
     */
    unmute() {
      this.isMuted = false;
      audioManager.unmuteAll();
    },

    /**
     * 切换静音
     */
    toggleMute() {
      if (this.isMuted) {
        this.unmute();
      } else {
        this.mute();
      }
    }
  }
});

export default useAudioStore;
