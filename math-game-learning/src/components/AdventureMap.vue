<template>
  <div class="adventure-map">
    <div class="map-header">
      <h2>🗺️ 世界地图</h2>
      <button class="btn-back" @click="back">← 返回</button>
    </div>
    
    <!-- Phaser 游戏容器 -->
    <div ref="gameContainer" class="phaser-container"></div>
    
    <!-- 区域选择提示 -->
    <div class="area-hint">
      <p>点击未锁定的区域开始冒险！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import WorldMapScene from '../scenes/WorldMapScene'

const props = defineProps({
  unlockedAreas: {
    type: Array,
    default: () => ['area_1']
  },
  currentAreaId: {
    type: String,
    default: 'area_1'
  }
})

const emit = defineEmits(['areaSelect', 'back'])

const gameContainer = ref(null)
let game = null

onMounted(() => {
  if (gameContainer.value) {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.value,
      width: 800,
      height: 600,
      backgroundColor: '#1a1a2e',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [
        createWorldMapScene(emit)
      ]
    }
    
    game = new Phaser.Game(config)
    
    // 启动世界地图场景
    game.scene.start('WorldMapScene', {
      unlockedAreas: props.unlockedAreas,
      currentAreaId: props.currentAreaId,
      onAreaSelect: (area) => {
        emit('areaSelect', area)
      }
    })
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})

const back = () => {
  emit('back')
}

// 创建世界地图场景
function createWorldMapScene(emit) {
  return class extends Phaser.Scene {
    constructor() {
      super({ key: 'WorldMapScene' })
    }
    
    init(data) {
      this.unlockedAreas = data.unlockedAreas || ['area_1']
      this.currentAreaId = data.currentAreaId || 'area_1'
      this.onAreaSelect = data.onAreaSelect
    }
    
    create() {
      const { width, height } = this.scale
      
      // 背景
      this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0)
      
      // 标题
      this.add.text(width / 2, 30, '🗺️ 世界地图', {
        font: 'bold 28px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      
      // 绘制区域节点
      const areas = [
        { id: 'area_1', x: width * 0.3, y: height * 0.3, name: '森林入口', icon: '🌲', difficulty: 1 },
        { id: 'area_2', x: width * 0.7, y: height * 0.4, name: '神秘洞穴', icon: '🕳️', difficulty: 2 },
        { id: 'area_3', x: width * 0.5, y: height * 0.6, name: '数学城堡', icon: '🏰', difficulty: 3 },
        { id: 'area_4', x: width * 0.2, y: height * 0.75, name: '魔法学院', icon: '🏛️', difficulty: 4 },
        { id: 'area_5', x: width * 0.8, y: height * 0.75, name: '龙之巢穴', icon: '🐉', difficulty: 5 }
      ]
      
      areas.forEach((area, index) => {
        const isUnlocked = this.unlockedAreas.includes(area.id)
        const isCurrent = this.currentAreaId === area.id
        
        // 绘制连接线
        if (index > 0) {
          const prevArea = areas[index - 1]
          this.add.line(prevArea.x, prevArea.y, area.x - prevArea.x, area.y - prevArea.y, 0, 0, 0x667eea, 0.5)
            .setOrigin(0)
        }
        
        // 区域节点
        const node = this.add.container(area.x, area.y)
        
        // 光晕
        if (isCurrent) {
          const halo = this.add.circle(0, 0, 50, 0x667eea, 0.3)
          node.add(halo)
        }
        
        // 节点背景
        const bg = this.add.circle(0, 0, 40, isUnlocked ? 0x667eea : 0x4a5568)
        if (!isUnlocked) {
          bg.setAlpha(0.5)
        }
        node.add(bg)
        
        // 图标
        const icon = this.add.text(0, 0, isUnlocked ? area.icon : '🔒', {
          font: 'bold 24px Arial'
        }).setOrigin(0.5)
        node.add(icon)
        
        // 名称
        const name = this.add.text(0, 55, area.name, {
          font: 'bold 14px Microsoft YaHei',
          color: isUnlocked ? '#ffffff' : '#888888'
        }).setOrigin(0.5)
        node.add(name)
        
        // 交互
        if (isUnlocked) {
          bg.setInteractive({ useHandCursor: true })
          bg.on('pointerover', () => {
            if (!isCurrent) bg.setScale(1.1)
          })
          bg.on('pointerout', () => {
            bg.setScale(1)
          })
          bg.on('pointerdown', () => {
            this.onAreaSelect?.(area)
          })
        }
      })
      
      // 图例
      const legendY = height - 60
      this.add.text(20, legendY, '🟣 已解锁', { font: '12px Microsoft YaHei', color: '#ffffff' })
      this.add.text(120, legendY, '⚪ 未解锁', { font: '12px Microsoft YaHei', color: '#888888' })
      this.add.text(220, legendY, '⭐ 当前', { font: '12px Microsoft YaHei', color: '#667eea' })
    }
  }
}
</script>

<style scoped>
.adventure-map {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  color: #fff;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
}

.map-header h2 {
  margin: 0;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.phaser-container {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.area-hint {
  margin-top: 1rem;
  text-align: center;
  opacity: 0.8;
}

.area-hint p {
  margin: 0;
  font-size: 0.9rem;
}
</style>
