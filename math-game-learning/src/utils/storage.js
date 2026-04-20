/**
 * LocalStorage 数据存储管理器
 */
import Player from '../models/Player'
import GameProgress from '../models/GameProgress'
import Inventory from '../models/Inventory'
import Settings from '../models/Settings'

const STORAGE_KEYS = {
  PLAYER: 'math_game_player',
  PROGRESS: 'math_game_progress',
  INVENTORY: 'math_game_inventory',
  SETTINGS: 'math_game_settings',
  VERSION: 'math_game_version'
}

const VERSION = '1.0.0'

class StorageManager {
  constructor() {
    this.currentVersion = VERSION
  }

  /**
   * 检查存储版本
   */
  checkVersion() {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION)
    if (!storedVersion) {
      return null
    }
    return storedVersion
  }

  /**
   * 更新存储版本
   */
  updateVersion() {
    localStorage.setItem(STORAGE_KEYS.VERSION, this.currentVersion)
  }

  /**
   * 保存玩家数据
   */
  savePlayer(player) {
    const data = player instanceof Player ? player.toStorage() : player
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(data))
  }

  /**
   * 加载玩家数据
   */
  loadPlayer() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER)
    if (data) {
      try {
        return Player.fromStorage(JSON.parse(data))
      } catch (e) {
        console.error('加载玩家数据失败:', e)
        return null
      }
    }
    return null
  }

  /**
   * 保存游戏进度
   */
  saveProgress(progress) {
    const data = progress instanceof GameProgress ? progress.toStorage() : progress
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data))
  }

  /**
   * 加载游戏进度
   */
  loadProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    if (data) {
      try {
        return GameProgress.fromStorage(JSON.parse(data))
      } catch (e) {
        console.error('加载游戏进度失败:', e)
        return null
      }
    }
    return null
  }

  /**
   * 保存库存
   */
  saveInventory(inventory) {
    const data = inventory instanceof Inventory ? inventory.toStorage() : inventory
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(data))
  }

  /**
   * 加载库存
   */
  loadInventory() {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY)
    if (data) {
      try {
        return Inventory.fromStorage(JSON.parse(data))
      } catch (e) {
        console.error('加载库存失败:', e)
        return null
      }
    }
    return null
  }

  /**
   * 保存设置
   */
  saveSettings(settings) {
    const data = settings instanceof Settings ? settings.toStorage() : settings
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data))
  }

  /**
   * 加载设置
   */
  loadSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (data) {
      try {
        return Settings.fromStorage(JSON.parse(data))
      } catch (e) {
        console.error('加载设置失败:', e)
        return null
      }
    }
    return null
  }

  /**
   * 保存完整游戏存档
   */
  saveGame(player, progress, inventory, settings) {
    this.savePlayer(player)
    this.saveProgress(progress)
    this.saveInventory(inventory)
    this.saveSettings(settings)
    this.updateVersion()
  }

  /**
   * 加载完整游戏存档
   */
  loadGame() {
    return {
      player: this.loadPlayer(),
      progress: this.loadProgress(),
      inventory: this.loadInventory(),
      settings: this.loadSettings(),
      version: this.checkVersion()
    }
  }

  /**
   * 创建新游戏存档
   */
  createNewGame(playerName, grade = 1) {
    const player = new Player({ name: playerName, grade })
    const progress = new GameProgress({ unlockedAreas: ['area_1'] })
    const inventory = new Inventory()
    const settings = new Settings({ grade })

    this.saveGame(player, progress, inventory, settings)

    return { player, progress, inventory, settings }
  }

  /**
   * 重置游戏
   */
  resetGame() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  /**
   * 清除所有数据
   */
  clearAll() {
    localStorage.clear()
  }

  /**
   * 导出数据
   */
  exportData() {
    const exportObj = {}
    Object.keys(STORAGE_KEYS).forEach(key => {
      const value = localStorage.getItem(STORAGE_KEYS[key])
      if (value) {
        exportObj[key] = value
      }
    })
    return JSON.stringify(exportObj, null, 2)
  }

  /**
   * 导入数据
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      Object.keys(data).forEach(key => {
        if (STORAGE_KEYS[key]) {
          localStorage.setItem(STORAGE_KEYS[key], data[key])
        }
      })
      return true
    } catch (e) {
      console.error('导入数据失败:', e)
      return false
    }
  }
}

// 创建单例
const storageManager = new StorageManager()

export default storageManager
export { StorageManager, STORAGE_KEYS }
