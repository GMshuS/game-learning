# Workshop Tutorial Spec

## Purpose

Define the workshop tutorial system requirements for explaining gameplay to players.

## Requirements

### Requirement: Workshop tutorial button
数学工坊界面 SHALL 显示 `❓ 玩法说明` 按钮，点击后弹出 GameTutorial 教程弹窗。

#### Scenario: User clicks tutorial button
- **WHEN** 用户在数学工坊界面点击 `❓ 玩法说明` 按钮
- **THEN** 弹出标题为 `🔨 数学工坊玩法说明` 的 GameTutorial 弹窗

#### Scenario: User closes tutorial
- **WHEN** 用户点击教程弹窗的关闭按钮
- **THEN** 教程弹窗关闭，用户回到数学工坊界面

### Requirement: Tutorial explains material acquisition
教程 SHALL 说明如何通过答题获取材料。

#### Scenario: Tutorial explains material types
- **WHEN** 用户查看教程
- **THEN** 教程说明有6种材料：木材、石头、铁矿（普通）、水晶、金矿（稀有）、魔法粉尘（史诗）

#### Scenario: Tutorial explains question answering for materials
- **WHEN** 用户查看教程
- **THEN** 教程说明答对数学题目可随机获得材料，材料稀有度影响获得概率

### Requirement: Tutorial explains crafting system
教程 SHALL 说明物品制作流程。

#### Scenario: Tutorial explains recipe requirements
- **WHEN** 用户查看教程
- **THEN** 教程说明每个配方需要特定种类和数量的材料，材料不足时无法制作

#### Scenario: Tutorial explains grade-gated recipes
- **WHEN** 用户查看教程
- **THEN** 教程说明配方按年级解锁：1-2年级解锁形状拼图和积木塔，3-4年级解锁花园围栏和地砖，5-6年级解锁预算桥和魔法塔

### Requirement: Tutorial explains sales system
教程 SHALL 说明成品上架售卖和销售结算流程。

#### Scenario: Tutorial explains listing items
- **WHEN** 用户查看教程
- **THEN** 教程说明可将制作好的成品上架，自定义售价（最低10金币）

#### Scenario: Tutorial explains sales settlement
- **WHEN** 用户查看教程
- **THEN** 教程说明顾客会定期购买待售物品，售价越接近基础价格越容易售出，撤回可退回成品
