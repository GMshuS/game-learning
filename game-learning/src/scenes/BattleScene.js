/**
 * Phaser 战斗场景
 */
import Phaser from 'phaser';
import { getRandomMonster } from '../config/monsters';
import { BattleState, calculateRewards, applyItemEffect } from '../utils/battle';
import { generateQuestion } from '../utils/questionGenerator';
import { useMathKnowledgeStore } from '../store/mathKnowledgeStore';

// 选项生成参数
const OPTION_OFFSET_RANGE = 20;   // 错误选项偏移范围（正负10）
const MAX_OPTION_ATTEMPTS = 30;   // 生成选项最大尝试次数（从 100 降为 30，减少极端情况迭代）

// 战斗参数常量
const DEFAULT_TIME_LIMIT = 60;         // 默认战斗限时（秒）
const TIME_WARNING_THRESHOLD = 10;     // 时间警告阈值（秒）
const TURN_DELAY_MS = 1500;              // 回合切换延迟（毫秒）
const AUTO_PROMPT_DELAY_MS = 500;        // 自动提示显示延迟（毫秒）
const HEAL_PROMPT_DELAY_MS = 800;        // 治疗提示显示延迟（毫秒）
const HEAL_PROMPT_HP_THRESHOLD = 0.3;    // 治疗提示 HP 阈值（30%）

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    
    this.player = null;
    this.monster = null;
    this.battleState = null;
    this.currentQuestion = null;
    this.streak = 0;
    this.onBattleEnd = null;
    this.timeLimit = null;
    this.timer = null;
    this.battleItems = [];
    this.onItemUsed = null;
    this.itemButtons = [];
    this.confirmDialog = null;
    this.autoPromptDialog = null;
    this._healPromptShown = false;
    /** @type {number[]} 追踪所有 setTimeout ID 以便场景关闭时清理 */
    this._timeoutIds = [];
  }

  /**
   * 安全的 setTimeout，场景关闭时自动清除
   * @param {Function} fn 回调函数
   * @param {number} delay 延迟毫秒
   * @returns {number} timeout ID
   */
  _setTimeout(fn, delay) {
    const id = setTimeout(() => {
      this._timeoutIds = this._timeoutIds.filter(t => t !== id);
      if (this.scene?.isActive()) fn();
    }, delay);
    this._timeoutIds.push(id);
    return id;
  }

  /**
   * 场景关闭/销毁时清理：清除所有 setTimeout 和 Phaser 对象引用
   */
  cleanup() {
    this._timeoutIds.forEach(id => clearTimeout(id));
    this._timeoutIds = [];
    if (this.timeEvent) {
      this.timeEvent.remove();
      this.timeEvent = null;
    }
    this.destroyConfirmDialog();
    this.destroyAutoPrompt();
  }

  init(data) {
    this.player = data.player || {
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      luck: 0,
      equipmentBonus: {}
    };
    
    this.monster = data.monster || getRandomMonster(data.grade || 1);
    this.grade = data.grade || 1;
    this.streak = data.streak || 0;
    this.onBattleEnd = data.onBattleEnd || null;
    this.timeLimit = data.timeLimit || 60;
    this.difficultyScale = data.difficultyScale || null;
    this.battleItems = data.battleItems || [];
    this.onItemUsed = data.onItemUsed || null;
    this._healPromptShown = false;
  }

  create() {
    // 注册场景生命周期清理
    this.events.on('shutdown', this.cleanup, this);
    this.events.on('destroy', this.cleanup, this);

    const { width, height } = this.scale;
    
    // 初始化战斗状态
    this.battleState = new BattleState(this.player, this.monster);
    
    // 生成题目
    this.generateQuestion();
    
    // 创建背景
    this.createBackground(width, height);
    
    // 创建怪物显示
    this.createMonster(width, height);
    
    // 创建玩家显示
    this.createPlayer(width, height);
    
    // 创建题目显示
    this.createQuestion(width, height);
    
    // 创建选项
    this.createOptions(width, height);
    
    // 创建战斗日志
    this.createBattleLog(width, height);
    
    // 创建计时器
    this.createTimer(width, height);
    
    // 创建道具栏
    this.createItemBar(width, height);
  }

  /**
   * 创建背景
   */
  createBackground(width, height) {
    // 战斗场地背景
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0);
    
    // 添加地面
    const ground = this.add.rectangle(0, height - 100, width, 100, 0x2d3748);
    ground.setOrigin(0);
  }

  /**
   * 创建怪物显示
   */
  createMonster(width, height) {
    const monsterX = width * 0.75;
    const monsterY = height * 0.25;
    
    // 怪物容器
    this.monsterContainer = this.add.container(monsterX, monsterY);
    
    // 怪物背景光环
    const halo = this.add.circle(0, 0, 80, this.hexToColor(this.monster.color), 0.3);
    this.monsterContainer.add(halo);
    
    // 怪物图标
    this.monsterIcon = this.add.text(0, 0, this.monster.icon, {
      font: 'bold 80px Arial'
    }).setOrigin(0.5);
    this.monsterContainer.add(this.monsterIcon);
    
    // 怪物名称
    this.monsterName = this.add.text(0, -100, this.monster.name, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.monsterContainer.add(this.monsterName);
    
    // 怪物血条背景
    const hpBarBg = this.add.rectangle(0, -70, 160, 20, 0x333333);
    hpBarBg.setStrokeStyle(2, 0x666666);
    this.monsterContainer.add(hpBarBg);
    
    // 怪物血条
    this.monsterHpBar = this.add.rectangle(-70, -70, 140, 14, 0xef4444);
    this.monsterHpBar.setOrigin(0, 0.5);
    this.monsterContainer.add(this.monsterHpBar);
    
    // 怪物 HP 文字
    this.monsterHpText = this.add.text(0, -70, `${this.monster.currentHp}/${this.monster.hp}`, {
      font: 'bold 12px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.monsterContainer.add(this.monsterHpText);
    
    // 怪物难度标识
    const difficultyStars = '⭐'.repeat(this.monster.difficulty);
    this.monsterDifficulty = this.add.text(0, -50, difficultyStars, {
      font: '14px Arial',
      color: '#fbbf24'
    }).setOrigin(0.5);
    this.monsterContainer.add(this.monsterDifficulty);
  }

  /**
   * 创建玩家显示
   */
  createPlayer(width, height) {
    const playerX = width * 0.25;
    const playerY = height * 0.25;
    
    // 玩家容器
    this.playerContainer = this.add.container(playerX, playerY);
    
    // 玩家头像背景
    const avatarBg = this.add.circle(0, 0, 50, 0x667eea);
    avatarBg.setStrokeStyle(3, 0xffffff);
    this.playerContainer.add(avatarBg);
    
    // 玩家头像
    this.playerAvatar = this.add.text(0, 0, '🧙', {
      font: 'bold 40px Arial'
    }).setOrigin(0.5);
    this.playerContainer.add(this.playerAvatar);
    
    // 玩家名称
    this.playerName = this.add.text(0, -70, this.player.name || '冒险者', {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.playerContainer.add(this.playerName);
    
    // 玩家血条背景
    const hpBarBg = this.add.rectangle(0, -40, 140, 20, 0x333333);
    hpBarBg.setStrokeStyle(2, 0x666666);
    this.playerContainer.add(hpBarBg);
    
    // 玩家血条
    this.playerHpBar = this.add.rectangle(-60, -40, 120, 14, 0x4ade80);
    this.playerHpBar.setOrigin(0, 0.5);
    this.playerContainer.add(this.playerHpBar);
    
    // 玩家 HP 文字
    this.playerHpText = this.add.text(0, -40, `${this.player.hp}/${this.player.maxHp}`, {
      font: 'bold 12px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.playerContainer.add(this.playerHpText);
    
    // 连击数
    this.streakText = this.add.text(0, -20, `连击：${this.streak}`, {
      font: 'bold 16px Microsoft YaHei',
      color: '#fbbf24'
    }).setOrigin(0.5);
    this.playerContainer.add(this.streakText);
  }

  /**
   * 创建题目显示
   */
  createQuestion(width, height) {
    const qWidth = width * 0.8;
    const qX = width / 2;
    const qY = height * 0.55;
    
    // 题目背景
    const qBg = this.add.rectangle(qX, qY, qWidth, 100, 0x2d3748);
    qBg.setStrokeStyle(3, 0x667eea);
    
    // 题目文字
    this.questionText = this.add.text(qX, qY, this.currentQuestion?.question || '', {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff',
      wordWrap: { width: qWidth - 40, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);
  }

  /**
   * 创建选项
   */
  createOptions(width, height) {
    const options = this.currentQuestion?.options || [];
    const optionWidth = 150;
    const optionHeight = 50;
    const spacing = 20;
    const totalWidth = options.length * optionWidth + (options.length - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const optionY = height * 0.75;
    
    this.optionButtons = [];
    
    options.forEach((option, index) => {
      const x = startX + index * (optionWidth + spacing) + optionWidth / 2;
      
      // 按钮背景
      const bg = this.add.rectangle(x, optionY, optionWidth, optionHeight, 0x667eea);
      bg.setStrokeStyle(2, 0xffffff);
      bg.setInteractive({ useHandCursor: true });
      
      // 选项文字
      const text = this.add.text(x, optionY, `${option}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#ffffff'
      }).setOrigin(0.5);
      
      // 选项标签（A, B, C, D）
      const labels = ['A', 'B', 'C', 'D'];
      const label = this.add.text(x - optionWidth / 2 + 10, optionY - optionHeight / 2 + 10, labels[index] || `${index + 1}`, {
        font: 'bold 12px Arial',
        color: '#cccccc'
      });
      
      const buttonObj = { bg, text, option, label };
      
      // 点击事件
      bg.on('pointerdown', () => this.selectOption(buttonObj.option, bg, text));
      bg.on('pointerover', () => bg.setFillStyle(0x7c3aed));
      bg.on('pointerout', () => bg.setFillStyle(0x667eea));
      
      this.optionButtons.push(buttonObj);
    });
  }

  /**
   * 创建战斗日志
   */
  createBattleLog(width, height) {
    const logX = width / 2;
    const logY = height * 0.96;
    
    this.battleLogText = this.add.text(logX, logY, '战斗开始！选择答案攻击怪物！', {
      font: '14px Microsoft YaHei',
      color: '#cccccc'
    }).setOrigin(0.5);
  }

  /**
   * 创建计时器
   */
  createTimer(width, _height) {
    const timerX = width - 80;
    const timerY = 50;
    
    // 应用难度倍率调整时间
    if (this.difficultyScale?.battleTimeRatio) {
      this.timeLimit = Math.round(this.timeLimit * this.difficultyScale.battleTimeRatio);
    }
    
    // 计时器背景
    const timerBg = this.add.circle(timerX, timerY, 35, 0x1a1a2e);
    timerBg.setStrokeStyle(3, 0x667eea);
    
    // 计时器文字
    this.timerText = this.add.text(timerX, timerY, `${this.timeLimit}`, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // 启动计时器
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * 计时器滴答
   */
  onTimerTick() {
    if (this.timeLimit > 0) {
      this.timeLimit--;
      this.timerText.setText(`${this.timeLimit}`);
      
      // 时间警告
      if (this.timeLimit <= TIME_WARNING_THRESHOLD) {
        this.timerText.setColor('#ef4444');
      }
      
      // 时间到
      if (this.timeLimit <= 0) {
        this.endBattle('timeout');
      }
    }
  }

  /**
   * 生成题目
   */
  generateQuestion() {
    const q = generateQuestion(this.grade, 'random');
    
    const answer = Number(q.answer);
    const options = new Set([answer]);
    
    let attempts = 0;
    while (options.size < 4 && attempts < MAX_OPTION_ATTEMPTS) {
      const offset = Math.floor(Math.random() * OPTION_OFFSET_RANGE) - (OPTION_OFFSET_RANGE / 2);
      const wrong = Math.max(0, answer + offset);
      if (wrong !== answer) {
        options.add(wrong);
      }
      attempts++;
    }
    
    let fallback = 1;
    while (options.size < 4) {
      options.add(answer + fallback * 7);
      fallback++;
    }
    
    // Fisher-Yates 洗牌算法
    const shuffled = Array.from(options);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.currentQuestion = {
      ...q,
      answer: Number(q.answer),
      options: shuffled
    };
    
  }

  /**
   * 选择选项
   */
  selectOption(selectedAnswer, button, _text) {
    // 禁用所有按钮
    this.optionButtons.forEach(opt => {
      opt.bg.disableInteractive();
    });
    
    const isCorrect = Number(selectedAnswer) === Number(this.currentQuestion.answer);

    // 记录答题结果到知识库
    const mathKnowledgeStore = useMathKnowledgeStore();
    const questionType = this.currentQuestion?.type;
    if (questionType) {
      mathKnowledgeStore.recordResult(questionType, isCorrect);
    }

    // 显示答案正确性
    if (isCorrect) {
      button.setFillStyle(0x4ade80);
      this.streak++;
      this.streakText.setText(`连击：${this.streak}`);
      
      // 更新战斗状态（玩家攻击）
      this.battleState.attack(true);
      
      // 更新显示
      this.updateBattleDisplay();
      
      // 延迟后继续
      this._setTimeout(() => {
        if (this.battleState.battleResult === 'ongoing') {
          this.nextTurn();
        } else {
          this.endBattle(this.battleState.battleResult);
        }
      }, TURN_DELAY_MS);
    } else {
      button.setFillStyle(0xef4444);
      this.streak = 0;
      this.streakText.setText(`连击：${this.streak}`);
      
      // 检查橡皮自动提示（答错、未使用过橡皮、背包有橡皮）
      if (!this.battleState.retryUsed && this.hasItem('eraser')) {
        this._setTimeout(() => {
          this.showAutoPrompt([], 'eraser');
        }, AUTO_PROMPT_DELAY_MS);
      } else {
        // 无橡皮可用 → 怪物反击
        this.battleState.attack(false);
        this.updateBattleDisplay();
        
        this._setTimeout(() => {
          if (this.battleState.battleResult === 'ongoing') {
            this.nextTurn();
          } else {
            this.endBattle(this.battleState.battleResult);
          }
        }, TURN_DELAY_MS);
      }
    }
  }

  /**
   * 更新战斗显示
   */
  updateBattleDisplay() {
    const state = this.battleState.getState();
    
    // 更新血条
    const monsterHpPercent = state.monster.currentHp / state.monster.hp;
    const playerHpPercent = state.player.hp / state.player.maxHp;
    
    this.monsterHpBar.width = 140 * monsterHpPercent;
    this.monsterHpText.setText(`${state.monster.currentHp}/${state.monster.hp}`);
    
    this.playerHpBar.width = 120 * playerHpPercent;
    this.playerHpText.setText(`${state.player.hp}/${state.player.maxHp}`);
    
    // 自动提示：HP < 阈值且背包有治疗道具
    if (playerHpPercent < HEAL_PROMPT_HP_THRESHOLD && this.hasHealItem() && !this._healPromptShown) {
      this._healPromptShown = true;
      const healItems = this.battleItems.filter(item =>
        item.effect && item.effect.type === 'heal' && item.quantity > 0
      );
      if (healItems.length > 0) {
        this._setTimeout(() => {
          this.showAutoPrompt(healItems, 'heal');
        }, HEAL_PROMPT_DELAY_MS);
      }
    }
    
    // 更新日志
    if (state.logs.length > 0) {
      const lastLog = state.logs[state.logs.length - 1];
      this.battleLogText.setText(lastLog.message);
    }
  }

  /**
   * 下一回合
   */
  nextTurn() {
    // 重置治疗提示标志
    this._healPromptShown = false;
    
    // 生成新题目
    this.generateQuestion();
    
    // 更新题目显示
    this.questionText.setText(this.currentQuestion.question);
    
    // 更新选项
    this.updateOptions();
    
    // 更新道具栏
    this.updateItemBar();
    
    // 重置计时器（应用难度倍率）
    this.timeLimit = this.difficultyScale?.battleTimeRatio
      ? Math.round(DEFAULT_TIME_LIMIT * this.difficultyScale.battleTimeRatio)
      : DEFAULT_TIME_LIMIT;
    this.timerText.setText(`${this.timeLimit}`);
    this.timerText.setColor('#ffffff');
  }

  /**
   * 更新选项
   */
  updateOptions() {
    const options = this.currentQuestion.options || [];
    
    this.optionButtons.forEach((opt, index) => {
      if (options[index]) {
        opt.text.setText(`${options[index]}`);
        opt.option = options[index];
        opt.bg.setFillStyle(0x667eea);
        opt.bg.setInteractive({ useHandCursor: true });
      }
    });
  }

  /**
   * 结束战斗
   */
  endBattle(result) {
    // 清理弹窗
    this.destroyConfirmDialog();
    this.destroyAutoPrompt();
    
    // 停止计时器
    if (this.timeEvent) {
      this.timeEvent.remove();
    }
    
    // 计算奖励
    const rewards = calculateRewards(
      this.currentQuestion,
      result === 'victory',
      60 - this.timeLimit,
      this.streak
    );
    
    // 应用难度倍率到奖励
    if (this.difficultyScale) {
      rewards.exp = Math.floor(rewards.exp * this.difficultyScale.expRatio);
      rewards.coins = Math.floor(rewards.coins * this.difficultyScale.coinRatio);
    }
    
    // 显示结果
    this.showResult(result, rewards);
  }

  /**
   * 显示结果
   */
  showResult(result, rewards) {
    const { width, height } = this.scale;
    
    // 结果背景
    const dialog = this.add.rectangle(width / 2, height / 2, 400, 250, 0x1a1a2e);
    dialog.setStrokeStyle(4, result === 'victory' ? 0x4ade80 : 0xef4444);
    
    // 结果图标
    const icon = result === 'victory' ? '🎉' : '💀';
    const resultText = result === 'victory' ? '胜利！' : result === 'defeat' ? '失败' : '时间到';
    
    this.add.text(width / 2, height / 2 - 70, `${icon} ${resultText}`, {
      font: 'bold 36px Microsoft YaHei',
      color: result === 'victory' ? '#4ade80' : '#ef4444'
    }).setOrigin(0.5);
    
    // 奖励显示
    if (result === 'victory') {
      this.add.text(width / 2, height / 2 - 20, `获得经验：+${rewards.exp}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#a78bfa'
      }).setOrigin(0.5);
      
      this.add.text(width / 2, height / 2 + 15, `获得金币：+${rewards.coins}`, {
        font: 'bold 20px Microsoft YaHei',
        color: '#fbbf24'
      }).setOrigin(0.5);
    }
    
    // 继续按钮
    const btnBg = this.add.rectangle(width / 2, height / 2 + 80, 160, 50, result === 'victory' ? 0x4ade80 : 0x666666);
    btnBg.setStrokeStyle(2, 0xffffff);
    
    /* unused btnText reference kept for clarity */
    const _btnText = this.add.text(width / 2, height / 2 + 80, '继续', {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    btnBg.setInteractive({ useHandCursor: true });
    btnBg.on('pointerover', () => btnBg.setScale(1.05));
    btnBg.on('pointerout', () => btnBg.setScale(1));
    btnBg.on('pointerdown', () => {
      if (this.onBattleEnd) {
        this.onBattleEnd({
          result,
          rewards,
          streak: this.streak
        });
      }
      this.scene.stop('BattleScene');
    });
  }

  /**
   * 颜色转换
   */
  hexToColor(hex) {
    const color = Phaser.Display.Color.HexStringToColor(hex);
    return color.color;
  }

  // ============================================================
  // 道具系统
  // ============================================================

  /**
   * 检查是否持有某道具（数量 > 0）
   */
  hasItem(productId) {
    return this.battleItems.some(item => item.productId === productId && item.quantity > 0);
  }

  /**
   * 检查是否持有治疗类道具
   */
  hasHealItem() {
    return this.battleItems.some(item =>
      item.effect && item.effect.type === 'heal' && item.quantity > 0
    );
  }

  /**
   * 创建道具栏（选项区域下方，最多5个道具按钮）
   */
  createItemBar(width, height) {
    this.itemButtons = [];
    if (!this.battleItems || this.battleItems.length === 0) return;

    const barY = height * 0.88;
    const btnWidth = 110;
    const btnHeight = 50;
    const spacing = 8;
    const totalWidth = this.battleItems.length * btnWidth + (this.battleItems.length - 1) * spacing;
    const startX = (width - totalWidth) / 2;

    this.battleItems.forEach((item, index) => {
      const x = startX + index * (btnWidth + spacing) + btnWidth / 2;
      const isUsable = item.quantity > 0 && item.effect && item.effect.type !== 'collectible';

      // 按钮背景
      const bgColor = isUsable ? 0x4a5568 : 0x2d3748;
      const bg = this.add.rectangle(x, barY, btnWidth, btnHeight, bgColor);
      bg.setStrokeStyle(2, isUsable ? 0x667eea : 0x4a5568);

      // 图标+名称
      const label = this.add.text(x, barY - 8, `${item.icon} ${item.name}`, {
        font: 'bold 11px Microsoft YaHei',
        color: isUsable ? '#ffffff' : '#666666'
      }).setOrigin(0.5);

      // 剩余数量
      const qty = this.add.text(x + btnWidth / 2 - 8, barY + btnHeight / 2 - 10, `×${item.quantity}`, {
        font: 'bold 10px Microsoft YaHei',
        color: isUsable ? '#fbbf24' : '#555555'
      }).setOrigin(0.5);

      // 可交互道具绑定点击事件
      if (isUsable) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this.showItemConfirm(item, index));
        bg.on('pointerover', () => bg.setFillStyle(0x5a6a88));
        bg.on('pointerout', () => bg.setFillStyle(0x4a5568));
      }

      this.itemButtons.push({ bg, label, qty, item, index });
    });
  }

  /**
   * 更新道具栏显示（数量变化后刷新）
   */
  updateItemBar() {
    this.itemButtons.forEach((btn, index) => {
      const item = this.battleItems[index];
      if (!item) return;

      const isUsable = item.quantity > 0 && item.effect && item.effect.type !== 'collectible';

      btn.bg.setFillStyle(isUsable ? 0x4a5568 : 0x2d3748);
      btn.bg.setStrokeStyle(2, isUsable ? 0x667eea : 0x4a5568);
      btn.label.setColor(isUsable ? '#ffffff' : '#666666');
      btn.qty.setText(`×${item.quantity}`);
      btn.qty.setColor(isUsable ? '#fbbf24' : '#555555');

      // 数量从0变成>0或反之，切换交互状态
      if (isUsable) {
        if (!btn.bg.input || !btn.bg.input.enabled) {
          btn.bg.setInteractive({ useHandCursor: true });
          // 重新绑定事件（移除旧的再绑定新的避免重复）
          btn.bg.removeAllListeners('pointerdown');
          btn.bg.removeAllListeners('pointerover');
          btn.bg.removeAllListeners('pointerout');
          btn.bg.on('pointerdown', () => this.showItemConfirm(item, index));
          btn.bg.on('pointerover', () => btn.bg.setFillStyle(0x5a6a88));
          btn.bg.on('pointerout', () => btn.bg.setFillStyle(0x4a5568));
        }
      } else {
        if (btn.bg.input) {
          btn.bg.disableInteractive();
        }
      }
    });
  }

  /**
   * 显示道具使用确认弹窗（纯 Phaser 图形）
   */
  showItemConfirm(item, buttonIndex) {
    const { width, height } = this.scale;

    // 半透明遮罩
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6);
    overlay.setOrigin(0);
    overlay.setInteractive();

    const dWidth = 350;
    const dHeight = 220;

    // 弹窗背景
    const dialog = this.add.rectangle(width / 2, height / 2, dWidth, dHeight, 0x1a1a2e);
    dialog.setStrokeStyle(3, 0x667eea);

    // 道具标题（图标+名称）
    const titleText = this.add.text(width / 2, height / 2 - 70, `${item.icon} ${item.name}`, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 效果描述
    const effectDesc = item.effect?.description || '';
    const descText = this.add.text(width / 2, height / 2 - 30, effectDesc, {
      font: '14px Microsoft YaHei',
      color: '#cccccc',
      wordWrap: { width: dWidth - 40 },
      align: 'center'
    }).setOrigin(0.5);

    // 触发条件描述（若有）
    const triggerDesc = item.effect?.triggerDescription || '';
    let triggerText = null;
    if (triggerDesc) {
      triggerText = this.add.text(width / 2, height / 2 - 5, triggerDesc, {
        font: '12px Microsoft YaHei',
        color: '#fbbf24'
      }).setOrigin(0.5);
    }

    // 使用按钮
    const useBtn = this.add.rectangle(width / 2 - 70, height / 2 + 60, 120, 45, 0x4ade80);
    useBtn.setStrokeStyle(2, 0xffffff);
    const useLabel = this.add.text(width / 2 - 70, height / 2 + 60, '✅ 使用', {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 取消按钮
    const cancelBtn = this.add.rectangle(width / 2 + 70, height / 2 + 60, 120, 45, 0x666666);
    cancelBtn.setStrokeStyle(2, 0xffffff);
    const cancelLabel = this.add.text(width / 2 + 70, height / 2 + 60, '❌ 取消', {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 收集弹窗元素
    const dialogElements = [overlay, dialog, titleText, descText, useBtn, useLabel, cancelBtn, cancelLabel];
    if (triggerText) dialogElements.push(triggerText);
    this.confirmDialog = dialogElements;

    // 使用按钮事件
    useBtn.setInteractive({ useHandCursor: true });
    useBtn.on('pointerdown', () => {
      this.destroyConfirmDialog();
      this.useItem(item, buttonIndex);
    });
    useBtn.on('pointerover', () => useBtn.setFillStyle(0x22c55e));
    useBtn.on('pointerout', () => useBtn.setFillStyle(0x4ade80));

    // 取消按钮事件
    cancelBtn.setInteractive({ useHandCursor: true });
    cancelBtn.on('pointerdown', () => this.destroyConfirmDialog());
    cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0x888888));
    cancelBtn.on('pointerout', () => cancelBtn.setFillStyle(0x666666));
  }

  /**
   * 销毁道具确认弹窗
   */
  destroyConfirmDialog() {
    if (this.confirmDialog) {
      this.confirmDialog.forEach(el => {
        if (el && typeof el.destroy === 'function') el.destroy();
      });
      this.confirmDialog = null;
    }
  }

  /**
   * 使用道具：应用效果 → 更新状态 → 回调通知
   */
  useItem(item, _buttonIndex) {
    const effectResult = applyItemEffect(item, this.battleState);

    // 更新道具库存数量
    if (effectResult.consumed) {
      item.quantity = effectResult.remainingQuantity;
    }

    // 更新战斗显示
    this.updateBattleDisplay();

    // 更新道具栏
    this.updateItemBar();

    // 显示效果消息
    if (effectResult.success) {
      this.battleLogText.setText(effectResult.message);
    }

    // 通知 Vue 层消耗道具
    if (this.onItemUsed && effectResult.consumed) {
      this.onItemUsed(item.id);
    }

    // 橡皮效果：重新生成同类型题目并更新显示
    if (item.effect && item.effect.target === 'retry' && effectResult.success) {
      this.generateQuestion();
      this.questionText.setText(this.currentQuestion.question);
      this.updateOptions();

      // 重置计时器
      this.timeLimit = this.difficultyScale?.battleTimeRatio
        ? Math.round(DEFAULT_TIME_LIMIT * this.difficultyScale.battleTimeRatio)
        : DEFAULT_TIME_LIMIT;
      this.timerText.setText(`${this.timeLimit}`);
      this.timerText.setColor('#ffffff');
    }
  }

  // ============================================================
  // 自动提示系统
  // ============================================================

  /**
   * 显示自动提示弹窗（橡皮/治疗）
   * @param {array} items - 相关道具列表（治疗用）
   * @param {string} promptType - 'eraser' | 'heal'
   */
  showAutoPrompt(items, promptType) {
    const { width, height } = this.scale;

    // 半透明遮罩
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6);
    overlay.setOrigin(0);
    overlay.setInteractive();

    const dWidth = 380;
    const dHeight = 220;

    // 弹窗背景
    const dialog = this.add.rectangle(width / 2, height / 2, dWidth, dHeight, 0x1a1a2e);
    dialog.setStrokeStyle(3, promptType === 'eraser' ? 0xf59e0b : 0x4ade80);

    // 标题
    const title = promptType === 'eraser' ? '🧹 发现橡皮！' : '💊 使用治疗道具？';
    const titleText = this.add.text(width / 2, height / 2 - 70, title, {
      font: 'bold 22px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 描述
    let desc = '';
    if (promptType === 'eraser') {
      desc = '答错了！使用橡皮重新生成一道新题目？\n（每场战斗仅限1次）';
    } else {
      const itemNames = items.map(i => `${i.icon}${i.name}`).join('、');
      desc = `你的生命值已低于30%！\n使用 ${itemNames} 恢复生命值？`;
    }
    const descText = this.add.text(width / 2, height / 2 - 30, desc, {
      font: '14px Microsoft YaHei',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: dWidth - 40 }
    }).setOrigin(0.5);

    // 使用按钮
    const useBtn = this.add.rectangle(width / 2 - 70, height / 2 + 60, 120, 45, 0x4ade80);
    useBtn.setStrokeStyle(2, 0xffffff);
    const useLabel = this.add.text(width / 2 - 70, height / 2 + 60, '✅ 使用', {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 取消按钮
    const cancelBtn = this.add.rectangle(width / 2 + 70, height / 2 + 60, 120, 45, 0x666666);
    cancelBtn.setStrokeStyle(2, 0xffffff);
    const cancelLabel = this.add.text(width / 2 + 70, height / 2 + 60, '❌ 取消', {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 收集弹窗元素
    const dialogElements = [overlay, dialog, titleText, descText, useBtn, useLabel, cancelBtn, cancelLabel];
    this.autoPromptDialog = dialogElements;

    if (promptType === 'eraser') {
      // 橡皮：使用后重新生成题目，不触发怪物攻击
      useBtn.setInteractive({ useHandCursor: true });
      useBtn.on('pointerdown', () => {
        this.destroyAutoPrompt();
        const eraserItem = this.battleItems.find(i => i.productId === 'eraser');
        if (eraserItem) {
          this.useItem(eraserItem, this.battleItems.indexOf(eraserItem));
        }
      });
      useBtn.on('pointerover', () => useBtn.setFillStyle(0x22c55e));
      useBtn.on('pointerout', () => useBtn.setFillStyle(0x4ade80));

      // 取消 → 怪物正常反击
      cancelBtn.setInteractive({ useHandCursor: true });
      cancelBtn.on('pointerdown', () => {
        this.destroyAutoPrompt();
        this.battleState.attack(false);
        this.updateBattleDisplay();
        this._setTimeout(() => {
          if (this.battleState.battleResult === 'ongoing') {
            this.nextTurn();
          } else {
            this.endBattle(this.battleState.battleResult);
          }
        }, TURN_DELAY_MS);
      });
      cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0x888888));
      cancelBtn.on('pointerout', () => cancelBtn.setFillStyle(0x666666));
    } else {
      // 治疗：使用第一个治疗道具
      useBtn.setInteractive({ useHandCursor: true });
      useBtn.on('pointerdown', () => {
        this.destroyAutoPrompt();
        const healItem = items[0];
        if (healItem) {
          this.useItem(healItem, this.battleItems.indexOf(healItem));
        }
      });
      useBtn.on('pointerover', () => useBtn.setFillStyle(0x22c55e));
      useBtn.on('pointerout', () => useBtn.setFillStyle(0x4ade80));

      // 取消 — 仅关闭弹窗
      cancelBtn.setInteractive({ useHandCursor: true });
      cancelBtn.on('pointerdown', () => this.destroyAutoPrompt());
      cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0x888888));
      cancelBtn.on('pointerout', () => cancelBtn.setFillStyle(0x666666));
    }
  }

  /**
   * 销毁自动提示弹窗
   */
  destroyAutoPrompt() {
    if (this.autoPromptDialog) {
      this.autoPromptDialog.forEach(el => {
        if (el && typeof el.destroy === 'function') el.destroy();
      });
      this.autoPromptDialog = null;
    }
  }
}
