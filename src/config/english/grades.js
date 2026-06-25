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
      { en: 'nose', cn: '鼻子', category: 'body', difficulty: 1 },
      // 常见短语（Level 1）
      { en: 'good morning', cn: '早上好', category: 'phrase', difficulty: 1, phrase: 'Good morning!', sentence: 'Good morning, teacher!' },
      { en: 'good night', cn: '晚安', category: 'phrase', difficulty: 1, phrase: 'Good night!', sentence: 'Good night, Mom.' },
      { en: 'thank you', cn: '谢谢', category: 'phrase', difficulty: 1, phrase: 'Thank you!', sentence: 'Thank you very much.' },
      { en: 'hello', cn: '你好', category: 'phrase', difficulty: 1, phrase: 'Hello!', sentence: 'Hello, my name is Tom.' },
      { en: 'goodbye', cn: '再见', category: 'phrase', difficulty: 1, phrase: 'Goodbye!', sentence: 'Goodbye, see you tomorrow.' },
      { en: 'yes', cn: '是的', category: 'phrase', difficulty: 1, phrase: 'Yes.', sentence: 'Yes, I can.' },
      { en: 'no', cn: '不', category: 'phrase', difficulty: 1, phrase: 'No.', sentence: 'No, I don\'t.' },
      { en: 'sorry', cn: '对不起', category: 'phrase', difficulty: 1, phrase: 'Sorry.', sentence: 'Sorry, I\'m late.' }
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
      { en: 'game', cn: '游戏', category: 'toy', difficulty: 2 },
      // 常见短语（Level 2）
      { en: 'excuse me', cn: '打扰一下', category: 'phrase', difficulty: 2, phrase: 'Excuse me.', sentence: 'Excuse me, where is the park?' },
      { en: 'come in', cn: '请进', category: 'phrase', difficulty: 2, phrase: 'Come in, please.', sentence: 'Come in and sit down.' },
      { en: 'sit down', cn: '坐下', category: 'phrase', difficulty: 2, phrase: 'Sit down, please.', sentence: 'Please sit down.' },
      { en: 'stand up', cn: '起立', category: 'phrase', difficulty: 2, phrase: 'Stand up!', sentence: 'Stand up, please.' },
      { en: 'well done', cn: '做得好', category: 'phrase', difficulty: 2, phrase: 'Well done!', sentence: 'Well done, you got it right!' },
      { en: 'you are welcome', cn: '不客气', category: 'phrase', difficulty: 2, phrase: 'You\'re welcome.', sentence: 'Thank you! — You\'re welcome.' },
      { en: 'see you', cn: '再见', category: 'phrase', difficulty: 2, phrase: 'See you!', sentence: 'See you tomorrow!' },
      { en: 'here you are', cn: '给你', category: 'phrase', difficulty: 2, phrase: 'Here you are.', sentence: 'Here you are, your book.' }
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
      { en: 'yesterday', cn: '昨天', category: 'time', difficulty: 3 },
      // 时间类短语
      { en: 'at noon', cn: '在中午', category: 'time_phrase', difficulty: 3, phrase: 'at noon', sentence: 'We have lunch at noon.' },
      { en: 'at night', cn: '在晚上', category: 'time_phrase', difficulty: 3, phrase: 'at night', sentence: 'I go to bed at night.' },
      { en: 'in the morning', cn: '在早上', category: 'time_phrase', difficulty: 3, phrase: 'in the morning', sentence: 'I read books in the morning.' },
      { en: 'every day', cn: '每天', category: 'time_phrase', difficulty: 3, phrase: 'every day', sentence: 'I go to school every day.' },
      // 方位类短语
      { en: 'next to', cn: '在旁边', category: 'direction_phrase', difficulty: 3, phrase: 'next to', sentence: 'The school is next to the park.' },
      { en: 'in front of', cn: '在前面', category: 'direction_phrase', difficulty: 3, phrase: 'in front of', sentence: 'There is a tree in front of the house.' }
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
      { en: 'proud', cn: '自豪的', category: 'emotion', difficulty: 4 },
      // 情感类短语
      { en: 'have fun', cn: '玩得开心', category: 'emotion_phrase', difficulty: 4, phrase: 'have fun', sentence: 'Have fun at the party!' },
      { en: 'take care', cn: '保重', category: 'emotion_phrase', difficulty: 4, phrase: 'take care', sentence: 'Take care of yourself.' },
      { en: 'cheer up', cn: '振作起来', category: 'emotion_phrase', difficulty: 4, phrase: 'cheer up', sentence: 'Cheer up! Everything will be fine.' },
      // 方位类短语扩展
      { en: 'behind', cn: '在后面', category: 'direction', difficulty: 4, phrase: 'behind', sentence: 'The cat is behind the door.' },
      { en: 'between', cn: '在之间', category: 'direction', difficulty: 4, phrase: 'between', sentence: 'The book is between the pens.' },
      { en: 'under', cn: '在下面', category: 'direction', difficulty: 4, phrase: 'under', sentence: 'The ball is under the chair.' },
      { en: 'on the left', cn: '在左边', category: 'direction_phrase', difficulty: 4, phrase: 'on the left', sentence: 'The library is on the left.' },
      { en: 'on the right', cn: '在右边', category: 'direction_phrase', difficulty: 4, phrase: 'on the right', sentence: 'The hospital is on the right.' }
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
      { en: 'all right', cn: '好的', category: 'idiom', difficulty: 5 },
      // 抽象概念扩展
      { en: 'wisdom', cn: '智慧', category: 'abstract', difficulty: 5, sentence: 'Knowledge comes from learning, wisdom comes from life.' },
      { en: 'justice', cn: '正义', category: 'abstract', difficulty: 5, sentence: 'Everyone deserves justice.' },
      { en: 'patience', cn: '耐心', category: 'abstract', difficulty: 5, sentence: 'You need patience to learn a language.' },
      { en: 'confidence', cn: '自信', category: 'abstract', difficulty: 5, sentence: 'She has great confidence in her English.' },
      // 复合词扩展
      { en: 'schoolbag', cn: '书包', category: 'compound', difficulty: 5, sentence: 'I put my books in my schoolbag.' },
      { en: 'classroom', cn: '教室', category: 'compound', difficulty: 5, sentence: 'Our classroom is on the second floor.' },
      { en: 'playground', cn: '操场', category: 'compound', difficulty: 5, sentence: 'The children are playing on the playground.' },
      { en: 'everyone', cn: '每个人', category: 'compound', difficulty: 5, sentence: 'Everyone in our class likes English.' },
      // 惯用语扩展
      { en: 'once upon a time', cn: '从前', category: 'idiom', difficulty: 5, phrase: 'once upon a time', sentence: 'Once upon a time, there was a princess...' },
      { en: 'as usual', cn: '像往常一样', category: 'idiom', difficulty: 5, phrase: 'as usual', sentence: 'He arrived late as usual.' },
      { en: 'in a hurry', cn: '匆忙', category: 'idiom', difficulty: 5, phrase: 'in a hurry', sentence: 'She left in a hurry.' },
      { en: 'by the way', cn: '顺便说一下', category: 'idiom', difficulty: 5, phrase: 'by the way', sentence: 'By the way, do you like music?' }
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
      { en: 'on the other hand', cn: '另一方面', category: 'sentence', difficulty: 6 },
      // 学术词汇扩展
      { en: 'discovery', cn: '发现', category: 'academic', difficulty: 6, sentence: 'This discovery changed the world.' },
      { en: 'invention', cn: '发明', category: 'academic', difficulty: 6, sentence: 'The invention of the internet changed everything.' },
      { en: 'knowledge', cn: '知识', category: 'academic', difficulty: 6, sentence: 'Knowledge is power.' },
      { en: 'achievement', cn: '成就', category: 'academic', difficulty: 6, sentence: 'This is a great achievement.' },
      { en: 'responsibility', cn: '责任', category: 'academic', difficulty: 6, sentence: 'We have a responsibility to protect nature.' },
      // 惯用语/抽象扩展
      { en: 'in my opinion', cn: '在我看来', category: 'sentence', difficulty: 6, phrase: 'in my opinion', sentence: 'In my opinion, English is very useful.' },
      { en: 'as a result', cn: '因此', category: 'sentence', difficulty: 6, phrase: 'as a result', sentence: 'He studied hard. As a result, he passed the exam.' },
      { en: 'in conclusion', cn: '总之', category: 'sentence', difficulty: 6, phrase: 'in conclusion', sentence: 'In conclusion, we should practice every day.' },
      { en: 'first of all', cn: '首先', category: 'sentence', difficulty: 6, phrase: 'first of all', sentence: 'First of all, let me introduce myself.' },
      { en: 'more importantly', cn: '更重要的是', category: 'sentence', difficulty: 6, phrase: 'more importantly', sentence: 'More importantly, you need to enjoy learning.' },
      { en: 'on the contrary', cn: '相反', category: 'sentence', difficulty: 6, phrase: 'on the contrary', sentence: 'I\'m not tired. On the contrary, I feel great.' }
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
