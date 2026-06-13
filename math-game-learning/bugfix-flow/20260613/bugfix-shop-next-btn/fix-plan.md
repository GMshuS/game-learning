# 修复方案

## 根因分析
"下一位"按钮点击后直接调用 `shopStore.clearCustomer()` 仅清空数据，不生成新顾客，导致界面回到空状态。

## 问题分析过程
1. 用户答题后 feedbackMessage 被设置 → "下一位"按钮显示
2. 点击按钮 → 调用 `clearCustomer()` 清空 customerQueue/isProblemActive
3. 界面回到 `!customerQueue` 空状态 → 需手动点击"来一位顾客"

## 修改点列表
- **src/components/ShopView.vue**: L107 - "下一位"按钮点击改用 inviteCustomer()
  ```javascript
  // 修改前
  @click="shopStore.clearCustomer()"
  // 修改后
  @click="inviteCustomer()"
  ```

- **src/store/shopStore.js**: L36-L39 - generateCustomer 开头清理残留找零字段
  ```javascript
  // 修改前
  generateCustomer(grade = 2) {
    // 随机选择顾客类型
  // 修改后
  generateCustomer(grade = 2) {
    // 清理可能残留的高年级找零字段
    this._paidAmount = null
    this._change = null
    // 随机选择顾客类型
  ```

## 影响范围
- 点击"下一位"后直接进入下一轮顾客答题，流程更顺畅
- 年级切换时 _paidAmount/_change 不会残留污染
