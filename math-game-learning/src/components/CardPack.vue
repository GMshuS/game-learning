<template>
  <div class="card-pack">
    <div class="header">
      <h2>🎁 开卡包</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <!-- 卡包选择 -->
    <div v-if="!openedCards" class="pack-select">
      <div v-for="(pack, id) in packs" :key="id" class="pack-card" @click="buyPack(id)">
        <div class="pack-icon">{{ pack.icon }}</div>
        <h3>{{ pack.name }}</h3>
        <div class="pack-price">
          <span v-if="pack.currency === 'gems'">💎 {{ pack.price }}</span>
          <span v-else>💰 {{ pack.price }}</span>
        </div>
        <p class="pack-desc">5张卡牌</p>
      </div>
    </div>

    <!-- 开包动画/结果 -->
    <div v-else class="pack-result">
      <div class="result-title">🎉 获得以下卡牌</div>
      <div class="result-cards">
        <div v-for="(result, i) in openedCards" :key="i" class="result-card"
             :style="{ animationDelay: i * 0.2 + 's' }">
          <div class="rc-new" v-if="result.isNew">NEW!</div>
          <div class="rc-name">{{ result.card.name }}</div>
          <div class="rc-rarity" :style="{ color: rarityConfig[result.card.rarity].color }">
            {{ rarityConfig[result.card.rarity].label }}
          </div>
          <div class="rc-type">{{ getCardTypeIcon(result.card.type) }}</div>
        </div>
      </div>
      <button class="btn-again" @click="openedCards = null">继续开包</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCardStore } from '../store/cardStore'
import { packConfig, rarityConfig } from '../config/cards'

const emit = defineEmits(['back', 'packOpened'])

const store = useCardStore()
const openedCards = ref(null)

const packs = packConfig

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

function buyPack(packType) {
  const results = store.openPack(packType)
  if (results.length > 0) {
    openedCards.value = results
    emit('packOpened', results)
  } else {
    alert('货币不足！')
  }
}
</script>

<style scoped>
.card-pack {
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
.btn-back { padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; color: #fff; cursor: pointer; }

.pack-select { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }

.pack-card {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.pack-card:hover { transform: translateY(-3px); border-color: #fbbf24; }
.pack-icon { font-size: 3rem; margin-bottom: 1rem; }
.pack-card h3 { margin: 0.5rem 0; }
.pack-price { font-size: 1.2rem; font-weight: bold; color: #fbbf24; margin: 0.5rem 0; }
.pack-desc { margin: 0; opacity: 0.7; font-size: 0.85rem; }

.pack-result { text-align: center; }
.result-title { font-size: 1.5rem; margin-bottom: 2rem; }

.result-cards { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }

.result-card {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 120px;
  position: relative;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.rc-new { position: absolute; top: -8px; right: -8px; background: #ef4444; color: #fff; padding: 0.2rem 0.5rem; border-radius: 8px; font-size: 0.7rem; font-weight: bold; }
.rc-name { font-weight: bold; margin-bottom: 0.3rem; }
.rc-rarity { font-size: 0.8rem; }
.rc-type { font-size: 1.5rem; margin-top: 0.5rem; }

.btn-again { padding: 0.8rem 2rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border: none; border-radius: 25px; color: #000; font-weight: bold; cursor: pointer; }

@media (max-width: 768px) {
  .pack-select { grid-template-columns: 1fr 1fr; }
}
</style>
