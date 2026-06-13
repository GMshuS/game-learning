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
    
    /** @type {AudioContext|null} */
    this._audioCtx = null
    
    /** 当前正在播放的 fallback BGM oscillator */
    this._fallbackBgm = null
    
    /** fallback BGM 是否因暂停而被停止 */
    this._fallbackPaused = false
  }

  /**
   * 获取 AudioContext（惰性初始化）
   * @returns {AudioContext}
   */
  getAudioContext() {
    if (!this._audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (Ctor) {
        this._audioCtx = new Ctor()
      }
    }
    return this._audioCtx
  }

  /**
   * 使用 Web Audio API 播放回退提示音（当音频文件加载失败时使用）
   * @param {number} duration 时长（秒）
   * @param {number} frequency 频率（Hz）
   * @param {number} volume 音量 (0-1)
   * @param {'sfx'|'bgm'} type 类型
   * @param {boolean} loop 是否循环
   * @returns {object|null} 控制对象（包含 stop 方法）
   */
  playFallbackTone(duration, frequency, volume, type = 'sfx', loop = false) {
    const ctx = this.getAudioContext()
    if (!ctx) return null

    if (type === 'bgm' && loop && this._fallbackBgm) {
      // BGM 已经在播放 fallback
      return this._fallbackBgm
    }

    const gainNode = ctx.createGain()
    gainNode.gain.value = volume * 0.3  // 防止刺耳
    gainNode.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency
    osc.connect(gainNode)
    osc.start()

    const control = {
      stop: () => {
        try {
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)
          setTimeout(() => {
            osc.stop()
            osc.disconnect()
            gainNode.disconnect()
          }, 100)
        } catch (e) { /* ignore */ }
      }
    }

    if (loop) {
      // 循环播放：持续振荡器
      this._fallbackBgm = control
      return control
    }

    // 非循环：自动停止
    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    setTimeout(() => {
      try {
        osc.stop()
        osc.disconnect()
        gainNode.disconnect()
      } catch (e) { /* ignore */ }
    }, duration * 1000 + 100)

    return control
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
      clone.play().catch(e => {
        console.warn('SFX play error, using fallback:', e.message)
        // 使用 Web Audio API 回退
        this.playFallbackTone(0.15, 660, this.sfxVolume * (config.volume ?? 1))
      })
    } else {
      // 音频未加载，直接用 fallback
      this.playFallbackTone(0.15, 660, this.sfxVolume * (config.volume ?? 1))
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
    this.bgmAudio.play().catch(e => {
      console.warn('BGM play error, using fallback:', e.message)
      // 停止可能存在的旧 fallback
      this.stopFallbackBgm()
      // 使用 Web Audio API 回退（循环播放简单音调）
      this.playFallbackTone(999, 440, this.bgmVolume * (config.volume ?? 1), 'bgm', true)
    })
    this.currentBgm = key
  }

  /**
   * 停止 fallback BGM
   */
  stopFallbackBgm() {
    if (this._fallbackBgm) {
      this._fallbackBgm.stop()
      this._fallbackBgm = null
    }
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
    this.stopFallbackBgm()
  }

  /**
   * 暂停背景音乐
   */
  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
    if (this._fallbackBgm) {
      // fallback 无法暂停，停止并标记以便恢复时重建
      this._fallbackBgm.stop()
      this._fallbackBgm = null
      this._fallbackPaused = true
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeBgm() {
    if (this.bgmAudio && this.bgmEnabled) {
      this.bgmAudio.play().catch(e => console.warn('BGM resume error:', e))
    } else if (this.bgmEnabled && this._fallbackPaused && this.currentBgm) {
      this._fallbackPaused = false
      const config = audioConfig.bgm[this.currentBgm]
      if (config) {
        this.playFallbackTone(999, 440, this.bgmVolume * (config.volume ?? 1), 'bgm', true)
      }
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
    // 更新 fallback BGM 音量：当前简化处理，停止旧 fallback 用新音量重建
    if (this._fallbackBgm && this.currentBgm) {
      this._fallbackBgm.stop()
      this._fallbackBgm = null
      const config = audioConfig.bgm[this.currentBgm]
      if (config) {
        this.playFallbackTone(999, 440, this.bgmVolume * (config.volume ?? 1), 'bgm', true)
      }
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
