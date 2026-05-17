# Card Battle Spec

## Purpose

Define the card battle system requirements including card database, collection, deck building, and AI battles.

## Requirements

### Requirement: 卡牌数据库
卡牌对战系统必须维护一个约 60 张卡牌的数据库，按稀有度分为普通（25 张）、稀有（18 张）、史诗（12 张）、传说（5 张）。

#### Scenario: 加载卡牌数据库
- **WHEN** 系统初始化卡牌模块
- **THEN** 从 config/cards.js 加载全部卡牌数据

#### Scenario: 卡牌属性
- **WHEN** 查询一张卡牌
- **THEN** 返回卡牌 ID、名称、类型（攻击/防御/回复/特殊）、稀有度、效果描述、适用年级范围

### Requirement: 卡牌收集
玩家必须能够收集、查看和管理自己的卡牌收藏。

#### Scenario: 查看收藏
- **WHEN** 玩家打开卡牌收藏界面
- **THEN** 按稀有度分组显示已拥有的卡牌及数量

#### Scenario: 未拥有卡牌
- **WHEN** 玩家查看收藏
- **THEN** 未拥有的卡牌显示为灰色剪影或"未解锁"状态

### Requirement: 卡包抽卡
玩家必须能够通过金币或钻石购买卡包来获取新卡牌。

#### Scenario: 普通卡包
- **WHEN** 玩家花费 50 金币购买普通卡包
- **THEN** 获得 1 张普通卡，有概率额外获得 1 张稀有卡

#### Scenario: 稀有卡包
- **WHEN** 玩家花费 150 金币购买稀有卡包
- **THEN** 获得 1 张稀有卡和 2 张普通卡

#### Scenario: 史诗卡包
- **WHEN** 玩家花费 500 金币购买史诗卡包
- **THEN** 获得 1 张史诗卡、1 张稀有卡和 1 张普通卡

#### Scenario: 传说卡包
- **WHEN** 玩家花费 10 钻石购买传说卡包
- **THEN** 获得 1 张传说卡、1 张史诗卡和 1 张稀有卡

#### Scenario: 重复卡牌处理
- **WHEN** 抽卡获得已拥有的卡牌
- **THEN** 转化为金币（普通 5 金币、稀有 15 金币、史诗 30 金币、传说 50 金币）

### Requirement: 卡组构筑
玩家必须能够组建和管理对战卡组。

#### Scenario: 创建卡组
- **WHEN** 玩家从收藏中选择卡牌加入卡组
- **THEN** 卡组最多包含 15 张卡牌

#### Scenario: 卡组验证
- **WHEN** 玩家尝试开始对战
- **THEN** 检查卡组至少有 10 张卡牌，否则提示无法开始

### Requirement: AI 对战
卡牌对战必须支持三种 AI 难度。

#### Scenario: 简单 AI
- **WHEN** 玩家选择简单难度对战
- **THEN** AI 随机从手牌中选择一张出牌

#### Scenario: 中等 AI
- **WHEN** 玩家选择中等难度对战
- **THEN** AI 根据 HP 阈值选择策略：HP<30% 优先防御，HP>70% 优先攻击，有回复卡则使用

#### Scenario: 复杂 AI
- **WHEN** 玩家选择复杂难度对战
- **THEN** AI 使用评估函数对每张候选牌计算期望收益，选择最高分的牌

#### Scenario: 默认难度推荐
- **WHEN** 玩家首次选择对战难度
- **THEN** 根据年级推荐：1-2 年级推荐简单，3-4 年级推荐中等，5-6 年级推荐复杂

### Requirement: 对战流程
卡牌对战必须遵循完整的回合制流程。

#### Scenario: 开始对战
- **WHEN** 玩家选择难度并点击"开始对战"
- **THEN** 双方各抽 3 张起始手牌，玩家先手

#### Scenario: 回合流程
- **WHEN** 轮到玩家回合
- **THEN** 玩家抽 1 张牌 → 选择 1 张牌出牌 → 答对题目卡牌生效 → 回合结束

#### Scenario: 对战结束
- **WHEN** 一方 HP 降为 0 或双方牌库耗尽
- **THEN** 显示对战结果，胜利方获得金币和卡包奖励

### Requirement: 年级适配卡牌
卡牌必须按年级分组，低年级玩家不会看到高年级卡牌。

#### Scenario: 低年级卡池
- **WHEN** 1-2 年级玩家抽卡
- **THEN** 只能抽到适用于 1-2 年级的卡牌

#### Scenario: 高年级卡池
- **WHEN** 5-6 年级玩家抽卡
- **THEN** 可以抽到所有年级的卡牌
