# Notification System Spec

## Purpose

Define the notification system requirements for managing async event notifications.

## Requirements

### Requirement: 通知队列
系统必须维护一个通知队列，管理所有异步事件通知。

#### Scenario: 添加通知
- **WHEN** 工坊物品售出、卡牌获得或成就解锁
- **THEN** 在通知队列中添加一条新通知

#### Scenario: 通知类型
- **WHEN** 创建通知
- **THEN** 通知包含类型（workshop_sale、card_obtained、achievement）、标题、内容和时间戳

### Requirement: Navbar 红点 Badge
游戏导航栏必须在有未读通知时显示红点 badge。

#### Scenario: 显示红点
- **WHEN** 通知队列中有未读通知
- **THEN** Navbar 对应模块图标上显示红点 badge 和未读数量

#### Scenario: 清除红点
- **WHEN** 玩家查看所有未读通知
- **THEN** 红点 badge 消失

### Requirement: 通知弹窗
玩家点击通知时必须显示详情弹窗。

#### Scenario: 工坊售出通知
- **WHEN** 玩家点击工坊售出通知
- **THEN** 弹窗显示物品名称、售价、购买者类型

#### Scenario: 卡牌获得通知
- **WHEN** 玩家点击卡牌获得通知
- **THEN** 弹窗显示卡牌名称、稀有度和效果

### Requirement: 通知持久化
通知数据必须在页面刷新后保持。

#### Scenario: 刷新后保留通知
- **WHEN** 玩家刷新页面
- **THEN** 未读通知仍然存在，红点 badge 保持显示

#### Scenario: 通知过期清理
- **WHEN** 通知超过 7 天未查看
- **THEN** 自动从通知队列中移除
