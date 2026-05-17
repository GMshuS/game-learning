## ADDED Requirements

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
