## ADDED Requirements

### Requirement: 挑战中心模式
游戏模式配置必须新增 CHALLENGE_CENTER 模式。

#### Scenario: 模式定义
- **WHEN** 查询游戏模式列表
- **THEN** 返回 adventure、shop、challenge_center 三种模式

#### Scenario: 模式切换
- **WHEN** 玩家从主菜单进入挑战中心
- **THEN** gameStore 设置当前模式为 challenge_center

#### Scenario: 模式返回
- **WHEN** 玩家从挑战中心返回主菜单
- **THEN** gameStore 清除当前模式（设为 null）
