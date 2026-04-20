/**
 * Phaser 游戏配置
 */
import Phaser from 'phaser'
import WorldMapScene from './scenes/WorldMapScene'

export const createGameConfig = (parent, width = 1280, height = 720) => {
  return {
    type: Phaser.AUTO,
    parent: parent,
    width: width,
    height: height,
    backgroundColor: '#1a1a2e',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
      WorldMapScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  }
}

export default createGameConfig
