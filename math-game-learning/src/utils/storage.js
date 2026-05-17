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
  VERSION: 'math_game_version',
  // 新增玩法数据
  SPEED_CHALLENGE: 'math_game_speed_challenge',
  WORKSHOP: 'math_game_workshop',
  CARD_BATTLE: 'math_game_card_battle',
  LEADERBOARD: 'math_game_leaderboard',
  NOTIFICATIONS: 'math_game_notifications'
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
  saveGame(player, progress, inventory, settings, extraData = {}) {
    this.savePlayer(player)
    this.saveProgress(progress)
    this.saveInventory(inventory)
    this.saveSettings(settings)
    
    // 保存新增玩法数据
    if (extraData.speedChallenge) {
      localStorage.setItem(STORAGE_KEYS.SPEED_CHALLENGE, JSON.stringify(extraData.speedChallenge))
    }
    if (extraData.workshop) {
      localStorage.setItem(STORAGE_KEYS.WORKSHOP, JSON.stringify(extraData.workshop))
    }
    if (extraData.cardBattle) {
      localStorage.setItem(STORAGE_KEYS.CARD_BATTLE, JSON.stringify(extraData.cardBattle))
    }
    if (extraData.leaderboard) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(extraData.leaderboard))
    }
    if (extraData.notifications) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(extraData.notifications))
    }
    
    this.updateVersion()
  }

  /**
   * 加载完整游戏存档
   */
  loadGame() {
    const baseData = {
      player: this.loadPlayer(),
      progress: this.loadProgress(),
      inventory: this.loadInventory(),
      settings: this.loadSettings(),
      version: this.checkVersion()
    }
    
    // 加载新增玩法数据（向后兼容：旧存档返回 null）
    try {
      const speedChallengeData = localStorage.getItem(STORAGE_KEYS.SPEED_CHALLENGE)
      baseData.speedChallenge = speedChallengeData ? JSON.parse(speedChallengeData) : null
    } catch { baseData.speedChallenge = null }
    
    try {
      const workshopData = localStorage.getItem(STORAGE_KEYS.WORKSHOP)
      baseData.workshop = workshopData ? JSON.parse(workshopData) : null
    } catch { baseData.workshop = null }
    
    try {
      const cardBattleData = localStorage.getItem(STORAGE_KEYS.CARD_BATTLE)
      baseData.cardBattle = cardBattleData ? JSON.parse(cardBattleData) : null
    } catch { baseData.cardBattle = null }
    
    try {
      const leaderboardData = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
      baseData.leaderboard = leaderboardData ? JSON.parse(leaderboardData) : null
    } catch { baseData.leaderboard = null }
    
    try {
      const notificationsData = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      baseData.notifications = notificationsData ? JSON.parse(notificationsData) : null
    } catch { baseData.notifications = null }
    
    return baseData
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
