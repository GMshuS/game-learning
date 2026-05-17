# Game Hall Spec

## Purpose

Define the game hall (challenge center hub) system requirements for navigation between gameplay modes.

## Requirements

### Requirement: 挑战中心入口
主菜单必须显示"挑战中心"按钮，点击后进入游戏大厅视图。主菜单不再直接显示"冒险模式"和"经营商店"按钮。

#### Scenario: 从主菜单进入挑战中心
- **WHEN** 玩家在主菜单点击"挑战中心"按钮
- **THEN** 视图切换到 GameHall，显示五个玩法卡片和快捷状态信息

#### Scenario: 从挑战中心返回主菜单
- **WHEN** 玩家在游戏大厅点击"返回"按钮
- **THEN** 视图切换回主菜单

### Requirement: 游戏大厅展示
游戏大厅必须展示冒险模式、经营商店、速算竞技场、数学工坊、数学卡牌对战五个玩法入口，每个入口显示玩法名称、图标和简要描述。

#### Scenario: 展示五个玩法卡片
- **WHEN** 玩家进入游戏大厅
- **THEN** 显示五个玩法卡片：冒险模式（⚔️）、经营商店（🏪）、速算竞技场（⚡）、数学工坊（🔨）、卡牌对战（🃏）

#### Scenario: 显示快捷状态
- **WHEN** 玩家进入游戏大厅
- **THEN** 每个玩法卡片显示快捷状态（冒险关卡进度、商店金币、速算最佳成绩、工坊待售数量、卡牌收藏数量）

### Requirement: 挑战中心包含冒险模式和经营商店入口
游戏大厅必须展示冒险模式和经营商店两个额外玩法入口，与现有三个玩法入口并列显示。

#### Scenario: 展示五个玩法卡片
- **WHEN** 玩家进入游戏大厅
- **THEN** 显示五个玩法卡片：冒险模式（⚔️）、经营商店（🏪）、速算竞技场（⚡）、数学工坊（🔨）、卡牌对战（🃏）

#### Scenario: 冒险模式卡片显示状态
- **WHEN** 玩家进入游戏大厅
- **THEN** 冒险模式卡片显示当前关卡或进度信息

#### Scenario: 经营商店卡片显示状态
- **WHEN** 玩家进入游戏大厅
- **THEN** 经营商店卡片显示金币余额或商店等级信息

### Requirement: 冒险模式导航
点击游戏大厅中的冒险模式卡片必须导航到冒险模式视图。

#### Scenario: 进入冒险模式
- **WHEN** 玩家点击冒险模式卡片
- **THEN** 视图切换到 AdventureMap

### Requirement: 经营商店导航
点击游戏大厅中的经营商店卡片必须导航到经营商店视图。

#### Scenario: 进入经营商店
- **WHEN** 玩家点击经营商店卡片
- **THEN** 视图切换到 ShopView

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
