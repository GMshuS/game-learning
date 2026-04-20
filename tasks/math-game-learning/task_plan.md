# Task Plan: math-game-learning

## Project Overview

**项目名称**: 数学王国大冒险 (Math Kingdom Adventure)

**项目类型**: 小学数学学习趣味游戏 - 冒险 RPG + 模拟经营混合模式

**目标用户**: 1-6 年级小学生

**技术栈**: 
- 前端框架：Vue.js 3 + Vite
- 游戏引擎：Phaser.js (冒险模式)
- UI 组件：自定义 Vue 组件 (经营界面)
- 数据存储：LocalStorage
- 部署：静态资源托管 (GitHub Pages / Vercel)

**核心特性**:
- 冒险模式：答题闯关、角色成长、装备收集
- 经营商店：商品买卖、收银找零、店铺升级
- 年级差异化：1-3 年级应用题可视化拖拽玩法
- 响应式设计：PC 浏览器 + 手机 H5 适配

---

## Tasks

### Task 1: 项目初始化与基础架构搭建

- **ID**: task-1
- **Description**: 创建 Vue.js 3 + Vite 项目，配置 Phaser.js 游戏引擎，建立项目目录结构
- **Dependencies**: []
- **Input**: 头脑风暴文档中的技术架构设计
- **Output**: 可运行的项目框架，包含基本配置文件和目录结构

```
目录结构:
math-game-learning/
├── src/
│   ├── main.js              # 应用入口
│   ├── App.vue              # 根组件
│   ├── config/              # 配置文件
│   │   ├── game.js          # 游戏配置
│   │   └── grades.js        # 年级配置
│   ├── scenes/              # Phaser 场景
│   ├── components/          # Vue 组件
│   ├── store/               # 状态管理
│   ├── utils/               # 工具函数
│   ├── assets/              # 静态资源
│   └── styles/              # 样式文件
├── public/
└── package.json
```

---

### Task 2: 游戏数据存储系统设计

- **ID**: task-2
- **Description**: 设计并实现游戏数据模型和 LocalStorage 存储方案，包括玩家进度、道具、金币等
- **Dependencies**: []
- **Input**: 头脑风暴中的数据结构设计
- **Output**: 数据模型定义和存储工具类

```
数据模型:
- Player: { id, name, grade, level, exp, coins, items }
- GameProgress: { adventureLevel, shopLevel, unlockedAreas }
- Inventory: { items, equipment, collectibles }
- Settings: { sound, music, difficulty }
```

---

### Task 3: 题库系统设计

- **ID**: task-3
- **Description**: 设计题库数据结构，实现按年级、知识点分类的题目生成和管理系统
- **Dependencies**: []
- **Input**: 头脑风暴中的知识点覆盖建议
- **Output**: 题库数据结构和题目生成器

```
题库结构:
- 1-2 年级：20/100 以内加减法
- 3-4 年级：乘除法、混合运算
- 5-6 年级：分数、小数、百分比
- 应用题库：生活场景题目（1-3 年级特色）
```

---

### Task 4: 冒险模式 - 世界地图场景

- **ID**: task-4
- **Description**: 使用 Phaser.js 实现冒险模式的世界地图，包含关卡选择、区域解锁等功能
- **Dependencies**: [task-1, task-2]
- **Input**: 项目框架、数据存储系统
- **Output**: 可交互的世界地图场景

```
地图功能:
- 关卡节点展示
- 区域锁定/解锁状态
- 关卡进度显示
- 点击跳转关卡
```

---

### Task 5: 冒险模式 - 答题战斗系统

- **ID**: task-5
- **Description**: 实现冒险模式的答题战斗核心玩法，包括怪物遭遇、答题界面、战斗结算
- **Dependencies**: [task-1, task-3]
- **Input**: 项目框架、题库系统
- **Output**: 完整的答题战斗流程

```
战斗流程:
遭遇怪物 → 显示题目 → 玩家答题 → 判定对错 → 伤害计算 → 战斗结算
```

---

### Task 6: 冒险模式 - 角色与装备系统

- **ID**: task-6
- **Description**: 实现角色属性、升级成长和装备系统（文具装备：铅笔剑、橡皮盾等）
- **Dependencies**: [task-2, task-5]
- **Input**: 数据存储系统、战斗系统
- **Output**: 角色成长系统和装备界面

```
装备系统:
- 武器：铅笔剑、尺子剑、圆规矛
- 防具：橡皮盾、书本甲
- 饰品：数学徽章、智慧之星
```

---

### Task 7: 经营商店 - 商店界面与基础交互

- **ID**: task-7
- **Description**: 实现经营商店的主界面，包括商品展示、顾客交互 UI
- **Dependencies**: [task-1]
- **Input**: 项目框架
- **Output**: 商店经营界面

```
商店界面:
- 商品货架展示
- 顾客对话框
- 收银台 UI
- 收支统计面板
```

---

### Task 8: 经营商店 - 收银找零玩法

- **ID**: task-8
- **Description**: 实现收银找零的核心玩法，顾客购物→计算总价→收款找零
- **Dependencies**: [task-3, task-7]
- **Input**: 题库系统、商店界面
- **Output**: 收银玩法完整流程

```
收银流程:
顾客购物 → 显示商品和价格 → 计算总价 → 顾客付款 → 玩家找零 → 完成交易
```

