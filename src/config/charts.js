/**
 * 统计图表 — 图表数据生成器
 * 支持3种图表类型：柱状图、折线图、扇形图
 * 每个图表生成数据 + 3-5个读图问题
 */

/**
 * 获取随机整数 [min, max]
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机打乱数组
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 获取随机主题
 */
function getTheme(grade) {
  const themes = [
    { label: '水果', items: ['苹果', '香蕉', '橘子', '葡萄', '西瓜', '草莓'] },
    { label: '动物', items: ['小狗', '小猫', '小兔', '小鸟', '小鱼'] },
    { label: '颜色', items: ['红色', '蓝色', '黄色', '绿色', '紫色'] },
    { label: '运动', items: ['跑步', '跳绳', '游泳', '篮球', '足球', '乒乓球'] },
    { label: '图书', items: ['故事书', '科普书', '漫画书', '绘本', '字典'] },
    { label: '天气', items: ['晴天', '多云', '雨天', '雪天', '阴天'] }
  ];

  if (grade <= 2) {
    return themes.slice(0, 3)[Math.floor(Math.random() * 3)];
  }
  return themes[Math.floor(Math.random() * themes.length)];
}

/**
 * 柱状图数据生成
 * @param {number} grade - 年级 (1-6)
 * @returns {object} { chartData, questions }
 */
export function generateBarChart(grade) {
  const theme = getTheme(grade);
  const count = grade <= 2 ? randomInt(3, 4) : randomInt(4, 6);
  const items = shuffle(theme.items).slice(0, count);

  // 生成数值
  const maxVal = grade <= 2 ? 20 : grade <= 4 ? 100 : 200;
  const values = items.map(() => randomInt(1, maxVal));

  const chartData = {
    type: 'bar',
    title: `${theme.label}统计图`,
    labels: items,
    values,
    unit: '个'
  };

  const questions = generateBarQuestions(chartData, grade);

  return { chartData, questions };
}

/**
 * 柱状图读图问题生成
 */
function generateBarQuestions(chartData, grade) {
  const { labels, values } = chartData;
  const questions = [];

  // 1. 最多/最少
  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));

  const wrongLabels1 = shuffle(labels.filter((_, i) => i !== maxIdx)).slice(0, 3);
  const choices1 = shuffle([labels[maxIdx], ...wrongLabels1]);
  questions.push({
    question: '哪种' + chartData.title.slice(0, -3) + '最多？',
    answer: labels[maxIdx],
    choices: choices1,
    type: 'bar_max'
  });

  if (grade > 1) {
    const wrongLabels2 = shuffle(labels.filter((_, i) => i !== minIdx)).slice(0, 3);
    const choices2 = shuffle([labels[minIdx], ...wrongLabels2]);
    questions.push({
      question: '哪种' + chartData.title.slice(0, -3) + '最少？',
      answer: labels[minIdx],
      choices: choices2,
      type: 'bar_min'
    });
  }

  // 3. 数量之和
  if (grade >= 2) {
    const indices = shuffle([...Array(labels.length).keys()]).slice(0, 2);
    const sum = indices.reduce((acc, i) => acc + values[i], 0);
    const wrongSums = generateWrongOptions(sum, 3);
    const choices3 = shuffle([sum, ...wrongSums]);
    questions.push({
      question: `${labels[indices[0]]}和${labels[indices[1]]}一共有多少个？`,
      answer: sum,
      choices: choices3,
      type: 'bar_sum'
    });
  }

  // 4. 数量差
  if (grade >= 3 && maxIdx !== minIdx) {
    const diff = values[maxIdx] - values[minIdx];
    const wrongDiffs = generateWrongOptions(diff, 3);
    const choices4 = shuffle([diff, ...wrongDiffs]);
    questions.push({
      question: `${labels[maxIdx]}比${labels[minIdx]}多多少个？`,
      answer: diff,
      choices: choices4,
      type: 'bar_diff'
    });
  }

  // 5. 求总数
  if (grade >= 3) {
    const total = values.reduce((acc, v) => acc + v, 0);
    const wrongTotals = generateWrongOptions(total, 3);
    const choices5 = shuffle([total, ...wrongTotals]);
    questions.push({
      question: chartData.title + '一共有多少个？',
      answer: total,
      choices: choices5,
      type: 'bar_total'
    });
  }

  return questions.slice(0, 5);
}

