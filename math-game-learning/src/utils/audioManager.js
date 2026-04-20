/**
 * 音频管理器
 */
import audioConfig from '../config/audio'

class AudioManager {
  constructor() {
    this.bgmVolume = 0.5
    this.sfxVolume = 0.7
    this.bgmEnabled = true
    this.sfxEnabled = true
    
    this.currentBgm = null
    this.bgmAudio = null
    this.sfxPool = {}
    
    this.preloaded = new Set()
  }

  /**
   * 初始化音频系统
   */
  init() {
    this.loadSettings()
    this.preloadSfx()
  }

  /**
   * 加载设置
   */
  loadSettings() {
    try {
      const settings = localStorage.getItem('audio_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        this.bgmVolume = parsed.bgmVolume ?? 0.5
        this.sfxVolume = parsed.sfxVolume ?? 0.7
        this.bgmEnabled = parsed.bgmEnabled ?? true
        this.sfxEnabled = parsed.sfxEnabled ?? true
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e)
    }
  }

  /**
   * 保存设置
   */
  saveSettings() {
    try {
      localStorage.setItem('audio_settings', JSON.stringify({
        bgmVolume: this.bgmVolume,
        sfxVolume: this.sfxVolume,
        bgmEnabled: this.bgmEnabled,
        sfxEnabled: this.sfxEnabled
      }))
    } catch (e) {
      console.warn('Failed to save audio settings:', e)
    }
  }

  /**
   * 预加载音效
   */
  preloadSfx() {
    Object.values(audioConfig.sfx).forEach(config => {
      this.loadSfx(config.id, config.src)
    })
  }

  /**
   * 加载音效
   */
  loadSfx(id, src) {
    if (this.sfxPool[id]) return

    const audio = new Audio(src)
    audio.volume = this.sfxVolume
    this.sfxPool[id] = audio
    this.preloaded.add(id)
  }

  /**
   * 播放音效
   */
  playSfx(key) {
    if (!this.sfxEnabled) return

    const config = audioConfig.sfx[key]
    if (!config) {
      console.warn(`SFX not found: ${key}`)
      return
    }

    const audio = this.sfxPool[config.id]
    if (audio) {
      // 克隆音频以支持重叠播放
      const clone = audio.cloneNode()
      clone.volume = this.sfxVolume * (config.volume ?? 1)
      clone.play().catch(e => console.warn('SFX play error:', e))
    }
  }

  /**
   * 播放背景音乐
   */
  playBgm(key) {
    if (!this.bgmEnabled) return

    const config = audioConfig.bgm[key]
    if (!config) {
      console.warn(`BGM not found: ${key}`)
      return
    }

    // 如果已经是当前 BGM，跳过
    if (this.currentBgm === key) return

    // 停止当前 BGM
    this.stopBgm()

    // 播放新 BGM
    this.bgmAudio = new Audio(config.src)
    this.bgmAudio.loop = config.loop ?? true
    this.bgmAudio.volume = this.bgmVolume * (config.volume ?? 1)
    this.bgmAudio.play().catch(e => console.warn('BGM play error:', e))
    this.currentBgm = key
  }

  /**
   * 停止背景音乐
   */
  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmAudio = null
      this.currentBgm = null
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeBgm() {
    if (this.bgmAudio && this.bgmEnabled) {
      this.bgmAudio.play().catch(e => console.warn('BGM resume error:', e))
    }
  }

  /**
   * 设置 BGM 音量
   */
  setBgmVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume))
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume
    }
    this.saveSettings()
  }

  /**
   * 设置 SFX 音量
   */
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    Object.values(this.sfxPool).forEach(audio => {
      audio.volume = this.sfxVolume
    })
    this.saveSettings()
  }

  /**
   * 切换 BGM 开关
   */
  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled
    if (this.bgmEnabled) {
      this.resumeBgm()
    } else {
      this.pauseBgm()
    }
    this.saveSettings()
    return this.bgmEnabled
  }

  /**
   * 切换 SFX 开关
   */
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled
    this.saveSettings()
    return this.sfxEnabled
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
      currentBgm: this.currentBgm
    }
  }

  /**
   * 静音全部
   */
  muteAll() {
    this.bgmEnabled = false
    this.sfxEnabled = false
    this.pauseBgm()
    this.saveSettings()
  }

  /**
   * 取消静音
   */
  unmuteAll() {
    this.bgmEnabled = true
    this.sfxEnabled = true
    this.resumeBgm()
    this.saveSettings()
  }
}

// 创建单例
const audioManager = new AudioManager()

export default audioManager
