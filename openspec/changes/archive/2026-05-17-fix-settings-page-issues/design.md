## Context

设置面板（`SettingsPanel.vue`）是游戏的主要配置界面，采用深色主题（`linear-gradient(135deg, #1a1a2e, #16213e)`）。当前存在四个问题：

1. 下拉框（`<select>`）的默认文本颜色继承浏览器样式（黑色），在深色背景下不可见
2. 难度卡片的 `<h4>` 和 `<p>` 标签未设置颜色，继承黑色，在深色背景下难以辨认
3. 难度卡片点击事件调用 `updateSetting('difficulty', diff.value)`，但 `updateSetting` 只更新 `localSettings` 的副本并 emit 整体设置，没有同步更新 `localSettings.difficulty`，导致 UI 状态不刷新
4. 数据管理的导出/导入按钮 emit `export`/`import` 事件，但父组件 `GameApp.vue` 未监听这些事件

## Goals / Non-Goals

**Goals:**
- 修复所有 UI 样式问题，确保文本在深色背景下清晰可读
- 修复难度切换的交互逻辑，使点击后视觉状态正确更新
- 实现数据导入导出功能的事件处理
- 保持现有设置面板的整体设计风格和布局

**Non-Goals:**
- 不重构设置面板的整体架构
- 不添加新的设置项
- 不修改 Pinia store 的数据结构

## Decisions

### 1. 下拉框文本颜色修复
**Decision**: 为 `<select>` 元素及其 `<option>` 子元素显式设置 `color: #fff`，覆盖浏览器默认样式。
**Rationale**: 浏览器对 `<select>` 和 `<option>` 的样式支持有限，最可靠的方式是直接设置白色文本。
**Alternatives considered**: 使用 CSS 变量统一管理颜色——但 `<option>` 元素对 CSS 变量的支持不一致。

### 2. 难度卡片字体颜色修复
**Decision**: 为 `.difficulty-card h4` 设置 `color: #fff`，为 `.difficulty-card p` 设置 `color: rgba(255, 255, 255, 0.8)`。
**Rationale**: 保持与整体深色主题的一致性，同时通过透明度区分标题和描述的层级。

### 3. 难度切换逻辑修复
**Decision**: 在 `updateSetting` 方法中，先更新 `localSettings.value[key]` 再 emit 事件；或者在难度卡片的 `@click` 中先更新 `localSettings.difficulty` 再调用 emit。
**Rationale**: 当前 `updateSetting` 只 emit 了更新后的设置，但没有更新本地的 `localSettings` 响应式引用，导致 Vue 无法检测到状态变化。
**Alternatives considered**: 使用 computed + watch 模式——增加了复杂度，对于简单的设置面板不必要。

### 4. 数据导入导出功能实现
**Decision**: 在 `GameApp.vue` 中添加 `handleExport`、`handleImport`、`handleReset` 方法：
- 导出：收集所有设置和游戏进度数据，序列化为 JSON，创建 Blob 并触发下载
- 导入：创建隐藏的 `<input type="file">`，读取 JSON 文件，解析后更新设置和游戏进度
- 重置：弹出确认对话框，确认后清除本地存储的游戏进度数据
**Rationale**: 这些逻辑属于应用级别的数据管理，放在父组件中更合适，保持 SettingsPanel 的纯粹性（只负责 UI 展示和用户交互）。

## Risks / Trade-offs

- **[浏览器兼容性]**: `<select>` 和 `<option>` 的样式在不同浏览器中表现可能不一致 → 接受有限的样式差异，确保文本可读即可
- **[数据导入安全性]**: 导入的 JSON 文件可能包含恶意数据 → 添加基本的格式验证和字段白名单
- **[localStorage 大小限制]**: 导出/导入的数据量较大时可能接近 localStorage 限制 → 当前数据量较小，暂不处理；未来可考虑压缩
