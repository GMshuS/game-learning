/**
 * 游戏设置数据模型
 */
export class Settings {
  constructor(data = {}) {
    this.sound = data.sound !== undefined ? data.sound : true;       // 音效开关
    this.music = data.music !== undefined ? data.music : true;       // 背景音乐开关
    this.musicVolume = data.musicVolume !== undefined ? data.musicVolume : 0.5;   // 音乐音量
    this.soundVolume = data.soundVolume !== undefined ? data.soundVolume : 0.7;   // 音效音量
    this.difficulty = data.difficulty || 'normal';   // 难度：easy, normal, hard
    this.gradeRange = data.gradeRange || { min: 1, max: 1 }; // 年级区间（新增）
    this.grade = data.grade || 1;                    // 年级设置（向下兼容，不再使用）
    this.language = data.language || 'zh-CN';        // 语言
    this.showTutorial = data.showTutorial !== undefined ? data.showTutorial : true; // 显示教程
    this.englishLevel = data.englishLevel || 'auto'; // 英语等级（'auto' 或 1-6）
    this.notifications = data.notifications !== undefined ? data.notifications : true; // 通知开关
    this.autoSave = data.autoSave !== undefined ? data.autoSave : true; // 自动保存
    this.showDamageNumbers = data.showDamageNumbers !== undefined ? data.showDamageNumbers : true; // 显示伤害数字
    this.quickMode = data.quickMode || false; // 快速模式
  }

  /**
   * 切换音效
   */
  toggleSound() {
    this.sound = !this.sound;
  }

  /**
   * 切换音乐
   */
  toggleMusic() {
    this.music = !this.music;
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 设置音效音量
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 设置难度
   */
  setDifficulty(difficulty) {
    const validDifficulties = ['easy', 'normal', 'hard'];
    if (validDifficulties.includes(difficulty)) {
      this.difficulty = difficulty;
      return true;
    }
    return false;
  }

  /**
   * 设置年级（向下兼容）
   */
  setGrade(grade) {
    if (grade >= 1 && grade <= 6) {
      this.grade = grade;
      this.gradeRange = { min: grade, max: grade };
      return true;
    }
    return false;
  }

  /**
   * 设置年级区间
   */
  setGradeRange(range) {
    if (range.min >= 1 && range.max <= 6 && range.min <= range.max) {
      this.gradeRange = range;
      return true;
    }
    return false;
  }

  /**
   * 切换教程显示
   */
  toggleTutorial() {
    this.showTutorial = !this.showTutorial;
  }

  /**
   * 重置为默认设置
   */
  reset() {
    this.sound = true;
    this.music = true;
    this.musicVolume = 0.5;
    this.soundVolume = 0.7;
    this.difficulty = 'normal';
    this.gradeRange = { min: 1, max: 1 };
    this.grade = 1;
    this.language = 'zh-CN';
    this.showTutorial = true;
    this.englishLevel = 'auto';
    this.notifications = true;
    this.autoSave = true;
    this.showDamageNumbers = true;
    this.quickMode = false;
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
      gradeRange: this.gradeRange,
      grade: this.grade,
      language: this.language,
      showTutorial: this.showTutorial,
      englishLevel: this.englishLevel,
      notifications: this.notifications,
      autoSave: this.autoSave,
      showDamageNumbers: this.showDamageNumbers,
      quickMode: this.quickMode
    };
  }

  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new Settings(data);
  }
}

export default Settings;
