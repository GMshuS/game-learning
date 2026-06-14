<template>
  <div class="speed-challenge">
    <GameTutorial
      v-if="showTutorial"
      title="⚡ 速算竞技场玩法说明"
      :steps="speedTutorialSteps"
      @close="closeTutorial"
    />

    <!-- 模式选择 -->
    <div v-if="!store.isPlaying && !store.gameResult" class="mode-select">
      <div class="header">
        <h2>⚡ 速算竞技场</h2>
        <div class="header-actions">
          <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
          <button class="btn-back" @click="$emit('back')">← 返回</button>
        </div>
      </div>

      <div class="mode-cards">
        <div
          v-for="mode in modes"
          :key="mode.id"
          class="mode-card"
          @click="startMode(mode.id)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <h3>{{ mode.name }}</h3>
          <p>{{ mode.description }}</p>
          <div v-if="bestScores[mode.id]" class="mode-best">
            最佳: {{ bestScores[mode.id].score }}分 ({{ bestScores[mode.id].rating }})
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏中 -->
    <div v-else-if="store.isPlaying" class="game-area">
      <div class="game-header">
        <div class="timer" :class="{ warning: store.timeLeft <= 10 }">
          ⏱️ {{ store.timeLeft }}s
        </div>
        <div class="score">得分: {{ store.score }}</div>
        <div v-if="store.combo > 1" class="combo">🔥 {{ store.combo }}连击</div>
        <div v-if="store.currentMode === 'survival'" class="lives">
          ❤️ {{ '❤️'.repeat(store.lives) }}{{ '🖤'.repeat(store.maxLives - store.lives) }}
        </div>
        <div v-if="store.currentMode === 'blitz'" class="ai-bar">
          <div class="ai-label">AI 对手</div>
          <div class="ai-progress-bar">
            <div class="ai-fill" :style="{ width: store.aiProgress + '%' }" />
          </div>
        </div>
        <button class="btn-back-game" @click="goBackToModeSelect">← 返回</button>
      </div>

      <div class="question-area">
        <div class="question">
          {{ store.currentQuestion?.a }} {{ store.currentQuestion?.op }} {{ store.currentQuestion?.b }} = ?
        </div>
        <div class="options">
          <button
            v-for="opt in store.currentQuestion?.options"
            :key="opt"
            class="option-btn"
            @click="handleAnswer(opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结算 -->
    <div v-else-if="store.gameResult" class="result-area">
      <h2>🏁 挑战结束</h2>
      <div class="result-stats">
        <div class="stat">
          <div class="stat-value">{{ store.gameResult.score }}</div>
          <div class="stat-label">得分</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ store.gameResult.rating }}</div>
          <div class="stat-label">评级</div>
        </div>
        <div class="stat">
          <div class="stat-value">💰 {{ store.gameResult.coins }}</div>
          <div class="stat-label">金币</div>
        </div>
        <div v-if="store.gameResult.gems > 0" class="stat">
          <div class="stat-value">💎 {{ store.gameResult.gems }}</div>
          <div class="stat-label">钻石</div>
        </div>
      </div>
      <div class="result-details">
        <p>✅ 正确: {{ store.gameResult.correct }} | ❌ 错误: {{ store.gameResult.wrong }}</p>
        <p>🔥 最大连击: {{ store.gameResult.maxCombo }}</p>
        <p v-if="store.gameResult.aiWon">😤 AI 获胜！下次加油！</p>
      </div>
      <div class="result-actions">
        <button class="btn-retry" @click="startMode(store.currentMode)">再来一次</button>
        <button class="btn-back-result" @click="goBackToModeSelect">返回模式选择</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useSpeedChallengeStore } from '../store/speedChallengeStore';
import { useGameStore } from '../store/gameStore';
import GameTutorial from './GameTutorial.vue';

const emit = defineEmits(['back', 'challengeEnd']);

const store = useSpeedChallengeStore();
const gameStore = useGameStore();
let timer = null;

const showTutorial = ref(false);

