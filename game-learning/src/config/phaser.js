/**
 * Phaser 游戏配置
 *
 * @deprecated 此配置文件已损坏且未被任何组件使用。
 *   AGENTS.md 中已标注为死代码。当前使用 BattleScene 和 WorldMapScene
 *   各自在 Vue 组件内独立创建 Phaser.Game 实例，不经过此文件。
 *   保留仅作参考，将在下个大版本移除。
 */
import Phaser from 'phaser';
import WorldMapScene from '../scenes/WorldMapScene';

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
  };
};

export default createGameConfig;
