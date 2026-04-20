<template>
  <div class="cashier-game">
    <div class="game-header">
      <h2>🧾 收银找零</h2>
      <div class="timer-display" :class="{ urgent: timeLeft <= 10 }">
        <span class="timer-icon">⏱️</span>
        <span class="timer-value">{{ timeLeft }}s</span>
      </div>
      <button class="btn-back" @click="back">← 返回</button>
    </div>

    <!-- 游戏状态 -->
    <div v-if="!isComplete" class="game-content">
      <!-- 题目显示 -->
      <div v-if="problem" class="problem-card">
        <div class="customer-info">
          <span class="customer-avatar">👤</span>
          <div class="customer-text">
            <p class="customer-statement">{{ problem.customerStatement }}</p>
          </div>
        </div>
        <div class="transaction-info">
          <div class="transaction-row">
            <span>应收：</span>
            <span class="amount due">💰 ¥{{ (problem.total / 100).toFixed(2) }}</span>
          </div>
          <div class="transaction-row">
            <span>实收：</span>
            <span class="amount paid">💵 ¥{{ (problem.paid / 100).toFixed(2) }}</span>
          </div>
          <div class="transaction-row highlight">
            <span>应找：</span>
            <span class="amount change">💰 ¥{{ (problem.change / 100).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 货币选择区 -->
      <div class="currency-section">
        <h3>选择找零货币</h3>
        <div class="currency-grid">
          <div
            v-for="denom in cashierConfig.denominations"
            :key="denom.value"
            class="currency-option"
            @click="addCoin(denom.value)"
          >
            <div class="currency-icon">{{ denom.icon }}</div>
            <div class="currency-info">
              <span class="currency-value">¥{{ (denom.value / 100).toFixed(2) }}</span>
              <span class="currency-count" v-if="getCoinCount(denom.value) > 0">
                x{{ getCoinCount(denom.value) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 已选货币 -->
      <div class="selected-change">
        <h3>已选找零</h3>
        <div v-if="Object.keys(selectedChange).length === 0" class="empty-selection">
          请从上方选择货币进行找零
        </div>
        <div v-else class="selected-list">
          <div
            v-for="(count, value) in selectedChange"
            :key="value"
            class="selected-item"
          >
            <span class="item-icon">{{ getDenomination(parseInt(value))?.icon || '💰' }}</span>
            <span class="item-value">¥{{ (parseInt(value) / 100).toFixed(2) }}</span>
            <span class="item-count">x{{ count }}</span>
            <button class="remove-btn" @click="removeCoin(parseInt(value))">×</button>
          </div>
        </div>
        <div class="current-total">
          当前总额：<span :class="{ correct: currentTotal === problem?.change, incorrect: currentTotal > problem?.change }">
            ¥{{ (currentTotal / 100).toFixed(2) }}
          </span>
          <span v-if="remainingChange > 0" class="remaining">还需：¥{{ (remainingChange / 100).toFixed(2) }}</span>
          <span v-else-if="remainingChange < 0" class="overpaid text-red">多了：¥{{ (-remainingChange / 100).toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button class="btn-submit" @click="submit">
        提交答案
      </button>
    </div>

    <!-- 结果展示 -->
    <div v-else class="result-panel">
      <div class="result-icon">{{ result.status === 'success' ? '🎉' : result.status === 'timeout' ? '⏰' : '❌' }}</div>
      <h3 class="result-title">
        {{ result.status === 'success' ? '恭喜！' : result.status === 'timeout' ? '时间到！' : '不正确' }}
      </h3>
      
      <div v-if="result.status === 'success'" class="result-details">
        <p>评分：<span class="stars">{{ '⭐'.repeat(result.stars) }}</span></p>
        <p>使用货币数：{{ result.coinCount }} 枚</p>
        <p>最优解：{{ result.optimalCount }} 枚</p>
        <p>用时：{{ result.timeUsed }} 秒</p>
      </div>

      <div class="result-actions">
        <button class="btn-next" @click="next">再来一题</button>
        <button class="btn-quit" @click="back">结束游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  cashierConfig,
  generateCashierProblem,
  calculateOptimalChange,
  validateChange
} from '../config/cashier'

const props = defineProps({
  difficulty: {
    type: String,
    default: 'easy'
  }
})

const emit = defineEmits(['complete', 'back'])

const problem = ref(null)
const selectedChange = ref({})
const timeLeft = ref(60)
const isComplete = ref(false)
const result = ref(null)
let timer = null

// 初始化游戏
const initGame = () => {
  problem.value = generateCashierProblem(props.difficulty)
  selectedChange.value = {}
  isComplete.value = false
  result.value = null
  
  // 根据难度设置时间
  const config = cashierConfig.difficulties[props.difficulty]
  timeLeft.value = config.timeLimit
  
  startTimer()
}

// 启动计时器
const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame('timeout')
    }
  }, 1000)
}

// 添加货币到找零
const addCoin = (value) => {
  if (isComplete.value) return
  
  const key = value.toString()
  selectedChange.value[key] = (selectedChange.value[key] || 0) + 1
}

// 移除货币
const removeCoin = (value) => {
  if (isComplete.value) return
  
  const key = value.toString()
  if (selectedChange.value[key] && selectedChange.value[key] > 0) {
    selectedChange.value[key]--
    if (selectedChange.value[key] === 0) {
      delete selectedChange.value[key]
    }
  }
}

// 获取当前选择的货币数量
const getCoinCount = (value) => {
  return selectedChange.value[value.toString()] || 0
}

// 计算当前找零总额
const currentTotal = computed(() => {
  return Object.entries(selectedChange.value).reduce((sum, [value, count]) => {
    return sum + parseInt(value) * count
  }, 0)
})

// 计算还需要找零多少
const remainingChange = computed(() => {
  if (!problem.value) return 0
  return problem.value.change - currentTotal.value
})

// 提交答案
const submit = () => {
  if (!problem.value || isComplete.value) return
  
  const validation = validateChange(selectedChange.value, problem.value.change)
  
  if (validation.correct) {
    // 计算评分
    const coinCount = Object.values(selectedChange.value).reduce((sum, c) => sum + c, 0)
    const optimalChange = calculateOptimalChange(problem.value.change)
    const optimalCount = Object.values(optimalChange).reduce((sum, c) => sum + c, 0)
    
    let stars = 1
    if (coinCount <= optimalCount) stars = 3
    else if (coinCount <= optimalCount + 2) stars = 2
    
    endGame('success', {
      stars,
      coinCount,
      optimalCount,
      timeUsed: cashierConfig.difficulties[props.difficulty].timeLimit - timeLeft.value
    })
  } else {
    endGame('wrong', validation)
  }
}

// 结束游戏
const endGame = (status, data = {}) => {
  isComplete.value = true
  if (timer) clearInterval(timer)
  
  result.value = {
    status,
    ...data,
    problem: problem.value,
    selectedChange: { ...selectedChange.value }
  }
  
  emit('complete', result.value)
}

// 继续下一题
const next = () => {
  initGame()
}

// 返回
const back = () => {
  if (timer) clearInterval(timer)
  emit('back')
}

// 获取货币配置
const getDenomination = (value) => {
  return cashierConfig.denominations.find(d => d.value === parseInt(value))
}

// 初始化
initGame()
</script>

<style scoped>
.cashier-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 1rem;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.game-header h2 {
  margin: 0;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.timer-display.urgent {
  background: rgba(239, 68, 68, 0.3);
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.btn-back {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
}

.game-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.problem-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  padding: 1.5rem;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.customer-avatar {
  font-size: 3rem;
}

.customer-statement {
  margin: 0;
  font-size: 1.1rem;
}

.transaction-info {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
}

.transaction-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.transaction-row:last-child {
  border-bottom: none;
}

.transaction-row.highlight {
  font-size: 1.2rem;
  font-weight: bold;
}

.amount {
  font-weight: bold;
}

.amount.due { color: #fbbf24; }
.amount.paid { color: #4ade80; }
.amount.change { color: #fff; }

.currency-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 1rem;
}

.currency-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.currency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.currency-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.currency-option:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.currency-icon {
  font-size: 1.5rem;
}

.currency-info {
  display: flex;
  flex-direction: column;
}

.currency-value {
  font-weight: bold;
}

.currency-count {
  font-size: 0.8rem;
  color: #fbbf24;
}

.selected-change {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 1rem;
}

.selected-change h3 {
  margin: 0 0 1rem 0;
}

.empty-selection {
  text-align: center;
  opacity: 0.6;
  padding: 2rem;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.item-icon {
  font-size: 1.2rem;
}

.item-value {
  font-weight: bold;
}

.item-count {
  color: #fbbf24;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  margin-left: 0.5rem;
}

.current-total {
  margin-top: 1rem;
  text-align: center;
  font-size: 1.1rem;
}

.current-total .correct {
  color: #4ade80;
  font-weight: bold;
}

.current-total .incorrect {
  color: #ef4444;
  font-weight: bold;
}

.remaining {
  color: #fbbf24;
  margin-left: 1rem;
}

.text-red {
  color: #ef4444;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.result-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.result-title {
  font-size: 2rem;
  margin: 0 0 2rem 0;
}

.result-details {
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
}

.result-details p {
  margin: 0.5rem 0;
}

.stars {
  font-size: 1.5rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
}

.btn-next,
.btn-quit {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
}

.btn-quit {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>
