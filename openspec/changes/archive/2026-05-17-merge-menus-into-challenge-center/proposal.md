## Why

当前主菜单包含5个选项（冒险模式、经营商店、挑战中心、成就系统、设置），菜单较长且功能分类不够清晰。冒险模式和经营商店本质上也是挑战玩法，与挑战中心内的速算竞技、数学工坊、卡牌对战属于同一类别。将它们合并到挑战中心可以简化主菜单、统一挑战类玩法的入口，提升用户体验。

## What Changes

- 从主菜单移除"冒险模式"和"经营商店"两个选项
- 在挑战中心（GameHall）中新增"冒险模式"和"经营商店"入口卡片
- 主菜单仅保留"挑战中心"、"成就系统"、"设置"三个选项
- 更新 GameApp.vue 中的导航逻辑，移除直接导航到冒险模式和经营商店的事件处理
- 更新 GameNavbar.vue 中的模式标签映射

## Capabilities

### New Capabilities
- `challenge-center-expanded`: 挑战中心作为统一入口，包含冒险模式、经营商店、速算竞技、数学工坊、卡牌对战所有挑战玩法

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- `src/components/MainMenu.vue` — 移除冒险模式和经营商店菜单项
- `src/components/GameHall.vue` — 新增冒险模式和经营商店入口卡片
- `src/components/GameApp.vue` — 简化导航逻辑，移除 adventure/shop 视图切换
- `src/components/GameNavbar.vue` — 更新模式标签
- `src/config/navigation.js` — 更新路由配置
