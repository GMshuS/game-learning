/**
 * 战斗系统工具函数
 */
import { getDifficultyConfig } from '../config/questionTypes';

// 战斗平衡参数
const CRIT_DAMAGE_MULTIPLIER = 1.5;       // 暴击伤害倍率
const MAX_DAMAGE_REDUCTION = 0.8;         // 最大减伤比例（80%）
const DEFENSE_REDUCTION_PER_POINT = 0.02; // 每点防御减少 2% 伤害
const BASE_CRIT_RATE = 0.05;              // 基础暴击率 5%
const LUCK_CRIT_BONUS_PER_POINT = 0.01;   // 每点幸运增加 1% 暴击率

/**
 * 应用道具效果
 * 根据 effect.type 分派到 buff/heal/special 三大分支
 * @param {object} item - 道具对象，含 effect 字段
 * @param {object} battleState - BattleState 实例
 * @returns {object} { success, effectType, target, value, message, consumed, remainingQuantity }
 */
export function applyItemEffect(item, battleState) {
  const effect = item.effect;
  if (!effect) {
    return {
      success: false,
      effectType: null,
      target: null,
      value: 0,
      message: '道具效果未定义',
      consumed: false,
      remainingQuantity: item.quantity - 1
    };
  }

  const result = {
    success: true,
    effectType: effect.type,
    target: effect.target,
    value: effect.value,
    message: '',
    consumed: false,
    remainingQuantity: item.quantity - 1
  };

  switch (effect.type) {
    case 'buff': {
      // buff：修改 battleState 中对应属性，持续整场战斗
      const target = effect.target;
      if (target === 'attack') {
        battleState.player.attack += effect.value;
        result.message = `攻击力+${effect.value}`;
      } else if (target === 'defense') {
        battleState.player.defense += effect.value;
        result.message = `防御力+${effect.value}`;
      } else if (target === 'exp') {
        battleState.player.expMultiplier = (battleState.player.expMultiplier || 1) * effect.value;
        result.message = `经验获取×${effect.value}`;
      } else if (target === 'crit') {
        battleState.player.critBonus = (battleState.player.critBonus || 0) + effect.value;
        result.message = `暴击率+${Math.round(effect.value * 100)}%`;
      } else if (target === 'time') {
        battleState.player.timeBonus = (battleState.player.timeBonus || 0) + effect.value;
        result.message = `答题时间+${effect.value}秒`;
      } else if (target === 'luck') {
        battleState.player.luck += effect.value;
        result.message = `幸运+${effect.value}`;
      } else if (target === 'gold') {
        battleState.player.goldMultiplier = (battleState.player.goldMultiplier || 1) * effect.value;
        result.message = `金币获取×${effect.value}`;
      } else {
        result.success = false;
        result.message = `未知的 buff 目标: ${target}`;
      }

      // 添加到 activeEffects 追踪
      if (result.success) {
        battleState.activeEffects.push({
          itemId: item.id,
          productId: item.productId,
          target: target,
          value: effect.value,
          duration: effect.duration,
          source: item.name
        });
        result.consumed = false; // buff 持续整场，使用时不消耗
      }
      break;
    }

    case 'heal': {
      // heal：增加 player.hp（不超过 maxHp），一次性效果
      const target = effect.target;
      if (target === 'hp' || target === 'all') {
        const oldHp = battleState.player.hp;
        battleState.player.hp = Math.min(battleState.player.maxHp, battleState.player.hp + effect.value);
        const actualHeal = battleState.player.hp - oldHp;
        result.message = `恢复${actualHeal}点生命值`;
        result.consumed = true;
      } else {
        result.success = false;
        result.message = `未知的治疗目标: ${target}`;
      }
      break;
    }

    case 'special': {
      const target = effect.target;
      if (target === 'retry') {
        // 橡皮：重新生成题目，标记 retryUsed
        if (battleState.retryUsed) {
          result.success = false;
          result.message = '本场战斗已使用过橡皮';
        } else {
          battleState.retryUsed = true;
          result.message = '重新生成一道新题目';
          result.consumed = true;
        }
      } else if (target === 'skip_monster') {
        // 皮球：怪物跳过下回合
        battleState.activeEffects.push({
          itemId: item.id,
          productId: item.productId,
          target: 'skip_monster',
          value: effect.value,
          duration: 'one_time',
          source: item.name
        });
        result.message = '怪物下回合将跳过攻击';
        result.consumed = true;
      } else if (target === 'taunt') {
        // 玩偶：怪物下回合攻击不扣血
        battleState.activeEffects.push({
          itemId: item.id,
          productId: item.productId,
          target: 'taunt',
          value: effect.value,
          duration: 'one_time',
          source: item.name
        });
        result.message = '怪物下回合攻击不扣血';
        result.consumed = true;
      } else if (target === 'damage_multiplier') {
        // 冰淇淋：下题答对伤害×2
        battleState.activeEffects.push({
          itemId: item.id,
          productId: item.productId,
          target: 'damage_multiplier',
          value: effect.value,
          duration: 'one_time',
          source: item.name
        });
        result.message = `下题答对伤害×${effect.value}`;
        result.consumed = true;
      } else if (target === 'collectible') {
        // 收藏品无战斗效果
        result.message = '收藏品无战斗效果';
        result.consumed = false;
      } else {
        result.success = false;
        result.message = `未知的特殊效果目标: ${target}`;
      }
      break;
    }

    default: {
      result.success = false;
      result.message = `未知的效果类型: ${effect.type}`;
      break;
    }
  }

  return result;
}

