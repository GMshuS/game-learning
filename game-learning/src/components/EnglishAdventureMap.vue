<template>
  <div class="english-adventure-map">
    <div class="map-header">
      <h2>🏰 英语冒险世界</h2>
      <button class="btn-back" @click="back">← 返回</button>
    </div>

    <!-- Phaser 游戏容器 -->
    <div ref="gameContainer" class="phaser-container" />

    <!-- 操作提示 -->
    <div class="map-hint">
      <p>点击已解锁的区域开始语法冒险！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import EnglishWorldMapScene from '../scenes/EnglishWorldMapScene';

const props = defineProps({
  unlockedRegions: {
    type: Array,
    default: () => ['region_1']
  },
  currentRegionId: {
    type: String,
    default: 'region_1'
  }
});

const emit = defineEmits(['regionSelect', 'back']);

const gameContainer = ref(null);
let game = null;

onMounted(() => {
  if (gameContainer.value) {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.value,
      width: 800,
      height: 600,
      backgroundColor: '#1a1a3e',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [] // 不传场景，稍后手动添加启动，避免重复初始化
    };

    game = new Phaser.Game(config);

    // 等 game 就绪后添加场景并传递参数
    game.events.on('ready', () => {
      game.scene.add('EnglishWorldMapScene', EnglishWorldMapScene, true, {
        unlockedRegions: props.unlockedRegions,
        currentRegionId: props.currentRegionId,
        onRegionSelect: (region) => {
          emit('regionSelect', region);
        }
      });
    });
  }
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});

const back = () => {
  emit('back');
};
</script>

<style scoped>
.english-adventure-map {
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

.map-hint {
  margin-top: 1rem;
  text-align: center;
  opacity: 0.8;
}

.map-hint p {
  margin: 0;
  font-size: 0.9rem;
}
</style>
