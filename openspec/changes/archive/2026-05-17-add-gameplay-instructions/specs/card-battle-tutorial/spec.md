## ADDED Requirements

### Requirement: Card battle tutorial button
卡牌对战模式选择界面 SHALL 显示 `❓ 玩法说明` 按钮，点击后弹出 GameTutorial 教程弹窗。

#### Scenario: User clicks tutorial button on battle select screen
- **WHEN** 用户在卡牌对战模式选择界面点击 `❓ 玩法说明` 按钮
- **THEN** 弹出标题为 `🃏 卡牌对战玩法说明` 的 GameTutorial 弹窗

#### Scenario: User closes tutorial
- **WHEN** 用户点击教程弹窗的关闭按钮
- **THEN** 教程弹窗关闭，用户回到对战选择界面

### Requirement: Tutorial explains deck building
教程 SHALL 说明卡组构建规则。

#### Scenario: Tutorial explains deck size requirement
- **WHEN** 用户查看教程
- **THEN** 教程说明卡组需要 10-15 张卡牌，可从卡牌收藏中组建

#### Scenario: Tutorial explains card grade groups
- **WHEN** 用户查看教程
- **THEN** 教程说明卡牌按年级分组（1-2年级、3-4年级、5-6年级），只能使用对应年级的卡牌

### Requirement: Tutorial explains card types
教程 SHALL 说明五种卡牌类型及其效果。

#### Scenario: Tutorial explains attack cards
- **WHEN** 用户查看教程
- **THEN** 教程说明攻击卡牌对AI造成伤害

#### Scenario: Tutorial explains defense and heal cards
- **WHEN** 用户查看教程
- **THEN** 教程说明防御卡牌减少受到伤害，治疗卡牌恢复自身HP

#### Scenario: Tutorial explains special and equation cards
- **WHEN** 用户查看教程
- **THEN** 教程说明特殊卡牌有额外效果（双倍伤害、吸血、反击等），方程卡牌需要解方程才能发动（5-6年级）

### Requirement: Tutorial explains battle flow
教程 SHALL 说明回合制对战流程。

#### Scenario: Tutorial explains turn structure
- **WHEN** 用户查看教程
- **THEN** 教程说明双方初始30HP，开局抽3张牌，每回合抽1张，手牌上限5张，点击手牌出牌

#### Scenario: Tutorial explains win condition
- **WHEN** 用户查看教程
- **THEN** 教程说明将AI的HP归零即可获胜，己方HP归零则失败

### Requirement: Tutorial explains difficulty levels
教程 SHALL 说明三种难度级别的差异。

#### Scenario: Tutorial explains difficulty differences
- **WHEN** 用户查看教程
- **THEN** 教程说明简单难度AI随机出牌，中等难度AI有基本策略，困难难度AI最优决策
