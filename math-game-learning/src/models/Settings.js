/**
 * 游戏设置数据模型
 */
export class Settings {
  constructor(data = {}) {
    this.sound = data.sound !== undefined ? data.sound : true       // 音效开关
    this.music = data.music !== undefined ? data.music : true       // 背景音乐开关
    this.musicVolume = data.musicVolume !== undefined ? data.musicVolume : 0.5   // 音乐音量
    this.soundVolume = data.soundVolume !== undefined ? data.soundVolume : 0.7   // 音效音量
    this.difficulty = data.difficulty || 'normal'   // 难度：easy, normal, hard
    this.grade = data.grade || 1                    // 年级设置
    this.language = data.language || 'zh-CN'        // 语言
    this.showTutorial = data.showTutorial !== undefined ? data.showTutorial : true // 显示教程
  }

  /**
   * 切换音效
   */
  toggleSound() {
    this.sound = !this.sound
  }

  /**
   * 切换音乐
   */
  toggleMusic() {
    this.music = !this.music
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 设置音效音量
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 设置难度
   */
  setDifficulty(difficulty) {
    const validDifficulties = ['easy', 'normal', 'hard']
    if (validDifficulties.includes(difficulty)) {
      this.difficulty = difficulty
      return true
    }
    return false
  }

  /**
   * 设置年级
   */
  setGrade(grade) {
    if (grade >= 1 && grade <= 6) {
      this.grade = grade
      return true
    }
    return false
  }

  /**
   * 切换教程显示
   */
  toggleTutorial() {
    this.showTutorial = !this.showTutorial
  }

  /**
   * 重置为默认设置
   */
  reset() {
    this.sound = true
    this.music = true
    this.musicVolume = 0.5
    this.soundVolume = 0.7
    this.difficulty = 'normal'
    this.grade = 1
    this.language = 'zh-CN'
    this.showTutorial = true
  }

  /**
   * 转换为存储对象
   */
  toStorage() {
    return {
      sound: this.sound,
      music: this.music,
      musicVolume: this.musicVolume,
      soundVolume: this.soundVolume,
      difficulty: this.difficulty,
      grade: this.grade,
      language: this.language,
      showTutorial: this.showTutorial
    }
  }

  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new Settings(data)
  }
}

export default Settings
