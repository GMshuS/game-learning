<template>
  <div class="card-world">
    <!-- 头部 -->
    <div class="header">
      <h2>🃏 卡牌世界</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <!-- 概要信息 -->
    <div class="summary-cards">
      <div class="summary-item">
        <div class="summary-icon">🃏</div>
        <div class="summary-data">
          <span class="summary-value">{{ collectionCount }}</span>
          <span class="summary-label">收藏总数</span>
        </div>
      </div>
      <div class="summary-item">
        <div class="summary-icon">💎</div>
        <div class="summary-data">
          <span class="summary-value">{{ shardCount }}</span>
          <span class="summary-label">碎片总数</span>
        </div>
      </div>
      <div class="summary-item">
        <div class="summary-icon">⭐</div>
        <div class="summary-data">
          <span class="summary-value">{{ totalCardsEarned }}</span>
          <span class="summary-label">累计获得</span>
        </div>
      </div>
    </div>

    <!-- 碎片详情 -->
    <div class="shard-details">
      <h4>💠 碎片详情</h4>
      <div class="shard-row">
        <span class="shard-subject">🧮 数学碎片</span>
        <div class="shard-bar-bg">
          <div class="shard-bar-fill math-fill" :style="{ width: shardMathPercent + '%' }" />
        </div>
        <span class="shard-value">{{ shardMath }}</span>
      </div>
      <div class="shard-row">
        <span class="shard-subject">🔤 英语碎片</span>
        <div class="shard-bar-bg">
          <div class="shard-bar-fill english-fill" :style="{ width: shardEnglishPercent + '%' }" />
        </div>
        <span class="shard-value">{{ shardEnglish }}</span>
      </div>
    </div>

    <!-- 合成卡牌按钮 -->
    <div class="craft-section">
      <button
        class="btn-craft"
        :disabled="shardCount < craftCost"
        @click="handleCraft"
      >
        ✨ 合成卡牌（消耗 {{ craftCost }} 碎片）
      </button>
      <p v-if="shardCount < craftCost" class="craft-hint">
        还需要 {{ craftCost - shardCount }} 碎片才能合成
      </p>
    </div>

    <!-- 合成结果弹窗 -->
    <div v-if="craftResult" class="craft-modal" @click.self="craftResult = null">
      <div class="craft-modal-content">
        <div class="craft-modal-icon">🎉</div>
        <h3>合成成功！</h3>
        <p class="craft-card-name">{{ craftResult.name }}</p>
        <p class="craft-card-rarity" :class="'rarity-' + craftResult.rarity">
          {{ rarityLabel(craftResult.rarity) }}
        </p>
        <p class="craft-card-desc">{{ craftResult.description || '' }}</p>
        <button class="btn-close-craft" @click="craftResult = null">太棒了！</button>
      </div>
    </div>

    <!-- 子入口导航 -->
    <div class="entrance-grid">
      <div class="entrance-card" @click="navigateTo('cardBattle')">
        <div class="entrance-icon">⚔️</div>
        <div class="entrance-info">
          <h3>卡牌对战</h3>
          <p>组建卡组，挑战AI对手</p>
        </div>
        <div class="entrance-arrow">→</div>
      </div>

      <div class="entrance-card" @click="navigateTo('cardCollection')">
        <div class="entrance-icon">📚</div>
        <div class="entrance-info">
          <h3>卡牌收藏</h3>
          <p>查看和管理你的卡牌</p>
        </div>
        <div class="entrance-arrow">→</div>
      </div>

      <div class="entrance-card" @click="navigateTo('cardPack')">
        <div class="entrance-icon">🎁</div>
        <div class="entrance-info">
          <h3>开卡包</h3>
          <p>开启卡包获得稀有卡牌</p>
        </div>
        <div class="entrance-arrow">→</div>
      </div>
    </div>

    <!-- 跨学科统计 -->
    <div class="cross-domain-section">
      <h4>📊 跨学科统计</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-num">{{ crossDomainStats.mathCardsEarned }}</span>
          <span class="stat-label">数学卡牌获得</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ crossDomainStats.englishCardsEarned }}</span>
          <span class="stat-label">英语卡牌获得</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ battleStats.wins }}</span>
          <span class="stat-label">对战胜利</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ battleStats.totalBattles }}</span>
          <span class="stat-label">总对战</span>
        </div>
      </div>
    </div>

    <!-- 最近获得（如果有） -->
    <div v-if="recentAcquisitions.length > 0" class="recent-section">
      <h4>📋 最近获得</h4>
      <div class="recent-list">
        <div
          v-for="(item, index) in recentAcquisitions"
          :key="index"
          class="recent-item"
        >
          <span class="recent-icon">{{ getCardIcon(item.cardId) || '🃏' }}</span>
          <span class="recent-name">{{ getCardName(item.cardId) || '未知卡牌' }}</span>
          <span class="recent-source">{{ getSourceLabel(item.source) }}</span>
          <span class="recent-time">{{ formatTime(item.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCardStore } from '../store/cardStore';
import { getCardById } from '../config/cards';

const emit = defineEmits(['back', 'navigate']);

const cardStore = useCardStore();

const craftCost = ref(10);
const craftResult = ref(null);

const recentAcquisitions = ref([]);

const collectionCount = computed(() => {
  return cardStore.collectionCount || 0;
});

const shardCount = computed(() => {
  return cardStore.shards?.total || 0;
});

const shardMath = computed(() => {
  return cardStore.shards?.math || 0;
});

const shardEnglish = computed(() => {
  return cardStore.shards?.english || 0;
});

const shardMathPercent = computed(() => {
  const total = shardCount.value;
  if (total === 0) return 0;
  return (shardMath.value / total) * 100;
});

const shardEnglishPercent = computed(() => {
  const total = shardCount.value;
  if (total === 0) return 0;
  return (shardEnglish.value / total) * 100;
});

const totalCardsEarned = computed(() => {
  return cardStore.totalCardsEarned || 0;
});

const crossDomainStats = computed(() => {
  return cardStore.crossDomainStats || { mathCardsEarned: 0, englishCardsEarned: 0 };
});

const battleStats = computed(() => {
  return cardStore.battleStats || { wins: 0, losses: 0, totalBattles: 0 };
});

function navigateTo(view) {
  emit('navigate', view);
}

function handleCraft() {
  const card = cardStore.craftCard(craftCost.value);
  if (card) {
    craftResult.value = card;
    // 刷新最近获得
    refreshRecent();
  }
}

function rarityLabel(rarity) {
  const labels = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
  return labels[rarity] || rarity;
}

function getCardIcon(cardId) {
  const card = getCardById(cardId);
  return card ? card.icon || '🃏' : '🃏';
}

function getCardName(cardId) {
  const card = getCardById(cardId);
  return card ? card.name : null;
}

function getSourceLabel(source) {
  const labels = { math: '🧮 数学', english: '🔤 英语', craft: '✨ 合成', pack: '🎁 卡包', battle: '⚔️ 对战' };
  return labels[source] || source || '';
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function refreshRecent() {
  if (cardStore.recentAcquisitions && cardStore.recentAcquisitions.length > 0) {
    recentAcquisitions.value = cardStore.recentAcquisitions.slice(-10).reverse();
  }
}

onMounted(() => {
  refreshRecent();
});
</script>

<style scoped>
.card-world {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 概要信息卡片 */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.summary-icon {
  font-size: 2rem;
}

.summary-data {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.summary-label {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 入口导航 */
.entrance-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.entrance-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entrance-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.entrance-icon {
  font-size: 2.5rem;
  min-width: 3rem;
  text-align: center;
}

.entrance-info {
  flex: 1;
}

.entrance-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.2rem;
}

.entrance-info p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}

.entrance-arrow {
  font-size: 1.5rem;
  opacity: 0.5;
  transition: all 0.3s;
}

.entrance-card:hover .entrance-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 碎片详情 */
.shard-details {
  margin-bottom: 1.2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.shard-details h4 {
  margin: 0 0 0.8rem 0;
  font-size: 0.95rem;
  opacity: 0.8;
}

.shard-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
}

.shard-row:last-child {
  margin-bottom: 0;
}

.shard-subject {
  font-size: 0.85rem;
  min-width: 6rem;
  font-weight: bold;
}

.shard-bar-bg {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  overflow: hidden;
}

.shard-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.shard-bar-fill.math-fill {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.shard-bar-fill.english-fill {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.shard-value {
  font-size: 1rem;
  font-weight: bold;
  min-width: 2rem;
  text-align: right;
}

/* 合成区域 */
.craft-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.btn-craft {
  width: 100%;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-craft:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.btn-craft:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.craft-hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  opacity: 0.5;
}

/* 合成结果弹窗 */
.craft-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.craft-modal-content {
  background: linear-gradient(135deg, #1e293b, #334155);
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 340px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
}

.craft-modal-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.craft-modal-content h3 {
  margin: 0 0 0.8rem;
  font-size: 1.5rem;
}

.craft-card-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 0.4rem;
}

.craft-card-rarity {
  font-size: 0.9rem;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 0.6rem;
}

.craft-card-rarity.rarity-common { color: #94a3b8; background: rgba(148, 163, 184, 0.2); }
.craft-card-rarity.rarity-rare { color: #3b82f6; background: rgba(59, 130, 246, 0.2); }
.craft-card-rarity.rarity-epic { color: #8b5cf6; background: rgba(139, 92, 246, 0.2); }
.craft-card-rarity.rarity-legendary { color: #f59e0b; background: rgba(245, 158, 11, 0.2); }

.craft-card-desc {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0 0 1.2rem;
  line-height: 1.5;
}

.btn-close-craft {
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close-craft:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
}

/* 跨学科统计 */
.cross-domain-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.cross-domain-section h4 {
  margin: 0 0 0.8rem 0;
  font-size: 0.95rem;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.stat-num {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fbbf24;
}

.cross-domain-section .stat-label {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-top: 0.2rem;
}

/* 最近获得 */
.recent-section {
  margin-top: 0.5rem;
}

.recent-section h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  opacity: 0.8;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.recent-icon {
  font-size: 1.2rem;
}

.recent-name {
  flex: 1;
  font-size: 0.9rem;
}

.recent-source {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-right: 0.5rem;
}

.recent-time {
  font-size: 0.75rem;
  opacity: 0.4;
  white-space: nowrap;
}

/* 响应式 */
@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .entrance-card {
    padding: 1rem;
  }

  .header h2 {
    font-size: 1.4rem;
  }
}
</style>
