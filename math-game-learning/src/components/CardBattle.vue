<template>
  <div class="card-battle">
    <GameTutorial
      v-if="showTutorial"
      title="🃏 卡牌对战玩法说明"
      :steps="cardBattleTutorialSteps"
      @close="closeTutorial"
    />

    <!-- 对战选择 -->
    <div v-if="!store.battle" class="battle-select">
      <div class="header">
        <h2>🃏 卡牌对战</h2>
        <div class="header-actions">
          <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
          <button class="btn-back" @click="$emit('back')">← 返回</button>
        </div>
      </div>

      <div class="deck-info">
        <p>卡组: {{ store.deck.length }}/15 张 (最少10张)</p>
        <button class="btn-deck" @click="$emit('openCollection')">管理卡组</button>
      </div>

      <div class="difficulty-select">
        <h3>选择难度</h3>
        <div class="diff-options">
          <div
            v-for="diff in difficulties" :key="diff.id" class="diff-card"
            :class="{ recommended: diff.recommended }"
            @click="startBattle(diff.id)">
            <div class="diff-icon">{{ diff.icon }}</div>
            <h4>{{ diff.name }}</h4>
            <p>{{ diff.desc }}</p>
            <span v-if="diff.recommended" class="rec-badge">推荐</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 对战中 -->
    <div v-else-if="!store.battle.winner" class="battle-area">
      <!-- AI 区域 -->
      <div class="ai-area">
        <div class="hp-bar">
          <span>AI</span>
          <div class="hp-track">
            <div class="hp-fill ai-hp" :style="{ width: (store.battle.aiHP / store.battle.aiMaxHP * 100) + '%' }" />
          </div>
          <span>{{ store.battle.aiHP }}/{{ store.battle.aiMaxHP }}</span>
        </div>
        <div class="ai-hand">
          <div v-for="(_, i) in store.battle.aiHand" :key="i" class="card-back">🂠</div>
        </div>
      </div>

      <!-- 战斗日志 -->
      <div class="battle-log">
        <div v-for="(msg, i) in store.battle.log.slice(-5)" :key="i" class="log-msg">{{ msg }}</div>
      </div>

      <!-- 玩家区域 -->
      <div class="player-area">
        <div class="hp-bar">
          <span>你</span>
          <div class="hp-track">
            <div class="hp-fill player-hp" :style="{ width: (store.battle.playerHP / store.battle.playerMaxHP * 100) + '%' }" />
          </div>
          <span>{{ store.battle.playerHP }}/{{ store.battle.playerMaxHP }}</span>
        </div>

        <!-- 方程答题 -->
        <div v-if="store.battle.phase === 'answer'" class="equation-dialog">
          <p>解方程: {{ getEquation() }}</p>
          <div class="eq-options">
            <button v-for="opt in getEquationOptions()" :key="opt" class="eq-opt" @click="store.answerEquation(opt)">
              x = {{ opt }}
            </button>
          </div>
        </div>

        <!-- 手牌 -->
        <div class="player-hand">
          <div
            v-for="(cardId, i) in store.battle.playerHand" :key="i" class="hand-card"
            :class="{ disabled: store.battle.turn !== 'player' || store.battle.phase !== 'play' }"
            @click="store.battle.phase === 'play' && store.battle.turn === 'player' ? store.playCard(i) : null">
            <div class="card-name">{{ getCardName(cardId) }}</div>
            <div class="card-type">{{ getCardTypeIcon(cardId) }}</div>
            <div v-if="getCardValue(cardId) > 0" class="card-value">{{ getCardValue(cardId) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算 -->
    <div v-else class="battle-result">
      <h2>{{ store.battle.winner === 'player' ? '🎉 胜利！' : '😤 失败...' }}</h2>
      <div class="result-actions">
        <button class="btn-retry" @click="store.startBattle(store.battle.difficulty)">再来一局</button>
        <button class="btn-back-result" @click="$emit('back')">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCardStore } from '../store/cardStore';
import { getCardById, getCardsByGrade } from '../config/cards';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import GameTutorial from './GameTutorial.vue';

const emit = defineEmits(['back', 'openCollection', 'battleEnd']);

const store = useCardStore();
const gameStore = useGameStore();
const settingsStore = useSettingsStore();

const showTutorial = ref(false);

const cardBattleTutorialSteps = [
  {
    title: '卡组构建',
    description: '从卡牌收藏中组建10-15张卡牌的卡组。卡牌按年级分组，只能使用对应年级的卡牌。点击"管理卡组"可以编辑你的卡组。'
  },
  {
    title: '卡牌类型',
    description: '共有5种卡牌：⚔️攻击（对AI造成伤害）、🛡️防御（减少受到伤害）、💚治疗（恢复HP）、✨特殊（额外效果）、📐方程（需解方程发动）。'
  },
  {
    title: '对战流程',
    description: '双方初始30HP，开局各抽3张牌。每回合抽1张牌，手牌上限5张。点击手牌出牌，轮到你的回合时才能出牌。'
  },
  {
    title: '方程卡牌',
    description: '方程卡牌（5-6年级）出牌时需要解方程，答对才能发动效果。例如"x + 5 = 12"，需要选择正确的x值。'
  },
  {
    title: '难度选择',
    description: '简单：AI随机出牌；中等：AI根据HP情况有基本策略；困难：AI计算所有卡牌效果后选择最优出牌。'
  },
  {
    title: '胜负条件',
    description: '将AI的HP归零即可获胜，获得金币奖励。己方HP归零则失败。战斗日志会记录每回合的出牌和效果。'
  }
];

const closeTutorial = () => {
  showTutorial.value = false;
};

const difficulties = computed(() => {
  const grade = settingsStore.grade;
  return [
    { id: 'easy', icon: '😊', name: '简单', desc: 'AI 随机出牌', recommended: grade <= 2 },
    { id: 'normal', icon: '🤔', name: '中等', desc: 'AI 有基本策略', recommended: grade >= 3 && grade <= 4 },
    { id: 'hard', icon: '😈', name: '困难', desc: 'AI 最优决策', recommended: grade >= 5 }
  ];
});

function startBattle(diff) {
  if (store.startBattle(diff)) {
    // ok
  } else {
    alert('卡组无效！需要 10-15 张卡牌');
  }
}

function getCardName(id) {
  const card = getCardById(id);
  return card ? card.name : '?';
}

function getCardTypeIcon(id) {
  const card = getCardById(id);
  if (!card) return '?';
  switch (card.type) {
  case 'attack': return '⚔️';
  case 'defense': return '🛡️';
  case 'heal': return '💚';
  case 'special': return '✨';
  case 'equation': return '📐';
  default: return '?';
  }
}

function getCardValue(id) {
  const card = getCardById(id);
  return card ? card.value : 0;
}

function getEquation() {
  const card = getCardById(store.battle.playedCard);
  return card ? card.equation : '';
}

function getEquationOptions() {
  const card = getCardById(store.battle.playedCard);
  if (!card) return [];
  const answer = card.answer;
  const opts = new Set([answer]);
  while (opts.size < 4) {
    opts.add(answer + Math.floor(Math.random() * 10) - 5);
  }
  return [...opts].filter(v => v >= 0).sort(() => Math.random() - 0.5).slice(0, 4);
}

onMounted(() => {
  if (!gameStore.cardBattle) gameStore.cardBattle = gameStore.getDefaultCardBattle();
  store.loadData(gameStore.cardBattle);
});
</script>

<style scoped>
.card-battle {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: #fff;
  overflow-y: auto;
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.header h2 { margin: 0; }

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-back { padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; color: #fff; cursor: pointer; }

.btn-help {
  padding: 0.5rem 1rem;
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

.deck-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 10px; }
.btn-deck { padding: 0.4rem 1rem; background: #3b82f6; border: none; border-radius: 15px; color: #fff; cursor: pointer; }

.diff-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.diff-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; position: relative; border: 2px solid transparent; }
.diff-card:hover { border-color: #fbbf24; }
.diff-card.recommended { border-color: #4ade80; }
.diff-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.diff-card h4 { margin: 0.5rem 0 0.3rem; }
.diff-card p { margin: 0; font-size: 0.8rem; opacity: 0.7; }
.rec-badge { position: absolute; top: -8px; right: -8px; background: #4ade80; color: #000; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.7rem; font-weight: bold; }

.battle-area { flex: 1; display: flex; flex-direction: column; gap: 1rem; }

.hp-bar { display: flex; align-items: center; gap: 0.5rem; }
.hp-track { flex: 1; height: 12px; background: rgba(255,255,255,0.2); border-radius: 6px; overflow: hidden; }
.hp-fill { height: 100%; transition: width 0.3s; }
.player-hp { background: linear-gradient(90deg, #4ade80, #22c55e); }
.ai-hp { background: linear-gradient(90deg, #ef4444, #f97316); }

.ai-hand { display: flex; gap: 0.5rem; justify-content: center; }
.card-back { font-size: 2rem; opacity: 0.5; }

.battle-log { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 0.5rem; min-height: 80px; max-height: 120px; overflow-y: auto; }
.log-msg { font-size: 0.8rem; padding: 0.2rem 0; opacity: 0.8; }

.player-hand { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }
.hand-card { background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; padding: 0.8rem; text-align: center; cursor: pointer; min-width: 80px; transition: all 0.2s; }
.hand-card:hover:not(.disabled) { transform: translateY(-5px); border-color: #fbbf24; }
.hand-card.disabled { opacity: 0.4; cursor: not-allowed; }
.card-name { font-size: 0.8rem; font-weight: bold; }
.card-type { font-size: 1.2rem; }
.card-value { font-size: 1rem; color: #fbbf24; font-weight: bold; }

.equation-dialog { background: rgba(0,0,0,0.4); border-radius: 12px; padding: 1rem; text-align: center; margin-bottom: 1rem; }
.eq-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem; }
.eq-opt { padding: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; cursor: pointer; }
.eq-opt:hover { background: rgba(255,255,255,0.2); }

.battle-result { text-align: center; padding: 3rem; }
.result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
.btn-retry { padding: 0.8rem 2rem; background: linear-gradient(135deg, #4ade80, #22c55e); border: none; border-radius: 25px; color: #fff; cursor: pointer; }
.btn-back-result { padding: 0.8rem 2rem; background: rgba(255,255,255,0.2); border: none; border-radius: 25px; color: #fff; cursor: pointer; }

@media (max-width: 768px) {
  .diff-options { grid-template-columns: 1fr; }
  .hand-card { min-width: 60px; padding: 0.5rem; }
}
</style>
