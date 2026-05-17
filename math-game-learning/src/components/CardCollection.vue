<template>
  <div class="card-collection">
    <div class="header">
      <h2>📚 卡牌收藏</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <div class="collection-stats">
      <span>收藏: {{ store.collectionCount }} 张</span>
      <span>卡组: {{ store.deck.length }}/15</span>
      <button class="btn-pack" @click="$emit('openPack')">🎁 开卡包</button>
    </div>

    <div class="rarity-sections">
      <div v-for="rarity in rarities" :key="rarity.id" class="rarity-section">
        <h3 :style="{ color: rarity.color }">{{ rarity.label }} ({{ countByRarity(rarity.id) }})</h3>
        <div class="card-grid">
          <div v-for="card in cardsByRarity(rarity.id)" :key="card.id" class="collection-card"
               :class="{ 'in-deck': store.deck.includes(card.id) }"
               @click="toggleDeck(card.id)">
            <div class="cc-rarity" :style="{ background: rarity.color }">{{ rarity.label }}</div>
            <div class="cc-name">{{ card.name }}</div>
            <div class="cc-type">{{ getCardTypeIcon(card.type) }}</div>
            <div class="cc-value" v-if="card.value > 0">{{ card.value }}</div>
            <div class="cc-qty" v-if="getCardQty(card.id) > 1">×{{ getCardQty(card.id) }}</div>
            <div class="cc-deck-badge" v-if="store.deck.includes(card.id)">卡组中</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCardStore } from '../store/cardStore'
import { cards, getCardById, rarityConfig, getCardsByGrade } from '../config/cards'
import { useGameStore } from '../store/gameStore'

const emit = defineEmits(['back'])

const store = useCardStore()
const gameStore = useGameStore()

const rarities = [
  { id: 'common', label: '普通', color: '#94a3b8' },
  { id: 'rare', label: '稀有', color: '#3b82f6' },
  { id: 'epic', label: '史诗', color: '#a855f7' },
  { id: 'legendary', label: '传说', color: '#fbbf24' }
]

function cardsByRarity(rarity) {
  const grade = gameStore.playerGrade || 1
  return cards.filter(c => c.rarity === rarity && c.grade[0] <= grade && c.grade[1] >= grade)
}

function countByRarity(rarity) {
  return cardsByRarity(rarity).filter(c => store.hasCard(c.id)).length
}

function getCardQty(cardId) {
  const entry = store.collection.find(c => c.cardId === cardId)
  return entry ? entry.quantity : 0
}

function getCardTypeIcon(type) {
  switch (type) {
    case 'attack': return '⚔️'
    case 'defense': return '🛡️'
    case 'heal': return '💚'
    case 'special': return '✨'
    case 'equation': return '📐'
    default: return '?'
  }
}

function toggleDeck(cardId) {
  if (store.deck.includes(cardId)) {
    store.removeFromDeck(cardId)
  } else {
    store.addToDeck(cardId)
  }
  gameStore.cardBattle = store.getSaveData()
  gameStore.saveGame()
}
</script>

<style scoped>
.card-collection {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: #fff;
  overflow-y: auto;
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.header h2 { margin: 0; }
.btn-back { padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; color: #fff; cursor: pointer; }

.collection-stats { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 10px; }
.btn-pack { margin-left: auto; padding: 0.4rem 1rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border: none; border-radius: 15px; color: #000; font-weight: bold; cursor: pointer; }

.rarity-sections { display: flex; flex-direction: column; gap: 1.5rem; }
.rarity-section h3 { margin: 0 0 0.5rem; }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.8rem; }

.collection-card {
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 0.8rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.collection-card:hover { border-color: rgba(255,255,255,0.3); }
.collection-card.in-deck { border-color: #4ade80; }

.cc-rarity { font-size: 0.6rem; padding: 0.1rem 0.4rem; border-radius: 8px; color: #fff; display: inline-block; margin-bottom: 0.3rem; }
.cc-name { font-size: 0.75rem; font-weight: bold; margin-bottom: 0.3rem; }
.cc-type { font-size: 1.2rem; }
.cc-value { color: #fbbf24; font-weight: bold; }
.cc-qty { position: absolute; top: 5px; right: 5px; font-size: 0.7rem; color: #fbbf24; }
.cc-deck-badge { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: #4ade80; color: #000; font-size: 0.6rem; padding: 0.1rem 0.4rem; border-radius: 8px; white-space: nowrap; }

@media (max-width: 768px) {
  .card-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
}
</style>
