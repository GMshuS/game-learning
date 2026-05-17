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
      scene: [WorldMapScene]
    }
    
    game = new Phaser.Game(config)
    
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
