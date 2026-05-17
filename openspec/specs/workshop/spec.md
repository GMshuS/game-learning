# Workshop Spec

## Purpose

Define the math workshop system requirements including material collection, crafting, and sales.
## Requirements
### Requirement: 材料收集系统
数学工坊必须提供通过答题获取材料的机制。

#### Scenario: 答题获取材料
- **WHEN** 玩家在工坊点击"答题获取材料"按钮
- **THEN** 弹出数学题目对话框，显示题目和四个选项

#### Scenario: 答对获取材料
- **WHEN** 玩家答对题目
- **THEN** 获得随机数量的材料（普通 60%、稀有 30%、史诗 10%）

#### Scenario: 答错处理
- **WHEN** 玩家答错题目
- **THEN** 提示正确答案，不奖励材料

#### Scenario: 材料库存
- **WHEN** 玩家查看工坊
- **THEN** 显示当前持有的各类材料数量

### Requirement: 配方制作系统
数学工坊必须提供配方列表和制作功能，玩家消耗材料制作物品。

#### Scenario: 查看配方
- **WHEN** 玩家打开工坊配方列表
- **THEN** 显示可制作的配方及所需材料

#### Scenario: 制作物品
- **WHEN** 玩家选择配方并点击"制作"且材料充足
- **THEN** 消耗对应材料，将成品加入背包

#### Scenario: 材料不足
- **WHEN** 玩家尝试制作但材料不足
- **THEN** 提示缺少的材料种类和数量，禁止制作

### Requirement: 物品上架销售
工坊制作的物品必须可以上架到商店出售。

#### Scenario: 上架物品
- **WHEN** 玩家选择背包中的物品并设定价格后上架
- **THEN** 物品进入待售队列，记录上架时间戳

#### Scenario: 定价
- **WHEN** 玩家上架物品
- **THEN** 玩家可自由设定售价（在合理范围内）

#### Scenario: 撤回未售出物品
- **WHEN** 玩家选择撤回尚未售出的上架物品
- **THEN** 物品返回背包，从待售队列移除

### Requirement: 后台异步销售
上架的物品必须在后台模拟顾客购买，玩家可切出做其他事情。

#### Scenario: 离线销售计算
- **WHEN** 玩家离开工坊后返回
- **THEN** 根据时间差计算期间发生的销售，更新待售状态

#### Scenario: 销售上限
- **WHEN** 玩家长时间未上线（如数天）
- **THEN** 单次最多结算 10 笔交易，超出部分保持待售

### Requirement: 销售通知
工坊物品售出后必须通知玩家。

#### Scenario: 售出通知
- **WHEN** 上架物品被模拟顾客购买
- **THEN** 在 Navbar 显示红点 badge，点击可查看售出详情

#### Scenario: 通知详情
- **WHEN** 玩家点击售出通知
- **THEN** 显示物品名称、售价、购买者类型

### Requirement: 年级适配配方
工坊必须根据年级提供不同的配方和制作题目。

#### Scenario: 低年级配方
- **WHEN** 1-2 年级玩家在工坊
- **THEN** 配方为形状识别和简单图形拼合，材料需求少

#### Scenario: 中年级配方
- **WHEN** 3-4 年级玩家在工坊
- **THEN** 配方涉及周长/面积计算，材料需求中等

#### Scenario: 高年级配方
- **WHEN** 5-6 年级玩家在工坊
- **THEN** 配方涉及立体图形、比例缩放和预算规划

### Requirement: 数据持久化
工坊数据必须在进入时加载，操作后自动保存。

#### Scenario: 加载存档数据
- **WHEN** 玩家进入工坊
- **THEN** 从存档加载材料、成品和待售数据到 Store

#### Scenario: 保存操作结果
- **WHEN** 玩家完成答题、制作、上架或撤回操作
- **THEN** 将当前 Store 状态同步到存档并保存

### Requirement: 除法题目正确性
工坊生成的除法题目必须确保答案正确。

#### Scenario: 生成可整除的除法题
- **WHEN** 系统生成除法题目
- **THEN** 题目结果必须是整数，正确答案与被除数和除数匹配

