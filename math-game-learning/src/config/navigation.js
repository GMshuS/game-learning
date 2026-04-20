/**
 * 导航路由配置
 */
export const routes = {
  // 主菜单
  home: {
    path: '/',
    name: 'home',
    component: 'MainMenu',
    title: '主菜单'
  },
  
  // 冒险模式
  adventure: {
    path: '/adventure',
    name: 'adventure',
    component: 'AdventureMap',
    title: '冒险模式',
    parent: 'adventure'
  },
  
  // 冒险战斗
  battle: {
    path: '/adventure/battle',
    name: 'battle',
    component: 'BattleGame',
    title: '战斗',
    parent: 'adventure'
  },
  
  // 角色装备
  equipment: {
    path: '/adventure/equipment',
    name: 'equipment',
    component: 'EquipmentManager',
    title: '装备管理',
    parent: 'adventure'
  },
  
  // 经营商店
  shop: {
    path: '/shop',
    name: 'shop',
    component: 'ShopView',
    title: '经营商店',
    parent: 'shop'
  },
  
  // 收银游戏
  cashier: {
    path: '/shop/cashier',
    name: 'cashier',
    component: 'CashierGame',
    title: '收银挑战',
    parent: 'shop'
  },
  
  // 进货管理
  restock: {
    path: '/shop/restock',
    name: 'restock',
    component: 'RestockView',
    title: '进货管理',
    parent: 'shop'
  },
  
  // 库存管理
  inventory: {
    path: '/shop/inventory',
    name: 'inventory',
    component: 'InventoryView',
    title: '库存管理',
    parent: 'shop'
  },
  
  // 成就系统
  achievements: {
    path: '/achievements',
    name: 'achievements',
    component: 'AchievementView',
    title: '成就系统'
  },
  
  // 设置
  settings: {
    path: '/settings',
    name: 'settings',
    component: 'SettingsPanel',
    title: '设置'
  },
  
  // 存档管理
  saveData: {
    path: '/settings/save',
    name: 'saveData',
    component: 'SaveDataManager',
    title: '存档管理',
    parent: 'settings'
  }
}

/**
 * 导航历史管理
 */
export class NavigationHistory {
  constructor() {
    this.history = []
    this.currentIndex = -1
  }
  
  push(route) {
    // 清除当前索引之后的历史
    this.history = this.history.slice(0, this.currentIndex + 1)
    this.history.push(route)
    this.currentIndex++
  }
  
  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      return this.history[this.currentIndex]
    }
    return null
  }
  
  forward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }
  
  canGoBack() {
    return this.currentIndex > 0
  }
  
  canGoForward() {
    return this.currentIndex < this.history.length - 1
  }
  
  clear() {
    this.history = []
    this.currentIndex = -1
  }
  
  getCurrent() {
    return this.history[this.currentIndex] || null
  }
}

/**
 * 获取路由配置
 */
export function getRoute(name) {
  return routes[name] || null
}

/**
 * 获取所有路由
 */
export function getAllRoutes() {
  return routes
}

export default {
  routes,
  NavigationHistory,
  getRoute,
  getAllRoutes
}
