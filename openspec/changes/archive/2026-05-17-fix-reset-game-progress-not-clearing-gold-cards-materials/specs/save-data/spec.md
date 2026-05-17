## ADDED Requirements

### Requirement: 重置游戏进度时清除所有玩法数据
当执行重置游戏进度操作时，系统 SHALL 清除所有玩法相关的存档数据，包括速算挑战、工坊、卡牌对战、排行榜和通知数据。

#### Scenario: 重置清除全部玩法数据
- **WHEN** 调用 `resetGameKeepSettings()`
- **THEN** `math_game_speed_challenge`、`math_game_workshop`、`math_game_card_battle`、`math_game_leaderboard`、`math_game_notifications` 键均被删除

#### Scenario: 重置不删除设置数据
- **WHEN** 调用 `resetGameKeepSettings()`
- **THEN** `math_game_settings` 键保持不变
