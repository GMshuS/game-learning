/**
 * 音效配置
 */
export const audioConfig = {
  // 背景音乐
  bgm: {
    main: {
      id: 'bgm_main',
      name: '主菜单音乐',
      src: 'audio/bgm/main-theme.wav',
      volume: 0.5,
      loop: true
    },
    adventure: {
      id: 'bgm_adventure',
      name: '冒险主题曲',
      src: 'audio/bgm/adventure-theme.wav',
      volume: 0.5,
      loop: true
    },
    battle: {
      id: 'bgm_battle',
      name: '战斗音乐',
      src: 'audio/bgm/battle-theme.wav',
      volume: 0.6,
      loop: true
    },
    shop: {
      id: 'bgm_shop',
      name: '商店音乐',
      src: 'audio/bgm/shop-theme.wav',
      volume: 0.5,
      loop: true
    },
    victory: {
      id: 'bgm_victory',
      name: '胜利音乐',
      src: 'audio/bgm/victory.wav',
      volume: 0.6,
      loop: false
    }
  },

  // 音效
  sfx: {
    // UI 音效
    click: {
      id: 'sfx_click',
      name: '点击',
      src: 'audio/sfx/click.wav',
      volume: 0.7
    },
    hover: {
      id: 'sfx_hover',
      name: '悬停',
      src: 'audio/sfx/hover.wav',
      volume: 0.5
    },
    open: {
      id: 'sfx_open',
      name: '打开',
      src: 'audio/sfx/open.wav',
      volume: 0.6
    },
    close: {
      id: 'sfx_close',
      name: '关闭',
      src: 'audio/sfx/close.wav',
      volume: 0.6
    },

    // 答题音效
    correct: {
      id: 'sfx_correct',
      name: '正确',
      src: 'audio/sfx/correct.wav',
      volume: 0.8
    },
    wrong: {
      id: 'sfx_wrong',
      name: '错误',
      src: 'audio/sfx/wrong.wav',
      volume: 0.7
    },
    submit: {
      id: 'sfx_submit',
      name: '提交',
      src: 'audio/sfx/submit.wav',
      volume: 0.6
    },

    // 战斗音效
    attack: {
      id: 'sfx_attack',
      name: '攻击',
      src: 'audio/sfx/attack.wav',
      volume: 0.7
    },
    hit: {
      id: 'sfx_hit',
      name: '命中',
      src: 'audio/sfx/hit.wav',
      volume: 0.7
    },
    miss: {
      id: 'sfx_miss',
      name: '未命中',
      src: 'audio/sfx/miss.wav',
      volume: 0.5
    },
    critical: {
      id: 'sfx_critical',
      name: '暴击',
      src: 'audio/sfx/critical.wav',
      volume: 0.9
    },

    // 奖励音效
    coin: {
      id: 'sfx_coin',
      name: '金币',
      src: 'audio/sfx/coin.wav',
      volume: 0.7
    },
    gainExp: {
      id: 'sfx_gain_exp',
      name: '获得经验',
      src: 'audio/sfx/gain-exp.wav',
      volume: 0.6
    },
    levelUp: {
      id: 'sfx_level_up',
      name: '升级',
      src: 'audio/sfx/level-up.wav',
      volume: 0.8
    },
    achievement: {
      id: 'sfx_achievement',
      name: '成就解锁',
      src: 'audio/sfx/achievement.wav',
      volume: 0.9
    },

    // 商店音效
    buy: {
      id: 'sfx_buy',
      name: '购买',
      src: 'audio/sfx/buy.wav',
      volume: 0.7
    },
    sell: {
      id: 'sfx_sell',
      name: '出售',
      src: 'audio/sfx/sell.wav',
      volume: 0.6
    },
    cash: {
      id: 'sfx_cash',
      name: '收银',
      src: 'audio/sfx/cash.wav',
      volume: 0.7
    }
  }
}

/**
 * 获取音效配置
 */
export function getSfxConfig(key) {
  return audioConfig.sfx[key] || null
}

/**
 * 获取背景音乐配置
 */
export function getBgmConfig(key) {
  return audioConfig.bgm[key] || null
}

export default audioConfig
