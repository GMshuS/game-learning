/**
 * 战斗系统单元测试
 */
import { describe, it, expect } from 'vitest';
import {
  BattleState,
  calculateDamage,
  calculateReceivedDamage,
  determineBattleResult,
  calculateRewards,
  applyItemEffect,
  hasActiveEffect,
  consumeActiveEffect
} from './battle';

describe('calculateDamage', () => {
  it('应计算基础伤害', () => {
    expect(calculateDamage(10)).toBe(10);
  });

  it('应包含装备加成', () => {
    expect(calculateDamage(10, { attack: 5 })).toBe(15);
  });

  it('暴击时应乘以 1.5', () => {
    expect(calculateDamage(10, null, true)).toBe(15);
  });

  it('暴击时装备加成也参与计算', () => {
    expect(calculateDamage(10, { attack: 5 }, true)).toBe(22); // floor(15 * 1.5)
  });

  it('最小伤害为 1', () => {
    expect(calculateDamage(0)).toBe(1);
  });

  it('无装备时应正确处理', () => {
    expect(calculateDamage(5)).toBe(5);
  });
});

describe('calculateReceivedDamage', () => {
  it('无防御时受到全额伤害', () => {
    expect(calculateReceivedDamage(50, 0)).toBe(50);
  });

  it('高防御应减少伤害', () => {
    const damage = calculateReceivedDamage(100, 10);
    expect(damage).toBeLessThan(100);
  });

  it('防御有上限（80%减伤）', () => {
    const damage = calculateReceivedDamage(100, 50);
    // 最高减伤80%，至少保留20%伤害，Math.floor 可能导致略低于精确值
    expect(damage).toBeGreaterThanOrEqual(19);
    expect(damage).toBeLessThanOrEqual(20);
  });

  it('最小伤害为 1', () => {
    expect(calculateReceivedDamage(1, 100)).toBe(1);
  });
});

describe('determineBattleResult', () => {
  it('怪物 HP <= 0 时返回 victory', () => {
    expect(determineBattleResult(100, 0)).toBe('victory');
    expect(determineBattleResult(100, -5)).toBe('victory');
  });

  it('玩家 HP <= 0 时返回 defeat', () => {
    expect(determineBattleResult(0, 50)).toBe('defeat');
    expect(determineBattleResult(-10, 50)).toBe('defeat');
  });

  it('双方都存活时返回 ongoing', () => {
    expect(determineBattleResult(50, 50)).toBe('ongoing');
  });
});

describe('calculateRewards', () => {
  const question = { difficulty: 'easy' };

  it('答错不应获得奖励', () => {
    const rewards = calculateRewards(question, false, 10, 0);
    expect(rewards.exp).toBe(0);
    expect(rewards.coins).toBe(0);
  });

  it('答对应获得基础奖励', () => {
    const rewards = calculateRewards(question, true, 10, 0);
    expect(rewards.exp).toBeGreaterThan(0);
    expect(rewards.coins).toBeGreaterThan(0);
  });

  it('高连击应增加奖励', () => {
    const baseRewards = calculateRewards(question, true, 10, 0);
    const streakRewards = calculateRewards(question, true, 10, 5);
    expect(streakRewards.exp).toBeGreaterThan(baseRewards.exp);
    expect(streakRewards.coins).toBeGreaterThan(baseRewards.coins);
  });
});