const speedTutorialSteps = [
  {
    title: '选择模式',
    description: '速算竞技场有三种模式：基础速算、闪电抢答和生存模式，每种模式有不同的规则和挑战。'
  },
  {
    title: '基础速算',
    description: '60秒计时，答对一题得10分，连续答对可获得连击加分（每连击+10%）。在时间内尽可能多答题！'
  },
  {
    title: '闪电抢答',
    description: '45秒内与AI对手竞速，答对一题得15分，连击加成15%。注意AI进度条，AI达到100%则挑战失败！'
  },
  {
    title: '生存模式',
    description: '没有计时限制，但有3条命。答对一题得20分，连击加成20%。答错扣一条命，3条命用完游戏结束。'
  },
  {
    title: '计分与奖励',
    description: '根据得分获得D/S评级，得分可兑换金币（0.5金币/分），达到300/500/800分还可获得钻石奖励！'
  }
];

const closeTutorial = () => {
  showTutorial.value = false;
};

const modes = [
  { id: 'base', icon: '⏱️', name: '基础速算', description: '60秒内尽可能多答题' },
  { id: 'blitz', icon: '⚡', name: '闪电抢答', description: '与 AI 对手竞速' },
  { id: 'survival', icon: '💀', name: '生存模式', description: '3条命，答错扣命' }
];

const bestScores = computed(() => gameStore.speedChallenge?.bestScores || {});

function startMode(modeId) {
  store.startGame(modeId);
  startTimer();
}

function handleAnswer(selected) {
  const correct = store.answer(selected);
  if (!store.isPlaying) {
    emit('challengeEnd', store.gameResult);
  }
}

function startTimer() {
  stopTimer();
  if (store.currentMode === 'survival') return;
  timer = setInterval(() => {
    store.tick();
    if (!store.isPlaying) {
      stopTimer();
      emit('challengeEnd', store.gameResult);
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function goBackToModeSelect() {
  store.$reset();
  stopTimer();
}

onUnmounted(() => stopTimer());
</script>

<style scoped>
.speed-challenge {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.header h2 { margin: 0; font-size: 1.8rem; }

.btn-back {
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
}

.btn-help {
  padding: 0.5rem 1.2rem;
  background: rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-help:hover {
  background: rgba(102, 126, 234, 0.5);
}

.btn-back-game {
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-back-game:hover {
  background: rgba(255,255,255,0.3);
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.mode-card {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.mode-card:hover {
  transform: translateY(-3px);
  border-color: #fbbf24;
}

.mode-icon { font-size: 3rem; margin-bottom: 1rem; }
.mode-card h3 { margin: 0 0 0.5rem; }
.mode-card p { margin: 0; opacity: 0.8; font-size: 0.9rem; }
.mode-best { margin-top: 1rem; font-size: 0.8rem; color: #fbbf24; }

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
}

.timer { font-size: 1.5rem; font-weight: bold; }
.timer.warning { color: #ef4444; animation: pulse 0.5s infinite; }
.score { font-size: 1.2rem; color: #fbbf24; }
.combo { font-size: 1.2rem; color: #f97316; }

.ai-bar { width: 100%; }
.ai-label { font-size: 0.8rem; margin-bottom: 0.3rem; }
.ai-progress-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
.ai-fill { height: 100%; background: linear-gradient(90deg, #ef4444, #f97316); transition: width 0.3s; }

.question-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.question {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.option-btn {
  padding: 1.5rem;
  font-size: 1.5rem;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }

.result-area {
  text-align: center;
  padding: 2rem;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.stat { text-align: center; }
.stat-value { font-size: 2rem; font-weight: bold; }
.stat-label { font-size: 0.9rem; opacity: 0.7; }

.result-details { margin: 1.5rem 0; opacity: 0.8; }

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-retry, .btn-back-result {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-retry { background: linear-gradient(135deg, #4ade80, #22c55e); color: #fff; }
.btn-back-result { background: rgba(255,255,255,0.2); color: #fff; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .speed-challenge { padding: 1rem; }
  .question { font-size: 2rem; }
  .options { grid-template-columns: 1fr; }
}
</style>
