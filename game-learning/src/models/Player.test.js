/**
 * Player 模型单元测试
 */
import { describe, it, expect } from 'vitest';
import { Player } from './Player';

describe('Player', () => {
  it('应该使用默认值创建玩家', () => {
    const player = new Player();
    expect(player.name).toBe('冒险者');
    expect(player.level).toBe(1);
    expect(player.exp).toBe(0);
    expect(player.coins).toBe(0);
    expect(player.items).toEqual([]);
  });

  it('应该使用传入数据创建玩家', () => {
    const player = new Player({
      name: '小明',
      level: 3,
      exp: 150,
      coins: 500
    });
    expect(player.name).toBe('小明');
    expect(player.level).toBe(3);
    expect(player.exp).toBe(150);
    expect(player.coins).toBe(500);
  });

  it('addExp 应该增加经验值', () => {
    const player = new Player({ level: 1, exp: 0 });
    player.addExp(50);
    expect(player.exp).toBe(50);
  });

  it('addExp 在经验值达到升级阈值时应触发升级', () => {
    const player = new Player({ level: 1, exp: 0 });
    const leveledUp = player.addExp(100);
    expect(leveledUp).toBe(true);
    expect(player.level).toBe(2);
    // 经验值应扣除升级所需（100），多余经验保留
    expect(player.exp).toBe(0);
  });

  it('addExp 在多次累积后应逐级升级', () => {
    const player = new Player({ level: 1, exp: 90 });
    const leveledUp = player.addExp(120);
    expect(leveledUp).toBe(true);
    expect(player.level).toBe(2);
    expect(player.exp).toBe(110); // 90 + 120 - 100(升级消耗)
  });

  it('addCoins 应增加金币', () => {
    const player = new Player({ coins: 100 });
    player.addCoins(50);
    expect(player.coins).toBe(150);
  });

  it('spendCoins 在余额充足时应返回 true 并扣除金币', () => {
    const player = new Player({ coins: 100 });
    const result = player.spendCoins(30);
    expect(result).toBe(true);
    expect(player.coins).toBe(70);
  });

  it('spendCoins 在余额不足时应返回 false 且不扣金币', () => {
    const player = new Player({ coins: 20 });
    const result = player.spendCoins(50);
    expect(result).toBe(false);
    expect(player.coins).toBe(20);
  });

  it('addItem 应添加道具到列表', () => {
    const player = new Player();
    const potion = { id: 'potion_1', name: '治疗药水' };
    player.addItem(potion);
    expect(player.items).toHaveLength(1);
    expect(player.items[0]).toEqual(potion);
  });

  it('removeItem 应移除存在的道具', () => {
    const player = new Player();
    player.addItem({ id: 'item_1', name: '道具1' });
    player.addItem({ id: 'item_2', name: '道具2' });
    const result = player.removeItem('item_1');
    expect(result).toBe(true);
    expect(player.items).toHaveLength(1);
    expect(player.items[0].id).toBe('item_2');
  });

  it('removeItem 在道具不存在时应返回 false', () => {
    const player = new Player();
    const result = player.removeItem('non_existent');
    expect(result).toBe(false);
  });

  it('toStorage 应返回正确的存储对象', () => {
    const player = new Player({ name: '测试', level: 2, coins: 300 });
    const storage = player.toStorage();
    expect(storage.name).toBe('测试');
    expect(storage.level).toBe(2);
    expect(storage.coins).toBe(300);
    expect(storage.id).toBeDefined();
    expect(storage.createdAt).toBeDefined();
    expect(storage.lastLoginAt).toBeDefined();
  });

  it('fromStorage 应从存储对象重建玩家', () => {
    const data = {
      id: 'player_test',
      name: '恢复测试',
      level: 5,
      exp: 200,
      coins: 1000,
      items: [{ id: 'sword', name: '铁剑' }],
      createdAt: '2024-01-01T00:00:00Z'
    };
    const player = Player.fromStorage(data);
    expect(player.name).toBe('恢复测试');
    expect(player.level).toBe(5);
    expect(player.exp).toBe(200);
    expect(player.coins).toBe(1000);
    expect(player.items).toHaveLength(1);
  });

  it('generateId 应生成唯一 ID', () => {
    const player1 = new Player();
    const player2 = new Player();
    expect(player1.id).not.toBe(player2.id);
  });
});
