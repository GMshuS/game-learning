/**
 * 知识点定义 + 学科注册式架构
 *
 * 每个知识点节点对应一种题型类型，id 与现有题型注册的 key 一致。
 * subjects 注册表设计：未来新增学科只需在 subjects 对象中添加一项。
 */
const mathKnowledgeNodes = [
  { id: 'add', label: '加法', icon: '➕', gradeRange: [1, 6] },
  { id: 'subtract', label: '减法', icon: '➖', gradeRange: [1, 6] },
  { id: 'multiply', label: '乘法', icon: '✖️', gradeRange: [2, 6] },
  { id: 'divide', label: '除法', icon: '➗', gradeRange: [3, 6] },
  { id: 'mixed', label: '四则运算', icon: '🧮', gradeRange: [3, 6] },
  { id: 'fraction', label: '分数', icon: '🔢', gradeRange: [3, 6] },
  { id: 'decimal', label: '小数', icon: '🔟', gradeRange: [4, 6] },
  { id: 'percentage', label: '百分数', icon: '💯', gradeRange: [5, 6] },
  { id: 'word', label: '应用题', icon: '📝', gradeRange: [1, 6] },
  { id: 'numberFill', label: '填空', icon: '⬜', gradeRange: [1, 6] },
  { id: 'estimate', label: '估算', icon: '📐', gradeRange: [2, 6] },
  { id: 'equation', label: '方程', icon: '⚖️', gradeRange: [4, 6] },
  { id: 'custom', label: '自定义模板', icon: '📋', gradeRange: [1, 6] }
];

const englishKnowledgeNodes = [
  { id: 'en2cn', label: '英译中', icon: '🇬🇧', gradeRange: [1, 6] },
  { id: 'cn2en', label: '中译英', icon: '🇨🇳', gradeRange: [1, 6] },
  { id: 'listening', label: '听力', icon: '🎧', gradeRange: [1, 6] }
];

const subjects = {
  math: {
    id: 'math',
    label: '数学',
    icon: '📐',
    color: '#4A90D9',
    nodes: mathKnowledgeNodes,
    store: 'mathKnowledge'
  },
  english: {
    id: 'english',
    label: '英语',
    icon: '🔤',
    color: '#7B68EE',
    nodes: englishKnowledgeNodes,
    store: 'englishKnowledge'
  }
};

/**
 * 根据学科 id 获取学科注册信息
 * @param {string} id - 学科标识（'math' | 'english'）
 * @returns {object|undefined} 学科注册信息
 */
function getSubjectById(id) {
  return subjects[id];
}

/**
 * 根据学科 id 和知识点 id 获取知识点节点
 * @param {string} subjectId - 学科标识
 * @param {string} nodeId - 知识点节点标识
 * @returns {object|undefined} 知识点节点
 */
function getNodeById(subjectId, nodeId) {
  const subject = subjects[subjectId];
  if (!subject) return undefined;
  return subject.nodes.find(n => n.id === nodeId);
}

export {
  mathKnowledgeNodes,
  englishKnowledgeNodes,
  subjects,
  getSubjectById,
  getNodeById
};
