# Dual Currency Economy Spec

## Purpose

Define the dual currency (coins and gems) economy system requirements.

## Requirements

### Requirement: 钻石货币
系统必须支持钻石（gems）作为第二货币，与金币（coins）并存。

#### Scenario: 钻石余额显示
- **WHEN** 玩家查看状态栏
- **THEN** 同时显示金币和钻石余额

#### Scenario: 获得钻石
- **WHEN** 玩家完成成就、连续登录或获得速算三星评级
- **THEN** 钻石余额增加

#### Scenario: 消费钻石
- **WHEN** 玩家购买传说卡包或特殊配方
- **THEN** 检查钻石余额充足后扣减

#### Scenario: 钻石不足
- **WHEN** 玩家尝试消费但钻石不足
- **THEN** 提示钻石不足，禁止交易

### Requirement: 星星评级
系统必须支持星星（stars）作为成就评级货币。

#### Scenario: 获得星星
- **WHEN** 玩家在速算或卡牌对战中获得高评价
- **THEN** 星星数量增加

#### Scenario: 星星用途
- **WHEN** 星星数量达到阈值
- **THEN** 可解锁限定装饰或称号

### Requirement: 统一经济产出
所有玩法的金币产出必须通过 gameStore 统一管理。

#### Scenario: 速算产出金币
- **WHEN** 玩家完成速算挑战
- **THEN** 调用 gameStore.addCoins() 增加金币

#### Scenario: 工坊售出获得金币
- **WHEN** 工坊物品被顾客购买
- **THEN** 调用 gameStore.addCoins() 增加金币

#### Scenario: 卡牌对战产出金币
- **WHEN** 玩家赢得卡牌对战
- **THEN** 调用 gameStore.addCoins() 增加金币

#### Scenario: 卡牌对战消耗金币
- **WHEN** 玩家购买卡包
- **THEN** 调用 gameStore.spendCoins() 扣减金币

### Requirement: 钻石稀缺性控制
钻石的获取频率必须保持稀有，周产出控制在 2-5 个。

#### Scenario: 成就钻石奖励
- **WHEN** 玩家解锁成就
- **THEN** 部分成就奖励 1-3 钻石（一次性）

#### Scenario: 连续登录奖励
- **WHEN** 玩家连续登录 7 天
- **THEN** 获得 2 钻石奖励

#### Scenario: 速算三星奖励
- **WHEN** 玩家在速算中获得 ⭐⭐⭐ 评级
- **THEN** 获得 1 钻石