/**
 * 折线图数据生成
 * @param {number} grade - 年级
 * @returns {object} { chartData, questions }
 */
export function generateLineChart(grade) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const useMonths = grade <= 2 ? months.slice(0, 4) : grade <= 4 ? months.slice(0, 6) : months.slice(0, 8);
  const count = useMonths.length;

  // 生成趋势数据
  let base = randomInt(10, grade <= 2 ? 50 : 100);
  const values = [];
  for (let i = 0; i < count; i++) {
    base += randomInt(-10, 15);
    base = Math.max(0, base);
    values.push(base);
  }

  const chartData = {
    type: 'line',
    title: '气温变化统计图',
    labels: useMonths,
    values,
    unit: '°C'
  };

  const questions = generateLineQuestions(chartData, grade);

  return { chartData, questions };
}

/**
 * 折线图读图问题
 */
function generateLineQuestions(chartData, grade) {
  const { labels, values } = chartData;
  const questions = [];

  // 1. 最高/最低
  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));

  questions.push({
    question: '哪个月份气温最高？',
    answer: labels[maxIdx],
    choices: shuffle([...labels]),
    type: 'line_max'
  });

  if (grade > 1) {
    questions.push({
      question: '哪个月份气温最低？',
      answer: labels[minIdx],
      choices: shuffle([...labels]),
      type: 'line_min'
    });
  }

  // 3. 上升还是下降（趋势）
  if (grade >= 2) {
    const startVal = values[0];
    const endVal = values[values.length - 1];
    const trend = endVal > startVal ? '上升' : '下降';
    const wrongTrends = shuffle(['上升', '下降', '不变'].filter(t => t !== trend)).slice(0, 2);
    const choices3 = shuffle([trend, ...wrongTrends]);
    questions.push({
      question: `从${labels[0]}到${labels[labels.length - 1]}，气温总体呈什么趋势？`,
      answer: trend,
      choices: choices3,
      type: 'line_trend'
    });
  }

  // 4. 变化最大区间
  if (grade >= 3) {
    const diffs = [];
    for (let i = 1; i < values.length; i++) {
      diffs.push({ from: labels[i - 1], to: labels[i], diff: Math.abs(values[i] - values[i - 1]) });
    }
    diffs.sort((a, b) => b.diff - a.diff);
    const maxDiff = diffs[0];
    const wrongPeriods = shuffle(diffs.filter(d => d.from !== maxDiff.from)).slice(0, 2).map(d => `${d.from}→${d.to}`);
    const correctPeriod = `${maxDiff.from}→${maxDiff.to}`;
    const choices4 = shuffle([correctPeriod, ...wrongPeriods]);
    questions.push({
      question: '哪两个月之间气温变化最大？',
      answer: correctPeriod,
      choices: choices4,
      type: 'line_maxChange'
    });
  }

  return questions.slice(0, 5);
}

/**
 * 扇形图数据生成
 * @param {number} grade - 年级
 * @returns {object} { chartData, questions }
 */
export function generatePieChart(grade) {
  const theme = getTheme(grade);
  const count = grade <= 2 ? randomInt(3, 4) : randomInt(4, 5);
  const items = shuffle(theme.items).slice(0, count);

  // 生成百分比（确保总和为100）
  let remaining = 100;
  const values = [];
  for (let i = 0; i < count - 1; i++) {
    const maxVal = Math.floor(remaining / (count - i) * 1.5);
    const minVal = Math.floor(remaining / (count - i) * 0.5);
    const v = randomInt(Math.max(5, minVal), Math.min(remaining - (count - i - 1), maxVal));
    values.push(v);
    remaining -= v;
  }
  values.push(remaining);

  // 为每个项目计算角度
  const angles = values.map(v => Math.round(v * 3.6 * 10) / 10);

  const chartData = {
    type: 'pie',
    title: `${theme.label}占比统计图`,
    labels: items,
    values,
    angles,
    unit: '%',
    total: 100
  };

  const questions = generatePieQuestions(chartData, grade);

  return { chartData, questions };
}

