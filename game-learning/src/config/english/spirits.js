/**
 * 英语精灵收集配置
 * 定义9个可收集的语法精灵，按区域分组
 */
export const englishSpiritsConfig = [
  {
    id: 'noun_spirit',
    name: '名词精灵',
    icon: '📝',
    region: 'region_1',
    description: '名词是表示人、事物、地点或抽象概念的词。掌握名词是英语学习的第一步。',
    unlockCondition: '击败词法森林的BOSS'
  },
  {
    id: 'pronoun_spirit',
    name: '代词精灵',
    icon: '🔤',
    region: 'region_1',
    description: '代词用于代替名词，避免重复。如 I, you, he, she, it, we, they。',
    unlockCondition: '完成代词语法塔'
  },
  {
    id: 'article_spirit',
    name: '冠词精灵',
    icon: '🎯',
    region: 'region_1',
    description: '冠词是置于名词之前的限定词，包括定冠词 the 和不定冠词 a/an。',
    unlockCondition: '完成冠词语法塔'
  },
  {
    id: 'tense_spirit',
    name: '时态精灵',
    icon: '⏰',
    region: 'region_2',
    description: '时态表示动作发生的时间。掌握时态是英语语法的核心。',
    unlockCondition: '击败时态山脉的BOSS'
  },
  {
    id: 'preposition_spirit',
    name: '介词精灵',
    icon: '📍',
    region: 'region_3',
    description: '介词表示名词/代词与其他词的关系，如 in, on, at, under, behind。',
    unlockCondition: '完成介词语法塔'
  },
  {
    id: 'therebe_spirit',
    name: 'There be精灵',
    icon: '🌟',
    region: 'region_3',
    description: 'There be 结构用于表示"某处有某物"，是英语中非常常见的句型。',
    unlockCondition: '完成There be语法塔'
  },
  {
    id: 'conjunction_spirit',
    name: '连词精灵',
    icon: '🔗',
    region: 'region_3',
    description: '连词用于连接单词、短语或句子，如 and, but, or, so, because。',
    unlockCondition: '击败句法城堡的BOSS'
  },
  {
    id: 'speaking_spirit',
    name: '口语精灵',
    icon: '💬',
    region: 'region_4',
    description: '口语是语言交流的核心。掌握常用表达和情景对话，让英语活起来。',
    unlockCondition: '击败口语小镇的BOSS'
  },
  {
    id: 'king_spirit',
    name: '英语国王精灵',
    icon: '👑',
    region: 'final',
    description: '集齐所有精灵后召唤的终极精灵，代表对英语语法体系的全面掌握。',
    unlockCondition: '集齐前8个精灵后自动解锁'
  }
];

/**
 * 根据精灵ID获取精灵配置
 * @param {string} spiritId - 精灵ID
 * @returns {object|undefined} 精灵配置对象
 */
export function getSpirit(spiritId) {
  return englishSpiritsConfig.find(s => s.id === spiritId);
}

/**
 * 获取所有精灵配置
 * @returns {object[]} 精灵配置数组
 */
export function getAllSpirits() {
  return englishSpiritsConfig;
}

/**
 * 根据区域ID获取该区域的精灵列表
 * @param {string} regionId - 区域ID
 * @returns {object[]} 精灵配置数组
 */
export function getSpiritsByRegion(regionId) {
  return englishSpiritsConfig.filter(s => s.region === regionId);
}

/**
 * 获取精灵总数
 * @returns {number} 精灵总数
 */
export function getTotalSpiritCount() {
  return englishSpiritsConfig.length;
}

export default englishSpiritsConfig;
