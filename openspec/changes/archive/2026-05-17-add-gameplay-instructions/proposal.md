## Why

速算竞技场、数学工坊、卡牌对战三个挑战中心模式缺少玩法说明，新用户首次进入时无法快速了解规则和操作方式。冒险模式和经营商店已有 `❓ 玩法说明` 按钮和 GameTutorial 教程弹窗，但三个挑战模式未接入该机制，导致用户体验不一致。

## What Changes

- 速算竞技场增加 `❓ 玩法说明` 按钮，弹窗说明三种子模式（基础速算、闪电抢答、生存模式）的规则
- 数学工坊增加 `❓ 玩法说明` 按钮，弹窗说明材料获取、物品制作、上架售卖的完整流程
- 卡牌对战增加 `❓ 玩法说明` 按钮，弹窗说明卡组构建、回合制对战、卡牌类型和效果的规则
- 三个模式复用现有 GameTutorial 组件，保持与冒险模式、经营商店一致的教程风格

## Capabilities

### New Capabilities

- `speed-challenge-tutorial`: 速算竞技场玩法说明教程，覆盖三种子模式的规则和操作
- `workshop-tutorial`: 数学工坊玩法说明教程，覆盖材料、制作、售卖流程
- `card-battle-tutorial`: 卡牌对战玩法说明教程，覆盖卡组、对战、卡牌类型

### Modified Capabilities

<!-- No existing capability requirements are changing -->

## Impact

- `src/components/SpeedChallenge.vue` — 添加教程按钮和教程数据
- `src/components/Workshop.vue` — 添加教程按钮和教程数据
- `src/components/CardBattle.vue` — 添加教程按钮和教程数据
- 复用现有 `src/components/GameTutorial.vue` 组件，无需修改
