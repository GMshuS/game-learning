/**
 * Phaser 概率模拟场景 — 可视化概率实验
 * 支持4种实验：掷骰子、抽球、抛硬币、转盘
 * 通过 init(data) 接收实验参数
 */
import Phaser from 'phaser';
import { simulateMultiple, getExperimentConfig } from '../config/probability';

export default class ProbabilityScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ProbabilityScene' });

    this.experimentId = 'dice';
    this.params = {};
    this.results = [];
    this.stats = {};
    this.simulating = false;
    this.currentTrial = 0;
    this.totalTrials = 0;
    this._timeoutIds = [];
    this._destroyed = false;
    this.onSimulationEnd = null;
  }

  /**
   * 安全的 setTimeout
   */
  _setTimeout(fn, delay) {
    const id = setTimeout(() => {
      this._timeoutIds = this._timeoutIds.filter(t => t !== id);
      if (this._destroyed) return;
      if (this.scene?.isActive()) fn();
    }, delay);
    this._timeoutIds.push(id);
    return id;
  }

  cleanup() {
    this._destroyed = true;
    this._timeoutIds.forEach(id => clearTimeout(id));
    this._timeoutIds = [];
  }

  /**
   * 接收外部数据
   * @param {object} data
   * @param {string} data.experimentId - 实验ID
   * @param {object} data.params - 实验参数
   * @param {number} data.params.trials - 模拟次数
   * @param {function} data.onSimulationEnd - 模拟结束回调
   */
  init(data) {
    this.experimentId = data.experimentId || 'dice';
    this.params = data.params || {};
    this.totalTrials = this.params.trials || 20;
    this.onSimulationEnd = data.onSimulationEnd || null;
    this.currentTrial = 0;
    this.results = [];
    this.stats = {};
    this.simulating = false;

    // 立即执行模拟
    const result = simulateMultiple(this.experimentId, this.params, this.totalTrials);
    this.results = result.results;
    this.stats = result.stats;
  }

  create() {
    this.events.on('shutdown', this.cleanup, this);
    this.events.on('destroy', this.cleanup, this);

    const { width, height } = this.scale;

    // 创建背景
    this.createBackground(width, height);

    // 创建实验标题
    this.createTitle(width);

    // 创建实验展示区
    this.createExperimentDisplay(width, height);

    // 创建统计面板
    this.createStatsPanel(width, height);

    // 创建结果柱状图
    this.createBarChart(width, height);

    // 启动逐次模拟动画
    this._setTimeout(() => {
      this.startSimulation();
    }, 500);
  }

  /**
   * 创建背景
   */
  createBackground(width, height) {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);

    // 装饰圆点
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      this.add.circle(x, y, Math.random() * 2 + 1, 0xffffff, Math.random() * 0.3 + 0.1);
    }
  }

  /**
   * 创建标题
   */
  createTitle(width) {
    const expConfig = getExperimentConfig(this.experimentId);
    const title = expConfig ? `${expConfig.icon} ${expConfig.name}` : '概率实验';
    this.add.text(width / 2, 30, title, {
      font: 'bold 28px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#667eea',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, 60, `模拟 ${this.totalTrials} 次`, {
      font: '16px Microsoft YaHei',
      color: '#94a3b8'
    }).setOrigin(0.5);

    this.trialText = this.add.text(width / 2, 85, '准备开始...', {
      font: '14px Microsoft YaHei',
      color: '#fbbf24'
    }).setOrigin(0.5);
  }

  /**
   * 创建实验展示区（可视化动画区域）
   */
  createExperimentDisplay(width, height) {
    const displayX = width / 2;
    const displayY = height * 0.28;

    // 展示区背景圆
    const bgCircle = this.add.circle(displayX, displayY, 80, 0x2d3748);
    bgCircle.setStrokeStyle(2, 0x4a5568);

    // 根据不同实验类型创建不同的展示元素
    this.displayContainer = this.add.container(displayX, displayY);

    switch (this.experimentId) {
      case 'dice':
        this.createDiceDisplay();
        break;
      case 'ball':
        this.createBallDisplay();
        break;
      case 'coin':
        this.createCoinDisplay();
        break;
      case 'spinner':
        this.createSpinnerDisplay();
        break;
    }
  }

  /**
   * 骰子显示
   */
  createDiceDisplay() {
    // 骰子主体（圆角方形用普通矩形模拟）
    const size = 70;
    const diceBg = this.add.graphics();
    diceBg.fillStyle(0xffffff, 1);
    diceBg.fillRoundedRect(-size / 2, -size / 2, size, size, 12);
    diceBg.lineStyle(3, 0x1e293b);
    diceBg.strokeRoundedRect(-size / 2, -size / 2, size, size, 12);
    this.displayContainer.add(diceBg);

    // 骰子点数
    this.diceText = this.add.text(0, 0, '?', {
      font: 'bold 36px Arial',
      color: '#1e293b'
    }).setOrigin(0.5);
    this.displayContainer.add(this.diceText);

    // 提示文字
    this.add.text(this.displayContainer.x, this.displayContainer.y + 95, '点击"开始模拟"观察结果', {
      font: '12px Microsoft YaHei',
      color: '#94a3b8'
    }).setOrigin(0.5);
  }

  /**
   * 抽球显示
   */
  createBallDisplay() {
    // 袋子
    const bagGraphics = this.add.graphics();
    bagGraphics.fillStyle(0x8b5cf6, 1);
    bagGraphics.fillRoundedRect(-45, -30, 90, 60, 20);
    bagGraphics.lineStyle(3, 0x7c3aed);
    bagGraphics.strokeRoundedRect(-45, -30, 90, 60, 20);
    this.displayContainer.add(bagGraphics);

    // 袋子开口
    const openGraphics = this.add.graphics();
    openGraphics.lineStyle(3, 0x7c3aed);
    openGraphics.beginPath();
    openGraphics.moveTo(-25, -30);
    openGraphics.lineTo(0, -45);
    openGraphics.lineTo(25, -30);
    openGraphics.strokePath();
    this.displayContainer.add(openGraphics);

    // 抽出球的显示
    this.ballResult = this.add.circle(0, -70, 18, 0xcccccc);
    this.ballResult.setStrokeStyle(2, 0xffffff);
    this.displayContainer.add(this.ballResult);

    this.ballResultText = this.add.text(0, -70, '?', {
      font: 'bold 14px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.displayContainer.add(this.ballResultText);
  }

  /**
   * 硬币显示
   */
  createCoinDisplay() {
    // 硬币
    const coinBg = this.add.circle(0, 0, 45, 0xfbbf24);
    coinBg.setStrokeStyle(3, 0xd97706);
    this.displayContainer.add(coinBg);

    // 硬币内部圆
    const innerCircle = this.add.circle(0, 0, 35, 0xf59e0b);
    innerCircle.setStrokeStyle(1, 0xd97706);
    this.displayContainer.add(innerCircle);

    // 硬币文字
    this.coinText = this.add.text(0, 0, '?', {
      font: 'bold 28px Microsoft YaHei',
      color: '#92400e'
    }).setOrigin(0.5);
    this.displayContainer.add(this.coinText);
  }

  /**
   * 转盘显示
   */
  createSpinnerDisplay() {
    const expConfig = getExperimentConfig(this.experimentId);
    const sectors = this.params.sectors || (expConfig ? expConfig.defaultParams.sectors : 8);
    const radius = 65;

    // 绘制转盘
    const spinnerGraphics = this.add.graphics();
    const angleStep = (Math.PI * 2) / sectors;

    for (let i = 0; i < sectors; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;

      spinnerGraphics.fillStyle(expConfig.outcomeColors[i % expConfig.outcomeColors.length], 1);
      spinnerGraphics.beginPath();
      spinnerGraphics.moveTo(0, 0);
      spinnerGraphics.arc(0, 0, radius, startAngle, endAngle, false);
      spinnerGraphics.closePath();
      spinnerGraphics.fillPath();
    }

    // 外圈边框
    spinnerGraphics.lineStyle(3, 0xffffff);
    spinnerGraphics.strokeCircle(0, 0, radius);

    // 中心圆
    spinnerGraphics.fillStyle(0xffffff, 1);
    spinnerGraphics.fillCircle(0, 0, 10);
    spinnerGraphics.lineStyle(2, 0x333333);
    spinnerGraphics.strokeCircle(0, 0, 10);

    this.displayContainer.add(spinnerGraphics);

    // 指针（三角形）
    this.pointer = this.add.triangle(0, -radius - 10, 0, -10, -8, 0, 8, 0, 0xef4444);
    this.displayContainer.add(this.pointer);

    // 当前扇区标签
    this.sectorText = this.add.text(0, radius + 20, '', {
      font: '12px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.displayContainer.add(this.sectorText);
  }

  /**
   * 创建统计面板
   */
  createStatsPanel(width, height) {
    const panelX = width / 2;
    const panelY = height * 0.52;
    const panelWidth = width * 0.85;

    // 面板背景
    const panelBg = this.add.rectangle(panelX, panelY, panelWidth, 50, 0x2d3748, 0.8);
    panelBg.setStrokeStyle(1, 0x4a5568);

    // 统计文字
    this.statsText = this.add.text(panelX, panelY, '模拟结果统计', {
      font: '13px Microsoft YaHei',
      color: '#94a3b8'
    }).setOrigin(0.5);
  }

  /**
   * 创建柱状图
   */
  createBarChart(width, height) {
    const chartX = width * 0.1;
    const chartY = height * 0.58;
    const chartWidth = width * 0.8;
    const chartHeight = height * 0.3;

    // 图表背景
    const chartBg = this.add.rectangle(
      chartX + chartWidth / 2,
      chartY + chartHeight / 2,
      chartWidth,
      chartHeight,
      0x1e293b,
      0.6
    );
    chartBg.setStrokeStyle(1, 0x4a5568);

    this.chartData = { chartX, chartY, chartWidth, chartHeight };
    this.barContainer = this.add.container(0, 0);
  }

  /**
   * 更新统计面板
   */
  updateStats() {
    const statLines = Object.entries(this.stats)
      .map(([label, data]) => {
        const pct = (data.frequency * 100).toFixed(1);
        const theoreticalPct = (data.theoreticalProb * 100).toFixed(1);
        return `${label}: ${data.count}次 (${pct}%) [理论: ${theoreticalPct}%]`;
      })
      .join('  |  ');

    if (this.statsText) {
      this.statsText.setText(statLines);
    }
  }

  /**
   * 更新柱状图
   */
  updateBarChart() {
    // 清除旧柱状图
    this.barContainer.removeAll(true);

    const entries = Object.entries(this.stats);
    if (entries.length === 0) return;

    const { chartX, chartY, chartWidth, chartHeight } = this.chartData;
    const barPadding = 10;
    const barAreaWidth = chartWidth - 20;
    const barWidth = Math.min(40, (barAreaWidth - barPadding * (entries.length - 1)) / entries.length);
    const totalWidth = entries.length * barWidth + (entries.length - 1) * barPadding;
    const startX = chartX + (chartWidth - totalWidth) / 2 + barWidth / 2;
    const maxCount = Math.max(...entries.map(([, d]) => d.count), 1);
    const barMaxHeight = chartHeight - 40;

    const expConfig = getExperimentConfig(this.experimentId);

    entries.forEach(([label, data], index) => {
      const x = startX + index * (barWidth + barPadding);
      const barHeight = Math.max(5, (data.count / maxCount) * barMaxHeight);
      const y = chartY + chartHeight - 20 - barHeight;

      // 柱体
      const color = expConfig ? expConfig.outcomeColors[index % expConfig.outcomeColors.length] : 0x667eea;
      const bar = this.add.rectangle(x, y, barWidth - 4, barHeight, color, 0.8);
      bar.setOrigin(0.5, 0);
      this.barContainer.add(bar);

      // 数值标签
      const countText = this.add.text(x, y - 2, String(data.count), {
        font: 'bold 11px Arial',
        color: '#ffffff'
      }).setOrigin(0.5, 1);
      this.barContainer.add(countText);

      // 底部标签
      const labelText = this.add.text(x, chartY + chartHeight - 12, label, {
        font: '10px Microsoft YaHei',
        color: '#94a3b8'
      }).setOrigin(0.5, 1);
      this.barContainer.add(labelText);

      // 理论概率线
      if (data.theoreticalProb > 0) {
        const theoryY = chartY + chartHeight - 20 - (data.theoreticalProb / (maxCount / this.totalTrials));
        if (theoryY > chartY + 10) {
          const line = this.add.graphics();
          line.lineStyle(1, 0xffffff, 0.4);
          line.beginPath();
          line.moveTo(x - barWidth / 2, theoryY);
          line.lineTo(x + barWidth / 2, theoryY);
          line.strokePath();
          this.barContainer.add(line);
        }
      }
    });
  }

  /**
   * 开始逐次模拟动画
   */
  startSimulation() {
    if (this.simulating) return;
    this.simulating = true;
    this.currentTrial = 0;

    // 显示当前实验过程的临时结果
    const tempResults = {};
    const totalResults = this.results;

    // 清除旧的柱状图数据
    this.barContainer.removeAll(true);

    // 动画循环：每次显示一个结果
    const animateTrial = () => {
      if (this._destroyed) return;
      if (this.currentTrial >= this.totalTrials) {
        this.simulating = false;
        this.trialText.setText(`模拟完成！共 ${this.totalTrials} 次`);
        if (this.onSimulationEnd) {
          this.onSimulationEnd({ results: this.results, stats: this.stats });
        }
        return;
      }

      const result = totalResults[this.currentTrial];
      this.currentTrial++;

      // 更新实验展示
      this.updateExperimentDisplay(result);

      // 更新临时统计
      const label = this.getResultLabel(result);
      tempResults[label] = (tempResults[label] || 0) + 1;

      // 更新柱状图（显示进行中的统计）
      this.updateBarChartProgress(tempResults, this.currentTrial);

      // 更新统计面板（简化版，只显示进行中的频次）
      this.updateStatsProgress(tempResults, this.currentTrial);

      // 更新进度文字
      this.trialText.setText(`正在模拟... ${this.currentTrial}/${this.totalTrials}`);

      // 延迟后模拟下一次
      const delay = this.currentTrial < 10 ? 300 : this.currentTrial < 30 ? 150 : 50;
      this._setTimeout(animateTrial, delay);
    };

    animateTrial();
  }

  /**
   * 获取结果标签
   */
  getResultLabel(result) {
    const expConfig = getExperimentConfig(this.experimentId);
    if (!expConfig) return String(result);

    switch (this.experimentId) {
      case 'dice':
        return `${result}点`;
      case 'ball': {
        const labels = { red: '红色', blue: '蓝色', green: '绿色', yellow: '黄色' };
        return labels[result] || String(result);
      }
      case 'coin':
        return result === 'heads' ? '正面' : '反面';
      case 'spinner': {
        const spinnerLabels = ['红', '蓝', '绿', '黄', '紫', '橙', '青', '粉'];
        return spinnerLabels[result] || String(result);
      }
      default:
        return String(result);
    }
  }

  /**
   * 更新实验展示区
   */
  updateExperimentDisplay(result) {
    switch (this.experimentId) {
      case 'dice':
        if (this.diceText) {
          this.diceText.setText(String(result));
        }
        break;
      case 'ball': {
        const colors = { red: 0xef4444, blue: 0x3b82f6, green: 0x22c55e, yellow: 0xfbbf24 };
        const labels = { red: '红', blue: '蓝', green: '绿', yellow: '黄' };
        if (this.ballResult) {
          this.ballResult.setFillStyle(colors[result] || 0xcccccc);
        }
        if (this.ballResultText) {
          this.ballResultText.setText(labels[result] || '?');
        }
        break;
      }
      case 'coin':
        if (this.coinText) {
          this.coinText.setText(result === 'heads' ? '正' : '反');
          // 微旋转动画
          this.displayContainer.setAngle(Math.random() * 20 - 10);
          this._setTimeout(() => {
            if (!this._destroyed) {
              this.displayContainer.setAngle(0);
            }
          }, 200);
        }
        break;
      case 'spinner': {
        const expConfig = getExperimentConfig(this.experimentId);
        if (expConfig && this.pointer) {
          const sectors = this.params.sectors || expConfig.defaultParams.sectors;
          const angle = (result / sectors) * 360;
          this.pointer.setAngle(angle);
        }
        if (this.sectorText) {
          const spinnerLabels = ['红', '蓝', '绿', '黄', '紫', '橙', '青', '粉'];
          const label = spinnerLabels[result] || String(result);
          this.sectorText.setText(label);
        }
        break;
      }
    }
  }

  /**
   * 更新柱状图（进行中）
   */
  updateBarChartProgress(tempResults, currentCount) {
    this.barContainer.removeAll(true);

    const entries = Object.entries(tempResults).sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'));
    if (entries.length === 0) return;

    const { chartX, chartY, chartWidth, chartHeight } = this.chartData;
    const barPadding = 10;
    const barAreaWidth = chartWidth - 20;
    const barWidth = Math.min(40, (barAreaWidth - barPadding * (entries.length - 1)) / entries.length);
    const totalWidth = entries.length * barWidth + (entries.length - 1) * barPadding;
    const startX = chartX + (chartWidth - totalWidth) / 2 + barWidth / 2;
    const maxCount = Math.max(...entries.map(([, c]) => c), 1);
    const barMaxHeight = chartHeight - 40;

    const expConfig = getExperimentConfig(this.experimentId);

    entries.forEach(([label, count], index) => {
      const x = startX + index * (barWidth + barPadding);
      const barHeight = Math.max(5, (count / maxCount) * barMaxHeight);
      const y = chartY + chartHeight - 20 - barHeight;

      const color = expConfig ? expConfig.outcomeColors[index % expConfig.outcomeColors.length] : 0x667eea;
      const bar = this.add.rectangle(x, y, barWidth - 4, barHeight, color, 0.8);
      bar.setOrigin(0.5, 0);
      this.barContainer.add(bar);

      const countText = this.add.text(x, y - 2, String(count), {
        font: 'bold 11px Arial',
        color: '#ffffff'
      }).setOrigin(0.5, 1);
      this.barContainer.add(countText);

      const labelText = this.add.text(x, chartY + chartHeight - 12, label, {
        font: '10px Microsoft YaHei',
        color: '#94a3b8'
      }).setOrigin(0.5, 1);
      this.barContainer.add(labelText);

      // 理论概率线
      const expConf = getExperimentConfig(this.experimentId);
      if (expConf && expConf.possibleOutcomes.length > 0) {
        const theoreticalProb = 1 / expConf.possibleOutcomes.length;
        // 理论概率线根据期望频次绘制
        const expectedCount = currentCount * theoreticalProb;
        if (expectedCount > 0) {
          const expectedBarHeight = Math.max(5, (expectedCount / maxCount) * barMaxHeight);
          const lineY = chartY + chartHeight - 20 - expectedBarHeight;
          if (lineY > chartY + 5) {
            const line = this.add.graphics();
            line.lineStyle(1, 0xffffff, 0.3);
            line.beginPath();
            line.moveTo(x - barWidth / 2, lineY);
            line.lineTo(x + barWidth / 2, lineY);
            line.strokePath();
            this.barContainer.add(line);
          }
        }
      }
    });
  }

  /**
   * 更新统计面板（进行中）
   */
  updateStatsProgress(tempResults, currentCount) {
    const statLines = Object.entries(tempResults)
      .map(([label, count]) => {
        const pct = ((count / currentCount) * 100).toFixed(1);
        return `${label}: ${count}次 (${pct}%)`;
      })
      .join('  |  ');

    if (this.statsText) {
      this.statsText.setText(statLines || '模拟结果统计');
    }
  }

  /**
   * 重新开始模拟（供组件调用）
   * @param {string} experimentId
   * @param {object} params
   */
  restartSimulation(experimentId, params) {
    this.cleanup();
    this._destroyed = false;
    this._timeoutIds = [];

    this.experimentId = experimentId || this.experimentId;
    this.params = params || this.params;
    this.totalTrials = this.params.trials || 20;

    const result = simulateMultiple(this.experimentId, this.params, this.totalTrials);
    this.results = result.results;
    this.stats = result.stats;

    this.currentTrial = 0;
    this.simulating = false;

    // 重新创建展示区
    if (this.displayContainer) {
      this.displayContainer.destroy();
    }

    const { width, height } = this.scale;
    const displayX = width / 2;
    const displayY = height * 0.28;

    // 清除旧柱状图
    this.barContainer.removeAll(true);

    // 更新标题
    const expConfig = getExperimentConfig(this.experimentId);
    if (expConfig) {
      // 标题文本我们不去找，直接用场景内的文本更新
      this.children.list.forEach(child => {
        if (child.type === 'Text' && child.y === 30 && child !== this.trialText && child !== this.statsText) {
          child.setText(`${expConfig.icon} ${expConfig.name}`);
        }
      });
    }

    this.displayContainer = this.add.container(displayX, displayY);
    switch (this.experimentId) {
      case 'dice':
        this.createDiceDisplay();
        break;
      case 'ball':
        this.createBallDisplay();
        break;
      case 'coin':
        this.createCoinDisplay();
        break;
      case 'spinner':
        this.createSpinnerDisplay();
        break;
    }

    // 重新启动模拟
    this._setTimeout(() => {
      this.startSimulation();
    }, 500);
  }
}