---

### Task 9: 经营商店 - 进货与库存管理

- **ID**: task-9
- **Description**: 实现商品进货、库存管理、定价策略功能
- **Dependencies**: [task-2, task-7]
- **Input**: 数据存储系统、商店界面
- **Output**: 进货和库存管理系统

```
进货功能:
- 商品列表选择
- 数量输入
- 成本计算
- 库存更新
- 定价设置
```

---

### Task 10: 1-3 年级应用题可视化组件

- **ID**: task-10
- **Description**: 实现应用题的特色玩法，包括拖拽物品、分步解题引导等可视化交互
- **Dependencies**: [task-1, task-3]
- **Input**: 项目框架、题库系统
- **Output**: 可视化应用题组件

```
可视化元素:
- 可拖拽物品（苹果、糖果等）
- 分步解题区域
- 图形化计数器
- 语音读题（可选）
```

---

### Task 11: 奖励与成就系统

- **ID**: task-11
- **Description**: 实现金币奖励、成就徽章、连续答对连击等激励系统
- **Dependencies**: [task-2]
- **Input**: 数据存储系统
- **Output**: 成就系统 UI 和逻辑

```
成就类型:
- 学习成就：连续答对 X 题、完成 X 关卡
- 经营成就：日收入破 X、顾客满意度 X 星
- 收集成就：收集全部数学卡片
```

---

### Task 12: 响应式布局与移动端适配

- **ID**: task-12
- **Description**: 实现 PC 和手机端的响应式布局，确保不同屏幕尺寸下的良好体验
- **Dependencies**: [task-4, task-7]
- **Input**: 冒险模式地图、商店界面
- **Output**: 响应式适配的完整界面

```
适配要点:
- 断点设计：移动端 (<768px)、平板 (768-1024px)、PC (>1024px)
- 触控优化：按钮尺寸、拖拽操作
- 性能优化：资源按需加载
```

---

### Task 13: 音效与背景音乐系统

- **ID**: task-13
- **Description**: 实现游戏音效（答题反馈、获得奖励）和背景音乐播放控制
- **Dependencies**: [task-1]
- **Input**: 项目框架
- **Output**: 音效管理系统

```
音效列表:
- BGM: 冒险主题曲、商店主题曲
- SFX: 答题正确/错误、获得金币、升级、购买
```

---

### Task 14: 设置与存档管理界面

- **ID**: task-14
- **Description**: 实现游戏设置（音效开关、难度选择）和存档管理（保存、加载、重置）
- **Dependencies**: [task-2]
- **Input**: 数据存储系统
- **Output**: 设置面板和存档管理

```
设置功能:
- 音效/音乐开关
- 年级/难度选择
- 存档保存/加载
- 游戏重置
```

---

### Task 15: 主菜单与导航系统

- **ID**: task-15
- **Description**: 实现游戏主菜单，整合冒险模式和经营商店两个入口，以及各界面间的导航
- **Dependencies**: [task-4, task-7]
- **Input**: 冒险模式、商店界面
- **Output**: 完整的主菜单和导航系统

```
主菜单功能:
- 游戏标题和 Logo
- 冒险模式入口
- 商店模式入口
- 设置入口
- 返回/退出功能
```

---

### Task 16: 性能优化与测试

- **ID**: task-16
- **Description**: 进行性能优化（资源压缩、按需加载）和多浏览器测试
- **Dependencies**: [task-4, task-5, task-7, task-8, task-10, task-12]
- **Input**: 所有核心功能模块
- **Output**: 优化后的可发布版本

```
优化内容:
- 资源压缩（图片、音频）
- 代码分割和按需加载
- LocalStorage 数据清理
- 浏览器兼容性测试
```

---

## Task Dependencies Overview

```
并行执行组 1 (无依赖):
├── task-1: 项目初始化
├── task-2: 数据存储系统
├── task-3: 题库系统

并行执行组 2 (依赖组 1):
├── task-4: 冒险地图 (依赖 task-1, task-2)
├── task-5: 答题战斗 (依赖 task-1, task-3)
├── task-7: 商店界面 (依赖 task-1)
├── task-10: 应用题组件 (依赖 task-1, task-3)
├── task-11: 成就系统 (依赖 task-2)
├── task-13: 音效系统 (依赖 task-1)
├── task-14: 设置存档 (依赖 task-2)

并行执行组 3 (依赖组 2):
├── task-6: 角色装备 (依赖 task-2, task-5)
├── task-8: 收银玩法 (依赖 task-3, task-7)
├── task-9: 进货库存 (依赖 task-2, task-7)
├── task-12: 响应式适配 (依赖 task-4, task-7)

并行执行组 4 (依赖组 3):
└── task-15: 主菜单导航 (依赖 task-4, task-7)

并行执行组 5 (最终集成):
└── task-16: 性能优化测试 (依赖多个任务)
```

---

## Summary

| 指标 | 数值 |
|------|------|
| **总任务数** | 16 |
| **并行执行组** | 5 |
| **关键路径** | task-1 → task-4 → task-15 → task-16 |
| **预估开发周期** | 4-6 周 |

---

## 下一步

使用以下命令执行任务计划：

```
# 方式 1: 按顺序执行所有任务
/bigtask-execute math-game-learning

# 方式 2: 执行特定任务
/bigtask-execute math-game-learning/task-1
```
