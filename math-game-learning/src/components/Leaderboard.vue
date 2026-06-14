<template>
  <div class="leaderboard">
    <div class="lb-header">
      <h2>🏆 排行榜</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <div class="lb-tabs">
      <button
        v-for="mode in modeTabs"
        :key="mode.id"
        class="tab-btn"
        :class="{ active: activeMode === mode.id }"
        @click="activeMode = mode.id"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="lb-content">
      <div v-if="playerBest" class="lb-player-entry">
        <div class="lb-rank lb-player-best">🌟</div>
        <div class="lb-name">你</div>
        <div class="lb-score">{{ playerBest.score }} 分</div>
        <div class="lb-date">{{ formatDate(playerBest.date) }}</div>
      </div>

      <div class="lb-list">
        <div
          v-for="(entry, index) in sortedEntries"
          :key="entry.id"
          class="lb-entry"
        >
          <div class="lb-rank" :class="rankClass(index)">{{ index + 1 }}</div>
          <div class="lb-name">{{ entry.name }}</div>
          <div class="lb-score">{{ entry.score }} 分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '../store/gameStore';
import leaderboardConfig from '../config/leaderboard';

const emit = defineEmits(['back']);

const gameStore = useGameStore();
const activeMode = ref('speed_base');

const modeTabs = [
  { id: 'speed_base', label: '基础速算' },
  { id: 'speed_blitz', label: '闪电抢答' },
  { id: 'speed_survival', label: '生存模式' }
];

const playerBest = computed(() => {
  return gameStore.leaderboard?.playerBest?.[activeMode.value] || null;
});

const sortedEntries = computed(() => {
  const entries = gameStore.leaderboard?.virtualPlayers || [];
  return [...entries]
    .filter(e => e.mode === activeMode.value)
    .sort((a, b) => b.score - a.score)
    .slice(0, leaderboardConfig.VIRTUAL_PLAYER_COUNT);
});

const rankClass = (index) => {
  if (index === 0) return 'rank-gold';
  if (index === 1) return 'rank-silver';
  if (index === 2) return 'rank-bronze';
  return '';
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

function generateVirtualPlayers() {
  const now = Date.now();
  const range = leaderboardConfig.scoreRanges[activeMode.value];
  if (!range) return;

  const existing = gameStore.leaderboard?.virtualPlayers?.filter(e => e.mode === activeMode.value) || [];
  if (existing.length >= leaderboardConfig.VIRTUAL_PLAYER_COUNT) return;

  const players = [];
  const usedNames = new Set(existing.map(e => e.name));

  for (let i = 0; i < leaderboardConfig.VIRTUAL_PLAYER_COUNT; i++) {
    let name;
    do {
      name = leaderboardConfig.virtualPlayerNames[Math.floor(Math.random() * leaderboardConfig.virtualPlayerNames.length)];
    } while (usedNames.has(name));
    usedNames.add(name);

    const score = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    players.push({
      id: `vp_${activeMode.value}_${i}`,
      name,
      score,
      mode: activeMode.value,
      createdAt: now
    });
  }

  if (!gameStore.leaderboard) {
    gameStore.leaderboard = gameStore.getDefaultLeaderboard();
  }
  gameStore.leaderboard.virtualPlayers.push(...players);
  gameStore.leaderboard.lastGenerated = now;
  gameStore.saveGame();
}

function updatePlayerBest(mode, score) {
  const current = gameStore.leaderboard?.playerBest?.[mode];
  if (!current || score > current.score) {
    if (!gameStore.leaderboard) {
      gameStore.leaderboard = gameStore.getDefaultLeaderboard();
    }
    gameStore.leaderboard.playerBest[mode] = { score, date: Date.now() };

    // 动态难度：虚拟玩家分数增长
    const range = leaderboardConfig.scoreRanges[mode];
    if (range && gameStore.leaderboard.virtualPlayers) {
      gameStore.leaderboard.virtualPlayers.forEach(vp => {
        if (vp.mode === mode) {
          const growth = 1 + Math.random() * (leaderboardConfig.SCORE_GROWTH.max - leaderboardConfig.SCORE_GROWTH.min) + leaderboardConfig.SCORE_GROWTH.min - 1;
          vp.score = Math.floor(vp.score * growth);
        }
      });
    }
    gameStore.saveGame();
  }
}

onMounted(() => {
  if (!gameStore.leaderboard) {
    gameStore.leaderboard = gameStore.getDefaultLeaderboard();
  }
  generateVirtualPlayers();
});

defineExpose({ updatePlayerBest });
</script>

<style scoped>
.leaderboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #fff;
  overflow-y: auto;
}

.lb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.lb-header h2 { margin: 0; font-size: 1.8rem; }

.btn-back {
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover { background: rgba(255,255,255,0.25); }

.lb-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  font-weight: bold;
  border-color: transparent;
}

.lb-player-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.lb-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lb-entry, .lb-player-entry {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
}

.lb-rank {
  font-weight: bold;
  text-align: center;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}

.rank-gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
.rank-silver { background: linear-gradient(135deg, #94a3b8, #64748b); color: #fff; }
.rank-bronze { background: linear-gradient(135deg, #d97706, #b45309); color: #fff; }

.lb-score {
  font-weight: bold;
  color: #fbbf24;
}

.lb-date {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

@media (max-width: 768px) {
  .leaderboard { padding: 1rem; }
  .lb-tabs { flex-wrap: wrap; }
}
</style>
