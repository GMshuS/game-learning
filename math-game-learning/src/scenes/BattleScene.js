/**
 * Phaser 战斗场景
 */
import Phaser from 'phaser'
import { getRandomMonster } from '../config/monsters'
import { BattleState, calculateRewards } from '../utils/battle'
import { generateQuestion } from '../utils/questionGenerator'

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' })
    
    this.player = null
    this.monster = null
    this.battleState = null
    this.currentQuestion = null
    this.streak = 0
    this.onBattleEnd = null
    this.timeLimit = null
    this.timer = null
  }

  init(data) {
    this.player = data.player || {
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      luck: 0,
      equipmentBonus: {}
    }
    
    this.monster = data.monster || getRandomMonster(data.grade || 1)
    this.streak = data.streak || 0
    this.onBattleEnd = data.onBattleEnd || null
    this.timeLimit = data.timeLimit || 60
  }

  create() {
    const { width, height } = this.scale
    
    // 初始化战斗状态
    this.battleState = new BattleState(this.player, this.monster)
    
    // 生成题目
    this.generateQuestion()
    
    // 创建背景
    this.createBackground(width, height)
    
    // 创建怪物显示
    this.createMonster(width, height)
    
    // 创建玩家显示
    this.createPlayer(width, height)
    
    // 创建题目显示
    this.createQuestion(width, height)
    
    // 创建选项
    this.createOptions(width, height)
    
    // 创建战斗日志
    this.createBattleLog(width, height)
    
    // 创建计时器
    this.createTimer(width, height)
  }

  /**
   * 创建背景
   */
  createBackground(width, height) {
    // 战斗场地背景
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e)
    bg.setOrigin(0)
    
    // 添加地面
    const ground = this.add.rectangle(0, height - 100, width, 100, 0x2d3748)
    ground.setOrigin(0)
  }

  /**
   * 创建怪物显示
   */
  createMonster(width, height) {
    const monsterX = width * 0.75
    const monsterY = height * 0.25
    
    // 怪物容器
    this.monsterContainer = this.add.container(monsterX, monsterY)
    
    // 怪物背景光环
    const halo = this.add.circle(0, 0, 80, this.hexToColor(this.monster.color), 0.3)
    this.monsterContainer.add(halo)
    
    // 怪物图标
    this.monsterIcon = this.add.text(0, 0, this.monster.icon, {
      font: 'bold 80px Arial'
    }).setOrigin(0.5)
    this.monsterContainer.add(this.monsterIcon)
    
    // 怪物名称
    this.monsterName = this.add.text(0, -100, this.monster.name, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)
    this.monsterContainer.add(this.monsterName)
    
    // 怪物血条背景
    const hpBarBg = this.add.rectangle(0, -70, 160, 20, 0x333333)
    hpBarBg.setStrokeStyle(2, 0x666666)
    this.monsterContainer.add(hpBarBg)
    
    // 怪物血条
    this.monsterHpBar = this.add.rectangle(-70, -70, 140, 14, 0xef4444)
    this.monsterHpBar.setOrigin(0, 0.5)
    this.monsterContainer.add(this.monsterHpBar)
    
    // 怪物 HP 文字
    this.monsterHpText = this.add.text(0, -70, `${this.monster.currentHp}/${this.monster.hp}`, {
      font: 'bold 12px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    this.monsterContainer.add(this.monsterHpText)
    
    // 怪物难度标识
    const difficultyStars = '⭐'.repeat(this.monster.difficulty)
    this.monsterDifficulty = this.add.text(0, -50, difficultyStars, {
      font: '14px Arial',
      color: '#fbbf24'
    }).setOrigin(0.5)
    this.monsterContainer.add(this.monsterDifficulty)
  }

  /**
   * 创建玩家显示
   */
  createPlayer(width, height) {
    const playerX = width * 0.25
    const playerY = height * 0.25
    
    // 玩家容器
    this.playerContainer = this.add.container(playerX, playerY)
    
    // 玩家头像背景
    const avatarBg = this.add.circle(0, 0, 50, 0x667eea)
    avatarBg.setStrokeStyle(3, 0xffffff)
    this.playerContainer.add(avatarBg)
    
    // 玩家头像
    this.playerAvatar = this.add.text(0, 0, '🧙', {
      font: 'bold 40px Arial'
    }).setOrigin(0.5)
    this.playerContainer.add(this.playerAvatar)
    
    // 玩家名称
    this.playerName = this.add.text(0, -70, this.player.name || '冒险者', {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)
    this.playerContainer.add(this.playerName)
    
    // 玩家血条背景
    const hpBarBg = this.add.rectangle(0, -40, 140, 20, 0x333333)
    hpBarBg.setStrokeStyle(2, 0x666666)
    this.playerContainer.add(hpBarBg)
    
    // 玩家血条
    this.playerHpBar = this.add.rectangle(-60, -40, 120, 14, 0x4ade80)
    this.playerHpBar.setOrigin(0, 0.5)
    this.playerContainer.add(this.playerHpBar)
    
    // 玩家 HP 文字
    this.playerHpText = this.add.text(0, -40, `${this.player.hp}/${this.player.maxHp}`, {
      font: 'bold 12px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    this.playerContainer.add(this.playerHpText)
    
    // 连击数
    this.streakText = this.add.text(0, -20, `连击：${this.streak}`, {
      font: 'bold 16px Microsoft YaHei',
      color: '#fbbf24'
    }).setOrigin(0.5)
    this.playerContainer.add(this.streakText)
  }

  /**
   * 创建题目显示
   */
  createQuestion(width, height) {
    const qWidth = width * 0.8
    const qX = width / 2
    const qY = height * 0.55
    
    // 题目背景
    const qBg = this.add.rectangle(qX, qY, qWidth, 100, 0x2d3748)
    qBg.setStrokeStyle(3, 0x667eea)
    
    // 题目文字
    this.questionText = this.add.text(qX, qY, this.currentQuestion?.question || '', {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff',
      wordWrap: { width: qWidth - 40, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5)
  }

  /**
   * 创建选项
   */
  createOptions(width, height) {
    const options = this.currentQuestion?.options || []
    const optionWidth = 150
    const optionHeight = 50
    const spacing = 20
    const totalWidth = options.length * optionWidth + (options.length - 1) * spacing
    const startX = (width - totalWidth) / 2
    const optionY = height * 0.75
    
    this.optionButtons = []
    
    options.forEach((option, index) => {
      const x = startX + index * (optionWidth + spacing) + optionWidth / 2
      
      // 按钮背景
      const bg = this.add.rectangle(x, optionY, optionWidth, optionHeight, 0x667eea)
      bg.setStrokeStyle(2, 0xffffff)
      bg.setInteractive({ useHandCursor: true })
      
      // 选项文字
      const text = this.add.text(x, optionY, `${option}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      
      // 选项标签（A, B, C, D）
      const labels = ['A', 'B', 'C', 'D']
      const label = this.add.text(x - optionWidth / 2 + 10, optionY - optionHeight / 2 + 10, labels[index] || `${index + 1}`, {
        font: 'bold 12px Arial',
        color: '#cccccc'
      })
      
      const buttonObj = { bg, text, option, label }
      
      // 点击事件
      bg.on('pointerdown', () => this.selectOption(buttonObj.option, bg, text))
      bg.on('pointerover', () => bg.setFillStyle(0x7c3aed))
      bg.on('pointerout', () => bg.setFillStyle(0x667eea))
      
      this.optionButtons.push(buttonObj)
    })
  }

  /**
   * 创建战斗日志
   */
  createBattleLog(width, height) {
    const logX = width * 0.25
    const logY = height * 0.85
    
    this.battleLogText = this.add.text(logX, logY, '战斗开始！选择答案攻击怪物！', {
      font: '14px Microsoft YaHei',
      color: '#cccccc'
    }).setOrigin(0.5)
  }

  /**
   * 创建计时器
   */
  createTimer(width, height) {
    const timerX = width - 80
    const timerY = 50
    
    // 计时器背景
    const timerBg = this.add.circle(timerX, timerY, 35, 0x1a1a2e)
    timerBg.setStrokeStyle(3, 0x667eea)
    
    // 计时器文字
    this.timerText = this.add.text(timerX, timerY, `${this.timeLimit}`, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // 启动计时器
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    })
  }

  /**
   * 计时器滴答
   */
  onTimerTick() {
    if (this.timeLimit > 0) {
      this.timeLimit--
      this.timerText.setText(`${this.timeLimit}`)
      
      // 时间警告
      if (this.timeLimit <= 10) {
        this.timerText.setColor('#ef4444')
      }
      
      // 时间到
      if (this.timeLimit <= 0) {
        this.endBattle('timeout')
      }
    }
  }

  /**
   * 生成题目
   */
  generateQuestion() {
    const grade = Math.ceil(this.monster.difficulty / 2)
    const q = generateQuestion(grade, 'random')
    
    const answer = Number(q.answer)
    const options = new Set([answer])
    
    let attempts = 0
    while (options.size < 4 && attempts < 100) {
      const offset = Math.floor(Math.random() * 20) - 10
      const wrong = answer + offset
      if (wrong !== answer) {
        options.add(wrong)
      }
      attempts++
    }
    
    let fallback = 1
    while (options.size < 4) {
      options.add(answer + fallback * 7)
      fallback++
    }
    
    this.currentQuestion = {
      ...q,
      answer: Number(q.answer),
      options: Array.from(options).sort(() => Math.random() - 0.5)
    }
    
    console.log('[DEBUG] generateQuestion:', {
      answer: this.currentQuestion.answer,
      options: this.currentQuestion.options,
      hasCorrect: this.currentQuestion.options.includes(this.currentQuestion.answer)
    })
  }

  /**
   * 选择选项
   */
  selectOption(selectedAnswer, button, text) {
    // 禁用所有按钮
    this.optionButtons.forEach(opt => {
      opt.bg.disableInteractive()
    })
    
    const isCorrect = Number(selectedAnswer) === Number(this.currentQuestion.answer)
    
    console.log('[DEBUG] selectOption:', {
      selected: selectedAnswer,
      correct: this.currentQuestion.answer,
      isCorrect,
      selectedType: typeof selectedAnswer,
      correctType: typeof this.currentQuestion.answer
    })
    
    // 显示答案正确性
    if (isCorrect) {
      button.setFillStyle(0x4ade80)
      this.streak++
      this.streakText.setText(`连击：${this.streak}`)
    } else {
      button.setFillStyle(0xef4444)
      this.streak = 0
      this.streakText.setText(`连击：${this.streak}`)
    }
    
    // 更新战斗状态
    this.battleState.attack(isCorrect)
    
    // 更新显示
    this.updateBattleDisplay()
    
    // 延迟后继续
    setTimeout(() => {
      if (this.battleState.battleResult === 'ongoing') {
        this.nextTurn()
      } else {
        this.endBattle(this.battleState.battleResult)
      }
    }, 1500)
  }

  /**
   * 更新战斗显示
   */
  updateBattleDisplay() {
    const state = this.battleState.getState()
    
    // 更新血条
    const monsterHpPercent = state.monster.currentHp / state.monster.hp
    const playerHpPercent = state.player.hp / state.player.maxHp
    
    this.monsterHpBar.width = 140 * monsterHpPercent
    this.monsterHpText.setText(`${state.monster.currentHp}/${state.monster.hp}`)
    
    this.playerHpBar.width = 120 * playerHpPercent
    this.playerHpText.setText(`${state.player.hp}/${state.player.maxHp}`)
    
    // 更新日志
    if (state.logs.length > 0) {
      const lastLog = state.logs[state.logs.length - 1]
      this.battleLogText.setText(lastLog.message)
    }
  }

  /**
   * 下一回合
   */
  nextTurn() {
    // 生成新题目
    this.generateQuestion()
    
    // 更新题目显示
    this.questionText.setText(this.currentQuestion.question)
    
    // 更新选项
    this.updateOptions()
    
    // 重置计时器
    this.timeLimit = 60
    this.timerText.setText(`${this.timeLimit}`)
    this.timerText.setColor('#ffffff')
  }

  /**
   * 更新选项
   */
  updateOptions() {
    const options = this.currentQuestion.options || []
    
    this.optionButtons.forEach((opt, index) => {
      if (options[index]) {
        opt.text.setText(`${options[index]}`)
        opt.option = options[index]
        opt.bg.setFillStyle(0x667eea)
        opt.bg.setInteractive({ useHandCursor: true })
      }
    })
    
    console.log('[DEBUG] updateOptions:', {
      answer: this.currentQuestion.answer,
      options: this.currentQuestion.options,
      buttonOptions: this.optionButtons.map(opt => opt.option),
      hasCorrect: this.currentQuestion.options.includes(this.currentQuestion.answer)
    })
  }

  /**
   * 结束战斗
   */
  endBattle(result) {
    // 停止计时器
    if (this.timeEvent) {
      this.timeEvent.remove()
    }
    
    // 计算奖励
    const rewards = calculateRewards(
      this.currentQuestion,
      result === 'victory',
      60 - this.timeLimit,
      this.streak
    )
    
    // 显示结果
    this.showResult(result, rewards)
  }

  /**
   * 显示结果
   */
  showResult(result, rewards) {
    const { width, height } = this.scale
    
    // 结果背景
    const dialog = this.add.rectangle(width / 2, height / 2, 400, 250, 0x1a1a2e)
    dialog.setStrokeStyle(4, result === 'victory' ? 0x4ade80 : 0xef4444)
    
    // 结果图标
    const icon = result === 'victory' ? '🎉' : '💀'
    const resultText = result === 'victory' ? '胜利！' : result === 'defeat' ? '失败' : '时间到'
    
    this.add.text(width / 2, height / 2 - 70, `${icon} ${resultText}`, {
      font: 'bold 36px Microsoft YaHei',
      color: result === 'victory' ? '#4ade80' : '#ef4444'
    }).setOrigin(0.5)
    
    // 奖励显示
    if (result === 'victory') {
      this.add.text(width / 2, height / 2 - 20, `获得经验：+${rewards.exp}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#a78bfa'
      }).setOrigin(0.5)
      
      this.add.text(width / 2, height / 2 + 15, `获得金币：+${rewards.coins}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#fbbf24'
      }).setOrigin(0.5)
    }
    
    // 继续按钮
    const btnBg = this.add.rectangle(width / 2, height / 2 + 80, 160, 50, result === 'victory' ? 0x4ade80 : 0x666666)
    btnBg.setStrokeStyle(2, 0xffffff)
    
    const btnText = this.add.text(width / 2, height / 2 + 80, '继续', {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    btnBg.setInteractive({ useHandCursor: true })
    btnBg.on('pointerover', () => btnBg.setScale(1.05))
    btnBg.on('pointerout', () => btnBg.setScale(1))
    btnBg.on('pointerdown', () => {
      if (this.onBattleEnd) {
        this.onBattleEnd({
          result,
          rewards,
          streak: this.streak
        })
      }
      this.scene.stop('BattleScene')
    })
  }

  /**
   * 颜色转换
   */
  hexToColor(hex) {
    return parseInt(hex.replace('#', '0x'))
  }
}