describe('BattleState', () => {
  const defaultPlayer = { hp: 100, maxHp: 100, attack: 10, defense: 5, luck: 0 };
  const defaultMonster = { hp: 50, attack: 8, defense: 2, name: '史莱姆', icon: '🟢' };

  it('应该正确初始化状态', () => {
    const state = new BattleState(defaultPlayer, defaultMonster);
    const s = state.getState();
    expect(s.player.hp).toBe(100);
    expect(s.monster.currentHp).toBe(50);
    expect(s.turn).toBe(1);
    expect(s.battleResult).toBe('ongoing');
    expect(s.activeEffects).toEqual([]);
  });

  it('答对攻击应减少怪物 HP', () => {
    const state = new BattleState(defaultPlayer, defaultMonster);
    state.attack(true);
    const s = state.getState();
    expect(s.monster.currentHp).toBeLessThan(50);
    expect(s.turn).toBe(2);
  });

  it('答错应触发怪物反击', () => {
    const state = new BattleState(defaultPlayer, defaultMonster);
    state.attack(false);
    const s = state.getState();
    expect(s.player.hp).toBeLessThan(100);
  });

  it('答错且怪物 HP 充足时 battleResult 应为 ongoing', () => {
    const state = new BattleState(defaultPlayer, { ...defaultMonster, hp: 1000, attack: 5 });
    state.attack(false);
    expect(state.battleResult).toBe('ongoing');
  });

  it('持续攻击怪物至 HP=0 应返回胜利', () => {
    const weakMonster = { hp: 5, attack: 1, defense: 0, name: '弱怪', icon: '👾' };
    const state = new BattleState({ ...defaultPlayer, attack: 100 }, weakMonster);
    state.attack(true);
    expect(state.battleResult).toBe('victory');
  });

  it('怪物攻击应验证 skip_monster 效果', () => {
    const state = new BattleState(defaultPlayer, defaultMonster);
    state.activeEffects.push({ target: 'skip_monster', value: 1, duration: 'one_time' });
    const s = state.monsterAttack();
    expect(s.logs[0].type).toBe('monster_skipped');
    // 效果消耗后不应再起作用
    expect(hasActiveEffect(state, 'skip_monster')).toBe(false);
  });

  it('怪物攻击应验证 taunt 效果', () => {
    const state = new BattleState(defaultPlayer, defaultMonster);
    state.activeEffects.push({ target: 'taunt', value: 1, duration: 'one_time' });
    const beforeHp = state.player.hp;
    state.monsterAttack();
    expect(state.player.hp).toBe(beforeHp); // 不扣血
    expect(hasActiveEffect(state, 'taunt')).toBe(false);
  });
});

describe('applyItemEffect', () => {
  const baseState = new BattleState(
    { hp: 100, maxHp: 100, attack: 10, defense: 5, luck: 0 },
    { hp: 50, attack: 8, defense: 2, name: '史莱姆', icon: '🟢' }
  );

  it('治疗效果应恢复 HP', () => {
    baseState.player.hp = 50; // 先扣血
    const potion = {
      id: 'potion_1',
      quantity: 2,
      effect: { type: 'heal', target: 'hp', value: 30 }
    };
    const result = applyItemEffect(potion, baseState);
    expect(result.success).toBe(true);
    expect(result.consumed).toBe(true);
    expect(baseState.player.hp).toBe(80);
  });

  it('治疗效果不应超过 maxHp', () => {
    baseState.player.hp = 90;
    const potion = {
      id: 'potion_2',
      quantity: 1,
      effect: { type: 'heal', target: 'hp', value: 50 }
    };
    applyItemEffect(potion, baseState);
    expect(baseState.player.hp).toBeLessThanOrEqual(baseState.player.maxHp);
  });

  it('buff 效果应增加属性且不消耗道具', () => {
    const state = new BattleState(
      { hp: 100, maxHp: 100, attack: 10, defense: 5, luck: 0 },
      { hp: 50, attack: 8, defense: 2, name: '史莱姆', icon: '🟢' }
    );
    const buff = {
      id: 'buff_1',
      quantity: 1,
      effect: { type: 'buff', target: 'attack', value: 5, duration: 'battle' }
    };
    const result = applyItemEffect(buff, state);
    expect(result.success).toBe(true);
    expect(result.consumed).toBe(false);
    expect(state.player.attack).toBe(15);
  });

  it('不存在的效果类型应返回失败', () => {
    const item = {
      id: 'unknown',
      quantity: 1,
      effect: { type: 'unknown_type', target: 'none', value: 0 }
    };
    const result = applyItemEffect(item, baseState);
    expect(result.success).toBe(false);
  });

  it('未定义 effect 的道具应返回失败', () => {
    const item = { id: 'no_effect', quantity: 1 };
    const result = applyItemEffect(item, baseState);
    expect(result.success).toBe(false);
  });
});

describe('hasActiveEffect / consumeActiveEffect', () => {
  it('应正确检测和消耗 activeEffect', () => {
    const state = new BattleState(
      { hp: 100, maxHp: 100, attack: 10, defense: 5, luck: 0 },
      { hp: 50, attack: 8, defense: 2, name: '史莱姆', icon: '🟢' }
    );
    state.activeEffects.push({ target: 'test_effect', value: 1 });

    expect(hasActiveEffect(state, 'test_effect')).toBe(true);
    expect(hasActiveEffect(state, 'non_existent')).toBe(false);

    consumeActiveEffect(state, 'test_effect');
    expect(hasActiveEffect(state, 'test_effect')).toBe(false);
  });
});
