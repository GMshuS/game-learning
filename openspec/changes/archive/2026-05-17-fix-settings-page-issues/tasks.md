## 1. 下拉框文本颜色修复

- [x] 1.1 为 `.setting-item select` 添加 `color: #fff` 样式
- [x] 1.2 为 `.setting-item select option` 添加 `color: #000` 和 `background: #1a1a2e` 样式（option 在下拉展开时需要深色背景配浅色文字）

## 2. 难度卡片字体颜色优化

- [x] 2.1 为 `.difficulty-card h4` 添加 `color: #fff` 样式
- [x] 2.2 为 `.difficulty-card p` 添加 `color: rgba(255, 255, 255, 0.8)` 样式

## 3. 难度切换逻辑修复

- [x] 3.1 修改 `updateSetting` 方法，先更新 `localSettings.value[key] = value` 再 emit 事件
- [x] 3.2 验证点击难度卡片后 UI 状态正确更新（选中高亮效果）

## 4. 数据导出功能实现

- [x] 4.1 在 `GameApp.vue` 中添加 `handleExport` 方法：收集设置和游戏数据，序列化为 JSON
- [x] 4.2 创建 Blob 对象并触发浏览器下载，文件名包含时间戳
- [x] 4.3 在 `SettingsPanel` 组件绑定 `@export="handleExport"` 事件

## 5. 数据导入功能实现

- [x] 5.1 在 `GameApp.vue` 中添加 `handleImport` 方法：创建隐藏 file input，监听文件选择
- [x] 5.2 实现文件读取和 JSON 解析逻辑，添加格式验证
- [x] 5.3 导入成功后更新 settings store 和相关游戏数据
- [x] 5.4 导入失败时显示错误提示
- [x] 5.5 在 `SettingsPanel` 组件绑定 `@import="handleImport"` 事件

## 6. 重置游戏进度功能实现

- [x] 6.1 在 `GameApp.vue` 中添加 `handleReset` 方法：显示确认对话框
- [x] 6.2 用户确认后清除 localStorage 中的游戏进度数据
- [x] 6.3 重置后刷新 UI 到默认状态
- [x] 6.4 在 `SettingsPanel` 组件绑定 `@reset="handleReset"` 事件

## 7. 验证与测试

- [x] 7.1 启动开发服务器，验证所有四个问题已修复
- [x] 7.2 测试下拉框文本颜色在选中/未选中状态下均可读
- [x] 7.3 测试难度卡片点击切换功能正常
- [x] 7.4 测试数据导出功能，验证导出的 JSON 文件内容完整
- [x] 7.5 测试数据导入功能，验证导入后数据正确恢复
- [x] 7.6 测试重置功能，验证确认对话框和重置逻辑
