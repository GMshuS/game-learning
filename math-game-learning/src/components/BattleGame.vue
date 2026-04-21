<template>
  <div class="battle-game">
    <!-- 冒险模式玩法说明 -->
    <GameTutorial
      v-if="showTutorial"
      title="⚔️ 冒险模式玩法说明"
      :steps="adventureTutorialSteps"
      @close="closeTutorial"
    />
    
    <!-- 返回按钮 -->
    <button class="btn-back" @click="back">← 返回</button>
    
    <!-- 玩法说明按钮 -->
    <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
    
    <!-- Phaser 游戏容器 -->
    <div ref="gameContainer" class="phaser-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import BattleScene from '../scenes/BattleScene'
import { getRandomMonster } from '../config/monsters'
import GameTutorial from './GameTutorial.vue'

const showTutorial = ref(false)

const adventureTutorialSteps = [
  {
    title: '选择关卡',
    description: '在世界地图上选择已解锁的区域进入关卡，每个区域有不同的难度等级。'
  },
  {
    title: '回答数学问题',
    description: '屏幕会显示数学题目和 4 个选项，点击正确答案对怪物造成伤害。'
  },
  {
    title: '战斗机制',
    description: '答对题目对怪物造成 10 点伤害，答错自己受到 5 点伤害。在 60 秒内答对题目可以获得额外连击奖励！'
  },
  {
    title: '连击奖励',
    description: '连续答对题目可以增加连击数，连击数越高，获胜后获得的经验和金币奖励越多！'
  },
  {
    title: '取得胜利',
    description: '将怪物的血量归零即可获胜，获得经验和金币奖励。如果自己的血量归零或时间用完则挑战失败。'
  }
]

const closeTutorial = () => {
  showTutorial.value = false
}

