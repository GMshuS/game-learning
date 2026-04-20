/**
 * 战斗系统工具函数
 */
import { getDifficultyConfig } from '../config/questionTypes'

/**
 * 计算战斗伤害
 */
export function calculateDamage(baseAttack, equipmentBonus, isCritical = false) {
  let damage = baseAttack + (equipmentBonus?.attack || 0)
  
  if (isCritical) {
    damage = Math.floor(damage * 1.5)
  }
  
  return Math.max(1, damage)
}

/**
 * 计算受到的伤害（考虑防御）
 */
export function calculateReceivedDamage(enemyAttack, defense) {
  const damageReduction = Math.min(0.8, defense * 0.02) // 每点防御减少 2% 伤害，最多 80%
  const damage = Math.floor(enemyAttack * (1 - damageReduction))
  return Math.max(1, damage)
}

/**
 * 检查是否暴击
 */
export function checkCriticalHit(luck = 0) {
  const baseCritRate = 0.05 // 5% 基础暴击率
  const critRate = baseCritRate + (luck * 0.01) // 每点幸运增加 1% 暴击率
  return Math.random() < critRate
}

/**
 * 计算答题奖励
 */
export function calculateRewards(question, isCorrect, timeUsed, streak) {
  const difficulty = getDifficultyConfig(question.difficulty)
  
  if (!isCorrect) {
    return { exp: 0, coins: 0 }
  }
  
  let exp = 10 * difficulty.expMultiplier
  let coins = 5 * difficulty.coinMultiplier
  
  // 连击奖励
  if (streak >= 3) {
    exp *= 1.2
    coins *= 1.2
  }
  if (streak >= 5) {
    exp *= 1.3
    coins *= 1.3
  }
  if (streak >= 10) {
    exp *= 1.5
    coins *= 1.5
  }
  
  // 时间奖励（如果有时间限制）
  if (timeUsed && difficulty.timeLimit) {
    const timeBonus = Math.max(0, (difficulty.timeLimit - timeUsed) / difficulty.timeLimit)
    exp *= (1 + timeBonus * 0.3)
    coins *= (1 + timeBonus * 0.3)
  }
  
  return {
    exp: Math.floor(exp),
    coins: Math.floor(coins)
  }
}

/**
 * 战斗结果判定
 */
export function determineBattleResult(playerHp, monsterHp) {
  if (monsterHp <= 0) {
    return 'victory'
  }
  if (playerHp <= 0) {
    return 'defeat'
  }
  return 'ongoing'
}

/**
 * 生成战斗日志
 */
export function generateBattleLog(player, monster, playerDamage, monsterDamage, isCritical) {
  const logs = []
  
  if (playerDamage > 0) {
    logs.push({
      type: 'player_attack',
      message: `你对${monster.name}造成了${playerDamage}点伤害${isCritical ? '（暴击！）' : ''}`
    })
  }
  
  if (monsterDamage > 0) {
    logs.push({
      type: 'monster_attack',
      message: `${monster.name}对你造成了${monsterDamage}点伤害`
    })
  }
  
  return logs
}

/**
 * 战斗状态机
 */
export class BattleState {
  constructor(player, monster) {
    this.player = {
      hp: player.hp || 100,
      maxHp: player.maxHp || 100,
      attack: player.attack || 10,
      defense: player.defense || 5,
      luck: player.luck || 0,
      equipmentBonus: player.equipmentBonus || {}
    }
    
    this.monster = {
      ...monster,
      currentHp: monster.hp
    }
    
    this.turn = 1
    this.isPlayerTurn = true
    this.battleResult = 'ongoing'
    this.logs = []
    this.currentQuestion = null
  }
  
  /**
   * 玩家攻击
   */
  attack(isCorrect) {
    if (!this.isPlayerTurn || this.battleResult !== 'ongoing') {
      return null
    }
    
    if (isCorrect) {
      const isCritical = checkCriticalHit(this.player.luck)
      const damage = calculateDamage(
        this.player.attack,
        this.player.equipmentBonus,
        isCritical
      )
      
      this.monster.currentHp -= damage
      
      this.logs = generateBattleLog(
        this.player,
        this.monster,
        damage,
        0,
        isCritical
      )
      
      this.battleResult = determineBattleResult(this.player.hp, this.monster.currentHp)
    } else {
      // 答错，怪物反击
      return this.monsterAttack()
    }
    
    this.turn++
    this.isPlayerTurn = false
    
    // 如果战斗未结束，怪物回合
    if (this.battleResult === 'ongoing') {
      setTimeout(() => this.monsterAttack(), 1000)
    }
    
    return this.getState()
  }
  
  /**
   * 怪物攻击
   */
  monsterAttack() {
    const damage = calculateReceivedDamage(
      this.monster.attack,
      this.player.defense
    )
    
    this.player.hp -= damage
    
    this.logs = generateBattleLog(
      this.player,
      this.monster,
      0,
      damage,
      false
    )
    
    this.battleResult = determineBattleResult(this.player.hp, this.monster.currentHp)
    this.isPlayerTurn = true
    this.turn++
    
    return this.getState()
  }
  
  /**
   * 获取战斗状态
   */
  getState() {
    return {
      player: { ...this.player },
      monster: { ...this.monster },
      turn: this.turn,
      isPlayerTurn: this.isPlayerTurn,
      battleResult: this.battleResult,
      logs: [...this.logs]
    }
  }
}

export default {
  calculateDamage,
  calculateReceivedDamage,
  checkCriticalHit,
  calculateRewards,
  determineBattleResult,
  generateBattleLog,
  BattleState
}
