/**
 * 游戏进度数据模型
 */
export class GameProgress {
  constructor(data = {}) {
    this.adventureLevel = data.adventureLevel || 1;    // 冒险关卡
    this.shopLevel = data.shopLevel || 1;              // 商店等级
    this.unlockedAreas = data.unlockedAreas || [];     // 已解锁区域
    this.completedLevels = data.completedLevels || []; // 已完成的关卡
    this.stars = data.stars || {};                     // 关卡星星评定
    this.totalPlayTime = data.totalPlayTime || 0;      // 总游戏时长（秒）
    this.lastSavedAt = data.lastSavedAt || new Date().toISOString();
  }

  /**
   * 解锁区域
   */
  unlockArea(areaId) {
    if (!this.unlockedAreas.includes(areaId)) {
      this.unlockedAreas.push(areaId);
      return true;
    }
    return false;
  }

  /**
   * 检查区域是否已解锁
   */
  isAreaUnlocked(areaId) {
    return this.unlockedAreas.includes(areaId);
  }

  /**
   * 完成关卡
   */
  completeLevel(levelId, stars = 1) {
    if (!this.completedLevels.includes(levelId)) {
      this.completedLevels.push(levelId);
    }
    // 更新星星评定（取最高）
    const currentStars = this.stars[levelId] || 0;
    if (stars > currentStars) {
      this.stars[levelId] = stars;
    }
  }

  /**
   * 检查关卡是否已完成
   */
  isLevelCompleted(levelId) {
    return this.completedLevels.includes(levelId);
  }

  /**
   * 增加游戏时长
   */
  addPlayTime(seconds) {
    this.totalPlayTime += seconds;
  }

  /**
   * 转换为存储对象
   */
  toStorage() {
    return {
      adventureLevel: this.adventureLevel,
      shopLevel: this.shopLevel,
      unlockedAreas: this.unlockedAreas,
      completedLevels: this.completedLevels,
      stars: this.stars,
      totalPlayTime: this.totalPlayTime,
      lastSavedAt: new Date().toISOString()
    };
  }

  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new GameProgress(data);
  }
}

export default GameProgress;
