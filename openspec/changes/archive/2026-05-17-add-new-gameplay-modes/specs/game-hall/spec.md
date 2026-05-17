## ADDED Requirements

### Requirement: 挑战中心入口
主菜单必须显示"挑战中心"按钮，点击后进入游戏大厅视图。

#### Scenario: 从主菜单进入挑战中心
- **WHEN** 玩家在主菜单点击"挑战中心"按钮
- **THEN** 视图切换到 GameHall，显示三个玩法卡片和快捷状态信息

#### Scenario: 从挑战中心返回主菜单
- **WHEN** 玩家在游戏大厅点击"返回"按钮
- **THEN** 视图切换回主菜单

### Requirement: 游戏大厅展示
游戏大厅必须展示速算竞技场、数学工坊、数学卡牌对战三个玩法入口，每个入口显示玩法名称、图标和简要描述。

#### Scenario: 展示三个玩法卡片
- **WHEN** 玩家进入游戏大厅
- **THEN** 显示三个玩法卡片：速算竞技场（⏱️）、数学工坊（🏗️）、数学卡牌对战（🃏）

#### Scenario: 显示快捷状态
- **WHEN** 玩家进入游戏大厅
- **THEN** 每个玩法卡片显示快捷状态（速算最佳成绩、工坊待售数量、卡牌收藏数量）

### Requirement: 玩法导航
点击游戏大厅中的玩法卡片必须导航到对应的玩法视图。

#### Scenario: 进入速算竞技场
- **WHEN** 玩家点击速算竞技场卡片
- **THEN** 视图切换到 SpeedChallenge

#### Scenario: 进入数学工坊
- **WHEN** 玩家点击数学工坊卡片
- **THEN** 视图切换到 Workshop

#### Scenario: 进入数学卡牌对战
- **WHEN** 玩家点击数学卡牌对战卡片
- **THEN** 视图切换到 CardBattle

### Requirement: 排行榜入口
游戏大厅必须提供排行榜查看入口。

#### Scenario: 查看排行榜
- **WHEN** 玩家在游戏大厅点击"排行榜"按钮
- **THEN** 视图切换到 Leaderboard
