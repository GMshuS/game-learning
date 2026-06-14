<template>
  <div class="game-hall">
    <div class="hall-header">
      <h2>🎮 挑战中心</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <div class="hall-cards">
      <!-- 经营商店 -->
      <div class="hall-card shop-card" @click="$emit('startShop')">
        <div class="card-icon">🏪</div>
        <h3>经营商店</h3>
        <p>数学购物挑战，计算总价赢取道具</p>
        <div class="card-status">
          <span>金币: {{ shopCoins }}</span>
        </div>
      </div>

      <!-- 收银游戏 -->
      <div class="hall-card cashier-card" @click="$emit('startCashier')">
        <div class="card-icon">🧾</div>
        <h3>收银游戏</h3>
        <p>练习收银找零，赢取金币奖励</p>
        <div class="card-status">
          <span>{{ cashierBestScore }}</span>
        </div>
      </div>

      <!-- 冒险模式 -->
      <div class="hall-card adventure-card" @click="$emit('startAdventure')">
        <div class="card-icon">⚔️</div>
        <h3>冒险模式</h3>
        <p>挑战数学怪物，提升角色等级</p>
        <div class="card-status">
          <span>关卡: {{ adventureProgress }}</span>
        </div>
      </div>

      <!-- 速算竞技 -->
      <div class="hall-card speed-card" @click="$emit('startSpeedChallenge')">
        <div class="card-icon">⚡</div>
        <h3>速算竞技场</h3>
        <p>限时答题，挑战手速</p>
        <div class="card-status">
          <span>最佳: {{ bestSpeedScore }}</span>
        </div>
      </div>

      <!-- 数学工坊 -->
      <div class="hall-card workshop-card" @click="$emit('startWorkshop')">
        <div class="card-icon">🔨</div>
        <h3>数学工坊</h3>
        <p>收集材料，制作出售</p>
        <div class="card-status">
          <span>待售: {{ listedCount }} 件</span>
        </div>
      </div>

      <!-- 卡牌对战 -->
      <div class="hall-card card-card" @click="$emit('startCardBattle')">
        <div class="card-icon">🃏</div>
        <h3>卡牌对战</h3>
        <p>收集卡牌，策略对决</p>
        <div class="card-status">
          <span>收藏: {{ cardCollectionCount }} 张</span>
        </div>
      </div>

      <!-- 针对性训练 -->
      <div class="hall-card training-card" @click="$emit('startTargetedTraining')">
        <div class="card-icon">🎯</div>
        <h3>针对性训练</h3>
        <p>根据错题记录，自动推荐薄弱题型</p>
        <div class="card-status">
          <span v-if="weakNodeCount > 0">待强化: {{ weakNodeCount }} 个知识点</span>
          <span v-else>暂无薄弱点</span>
        </div>
      </div>

      <!-- 复习模式 -->
      <div class="hall-card review-card" @click="$emit('startReview')">
        <div class="card-icon">📚</div>
        <h3>复习模式</h3>
        <p>基于遗忘曲线，智能安排复习</p>
        <div class="card-status">
          <span v-if="dueCount > 0">{{ dueCount }} 个知识点待复习</span>
          <span v-else>暂无待复习内容</span>
        </div>
      </div>
    </div>

    <div class="hall-footer">
      <button class="btn-leaderboard" @click="$emit('openLeaderboard')">
        🏆 排行榜
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { useCashierStore } from '../store/cashierStore';
import { useMathKnowledgeStore } from '../store/mathKnowledgeStore';
import { useEnglishKnowledgeStore } from '../store/englishKnowledgeStore';
import { getDueCount } from '../utils/spacedRepetition';

// ⚠️ 架构建议：以下 computed 直接访问 gameStore 深层嵌套属性（如 gameStore.speedChallenge?.bestScores?.base）。
//    建议在对应 Store 中暴露 getter（如 speedChallengeStore.bestScore），降低组件与 Store 内部结构的耦合度。

defineEmits([
  'back',
  'startShop',
  'startCashier',
  'startAdventure',
  'startSpeedChallenge',
  'startWorkshop',
  'startCardBattle',
  'startTargetedTraining',
  'startReview',
  'openLeaderboard'
]);

const gameStore = useGameStore();
const cashierStore = useCashierStore();

const adventureProgress = computed(() => {
  const area = gameStore.currentArea || 'area_1';
  const areaNum = area.replace('area_', '');
  return `第${areaNum}关`;
});

const shopCoins = computed(() => {
  return gameStore.playerCoins || 0;
});

const cashierBestScore = computed(() => {
  const scores = cashierStore.highScores;
  const best = Math.max(scores.easy, scores.medium, scores.hard);
  return best > 0 ? `最佳: ${best}分` : '未挑战';
});

const bestSpeedScore = computed(() => {
  const best = gameStore.speedChallenge?.bestScores?.base || null;
  return best ? `${best.score}分` : '未挑战';
});

const listedCount = computed(() => {
  return gameStore.workshop?.listedItems?.filter(item => !item.sold).length || 0;
});

const cardCollectionCount = computed(() => {
  return gameStore.cardBattle?.collection?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0;
});

const mathKnowledgeStore = useMathKnowledgeStore();
const englishKnowledgeStore = useEnglishKnowledgeStore();
const weakNodeCount = computed(() => {
  const records = mathKnowledgeStore.records;
  return Object.values(records).filter(r =>
    r.totalAttempts > 0 && (r.wrongCount / r.totalAttempts) > 0.3
  ).length;
});
const dueCount = computed(() => {
  return getDueCount(mathKnowledgeStore.records) + getDueCount(englishKnowledgeStore.records);
});
</script>

<style scoped>
.game-hall {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
}

.hall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.hall-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.btn-back {
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
}

.hall-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  flex: 1;
}

.hall-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.hall-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.adventure-card:hover {
  border-color: #764ba2;
}

.shop-card:hover {
  border-color: #f5576c;
}

.cashier-card:hover {
  border-color: #f97316;
}

.speed-card:hover {
  border-color: #f59e0b;
}

.workshop-card:hover {
  border-color: #10b981;
}

.card-card:hover {
  border-color: #8b5cf6;
}

.training-card:hover {
  border-color: #f59e0b;
}

.review-card:hover {
  border-color: #8b5cf6;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hall-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
}

.hall-card p {
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.card-status {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.85rem;
}

.hall-footer {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-leaderboard {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: none;
  border-radius: 25px;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-leaderboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4);
}

@media (max-width: 768px) {
  .game-hall {
    padding: 1rem;
  }
  
  .hall-cards {
    grid-template-columns: 1fr;
  }
}
</style>
