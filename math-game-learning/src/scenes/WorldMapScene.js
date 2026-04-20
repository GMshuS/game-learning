/**
 * Phaser 游戏主场景 - 世界地图
 */
import Phaser from 'phaser'
import { getAllAreas, getArea } from '../config/adventure'

export default class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldMapScene' })
    
    this.areas = []
    this.areaNodes = []
    this.selectedArea = null
    this.unlockedAreas = []
    this.currentAreaId = null
  }

  init(data) {
    this.unlockedAreas = data.unlockedAreas || ['area_1']
    this.currentAreaId = data.currentAreaId || 'area_1'
    this.onAreaSelect = data.onAreaSelect || null
  }

  create() {
    const { width, height } = this.scale
    
    // 添加背景
    this.createBackground(width, height)
    
    // 添加标题
    this.createTitle(width)
    
    // 创建世界地图节点
    this.createMapNodes(width, height)
    
    // 添加返回按钮
    this.createBackButton(width, height)
    
    // 添加说明文字
    this.createHintText(width, height)
  }

  /**
   * 创建背景
   */
  createBackground(width, height) {
    // 渐变背景
    const graphics = this.add.graphics()
    const gradient = graphics.fillGradientStyle(
      0x1a1a2e, 0x1a1a2e,
      0x16213e, 0x16213e,
      1
    )
    graphics.fillRect(0, 0, width, height)
    
    // 添加装饰性星星
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 2 + 1
      const alpha = Math.random() * 0.5 + 0.3
      
      this.add.circle(x, y, size, 0xffffff, alpha)
    }
  }

  /**
   * 创建标题
   */
  createTitle(width) {
    this.add.text(width / 2, 50, '🗺️ 世界地图', {
      font: 'bold 36px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#667eea',
      strokeThickness: 6
    }).setOrigin(0.5)
  }

  /**
   * 创建地图节点
   */
  createMapNodes(width, height) {
    this.areas = getAllAreas()
    
    const nodeSpacing = (height - 200) / this.areas.length
    const centerX = width / 2
    let startY = 120
    
    this.areas.forEach((area, index) => {
      const x = centerX
      const y = startY + index * nodeSpacing
      
      const isUnlocked = this.unlockedAreas.includes(area.id)
      const isCurrent = this.currentAreaId === area.id
      
      // 创建节点容器
      const container = this.add.container(x, y)
      
      // 节点背景（圆形）
      const circle = this.add.circle(0, 0, 50, isUnlocked ? this.hexToColor(area.color) : 0x444444)
      circle.setStrokeStyle(isCurrent ? 4 : 2, isCurrent ? 0xffffff : 0x666666)
      container.add(circle)
      
      // 区域图标
      const icon = this.add.text(0, 0, this.getAreaIcon(index), {
        font: 'bold 28px Arial',
        color: isUnlocked ? '#ffffff' : '#888888'
      }).setOrigin(0.5)
      container.add(icon)
      
      // 锁定图标
      if (!isUnlocked) {
        const lockIcon = this.add.text(0, 0, '🔒', {
          font: 'bold 24px Arial'
        }).setOrigin(0.5)
        container.add(lockIcon)
      }
      
      // 区域名称
      const nameLabel = this.add.text(0, 70, area.name, {
        font: 'bold 20px Microsoft YaHei',
        color: isUnlocked ? '#ffffff' : '#888888',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5)
      container.add(nameLabel)
      
      // 区域描述
      const descLabel = this.add.text(0, 95, area.description, {
        font: '14px Microsoft YaHei',
        color: isUnlocked ? '#cccccc' : '#666666'
      }).setOrigin(0.5)
      container.add(descLabel)
      
      // 关卡进度
      if (isUnlocked) {
        const progressLabel = this.add.text(0, 120, `${area.levels} 关卡`, {
          font: '12px Microsoft YaHei',
          color: '#667eea'
        }).setOrigin(0.5)
        container.add(progressLabel)
      }
      
      // 点击事件
      if (isUnlocked) {
        container.setInteractive({ useHandCursor: true })
        
        container.on('pointerover', () => {
          if (!isCurrent) {
            circle.setScale(1.1)
          }
        })
        
        container.on('pointerout', () => {
          circle.setScale(1)
        })
        
        container.on('pointerdown', () => {
          this.selectArea(area)
        })
      }
      
      this.areaNodes.push({
        container,
        circle,
        area,
        isUnlocked,
        isCurrent
      })
    })
  }

  /**
   * 创建返回按钮
   */
  createBackButton(width, height) {
    const backBtn = this.add.container(width - 80, height - 50)
    
    const bg = this.add.circle(0, 0, 40, 0x667eea)
    bg.setStrokeStyle(2, 0xffffff)
    backBtn.add(bg)
    
    const icon = this.add.text(0, 0, '←', {
      font: 'bold 24px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    backBtn.add(icon)
    
    backBtn.setInteractive({ useHandCursor: true })
    
    backBtn.on('pointerover', () => bg.setScale(1.1))
    backBtn.on('pointerout', () => bg.setScale(1))
    backBtn.on('pointerdown', () => {
      this.scene.stop('WorldMapScene')
    })
  }

  /**
   * 创建提示文字
   */
  createHintText(width, height) {
    this.add.text(width / 2, height - 30, '点击区域进入冒险', {
      font: '16px Microsoft YaHei',
      color: '#888888'
    }).setOrigin(0.5)
  }

  /**
   * 选择区域
   */
  selectArea(area) {
    // 重置所有节点状态
    this.areaNodes.forEach(node => {
      if (node.circle) {
        node.circle.setStrokeStyle(2, 0x666666)
      }
    })
    
    // 设置选中状态
    const selectedNode = this.areaNodes.find(n => n.area.id === area.id)
    if (selectedNode && selectedNode.circle) {
      selectedNode.circle.setStrokeStyle(4, 0xffffff)
    }
    
    this.selectedArea = area
    
    // 触发选择回调
    if (this.onAreaSelect) {
      this.onAreaSelect(area)
    }
    
    // 显示区域选择提示
    this.showAreaSelectDialog(area)
  }

  /**
   * 显示区域选择对话框
   */
  showAreaSelectDialog(area) {
    const { width, height } = this.scale
    
    // 创建对话框背景
    const dialogWidth = 400
    const dialogHeight = 200
    const dialogX = width / 2
    const dialogY = height / 2
    
    const bg = this.add.roundRect(
      dialogX - dialogWidth / 2,
      dialogY - dialogHeight / 2,
      dialogWidth,
      dialogHeight,
      16,
      0x1a1a2e
    )
    bg.setStrokeStyle(3, this.hexToColor(area.color))
    bg.setShadow(10, 10, 0x000000, 0.5)
    
    // 区域名称
    this.add.text(dialogX, dialogY - 60, area.name, {
      font: 'bold 28px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // 区域描述
    this.add.text(dialogX, dialogY - 20, area.description, {
      font: '16px Microsoft YaHei',
      color: '#cccccc'
    }).setOrigin(0.5)
    
    // 关卡信息
    this.add.text(dialogX, dialogY + 20, `关卡数：${area.levels}`, {
      font: '16px Microsoft YaHei',
      color: area.color
    }).setOrigin(0.5)
    
    // 进入按钮
    const enterBtn = this.add.container(dialogX, dialogY + 70)
    
    const btnBg = this.add.roundRect(-100, -25, 200, 50, 25, this.hexToColor(area.color))
    btnBg.setStrokeStyle(2, 0xffffff)
    enterBtn.add(btnBg)
    
    const btnText = this.add.text(0, 0, '进入冒险', {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    enterBtn.add(btnText)
    
    enterBtn.setInteractive({ useHandCursor: true })
    
    enterBtn.on('pointerover', () => btnBg.setScale(1.05))
    enterBtn.on('pointerout', () => btnBg.setScale(1))
    enterBtn.on('pointerdown', () => {
      this.enterArea(area)
    })
    
    // 关闭按钮
    const closeBtn = this.add.text(dialogX + dialogWidth / 2 - 30, dialogY - dialogHeight / 2 + 20, '✕', {
      font: 'bold 20px Arial',
      color: '#888888'
    }).setOrigin(0.5)
    
    closeBtn.setInteractive({ useHandCursor: true })
    closeBtn.on('pointerdown', () => {
      bg.destroy()
      dialogX // Prevent unused variable warning
      // 清理对话框所有子元素
      this.children.removeAll()
      this.create() // 重新创建场景
    })
  }

  /**
   * 进入区域
   */
  enterArea(area) {
    // 触发场景切换或回调
    this.scene.stop('WorldMapScene')
    
    // 这里可以启动关卡选择场景
    console.log('进入区域:', area)
  }

  /**
   * 获取区域图标
   */
  getAreaIcon(index) {
    const icons = ['🌲', '🏔️', '🏰', '🏝️', '👑']
    return icons[index] || '⭐'
  }

  /**
   * 颜色转换
   */
  hexToColor(hex) {
    return parseInt(hex.replace('#', '0x'))
  }
}
