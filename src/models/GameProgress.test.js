/**
 * GameProgress 模型单元测试
 */
import { describe, it, expect } from 'vitest';
import { GameProgress } from './GameProgress';

describe('GameProgress', () => {
  it('应该使用默认值创建', () => {
    const progress = new GameProgress();
    expect(progress.adventureLevel).toBe(1);
    expect(progress.shopLevel).toBe(1);
    expect(progress.unlockedAreas).toEqual([]);
    expect(progress.completedLevels).toEqual([]);
    expect(progress.stars).toEqual({});
    expect(progress.totalPlayTime).toBe(0);
  });

  it('应该使用传入数据创建', () => {
    const progress = new GameProgress({
      adventureLevel: 3,
      unlockedAreas: ['area_1', 'area_2'],
      completedLevels: ['area_1_level_1']
    });
    expect(progress.adventureLevel).toBe(3);
    expect(progress.unlockedAreas).toHaveLength(2);
    expect(progress.completedLevels).toHaveLength(1);
  });

  it('unlockArea 应解锁新区域', () => {
    const progress = new GameProgress();
    const result = progress.unlockArea('area_2');
    expect(result).toBe(true);
    expect(progress.unlockedAreas).toContain('area_2');
  });

  it('unlockArea 对已解锁区域应返回 false', () => {
    const progress = new GameProgress({ unlockedAreas: ['area_1'] });
    const result = progress.unlockArea('area_1');
    expect(result).toBe(false);
  });

  it('isAreaUnlocked 应正确检测区域状态', () => {
    const progress = new GameProgress({ unlockedAreas: ['area_1', 'area_3'] });
    expect(progress.isAreaUnlocked('area_1')).toBe(true);
    expect(progress.isAreaUnlocked('area_2')).toBe(false);
    expect(progress.isAreaUnlocked('area_3')).toBe(true);
  });

  it('completeLevel 应标记关卡完成', () => {
    const progress = new GameProgress();
    progress.completeLevel('area_1_level_1', 2);
    expect(progress.completedLevels).toContain('area_1_level_1');
    expect(progress.stars['area_1_level_1']).toBe(2);
  });

  it('completeLevel 应保留最高星星评价', () => {
    const progress = new GameProgress();
    progress.completeLevel('level_1', 1);
    expect(progress.stars['level_1']).toBe(1);
    // 再次以更高星星完成
    progress.completeLevel('level_1', 3);
    expect(progress.stars['level_1']).toBe(3);
    // 再次以更低星星完成不应覆盖
    progress.completeLevel('level_1', 2);
    expect(progress.stars['level_1']).toBe(3);
  });

  it('isLevelCompleted 应正确检测关卡状态', () => {
    const progress = new GameProgress({ completedLevels: ['area_1_level_1', 'area_1_level_2'] });
    expect(progress.isLevelCompleted('area_1_level_1')).toBe(true);
    expect(progress.isLevelCompleted('area_1_level_3')).toBe(false);
  });

  it('addPlayTime 应增加游戏时长', () => {
    const progress = new GameProgress({ totalPlayTime: 100 });
    progress.addPlayTime(50);
    expect(progress.totalPlayTime).toBe(150);
  });

  it('toStorage 应返回正确的存储对象', () => {
    const progress = new GameProgress({
      adventureLevel: 2,
      unlockedAreas: ['area_1']
    });
    const storage = progress.toStorage();
    expect(storage.adventureLevel).toBe(2);
    expect(storage.unlockedAreas).toEqual(['area_1']);
    expect(storage.lastSavedAt).toBeDefined();
  });

  it('fromStorage 应从存储对象恢复', () => {
    const data = {
      adventureLevel: 5,
      shopLevel: 3,
      unlockedAreas: ['area_1', 'area_2'],
      completedLevels: ['area_1_level_1'],
      stars: { 'area_1_level_1': 3 },
      totalPlayTime: 3600
    };
    const progress = GameProgress.fromStorage(data);
    expect(progress.adventureLevel).toBe(5);
    expect(progress.shopLevel).toBe(3);
    expect(progress.totalPlayTime).toBe(3600);
  });
});