const props = defineProps({
  player: {
    type: Object,
    default: () => ({
      name: '冒险者',
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      luck: 0,
      equipmentBonus: {}
    })
  },
  monster: {
    type: Object,
    default: null
  },
  grade: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['battleEnd', 'back'])

const gameContainer = ref(null)
let game = null

onMounted(() => {
  if (gameContainer.value) {
    const monster = props.monster || getRandomMonster(props.grade)
    
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
        createBattleScene(emit, props.player, monster, props.streak)
      ]
    }
    
    game = new Phaser.Game(config)
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

// 创建战斗场景
function createBattleScene(emit, player, monster, streak) {
  return class extends Phaser.Scene {
    constructor() {
      super({ key: 'BattleScene' })
    }
    
    init() {
      this.player = player
      this.monster = monster
      this.streak = streak
      this.timeLimit = 60
    }
    
    create() {
      const { width, height } = this.scale
      
      // 背景
      this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0)
      this.add.rectangle(0, height - 100, width, 100, 0x2d3748).setOrigin(0)
      
      // 怪物显示（右侧）
      const monsterX = width * 0.75
      const monsterY = height * 0.25
      
      this.monsterContainer = this.add.container(monsterX, monsterY)
      
      const halo = this.add.circle(0, 0, 80, this.hexToColor(this.monster.color), 0.3)
      this.monsterContainer.add(halo)
      
      const monsterIcon = this.add.text(0, 0, this.monster.icon, {
        font: 'bold 80px Arial'
      }).setOrigin(0.5)
      this.monsterContainer.add(monsterIcon)
      
      const monsterName = this.add.text(0, -100, this.monster.name, {
        font: 'bold 24px Microsoft YaHei',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5)
      this.monsterContainer.add(monsterName)
      
      // 怪物血条
      const monsterHpBarBg = this.add.rectangle(0, -70, 160, 20, 0x333333)
      monsterHpBarBg.setStrokeStyle(2, 0x666666)
      this.monsterContainer.add(monsterHpBarBg)
      
      this.monsterHp = this.monster.hp
      this.monsterMaxHp = this.monster.hp
      this.monsterHpBar = this.add.rectangle(-70, -70, 140, 14, 0xef4444)
      this.monsterHpBar.setOrigin(0, 0.5)
      this.monsterContainer.add(this.monsterHpBar)
      
      const monsterHpText = this.add.text(0, -70, `${this.monsterHp}/${this.monsterMaxHp}`, {
        font: 'bold 12px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      this.monsterContainer.add(monsterHpText)
      
      // 玩家显示（左侧）
      const playerX = width * 0.25
      const playerY = height * 0.25
      
      this.playerContainer = this.add.container(playerX, playerY)
      
      const playerAvatarBg = this.add.circle(0, 0, 50, 0x667eea)
      playerAvatarBg.setStrokeStyle(3, 0xffffff)
      this.playerContainer.add(playerAvatarBg)
      
      const playerAvatar = this.add.text(0, 0, '🧙', {
        font: 'bold 40px Arial'
      }).setOrigin(0.5)
      this.playerContainer.add(playerAvatar)
      
      const playerName = this.add.text(0, -70, this.player.name || '冒险者', {
        font: 'bold 20px Microsoft YaHei',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5)
      this.playerContainer.add(playerName)
      
      // 玩家血条
      const playerHpBarBg = this.add.rectangle(0, -40, 140, 20, 0x333333)
      playerHpBarBg.setStrokeStyle(2, 0x666666)
      this.playerContainer.add(playerHpBarBg)
      
      this.playerHp = this.player.hp
      this.playerMaxHp = this.player.maxHp
      this.playerHpBar = this.add.rectangle(-60, -40, 120, 14, 0x4ade80)
      this.playerHpBar.setOrigin(0, 0.5)
      this.playerContainer.add(this.playerHpBar)
      
      const playerHpText = this.add.text(0, -40, `${this.playerHp}/${this.playerMaxHp}`, {
        font: 'bold 12px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      this.playerContainer.add(playerHpText)
      
      // 连击
      this.streakCount = this.streak
      this.streakText = this.add.text(0, -20, `连击：${this.streakCount}`, {
        font: 'bold 16px Microsoft YaHei',
        color: '#fbbf24'
      }).setOrigin(0.5)
      this.playerContainer.add(this.streakText)
      
      // 计时器
      this.add.circle(width - 80, 50, 35, 0x1a1a2e).setStrokeStyle(3, 0x667eea)
      this.timerText = this.add.text(width - 80, 50, `${this.timeLimit}`, {
        font: 'bold 24px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.timeLimit > 0) {
            this.timeLimit--
            this.timerText.setText(`${this.timeLimit}`)
            if (this.timeLimit <= 10) {
              this.timerText.setColor('#ef4444')
            }
            if (this.timeLimit <= 0) {
              this.endBattle('timeout')
            }
          }
        },
        loop: true
      })
      
      // 生成题目
      this.generateQuestion()
      
      // 题目显示
      const qWidth = width * 0.8
      const qX = width / 2
      const qY = height * 0.55
      
      const qBg = this.add.rectangle(qX - qWidth / 2, qY - 40, qWidth, 80, 0x2d3748)
      qBg.setStrokeStyle(3, 0x667eea)
      
      this.questionText = this.add.text(qX, qY, this.currentQuestion?.question || '', {
        font: 'bold 28px Microsoft YaHei',
        color: '#ffffff',
        wordWrap: { width: qWidth - 40 }
      }).setOrigin(0.5)
      
      // 选项
      this.createOptions(width, height)
      
      // 战斗日志
      this.battleLogText = this.add.text(width / 2, height * 0.85, '战斗开始！选择答案攻击怪物！', {
        font: '14px Microsoft YaHei',
        color: '#cccccc'
      }).setOrigin(0.5)
    }
    
    generateQuestion() {
      const grade = Math.ceil(this.monster.difficulty / 2)
      const operations = ['add', 'subtract']
      if (grade >= 3) operations.push('multiply', 'divide')
      const type = operations[Math.floor(Math.random() * operations.length)]
      
      const a = Math.floor(Math.random() * 20) + 1
      const b = Math.floor(Math.random() * 20) + 1
      
      let question, answer, options
      
      if (type === 'add') {
        question = `${a} + ${b} = ?`
        answer = a + b
      } else if (type === 'subtract') {
        const max = Math.max(a, b)
        const min = Math.min(a, b)
        question = `${max} - ${min} = ?`
        answer = max - min
      } else if (type === 'multiply') {
        const ma = Math.floor(Math.random() * 10) + 1
        const mb = Math.floor(Math.random() * 10) + 1
        question = `${ma} × ${mb} = ?`
        answer = ma * mb
      } else {
        const mb = Math.floor(Math.random() * 9) + 2
        const answer_div = Math.floor(Math.random() * 9) + 2
        const ma = mb * answer_div
        question = `${ma} ÷ ${mb} = ?`
        answer = answer_div
      }
      
      // 生成选项
      options = [answer]
      while (options.length < 4) {
        const wrong = answer + Math.floor(Math.random() * 10) - 5
        if (wrong !== answer && !options.includes(wrong) && wrong >= 0) {
          options.push(wrong)
        }
      }
      options = options.sort(() => Math.random() - 0.5)
      
      this.currentQuestion = { question, answer, options }
    }
    
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
        const x = startX + index * (optionWidth + spacing)
        
        const bg = this.add.rectangle(x, optionY, optionWidth, optionHeight, 0x667eea)
        bg.setStrokeStyle(2, 0xffffff)
        bg.setInteractive({ useHandCursor: true })
        
        const text = this.add.text(x + optionWidth / 2, optionY + optionHeight / 2, `${option}`, {
          font: 'bold 20px Microsoft YaHei',
          color: '#ffffff'
        }).setOrigin(0.5)
        
        const labels = ['A', 'B', 'C', 'D']
        const label = this.add.text(x + 10, optionY + 10, labels[index] || `${index + 1}`, {
          font: 'bold 12px Arial',
          color: '#cccccc'
        })
        
        bg.on('pointerdown', () => this.selectOption(option, bg, text))
        bg.on('pointerover', () => bg.setFillStyle(0x7c3aed))
        bg.on('pointerout', () => bg.setFillStyle(0x667eea))
        
        this.optionButtons.push({ bg, text, option, label })
      })
    }
    
    selectOption(selectedAnswer, button, text) {
      this.optionButtons.forEach(opt => opt.bg.disableInteractive())
      
      const isCorrect = selectedAnswer === this.currentQuestion.answer
      
      if (isCorrect) {
        button.setFillStyle(0x4ade80)
        this.streakCount++
        this.streakText.setText(`连击：${this.streakCount}`)
        this.monsterHp -= 10
        if (this.monsterHp < 0) this.monsterHp = 0
        this.battleLogText.setText(`回答正确！对${this.monster.name}造成 10 点伤害！`)
      } else {
        button.setFillStyle(0xef4444)
        this.streakCount = 0
        this.streakText.setText(`连击：${this.streakCount}`)
        this.playerHp -= 5
        if (this.playerHp < 0) this.playerHp = 0
        this.battleLogText.setText(`回答错误！受到 5 点伤害！`)
      }
      
      // 更新血条
      this.monsterHpBar.width = 140 * (this.monsterHp / this.monsterMaxHp)
      this.playerHpBar.width = 120 * (this.playerHp / this.playerMaxHp)
      
      setTimeout(() => {
        if (this.monsterHp <= 0) {
          this.endBattle('victory')
        } else if (this.playerHp <= 0) {
          this.endBattle('defeat')
        } else {
          this.nextTurn()
        }
      }, 1500)
    }
    
    nextTurn() {
      this.generateQuestion()
      this.questionText.setText(this.currentQuestion.question)
      
      this.optionButtons.forEach((opt, index) => {
        if (this.currentQuestion.options[index]) {
          opt.text.setText(`${this.currentQuestion.options[index]}`)
          opt.option = this.currentQuestion.options[index]
          opt.bg.setFillStyle(0x667eea)
          opt.bg.setInteractive({ useHandCursor: true })
        }
      })
      
      this.timeLimit = 60
      this.timerText.setText(`${this.timeLimit}`)
      this.timerText.setColor('#ffffff')
    }
    
    endBattle(result) {
      if (this.timeEvent) this.timeEvent.remove()
      
      const { width, height } = this.scale
      
      const rewards = result === 'victory' 
        ? { exp: 20 + this.streakCount * 2, coins: 10 + this.streakCount }
        : { exp: 5, coins: 2 }
      
      const dialog = this.add.rectangle(width / 2, height / 2, 400, 250, 0x1a1a2e)
      dialog.setStrokeStyle(4, result === 'victory' ? 0x4ade80 : 0xef4444)
      
      const icon = result === 'victory' ? '🎉' : '💀'
      const resultText = result === 'victory' ? '胜利！' : result === 'defeat' ? '失败' : '时间到'
      
      this.add.text(width / 2, height / 2 - 70, `${icon} ${resultText}`, {
        font: 'bold 36px Microsoft YaHei',
        color: result === 'victory' ? '#4ade80' : '#ef4444'
      }).setOrigin(0.5)
      
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
      
      const continueBtn = this.add.container(width / 2, height / 2 + 80)
      const btnBg = this.add.rectangle(-80, -25, 160, 50, result === 'victory' ? 0x4ade80 : 0x666666)
      btnBg.setStrokeStyle(2, 0xffffff)
      continueBtn.add(btnBg)
      
      const btnText = this.add.text(0, 0, '继续', {
        font: 'bold 20px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5)
      continueBtn.add(btnText)
      
      continueBtn.setInteractive({ useHandCursor: true })
      continueBtn.on('pointerdown', () => {
        emit('battleEnd', { result, rewards, streak: this.streakCount })
        this.scene.stop('BattleScene')
      })
    }
    
    hexToColor(hex) {
      return parseInt(hex.replace('#', '0x'))
    }
  }
}
</script>

<style scoped>
.battle-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.phaser-container {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.btn-back {
  margin-top: 1rem;
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

.btn-help {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-help:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>
