/**
 * 游戏全局配置
 */
export const gameConfig = {
  // 游戏版本
  version: '1.0.0',
  
  // 游戏标题
  title: '数学王国大冒险',
  
  // 画布配置
  canvas: {
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e'
  },
  
  // 游戏模式
  modes: {
    ADVENTURE: 'adventure',
    SHOP: 'shop',
    CHALLENGE_CENTER: 'challenge_center'
  },
  
  // 难度级别
  difficulty: {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard'
  },
  
  // 游戏设置默认值
  defaultSettings: {
    sound: true,
    music: true,
    musicVolume: 0.5,
    soundVolume: 0.7
  }
}

export default gameConfig
