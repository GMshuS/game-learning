## MODIFIED Requirements

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

## ADDED Requirements

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
