<template>
  <div class="shop-view">
    <!-- 玩法说明 -->
    <GameTutorial
      v-if="showTutorial"
      title="🛍️ 数学购物挑战"
      :steps="shopTutorialSteps"
      @close="showTutorial = false"
    />

    <div class="shop-header">
      <h2>🏪 文具商店</h2>
      <div class="header-actions">
        <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
        <div class="coins-display">
          <span class="coin-icon">💰</span>
          <span class="coin-amount">{{ playerCoins }}</span>
        </div>
        <button class="btn-backpack" @click="openInventory">🎒 背包</button>
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </div>

    <div class="shop-content">
      <!-- 顾客对话区 -->
      <div v-if="shopStore.customerQueue" class="customer-area">
        <div class="customer-bubble">
          <div class="customer-icon">{{ shopStore.customerQueue.type.icon }}</div>
          <div class="bubble-text">
            <p class="customer-name">{{ shopStore.customerQueue.type.name }}</p>
            <p class="customer-dialogue">{{ shopStore.customerQueue.dialogue }}</p>
          </div>
        </div>

        <!-- 购物清单 -->
        <div class="shopping-list">
          <h3>📋 购物清单</h3>
          <div
            v-for="(item, index) in shopStore.customerQueue.items"
            :key="index"
            class="list-item"
          >
            <span class="list-icon">{{ item.product.icon }}</span>
            <span class="list-name">{{ item.product.name }}</span>
            <span class="list-price">{{ item.product.sellPrice }}元/个</span>
            <span class="list-qty">× {{ item.quantity }}</span>
          </div>
        </div>
      </div>

      <!-- 应用题作答区 -->
      <div v-if="shopStore.isProblemActive && shopStore.currentProblem" class="problem-area">
        <div class="problem-question">
          {{ shopStore.currentProblem.questionText }}
        </div>
        <div class="answer-input-area">
          <input
            v-model="userAnswer"
            type="number"
            class="answer-input"
            placeholder="输入答案..."
            @keyup.enter="submitAnswer"
          >
          <button
            class="btn-submit"
            :disabled="userAnswer === ''"
            @click="submitAnswer"
          >
            ✍️ 确认
          </button>
        </div>
        <div v-if="feedbackMessage" class="feedback" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>
        <div v-if="rewardInfo" class="reward-info">
          <p>🎉 获得物品：</p>
          <div
            v-for="(item, index) in rewardInfo.items"
            :key="index"
            class="reward-item"
          >
            <span>{{ item.icon }} {{ item.name }} ×{{ item.quantity }}</span>
          </div>
        </div>
      </div>

      <!-- 无顾客时的提示 -->
      <div v-if="!shopStore.customerQueue" class="empty-state">
        <div class="empty-icon">🛍️</div>
        <p>欢迎来到文具商店！</p>
        <p>点击下方按钮邀请顾客前来购物，<br>计算总价赢取道具吧！</p>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="shop-footer">
      <button
        class="btn-customer"
        :disabled="shopStore.isProblemActive"
        @click="inviteCustomer"
      >
        🧑‍🤝‍🧑 来一位顾客
      </button>
      <button
        v-if="shopStore.isProblemActive && feedbackMessage"
        class="btn-next"
        @click="inviteCustomer()"
      >
        ➡️ 下一位
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useShopStore } from '../store/shopStore';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import GameTutorial from './GameTutorial.vue';

const shopStore = useShopStore();
const gameStore = useGameStore();
const settingsStore = useSettingsStore();

const emit = defineEmits(['back', 'openInventory']);

const showTutorial = ref(false);
const userAnswer = ref('');
const feedbackMessage = ref('');
const feedbackClass = ref('');
const rewardInfo = ref(null);

const shopTutorialSteps = [
  {
    title: '🛍️ 迎接顾客',
    description: '点击「来一位顾客」按钮生成随机顾客和购物需求。'
  },
  {
    title: '📋 查看清单',
    description: '顾客对话气泡会显示购物清单，包括商品图标、名称、单价和数量。'
  },
  {
    title: '🧮 计算总价',
    description: '根据清单计算总价：低年级单种商品价格×数量；中年级两种商品之和；高年级额外计算找零。'
  },
  {
    title: '✍️ 提交答案',
    description: '在输入框中输入总价，点击确认按钮。答对获得物品，答错顾客离开。'
  },
  {
    title: '🎒 管理道具',
    description: '获得的物品存入背包，可在背包界面装备到战斗栏，在冒险中使用。'
  }
];

const playerCoins = computed(() => {
  return gameStore.playerCoins;
});

function inviteCustomer() {
  const grade = settingsStore.grade || 2;
  userAnswer.value = '';
  feedbackMessage.value = '';
  feedbackClass.value = '';
  rewardInfo.value = null;
  shopStore.generateCustomer(grade);
}

function submitAnswer() {
  if (userAnswer.value === '') return;

  // 检查是否是找零步骤
  const isChangeStep = feedbackMessage.value && feedbackMessage.value.includes('找零');
  const result = shopStore.checkAnswer(userAnswer.value, { isChangeStep });

  feedbackMessage.value = result.message;
  feedbackClass.value = result.correct ? 'feedback-correct' : 'feedback-wrong';
  userAnswer.value = '';

  if (result.correct) {
    if (result.isChangeStep) {
      // 高年级找零步骤：更新题目为找零计算
      return; // checkAnswer 已更新 questionText
    }
    if (result.reward) {
      rewardInfo.value = result.reward;
    }
  }
}

function openInventory() {
  emit('openInventory');
}
</script>

<style scoped>
.shop-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.shop-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  color: #000;
  font-weight: bold;
}

.btn-help {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-help:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-backpack,
.btn-back {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-backpack:hover,
.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.shop-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 顾客对话区 */
.customer-area {
  margin-bottom: 1.5rem;
}

.customer-bubble {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.2rem;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.customer-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.bubble-text {
  flex: 1;
}

.customer-name {
  margin: 0 0 0.3rem 0;
  font-weight: bold;
  font-size: 1.1rem;
}

.customer-dialogue {
  margin: 0;
  opacity: 0.8;
  line-height: 1.5;
}

/* 购物清单 */
.shopping-list {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.2rem;
  border-radius: 15px;
}

.shopping-list h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 0.4rem;
}

.list-item:last-child {
  margin-bottom: 0;
}

.list-icon {
  font-size: 1.5rem;
}

.list-name {
  flex: 1;
  font-weight: bold;
}

.list-price {
  color: #fbbf24;
  font-size: 0.9rem;
}

.list-qty {
  color: #4ade80;
  font-weight: bold;
}

/* 应用题作答区 */
.problem-area {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.problem-question {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  text-align: center;
}

.answer-input-area {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.answer-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.2rem;
  outline: none;
  transition: border-color 0.3s;
}

.answer-input:focus {
  border-color: #667eea;
}

.answer-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-submit {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
}

.feedback-correct {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.feedback-wrong {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.reward-info {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(251, 191, 36, 0.15);
  border-radius: 12px;
}

.reward-info p {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #fbbf24;
}

.reward-item {
  padding: 0.3rem 0;
  font-size: 0.95rem;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0.3rem 0;
  line-height: 1.6;
}

/* 底部操作栏 */
.shop-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-customer {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-customer:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-customer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-next {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}
</style>
