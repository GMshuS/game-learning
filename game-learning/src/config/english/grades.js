/**
 * 英语等级配置 - 定义各等级的词汇表
 */
export const englishGradesConfig = {
  1: {
    name: 'Level 1',
    theme: '颜色·数字·动物·家庭·身体',
    words: [
      // 颜色
      { en: 'red', cn: '红色', category: 'color', difficulty: 1 },
      { en: 'blue', cn: '蓝色', category: 'color', difficulty: 1 },
      { en: 'green', cn: '绿色', category: 'color', difficulty: 1 },
      { en: 'yellow', cn: '黄色', category: 'color', difficulty: 1 },
      { en: 'white', cn: '白色', category: 'color', difficulty: 1 },
      // 数字
      { en: 'one', cn: '一', category: 'number', difficulty: 1 },
      { en: 'two', cn: '二', category: 'number', difficulty: 1 },
      { en: 'three', cn: '三', category: 'number', difficulty: 1 },
      { en: 'four', cn: '四', category: 'number', difficulty: 1 },
      { en: 'five', cn: '五', category: 'number', difficulty: 1 },
      // 动物
      { en: 'cat', cn: '猫', category: 'animal', difficulty: 1 },
      { en: 'dog', cn: '狗', category: 'animal', difficulty: 1 },
      { en: 'bird', cn: '鸟', category: 'animal', difficulty: 1 },
      { en: 'fish', cn: '鱼', category: 'animal', difficulty: 1 },
      { en: 'rabbit', cn: '兔子', category: 'animal', difficulty: 1 },
      // 家庭
      { en: 'father', cn: '父亲', category: 'family', difficulty: 1 },
      { en: 'mother', cn: '母亲', category: 'family', difficulty: 1 },
      { en: 'brother', cn: '兄弟', category: 'family', difficulty: 1 },
      { en: 'sister', cn: '姐妹', category: 'family', difficulty: 1 },
      { en: 'baby', cn: '宝宝', category: 'family', difficulty: 1 },
      // 身体部位
      { en: 'head', cn: '头', category: 'body', difficulty: 1 },
      { en: 'hand', cn: '手', category: 'body', difficulty: 1 },
      { en: 'eye', cn: '眼睛', category: 'body', difficulty: 1 },
      { en: 'ear', cn: '耳朵', category: 'body', difficulty: 1 },
      { en: 'nose', cn: '鼻子', category: 'body', difficulty: 1 }
    ]
  },

  2: {
    name: 'Level 2',
    theme: '学校·食物·服装·天气·玩具',
    words: [
      // 学校
      { en: 'school', cn: '学校', category: 'school', difficulty: 2 },
      { en: 'teacher', cn: '老师', category: 'school', difficulty: 2 },
      { en: 'student', cn: '学生', category: 'school', difficulty: 2 },
      { en: 'book', cn: '书', category: 'school', difficulty: 2 },
      { en: 'pencil', cn: '铅笔', category: 'school', difficulty: 2 },
      // 食物
      { en: 'apple', cn: '苹果', category: 'food', difficulty: 2 },
      { en: 'bread', cn: '面包', category: 'food', difficulty: 2 },
      { en: 'milk', cn: '牛奶', category: 'food', difficulty: 2 },
      { en: 'egg', cn: '鸡蛋', category: 'food', difficulty: 2 },
      { en: 'rice', cn: '米饭', category: 'food', difficulty: 2 },
      // 服装
      { en: 'shirt', cn: '衬衫', category: 'clothing', difficulty: 2 },
      { en: 'shoes', cn: '鞋子', category: 'clothing', difficulty: 2 },
      { en: 'hat', cn: '帽子', category: 'clothing', difficulty: 2 },
      { en: 'coat', cn: '外套', category: 'clothing', difficulty: 2 },
      { en: 'socks', cn: '袜子', category: 'clothing', difficulty: 2 },
      // 天气
      { en: 'sunny', cn: '晴天', category: 'weather', difficulty: 2 },
      { en: 'rainy', cn: '下雨', category: 'weather', difficulty: 2 },
      { en: 'cloudy', cn: '多云', category: 'weather', difficulty: 2 },
      { en: 'windy', cn: '有风', category: 'weather', difficulty: 2 },
      { en: 'snowy', cn: '下雪', category: 'weather', difficulty: 2 },
      // 玩具
      { en: 'doll', cn: '娃娃', category: 'toy', difficulty: 2 },
      { en: 'ball', cn: '球', category: 'toy', difficulty: 2 },
      { en: 'kite', cn: '风筝', category: 'toy', difficulty: 2 },
      { en: 'toy', cn: '玩具', category: 'toy', difficulty: 2 },
      { en: 'game', cn: '游戏', category: 'toy', difficulty: 2 }
    ]
  },

  3: {
    name: 'Level 3',
    theme: '动词短语·形容词·方位·时间',
    words: [
      // 动词短语
      { en: 'get up', cn: '起床', category: 'verb', difficulty: 3 },
      { en: 'go to school', cn: '上学', category: 'verb', difficulty: 3 },
      { en: 'have dinner', cn: '吃晚饭', category: 'verb', difficulty: 3 },
      { en: 'play football', cn: '踢足球', category: 'verb', difficulty: 3 },
      { en: 'watch TV', cn: '看电视', category: 'verb', difficulty: 3 },
      // 形容词
      { en: 'happy', cn: '高兴的', category: 'adjective', difficulty: 3 },
      { en: 'beautiful', cn: '美丽的', category: 'adjective', difficulty: 3 },
      { en: 'strong', cn: '强壮的', category: 'adjective', difficulty: 3 },
      { en: 'clever', cn: '聪明的', category: 'adjective', difficulty: 3 },
      { en: 'brave', cn: '勇敢的', category: 'adjective', difficulty: 3 },
      // 方位
      { en: 'left', cn: '左边', category: 'direction', difficulty: 3 },
      { en: 'right', cn: '右边', category: 'direction', difficulty: 3 },
      { en: 'front', cn: '前面', category: 'direction', difficulty: 3 },
      { en: 'back', cn: '后面', category: 'direction', difficulty: 3 },
      { en: 'middle', cn: '中间', category: 'direction', difficulty: 3 },
      // 时间
      { en: 'morning', cn: '早晨', category: 'time', difficulty: 3 },
      { en: 'afternoon', cn: '下午', category: 'time', difficulty: 3 },
      { en: 'evening', cn: '傍晚', category: 'time', difficulty: 3 },
      { en: 'today', cn: '今天', category: 'time', difficulty: 3 },
      { en: 'tomorrow', cn: '明天', category: 'time', difficulty: 3 },
      { en: 'yesterday', cn: '昨天', category: 'time', difficulty: 3 }
    ]
  },

  4: {
    name: 'Level 4',
    theme: '职业·交通·自然·情感',
    words: [
      // 职业
      { en: 'doctor', cn: '医生', category: 'occupation', difficulty: 4 },
      { en: 'nurse', cn: '护士', category: 'occupation', difficulty: 4 },
      { en: 'pilot', cn: '飞行员', category: 'occupation', difficulty: 4 },
      { en: 'farmer', cn: '农民', category: 'occupation', difficulty: 4 },
      { en: 'cook', cn: '厨师', category: 'occupation', difficulty: 4 },
      // 交通
      { en: 'bus', cn: '公共汽车', category: 'transport', difficulty: 4 },
      { en: 'train', cn: '火车', category: 'transport', difficulty: 4 },
      { en: 'subway', cn: '地铁', category: 'transport', difficulty: 4 },
      { en: 'airplane', cn: '飞机', category: 'transport', difficulty: 4 },
      { en: 'bicycle', cn: '自行车', category: 'transport', difficulty: 4 },
      // 自然
      { en: 'river', cn: '河流', category: 'nature', difficulty: 4 },
      { en: 'mountain', cn: '山', category: 'nature', difficulty: 4 },
      { en: 'forest', cn: '森林', category: 'nature', difficulty: 4 },
      { en: 'ocean', cn: '海洋', category: 'nature', difficulty: 4 },
      { en: 'island', cn: '岛屿', category: 'nature', difficulty: 4 },
      // 情感
      { en: 'love', cn: '爱', category: 'emotion', difficulty: 4 },
      { en: 'angry', cn: '生气的', category: 'emotion', difficulty: 4 },
      { en: 'sad', cn: '伤心的', category: 'emotion', difficulty: 4 },
      { en: 'excited', cn: '兴奋的', category: 'emotion', difficulty: 4 },
      { en: 'afraid', cn: '害怕的', category: 'emotion', difficulty: 4 },
      { en: 'proud', cn: '自豪的', category: 'emotion', difficulty: 4 }
    ]
  },

  5: {
    name: 'Level 5',
    theme: '抽象概念·复合词·惯用语',
    words: [
      // 抽象概念
      { en: 'freedom', cn: '自由', category: 'abstract', difficulty: 5 },
      { en: 'success', cn: '成功', category: 'abstract', difficulty: 5 },
      { en: 'knowledge', cn: '知识', category: 'abstract', difficulty: 5 },
      { en: 'courage', cn: '勇气', category: 'abstract', difficulty: 5 },
      { en: 'peace', cn: '和平', category: 'abstract', difficulty: 5 },
      { en: 'honesty', cn: '诚实', category: 'abstract', difficulty: 5 },
      // 复合词
      { en: 'sunflower', cn: '向日葵', category: 'compound', difficulty: 5 },
      { en: 'rainbow', cn: '彩虹', category: 'compound', difficulty: 5 },
      { en: 'football', cn: '足球', category: 'compound', difficulty: 5 },
      { en: 'birthday', cn: '生日', category: 'compound', difficulty: 5 },
      { en: 'daylight', cn: '日光', category: 'compound', difficulty: 5 },
      { en: 'notebook', cn: '笔记本', category: 'compound', difficulty: 5 },
      // 惯用语
      { en: 'piece of cake', cn: '小菜一碟', category: 'idiom', difficulty: 5 },
      { en: 'break a leg', cn: '祝好运', category: 'idiom', difficulty: 5 },
      { en: 'let it go', cn: '顺其自然', category: 'idiom', difficulty: 5 },
      { en: 'no pain no gain', cn: '不劳无获', category: 'idiom', difficulty: 5 },
      { en: 'on time', cn: '准时', category: 'idiom', difficulty: 5 },
      { en: 'all right', cn: '好的', category: 'idiom', difficulty: 5 }
    ]
  },

  6: {
    name: 'Level 6',
    theme: '学术词汇·复杂句型',
    words: [
      // 学术词汇
      { en: 'experiment', cn: '实验', category: 'academic', difficulty: 6 },
      { en: 'environment', cn: '环境', category: 'academic', difficulty: 6 },
      { en: 'development', cn: '发展', category: 'academic', difficulty: 6 },
      { en: 'government', cn: '政府', category: 'academic', difficulty: 6 },
      { en: 'education', cn: '教育', category: 'academic', difficulty: 6 },
      { en: 'technology', cn: '技术', category: 'academic', difficulty: 6 },
      { en: 'population', cn: '人口', category: 'academic', difficulty: 6 },
      { en: 'communication', cn: '交流', category: 'academic', difficulty: 6 },
      // 复杂句型
      { en: 'I think that', cn: '我认为', category: 'sentence', difficulty: 6 },
      { en: 'make a decision', cn: '做决定', category: 'sentence', difficulty: 6 },
      { en: 'take part in', cn: '参加', category: 'sentence', difficulty: 6 },
      { en: 'look forward to', cn: '期待', category: 'sentence', difficulty: 6 },
      { en: 'be good at', cn: '擅长', category: 'sentence', difficulty: 6 },
      { en: 'get along with', cn: '与…相处', category: 'sentence', difficulty: 6 },
      { en: 'as soon as', cn: '一…就…', category: 'sentence', difficulty: 6 },
      { en: 'in addition', cn: '此外', category: 'sentence', difficulty: 6 },
      { en: 'on the other hand', cn: '另一方面', category: 'sentence', difficulty: 6 }
    ]
  }
};

/**
 * 根据等级获取词汇列表
 * @param {number} level 英语等级 (1-6)
 * @returns {Array} 词汇数组
 */
export function getWordsByLevel(level) {
  const config = englishGradesConfig[level];
  return config ? config.words : [];
}

/**
 * 根据等级获取等级名
 * @param {number} level
 * @returns {string}
 */
export function getLevelName(level) {
  const config = englishGradesConfig[level];
  return config ? config.name : '';
}
