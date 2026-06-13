# Bug 修复结果

## 修复摘要
- **问题**：文具商店结算确认后，点击"下一位"按钮直接返回空状态，需再次点击"来一位顾客"才能继续
- **根因**："下一位"按钮点击处理直接调用 `clearCustomer()` 仅清空数据，不生成新顾客
- **状态**：**已修复**

## 修改内容
1. **ShopView.vue**（L107）："下一位"按钮的点击处理从 `shopStore.clearCustomer()` 改为 `inviteCustomer()`
   - `inviteCustomer()` 内部已包含重置本地状态（feedbackMessage 等）+ 调用 `shopStore.generateCustomer(grade)` 的完整流程
   - 点击后直接清除旧顾客 → 生成新顾客 → 展示新题目

2. **shopStore.js**（L38-L39）：`generateCustomer()` 开头增加 `_paidAmount` / `_change` 清理
   - 防止高年级切换到低年级时，找零字段残留导致异常

## 涉及文件
- src/components/ShopView.vue
- src/store/shopStore.js

## 构建验证结果
- **构建**：✅ 通过 | 命令：`npm run build`
- 130 modules transformed, 0 errors
- 构建用时：3.74s

## 提交信息
详见 `commit-msg.txt`