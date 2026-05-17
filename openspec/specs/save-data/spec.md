# Save Data Spec

## Purpose

Define the save data system requirements for persisting game state including new gameplay modes.

## Requirements

### Requirement: 扩展存档数据结构
存档数据必须新增卡牌、工坊、速算、排行榜相关字段。

#### Scenario: 保存新玩法数据
- **WHEN** 调用 saveDataStore.saveGame()
- **THEN** 存档包含 speedChallenge、workshop、cardBattle、leaderboard 字段

#### Scenario: 加载存档
- **WHEN** 调用 saveDataStore.loadGame()
- **THEN** 正确恢复所有新玩法的数据状态

#### Scenario: 向后兼容
- **WHEN** 加载旧版本存档（不含新字段）
- **THEN** 新字段使用默认值初始化，不报错

### Requirement: 速算存档数据
速算挑战数据必须包含最佳成绩和总游戏次数。

#### Scenario: 速算数据结构
- **WHEN** 保存速算数据
- **THEN** 存储 bestScores（按模式）、totalGames、totalCorrect

### Requirement: 工坊存档数据
工坊数据必须包含材料、配方、待售物品和销售历史。

#### Scenario: 工坊数据结构
- **WHEN** 保存工坊数据
- **THEN** 存储 materials、craftedItems、listedItems（含 listedAt 时间戳）、salesHistory

### Requirement: 卡牌存档数据
卡牌数据必须包含收藏、卡组和对战记录。

#### Scenario: 卡牌数据结构
- **WHEN** 保存卡牌数据
- **THEN** 存储 collection（只存 cardId 和 quantity）、decks、battleRecords

#### Scenario: 存档大小控制
- **WHEN** 完整存档数据序列化
- **THEN** 总大小不超过 50KB

### Requirement: 重置游戏进度时清除所有玩法数据
当执行重置游戏进度操作时，系统 SHALL 清除所有玩法相关的存档数据，包括速算挑战、工坊、卡牌对战、排行榜和通知数据。

#### Scenario: 重置清除全部玩法数据
- **WHEN** 调用 `resetGameKeepSettings()`
- **THEN** `math_game_speed_challenge`、`math_game_workshop`、`math_game_card_battle`、`math_game_leaderboard`、`math_game_notifications` 键均被删除

#### Scenario: 重置不删除设置数据
- **WHEN** 调用 `resetGameKeepSettings()`
- **THEN** `math_game_settings` 键保持不变
