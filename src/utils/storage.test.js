/**
 * StorageManager 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// vitest 的 jsdom 环境中 localStorage 不可用，提供简易 mock
const mockStorage = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] ?? null),
  setItem: vi.fn((key, value) => { mockStorage[key] = String(value); }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }),
  get length() { return Object.keys(mockStorage).length; },
  key: vi.fn((index) => Object.keys(mockStorage)[index] ?? null)
});

import storageManager, { StorageManager } from './storage';

describe('StorageManager', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  describe('_safeSetItem', () => {
    it('应安全写入 localStorage', () => {
      const result = storageManager._safeSetItem('test_key', 'test_value');
      expect(result).toBe(true);
      expect(localStorage.getItem('test_key')).toBe('test_value');
    });

    it('写入失败时应返回 false（模拟配额不足）', () => {
      const manager = new StorageManager();
      // 临时让 localStorage.setItem 抛出 QuotaExceededError
      const originalMock = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const e = new Error('QuotaExceeded');
        e.name = 'QuotaExceededError';
        throw e;
      });
      const result = manager._safeSetItem('test', 'value');
      expect(result).toBe(false);
      localStorage.setItem = originalMock;
    });
  });

  describe('版本管理', () => {
    it('checkVersion 在无存档时应返回 null', () => {
      expect(storageManager.checkVersion()).toBeNull();
    });

    it('updateVersion 应写入当前版本', () => {
      storageManager.updateVersion();
      expect(localStorage.getItem('math_game_version')).toBe('3.0.0');
    });

    it('checkVersion 在版本不匹配时应返回旧版本号', () => {
      localStorage.setItem('math_game_version', '2.0.0');
      expect(storageManager.checkVersion()).toBe('2.0.0');
    });
  });

  describe('玩家数据持久化', () => {
    it('savePlayer 和 loadPlayer 应正确存取', () => {
      const playerData = { name: '测试玩家', level: 5, coins: 300 };
      storageManager.savePlayer(playerData);
      const loaded = storageManager.loadPlayer();
      expect(loaded.name).toBe('测试玩家');
      expect(loaded.level).toBe(5);
    });

    it('loadPlayer 在无数据时应返回 null', () => {
      expect(storageManager.loadPlayer()).toBeNull();
    });
  });

  describe('游戏进度持久化', () => {
    it('saveProgress 和 loadProgress 应正确存取', () => {
      const progressData = { adventureLevel: 3, unlockedAreas: ['area_1'] };
      storageManager.saveProgress(progressData);
      const loaded = storageManager.loadProgress();
      expect(loaded.adventureLevel).toBe(3);
    });
  });

  describe('saveGame / loadGame', () => {
    it('saveGame 应保存全部数据并更新版本', () => {
      const player = { name: '存档测试', coins: 100 };
      const progress = { adventureLevel: 2 };
      const inventory = { items: [] };
      const settings = { sound: true, musicVolume: 0.5 };
      storageManager.saveGame(player, progress, inventory, settings);

      expect(localStorage.getItem('math_game_version')).toBe('3.0.0');
      expect(localStorage.getItem('math_game_player')).toBeDefined();
    });

    it('loadGame 应加载完整数据', () => {
      const player = { name: '读取测试', coins: 200 };
      const progress = { adventureLevel: 3 };
      const inventory = { items: [{ id: 'sword' }] };
      const settings = { sound: true, musicVolume: 0.7 };
      storageManager.saveGame(player, progress, inventory, settings);

      const gameData = storageManager.loadGame();
      expect(gameData.player.name).toBe('读取测试');
      expect(gameData.progress.adventureLevel).toBe(3);
      expect(gameData.inventory.items).toHaveLength(1);
    });

    it('loadGame 在版本不匹配时应返回 null', () => {
      storageManager.saveGame(
        { name: 'test' }, { adventureLevel: 1 }, { items: [] }, { sound: true }
      );
      // 修改版本号模拟旧版本
      localStorage.setItem('math_game_version', '2.0.0');
      const gameData = storageManager.loadGame();
      expect(gameData).toBeNull();
    });
  });

  describe('createNewGame', () => {
    it('应创建带有默认值的新游戏数据', () => {
      const gameData = storageManager.createNewGame('新玩家', 2);
      expect(gameData.player.name).toBe('新玩家');
      expect(gameData.progress).toBeDefined();
      expect(gameData.inventory).toBeDefined();
      expect(gameData.settings).toBeDefined();
      // 验证持久化
      expect(localStorage.getItem('math_game_player')).toBeDefined();
    });
  });

  describe('migrateSettings', () => {
    it('应将百分比格式音量归一化为 0-1 范围', () => {
      localStorage.setItem('math_game_settings', JSON.stringify({
        musicVolume: 75,
        soundVolume: 50
      }));
      const migrated = storageManager.migrateSettings();
      expect(migrated).toBe(true);
      const settings = JSON.parse(localStorage.getItem('math_game_settings'));
      expect(settings.musicVolume).toBe(0.75);
      expect(settings.soundVolume).toBe(0.50);
    });

    it('已有正确格式数据不应迁移', () => {
      localStorage.setItem('math_game_settings', JSON.stringify({
        musicVolume: 0.5,
        soundVolume: 0.7
      }));
      const migrated = storageManager.migrateSettings();
      expect(migrated).toBe(false);
    });

    it('无数据时应返回 false', () => {
      const migrated = storageManager.migrateSettings();
      expect(migrated).toBe(false);
    });
  });

  describe('resetGame / resetGameKeepSettings', () => {
    it('resetGame 应清除所有数据', () => {
      storageManager.saveGame(
        { name: 'test' }, { adventureLevel: 1 }, { items: [] }, { sound: true }
      );
      storageManager.resetGame();
      expect(localStorage.getItem('math_game_player')).toBeNull();
      expect(localStorage.getItem('math_game_version')).toBeNull();
    });

    it('resetGameKeepSettings 应保留设置类数据', () => {
      storageManager.saveGame(
        { name: 'test' },
        { adventureLevel: 1 },
        { items: [] },
        { sound: true, musicVolume: 0.5 }
      );
      // 额外写入知识数据
      localStorage.setItem('math_game_math_knowledge', JSON.stringify({}));
      localStorage.setItem('math_game_english_knowledge', JSON.stringify({}));

      storageManager.resetGameKeepSettings();
      expect(localStorage.getItem('math_game_player')).toBeNull();
      expect(localStorage.getItem('math_game_settings')).toBeDefined();
      expect(localStorage.getItem('math_game_math_knowledge')).toBeDefined();
    });
  });

  describe('exportData / importData', () => {
    it('exportData 应导出所有数据', () => {
      storageManager.saveGame(
        { name: '导出测试' }, { adventureLevel: 1 }, { items: [] }, { sound: true }
      );
      const exported = storageManager.exportData();
      const parsed = JSON.parse(exported);
      expect(parsed.PLAYER).toBeDefined();
      expect(parsed.SETTINGS).toBeDefined();
    });

    it('importData 应导入有效数据', () => {
      const data = JSON.stringify({
        PLAYER: JSON.stringify({ name: '导入玩家', coins: 500 }),
        SETTINGS: JSON.stringify({ sound: true, musicVolume: 0.8 })
      });
      const result = storageManager.importData(data);
      expect(result).toBe(true);
      expect(localStorage.getItem('math_game_player')).toBeDefined();
    });

    it('importData 在无效 JSON 时应返回 false', () => {
      const result = storageManager.importData('invalid json');
      expect(result).toBe(false);
    });
  });

  describe('_loadOptionalData', () => {
    it('应加载存在的可选数据', () => {
      localStorage.setItem('test_optional', JSON.stringify({ foo: 'bar' }));
      const result = storageManager._loadOptionalData('test_optional', 'test');
      expect(result.foo).toBe('bar');
    });

    it('不存在的 key 应返回 null', () => {
      const result = storageManager._loadOptionalData('non_existent', 'test');
      expect(result).toBeNull();
    });

    it('损坏的数据应返回 null 且不抛出异常', () => {
      localStorage.setItem('bad_data', 'not json');
      const result = storageManager._loadOptionalData('bad_data', 'bad');
      expect(result).toBeNull();
    });
  });
});