/**
 * 检查是否有某个 activeEffect 处于激活状态
 */
export function hasActiveEffect(battleState, target) {
  return battleState.activeEffects.some(effect => effect.target === target);
}

/**
 * 消耗 activeEffects 中指定目标的效果（one_time 类）
 */
export function consumeActiveEffect(battleState, target) {
  const index = battleState.activeEffects.findIndex(e => e.target === target);
  if (index !== -1) {
    battleState.activeEffects.splice(index, 1);
  }
}

/**
 * 计算战斗伤害
 */
export function calculateDamage(baseAttack, equipmentBonus, isCritical = false) {
  let damage = baseAttack + (equipmentBonus?.attack || 0);
  
  if (isCritical) {
    damage = Math.floor(damage * CRIT_DAMAGE_MULTIPLIER);
  }
  
  return Math.max(1, damage);
}

/**
 * 计算受到的伤害（考虑防御）
 */
export function calculateReceivedDamage(enemyAttack, defense) {
  const damageReduction = Math.min(MAX_DAMAGE_REDUCTION, defense * DEFENSE_REDUCTION_PER_POINT);
  const damage = Math.floor(enemyAttack * (1 - damageReduction));
  return Math.max(1, damage);
}

/**
 * 检查是否暴击
 */
export function checkCriticalHit(luck = 0) {
  const baseCritRate = BASE_CRIT_RATE;
  const critRate = baseCritRate + (luck * LUCK_CRIT_BONUS_PER_POINT);
  return Math.random() < critRate;
}

/**
 * 计算答题奖励
 */
export function calculateRewards(question, isCorrect, timeUsed, streak) {
  const difficulty = getDifficultyConfig(question.difficulty);
  
  if (!isCorrect) {
    return { exp: 0, coins: 0 };
  }
  
  let exp = 10 * difficulty.expMultiplier;
  let coins = 5 * difficulty.coinMultiplier;
  
  // 连击奖励
  if (streak >= 3) {
    exp *= 1.2;
    coins *= 1.2;
  }
  if (streak >= 5) {
    exp *= 1.3;
    coins *= 1.3;
  }
  if (streak >= 10) {
    exp *= 1.5;
    coins *= 1.5;
  }
  
  // 时间奖励（如果有时间限制）
  if (timeUsed && difficulty.timeLimit) {
    const timeBonus = Math.max(0, (difficulty.timeLimit - timeUsed) / difficulty.timeLimit);
    exp *= (1 + timeBonus * 0.3);
    coins *= (1 + timeBonus * 0.3);
  }
  
  return {
    exp: Math.floor(exp),
    coins: Math.floor(coins)
  };
}

/**
 * 战斗结果判定
 */
export function determineBattleResult(playerHp, monsterHp) {
  if (monsterHp <= 0) {
    return 'victory';
  }
  if (playerHp <= 0) {
    return 'defeat';
  }
  return 'ongoing';
}

/**
 * 生成战斗日志
 */