/**
 * 扇形图读图问题
 */
function generatePieQuestions(chartData, grade) {
  const { labels, values } = chartData;
  const questions = [];

  // 1. 占比最大
  const maxIdx = values.indexOf(Math.max(...values));
  const wrongMax = shuffle(labels.filter((_, i) => i !== maxIdx)).slice(0, 3);
  const choices1 = shuffle([labels[maxIdx], ...wrongMax]);
  questions.push({
    question: '哪种' + chartData.title.slice(0, -4) + '占比最大？',
    answer: labels[maxIdx],
    choices: choices1,
    type: 'pie_largest'
  });

  // 2. 具体数值
  if (grade >= 2) {
    const askIdx = Math.floor(Math.random() * labels.length);
    const wrongVals = generateWrongOptions(values[askIdx], 3);
    const choices2 = shuffle([values[askIdx], ...wrongVals]);
    questions.push({
      question: `${labels[askIdx]}占整体的百分之多少？`,
      answer: `${values[askIdx]}%`,
      choices: choices2.map(v => typeof v === 'number' ? `${v}%` : v),
      type: 'pie_value'
    });
  }

  // 3. 两者之和
  if (grade >= 3) {
    const indices = shuffle([...Array(labels.length).keys()]).slice(0, 2);
    const sum = values[indices[0]] + values[indices[1]];
    const wrongSums = generateWrongOptions(sum, 3);
    const choices3 = shuffle([`${sum}%`, ...wrongSums.map(v => `${v}%`)]);
    questions.push({
      question: `${labels[indices[0]]}和${labels[indices[1]]}共占总体的百分之多少？`,
      answer: `${sum}%`,
      choices: choices3,
      type: 'pie_sum'
    });
  }

  // 4. 超过一半？
  if (grade >= 4) {
    const halfIdx = values.findIndex(v => v > 50);
    if (halfIdx >= 0) {
      questions.push({
        question: `${labels[halfIdx]}的占比是否超过了一半？`,
        answer: '是',
        choices: shuffle(['是', '否', '刚好一半']),
        type: 'pie_half'
      });
    }
  }

  return questions.slice(0, 5);
}

/**
 * 生成错误选项
 */
function generateWrongOptions(correct, count) {
  const pool = new Set();
  pool.add(correct + randomInt(1, 5));
  pool.add(Math.max(1, correct - randomInt(1, 5)));
  pool.add(correct * 2);
  pool.add(Math.round(correct / 2));
  pool.add(correct + randomInt(10, 20));

  pool.delete(correct);
  return Array.from(pool).filter(n => n > 0).slice(0, count);
}

/**
 * 根据年级生成图表数据
 * @param {number} grade - 年级 (1-6)
 * @param {string} type - 'bar' | 'line' | 'pie' 或空（随机）
 * @returns {object}
 */
export function generateChart(grade, type) {
  if (!type) {
    const types = ['bar', 'line', 'pie'];
    // 低年级以柱状图为主
    if (grade <= 2) {
      type = Math.random() < 0.7 ? 'bar' : 'pie';
    } else {
      type = types[Math.floor(Math.random() * types.length)];
    }
  }

  switch (type) {
    case 'bar':
      return generateBarChart(grade);
    case 'line':
      return generateLineChart(grade);
    case 'pie':
      return generatePieChart(grade);
    default:
      return generateBarChart(grade);
  }
}

export default {
  generateChart,
  generateBarChart,
  generateLineChart,
  generatePieChart
};
