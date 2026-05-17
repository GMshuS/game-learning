## 1. 速算竞技场教程

- [x] 1.1 在 SpeedChallenge.vue 导入 GameTutorial 组件
- [x] 1.2 添加 `showTutorial` ref 和 `speedTutorialSteps` 教程步骤数据（5步：模式选择、基础速算、闪电抢答、生存模式、计分奖励）
- [x] 1.3 在模式选择界面 header 区域添加 `❓ 玩法说明` 按钮
- [x] 1.4 添加 GameTutorial 弹窗模板，绑定 title、steps 和 @close 事件
- [x] 1.5 添加 btn-help 按钮样式（参照 BattleGame.vue 的样式）

## 2. 数学工坊教程

- [x] 2.1 在 Workshop.vue 导入 GameTutorial 组件
- [x] 2.2 添加 `showTutorial` ref 和 `workshopTutorialSteps` 教程步骤数据（5步：答题获取材料、材料类型、制作物品、上架售卖、销售结算）
- [x] 2.3 在 ws-header 区域添加 `❓ 玩法说明` 按钮
- [x] 2.4 添加 GameTutorial 弹窗模板，绑定 title、steps 和 @close 事件
- [x] 2.5 添加 btn-help 按钮样式

## 3. 卡牌对战教程

- [x] 3.1 在 CardBattle.vue 导入 GameTutorial 组件
- [x] 3.2 添加 `showTutorial` ref 和 `cardBattleTutorialSteps` 教程步骤数据（6步：卡组构建、卡牌类型、对战流程、方程卡牌、难度选择、胜负条件）
- [x] 3.3 在 battle-select 界面 header 区域添加 `❓ 玩法说明` 按钮
- [x] 3.4 添加 GameTutorial 弹窗模板，绑定 title、steps 和 @close 事件
- [x] 3.5 添加 btn-help 按钮样式

## 4. 验证

- [x] 4.1 运行 `npm run dev` 确认三个模式教程按钮正常显示和点击
- [x] 4.2 验证教程弹窗内容完整、排版正确
- [x] 4.3 验证关闭按钮正常工作