export function generateBattleLog(player, monster, playerDamage, monsterDamage, isCritical) {
  const logs = [];
  
  if (playerDamage > 0) {
    logs.push({
      type: 'player_attack',
      message: `你对${monster.name}造成了${playerDamage}点伤害${isCritical ? '（暴击！）' : ''}`
    });
  }
  
  if (monsterDamage > 0) {
    logs.push({
      type: 'monster_attack',
      message: `${monster.name}对你造成了${monsterDamage}点伤害`
    });
  }
  
  return logs;
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
    };
    
    this.monster = {
      ...monster,
      attack: monster.attack || 5,
      defense: monster.defense || 1,
      currentHp: monster.hp || 50
    };
    
    this.turn = 1;
    this.isPlayerTurn = true;
    this.battleResult = 'ongoing';
    this.logs = [];
    this.currentQuestion = null;
    this.activeEffects = [];       // 追踪当前生效的 buff/special 效果
    this.retryUsed = false;       // 橡皮是否已在本场战斗中使用
  }
  
  /**
   * 玩家攻击
   * 考虑 activeEffects 中的 buff 加成（damage_multiplier 等）
   */
  attack(isCorrect) {
    if (!this.isPlayerTurn || this.battleResult !== 'ongoing') {
      return null;
    }
    
    if (isCorrect) {
      // 检查是否有 critBonus 加成（来自 buff 效果）
      const critBonus = this.player.critBonus || 0;
      const effectiveLuck = this.player.luck + critBonus / LUCK_CRIT_BONUS_PER_POINT;
      const isCritical = checkCriticalHit(effectiveLuck);
      
      let damage = calculateDamage(
        this.player.attack,
        this.player.equipmentBonus,
        isCritical
      );
      
      // 检查是否有 damage_multiplier 效果（冰淇淋）
      const dmgMultiplierEffect = this.activeEffects.find(e => e.target === 'damage_multiplier');
      if (dmgMultiplierEffect) {
        damage = Math.floor(damage * dmgMultiplierEffect.value);
        // 消耗该效果
        const idx = this.activeEffects.indexOf(dmgMultiplierEffect);
        if (idx !== -1) this.activeEffects.splice(idx, 1);
      }
      
      this.monster.currentHp -= damage;
      
      this.logs = generateBattleLog(
        this.player,
        this.monster,
        damage,
        0,
        isCritical
      );
      
      this.battleResult = determineBattleResult(this.player.hp, this.monster.currentHp);
      
      // 答对路径：在此处递增 turn 并保持 isPlayerTurn=true（玩家可连续答题攻击）
      this.turn++;
      this.isPlayerTurn = true;
    } else {
      // 答错路径：委托给 monsterAttack() 管理 turn 递增和 isPlayerTurn 设置
      // monsterAttack() 内部已在每个分支（skip/taunt/正常）中执行 turn++ 和 isPlayerTurn=true
      const result = this.monsterAttack();
      return result;
    }
    
    return this.getState();
  }
  
  /**
   * 怪物攻击
   * 考虑 activeEffects 中的 taunt（不扣血）/ skip_monster（跳过攻击）/ defense 加成
   */
  monsterAttack() {
    // 检查是否有 skip_monster 效果（皮球）
    const skipEffect = this.activeEffects.find(e => e.target === 'skip_monster');
    if (skipEffect) {
      const idx = this.activeEffects.indexOf(skipEffect);
      if (idx !== -1) this.activeEffects.splice(idx, 1);
      this.logs = [{
        type: 'monster_skipped',
        message: '怪物本回合跳过攻击'
      }];
      this.isPlayerTurn = true;
      this.turn++;
      return this.getState();
    }

    // 检查是否有 taunt 效果（玩偶）
    const tauntEffect = this.activeEffects.find(e => e.target === 'taunt');
    if (tauntEffect) {
      const idx = this.activeEffects.indexOf(tauntEffect);
      if (idx !== -1) this.activeEffects.splice(idx, 1);
      this.logs = [{
        type: 'taunt',
        message: '玩偶挡住了怪物的攻击！'
      }];
      this.isPlayerTurn = true;
      this.turn++;
      return this.getState();
    }

    // 检查是否有防御 buff（从 activeEffects 中累计）
    let defenseBonus = 0;
    for (const effect of this.activeEffects) {
      if (effect.target === 'defense') {
        defenseBonus += effect.value;
      }
    }
    
    const effectiveDefense = this.player.defense + defenseBonus;
    const damage = calculateReceivedDamage(
      this.monster.attack,
      effectiveDefense
    );
    
    this.player.hp -= damage;
    
    this.logs = generateBattleLog(
      this.player,
      this.monster,
      0,
      damage,
      false
    );
    
    this.battleResult = determineBattleResult(this.player.hp, this.monster.currentHp);
    this.isPlayerTurn = true;
    this.turn++;
    
    return this.getState();
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
      logs: [...this.logs],
      activeEffects: [...this.activeEffects],
      retryUsed: this.retryUsed
    };
  }
}

export default {
  calculateDamage,
  calculateReceivedDamage,
  checkCriticalHit,
  calculateRewards,
  determineBattleResult,
  generateBattleLog,
  BattleState,
  applyItemEffect,
  hasActiveEffect,
  consumeActiveEffect
};
