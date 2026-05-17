# Leaderboard Spec

## Purpose

Define the leaderboard system requirements including virtual player generation and dynamic difficulty.

## Requirements

### Requirement: 虚拟玩家生成
排行榜必须能够生成虚拟玩家数据，包含名字、分数、年级和日期。

#### Scenario: 初始化排行榜
- **WHEN** 玩家首次查看某个模式的排行榜
- **THEN** 生成一组虚拟玩家（约 20 个），分数基于当前年级在合理范围内波动

#### Scenario: 虚拟玩家名字
- **WHEN** 生成虚拟玩家
- **THEN** 从预设的数学主题名字池中随机选取

#### Scenario: 分数范围
- **WHEN** 生成同年级虚拟玩家
- **THEN** 分数在玩家历史最佳水平的 ±30% 范围内波动

### Requirement: 动态难度调节
虚拟玩家的分数必须随玩家进步而增长，保持挑战性。

#### Scenario: 玩家打破记录
- **WHEN** 玩家的新成绩超过排行榜上某个虚拟玩家
- **THEN** 该虚拟玩家及排名附近的虚拟玩家分数增长 5%~15%

#### Scenario: 保持差距
- **WHEN** 玩家持续进步
- **THEN** 排行榜前 3 名始终有虚拟玩家分数略高于玩家当前最佳

### Requirement: 排行榜展示
排行榜必须按模式分类展示，显示排名、玩家名、分数、年级和日期。

#### Scenario: 速算排行榜
- **WHEN** 玩家查看速算排行榜
- **THEN** 按速算分数降序排列，标记玩家自己的排名

#### Scenario: 卡牌排行榜
- **WHEN** 玩家查看卡牌对战排行榜
- **THEN** 按卡牌对战胜率或积分降序排列

### Requirement: 玩家最佳记录
排行榜必须记录并展示玩家在各模式下的最佳成绩。

#### Scenario: 更新最佳记录
- **WHEN** 玩家完成一轮挑战且成绩优于历史记录
- **THEN** 更新该模式的最佳记录

#### Scenario: 显示玩家排名
- **WHEN** 玩家查看排行榜
- **THEN** 玩家自己的记录用高亮标记，显示具体排名
