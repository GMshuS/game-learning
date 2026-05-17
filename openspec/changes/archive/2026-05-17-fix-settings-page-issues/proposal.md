## Why

设置页面存在多个影响用户体验的 bug：下拉框未选中项文本颜色与深色背景不协调、难度设置区域的黑色字体在深色背景下难以辨认、难度切换点击无响应、数据管理的导入导出按钮点击无响应。这些问题导致设置功能部分不可用，需要修复。

## What Changes

- 修复年级选择和语言选择下拉框的未选中项文本颜色，确保在深色背景下清晰可读
- 优化难度设置卡片的字体颜色，将黑色文字改为浅色以提高可读性
- 修复难度设置切换逻辑，使点击难度卡片能正确更新选中状态
- 修复数据管理模块的导出数据和导入数据按钮，绑定正确的事件处理函数

## Capabilities

### New Capabilities

- `settings-data-management`: 数据导入导出功能的事件处理，包括数据序列化、文件下载、文件读取解析和导入确认

### Modified Capabilities

- `settings-ui`: 修复设置面板的 UI 样式问题（下拉框文本颜色、难度卡片字体颜色）和交互逻辑（难度切换响应）

## Impact

- `src/components/SettingsPanel.vue`: 样式修复、难度切换逻辑、新增导入导出事件处理
- `src/components/GameApp.vue`: 添加 export/import/reset 事件监听和处理方法
- `src/store/settingsStore.js`: 可能需要添加数据导入导出相关的辅助方法
