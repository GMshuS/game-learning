## ADDED Requirements

### Requirement: Speed challenge tutorial button
速算竞技场模式选择界面 SHALL 显示 `❓ 玩法说明` 按钮，点击后弹出 GameTutorial 教程弹窗。

#### Scenario: User clicks tutorial button on mode select screen
- **WHEN** 用户在速算竞技场模式选择界面点击 `❓ 玩法说明` 按钮
- **THEN** 弹出标题为 `⚡ 速算竞技场玩法说明` 的 GameTutorial 弹窗

#### Scenario: User closes tutorial
- **WHEN** 用户点击教程弹窗的关闭按钮或 × 按钮
- **THEN** 教程弹窗关闭，用户回到模式选择界面

### Requirement: Tutorial covers all three sub-modes
教程 SHALL 覆盖基础速算、闪电抢答、生存模式三种子模式的规则说明。

#### Scenario: Tutorial explains base mode
- **WHEN** 用户查看教程
- **THEN** 教程说明基础速算模式：60秒计时，答对得10分，连击有额外加成

#### Scenario: Tutorial explains blitz mode
- **WHEN** 用户查看教程
- **THEN** 教程说明闪电抢答模式：45秒与AI竞速，答对得15分，AI进度条满则AI获胜

#### Scenario: Tutorial explains survival mode
- **WHEN** 用户查看教程
- **THEN** 教程说明生存模式：3条命无计时，答对得20分，答错扣一条命

### Requirement: Tutorial explains scoring and rewards
教程 SHALL 说明计分规则和奖励机制。

#### Scenario: Tutorial explains combo bonus
- **WHEN** 用户查看教程
- **THEN** 教程说明连续答对可获得连击加分，不同模式连击加成比例不同

#### Scenario: Tutorial explains rating system
- **WHEN** 用户查看教程
- **THEN** 教程说明根据得分获得 D/S 评级，以及金币和钻石奖励
