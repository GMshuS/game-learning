# Speed Challenge Spec

## Purpose

Define the speed challenge arena system requirements including timed quizzes, combo system, and rewards.

## Requirements

### Requirement: 限时答题模式
速算竞技场必须提供限时答题功能，玩家在倒计时内尽可能多地作答数学题目。

#### Scenario: 开始速算挑战
- **WHEN** 玩家选择速算模式并点击"开始"
- **THEN** 显示倒计时计时器并开始出题

#### Scenario: 答题计时
- **WHEN** 玩家在倒计时期间作答
- **THEN** 每答对一题计分，计时器持续减少

#### Scenario: 时间结束
- **WHEN** 倒计时归零
- **THEN** 结束本轮挑战，显示最终得分和评级

### Requirement: 三种子模式
速算竞技场必须提供基础速算、闪电抢答、生存模式三种子模式。

#### Scenario: 基础速算模式
- **WHEN** 玩家选择基础速算模式
- **THEN** 固定 60 秒倒计时，答对得分，答错不扣分

#### Scenario: 闪电抢答模式
- **WHEN** 玩家选择闪电抢答模式
- **THEN** 玩家与 AI 虚拟对手竞速，先答对者得分

#### Scenario: 生存模式
- **WHEN** 玩家选择生存模式
- **THEN** 玩家有 3 条命，答错扣一条命，全部扣完结束

### Requirement: 连击系统
速算竞技场必须实现连击计数和连击加成机制。

#### Scenario: 连击计数
- **WHEN** 玩家连续答对题目
- **THEN** 连击数递增并显示在界面上

#### Scenario: 连击加成
- **WHEN** 玩家连击数达到 5 的倍数
- **THEN** 获得时间奖励（+2 秒）或分数加成（+10%）

#### Scenario: 连击中断
- **WHEN** 玩家答错题目
- **THEN** 连击数重置为 0

### Requirement: 年级适配题目
速算竞技场必须根据玩家年级生成对应难度的题目。

#### Scenario: 低年级题目
- **WHEN** 1-2 年级玩家进行速算
- **THEN** 题目为 20/100 以内加减法

#### Scenario: 中年级题目
- **WHEN** 3-4 年级玩家进行速算
- **THEN** 题目包含乘除法和混合运算

#### Scenario: 高年级题目
- **WHEN** 5-6 年级玩家进行速算
- **THEN** 题目包含分数、小数和百分比运算

### Requirement: 金币奖励
速算竞技场必须根据表现产出金币奖励。

#### Scenario: 基础金币奖励
- **WHEN** 玩家完成一轮速算
- **THEN** 每答对一题获得 1~3 金币

#### Scenario: 连击金币加成
- **WHEN** 玩家在速算中达到连击
- **THEN** 连击数 × 10% 作为额外金币加成

#### Scenario: 评级金币奖励
- **WHEN** 玩家获得 ⭐⭐⭐ 评级
- **THEN** 额外获得 20 金币和 1 钻石
