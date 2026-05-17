## 1. 修改主菜单（MainMenu.vue）

- [x] 1.1 从 menuOptions 计算属性中移除冒险模式（adventure）菜单项
- [x] 1.2 从 menuOptions 计算属性中移除经营商店（shop）菜单项
- [x] 1.3 从 confirmOption 函数中移除 adventure 和 shop 的分支处理
- [x] 1.4 从组件 emit 声明中移除 startAdventure 和 startShop 事件

## 2. 更新 GameApp.vue 导航逻辑

- [x] 2.1 移除 MainMenu 组件上的 @startAdventure 和 @startShop 事件绑定
- [x] 2.2 移除 startAdventure 和 startShop 导航函数
- [x] 2.3 为 GameHall 组件添加 @startAdventure 和 @startShop 事件绑定
- [x] 2.4 添加 startAdventureFromHall 和 startShopFromHall 函数（从挑战中心进入时设置 previousView 为 challenge）

## 3. 扩展挑战中心（GameHall.vue）

- [x] 3.1 在 hall-cards 中添加冒险模式入口卡片（⚔️ 图标，描述：挑战数学怪物，提升角色等级）
- [x] 3.2 在 hall-cards 中添加经营商店入口卡片（🏪 图标，描述：经营文具店，练习收银找零）
- [x] 3.3 为冒险模式卡片添加点击事件 emit('startAdventure')
- [x] 3.4 为经营商店卡片添加点击事件 emit('startShop')
- [x] 3.5 为冒险模式卡片添加状态显示（当前关卡进度）
- [x] 3.6 为经营商店卡片添加状态显示（金币余额或商店等级）
- [x] 3.7 在 emit 声明中添加 startAdventure 和 startShop 事件
- [x] 3.8 添加冒险模式和经营商店卡片的 hover 样式（分别对应紫色和粉色边框）

## 4. 更新导航配置和标签

- [x] 4.1 确认 navigation.js 中 adventure 和 shop 路由配置保持不变（内部导航仍需要）
- [x] 4.2 确认 GameNavbar.vue 的 modeLabels 保持不变（adventure/shop 模式标签仍需显示）

## 5. 验证与测试

- [x] 5.1 运行 npm run dev 验证主菜单仅显示3个选项
- [x] 5.2 验证挑战中心显示5个玩法卡片
- [x] 5.3 验证从挑战中心进入冒险模式功能正常
- [x] 5.4 验证从挑战中心进入经营商店功能正常
- [x] 5.5 验证从冒险模式/经营商店返回挑战中心功能正常
- [x] 5.6 验证现有速算竞技、数学工坊、卡牌对战功能不受影响
