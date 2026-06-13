<template>
  <div class="inventory-view">
    <div class="inventory-header">
      <h2>🎒 背包</h2>
      <div class="header-actions">
        <button class="btn-battle" @click="openBattlePrepare">⚔️ 战斗准备</button>
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </div>

    <div class="inventory-content">
      <!-- 筛选标签 -->
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          class="filter-tab"
          :class="{ active: activeFilter === tab.id }"
          @click="activeFilter = tab.id"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <!-- 战斗槽位区 -->
      <div class="battle-slots-section">
        <h3>⚔️ 战斗装备栏</h3>
        <div class="battle-slots">
          <div
            v-for="(slotId, index) in inventoryStore.battleSlots"
            :key="index"
            class="battle-slot"
            :class="{ 'slot-equipped': slotId !== null, 'slot-empty': slotId === null }"
            @click="onBattleSlotClick(index)"
          >
            <template v-if="slotId">
              <div class="slot-icon">{{ getItemById(slotId)?.icon || '❓' }}</div>
              <div class="slot-name">{{ getItemById(slotId)?.name || '未知' }}</div>
              <div class="slot-effect">{{ getItemById(slotId)?.effect?.description || '' }}</div>
              <button class="btn-unequip" @click.stop="unequipFromSlot(index)">✕</button>
            </template>
            <template v-else>
              <div class="slot-placeholder">＋</div>
              <div class="slot-label">空槽位</div>
            </template>
          </div>
        </div>
        <div class="slot-hint">点击已装备物品可卸下，点击空槽位从背包选择装备</div>
      </div>

      <!-- 物品网格 -->
      <div class="items-section">
        <h3>
          {{ currentFilterLabel }}
          <span class="item-count">({{ filteredItems.length }})</span>
        </h3>

        <div v-if="filteredItems.length === 0" class="empty-items">
          <div class="empty-icon">📦</div>
          <p>暂无物品</p>
        </div>

        <div v-else class="items-grid">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="item-card"
            :class="{ 'card-selected': selectedItem?.id === item.id, 'card-battle': isInBattleSlot(item.id) }"
            @click="selectItem(item)"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-qty">×{{ item.quantity }}</div>
            </div>
            <div v-if="item.effect" class="item-effect-tag">
              {{ getEffectTypeLabel(item.effect.type) }}
            </div>
            <div v-if="isInBattleSlot(item.id)" class="item-equipped-badge">装备中</div>
          </div>
        </div>
      </div>

      <!-- 收藏品集齐进度 -->
      <div v-if="collectibleSets.length > 0" class="collectible-section">
        <h3>📚 收藏品集</h3>
        <div
          v-for="set in collectibleSets"
          :key="set.id"
          class="collectible-set"
        >
          <div class="set-header">
            <span>{{ set.icon }} {{ set.name }}</span>
            <span class="set-progress">{{ getSetProgress(set) }} / {{ set.requiredProductIds.length }}</span>
          </div>
          <div class="set-bar">
            <div
              class="set-bar-fill"
              :style="{ width: getSetPercent(set) + '%' }"
            ></div>
          </div>
          <div class="set-items">
            <span
              v-for="pid in set.requiredProductIds"
              :key="pid"
              class="set-item"
              :class="{ collected: isCollectibleCollected(pid) }"
            >
              {{ getCollectibleIcon(pid) }}
              {{ getCollectibleName(pid) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 物品详情面板 -->
    <div v-if="selectedItem" class="detail-panel" @click.self="selectedItem = null">
      <div class="detail-content" @click.stop>
        <button class="detail-close" @click="selectedItem = null">✕</button>
        <div class="detail-icon">{{ selectedItem.icon }}</div>
        <h3 class="detail-name">{{ selectedItem.name }}</h3>
        <p class="detail-desc">{{ selectedItem.effect?.description || '普通物品' }}</p>

        <div v-if="selectedItem.effect" class="detail-effect">
          <p>效果类型：{{ getEffectTypeLabel(selectedItem.effect.type) }}</p>
          <p>效果目标：{{ selectedItem.effect.target }}</p>
          <p>效果数值：{{ selectedItem.effect.value }}</p>
          <p>持续方式：{{ selectedItem.effect.duration === 'battle' ? '整场战斗' : '一次性' }}</p>
        </div>

        <div class="detail-actions">
          <button
            v-if="!isInBattleSlot(selectedItem.id) && canEquip(selectedItem)"
            class="btn-equip"
            @click="equipSelectedToSlot"
          >
            ⚔️ 装备到战斗栏
          </button>
          <button
            v-if="isInBattleSlot(selectedItem.id)"
            class="btn-unequip-all"
            @click="unequipSelectedItem"
          >
            📦 从战斗栏卸下
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../store/inventoryStore'
import { getCollectibleSetInfo, isCollectible } from '../config/shopEffects'
import { getProductById } from '../config/shop'

const inventoryStore = useInventoryStore()
const emit = defineEmits(['back', 'openBattlePrepare'])

const activeFilter = ref('all')
const selectedItem = ref(null)

const filterTabs = [
  { id: 'all', name: '全部', icon: '📦' },
  { id: 'battle', name: '战斗道具', icon: '⚔️' },
  { id: 'collectible', name: '收藏品', icon: '🏆' },
  { id: 'equipment', name: '装备', icon: '🛡️' }
]

const currentFilterLabel = computed(() => {
  const tab = filterTabs.find(t => t.id === activeFilter.value)
  return tab ? `${tab.icon} ${tab.name}` : '全部'
})

const filteredItems = computed(() => {
  let items = [...inventoryStore.items]

  switch (activeFilter.value) {
    case 'battle':
      items = items.filter(item => item.effect && item.effect.target !== 'collectible')
      break
    case 'collectible':
      items = items.filter(item => isCollectible(item.productId))
      break
    case 'equipment':
      items = items.filter(item => !item.effect || item.effect.target === 'collectible')
      break
    default:
      break
  }

  return items
})

const collectibleSets = computed(() => {
  const sets = getCollectibleSetInfo()
  return Object.values(sets)
})

function getItemById(itemId) {
  return inventoryStore.items.find(i => i.id === itemId) || null
}

function isInBattleSlot(itemId) {
  return inventoryStore.battleSlots.includes(itemId)
}

function canEquip(item) {
  // 只有战斗道具（非收藏品）可以装备
  return item.effect && item.effect.target !== 'collectible'
}

function selectItem(item) {
  selectedItem.value = item
}

function onBattleSlotClick(index) {
  const slotId = inventoryStore.battleSlots[index]
  if (slotId !== null) {
    // 点击已装备物品 → 选中并打开详情
    const item = getItemById(slotId)
    if (item) {
      selectedItem.value = item
    }
  }
  // 空槽位点击通过点击物品卡片装备
}

function unequipFromSlot(index) {
  inventoryStore.unequipFromBattleSlot(index)
}

function equipSelectedToSlot() {
  if (!selectedItem.value) return

  // 找到第一个空槽位
  const emptySlot = inventoryStore.battleSlots.findIndex(s => s === null)
  if (emptySlot === -1) {
    alert('战斗栏已满，请先卸下其他物品')
    return
  }

  inventoryStore.equipToBattleSlot(selectedItem.value.id, emptySlot)
  selectedItem.value = null
}

function unequipSelectedItem() {
  if (!selectedItem.value) return

  for (let i = 0; i < inventoryStore.battleSlots.length; i++) {
    if (inventoryStore.battleSlots[i] === selectedItem.value.id) {
      inventoryStore.unequipFromBattleSlot(i)
      break
    }
  }
  selectedItem.value = null
}

function getEffectTypeLabel(type) {
  const labels = {
    buff: '✨ 增益',
    heal: '💚 治疗',
    special: '⭐ 特殊'
  }
  return labels[type] || type
}

function isCollectibleCollected(productId) {
  return inventoryStore.hasCollectible(productId)
}

function getCollectibleIcon(productId) {
  const product = getProductById(productId)
  return product?.icon || '❓'
}

function getCollectibleName(productId) {
  const product = getProductById(productId)
  return product?.name || '未知'
}

function getSetProgress(set) {
  const collectedIds = inventoryStore.collectibles.map(c => c.productId)
  return set.requiredProductIds.filter(id => collectedIds.includes(id)).length
}

function getSetPercent(set) {
  const total = set.requiredProductIds.length
  const collected = getSetProgress(set)
  return total > 0 ? Math.round((collected / total) * 100) : 0
}

function openBattlePrepare() {
  emit('openBattlePrepare')
}
</script>

<style scoped>
.inventory-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.inventory-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-battle {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-battle:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
}

.btn-back {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.inventory-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.filter-tab:hover {
  transform: translateY(-2px);
}

/* 战斗槽位 */
.battle-slots-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.2rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.battle-slots-section h3 {
  margin: 0 0 0.8rem 0;
}

.battle-slots {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
}

.battle-slot {
  width: 100px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.slot-equipped {
  background: rgba(74, 222, 128, 0.15);
  border: 2px solid rgba(74, 222, 128, 0.3);
}

.slot-equipped:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.3);
}

.slot-empty {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.slot-empty:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.slot-icon {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
}

.slot-name {
  font-size: 0.8rem;
  font-weight: bold;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.slot-effect {
  font-size: 0.65rem;
  opacity: 0.7;
  text-align: center;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-unequip {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.7);
  color: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-unequip:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.2);
}

.slot-placeholder {
  font-size: 2rem;
  opacity: 0.4;
  margin-bottom: 0.2rem;
}

.slot-label {
  font-size: 0.75rem;
  opacity: 0.4;
}

.slot-hint {
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.5;
  margin-top: 0.5rem;
}

/* 物品网格 */
.items-section {
  margin-bottom: 1.5rem;
}

.items-section h3 {
  margin: 0 0 0.8rem 0;
}

.item-count {
  font-weight: normal;
  opacity: 0.6;
  font-size: 0.9rem;
}

.empty-items {
  text-align: center;
  opacity: 0.6;
  padding: 3rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.8rem;
}

.item-card {
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
}

.item-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.card-selected {
  border-color: #667eea;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

.card-battle {
  border-color: rgba(74, 222, 128, 0.4);
  background: rgba(74, 222, 128, 0.08);
}

.item-icon {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.3rem;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 0.85rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.item-qty {
  font-size: 0.8rem;
  color: #fbbf24;
  margin-left: 0.3rem;
}

.item-effect-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.3);
  display: inline-block;
  margin-top: 0.3rem;
}

.item-equipped-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
  background: rgba(74, 222, 128, 0.6);
  color: #fff;
}

/* 收藏品集 */
.collectible-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.2rem;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.collectible-section h3 {
  margin: 0 0 0.8rem 0;
}

.collectible-set {
  margin-bottom: 1rem;
}

.collectible-set:last-child {
  margin-bottom: 0;
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.set-progress {
  font-size: 0.85rem;
  color: #fbbf24;
}

.set-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.set-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.set-items {
  display: flex;
  gap: 0.8rem;
}

.set-item {
  font-size: 0.85rem;
  opacity: 0.5;
}

.set-item.collected {
  opacity: 1;
  font-weight: bold;
}

/* 详情面板 */
.detail-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.detail-content {
  width: 90%;
  max-width: 400px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
}

.detail-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-close:hover {
  background: rgba(239, 68, 68, 0.6);
}

.detail-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
}

.detail-name {
  text-align: center;
  margin: 0 0 0.5rem 0;
}

.detail-desc {
  text-align: center;
  opacity: 0.7;
  margin: 0 0 1rem 0;
}

.detail-effect {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.detail-effect p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.detail-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
}

.btn-equip {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-equip:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-unequip-all {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-unequip-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
}
</style>
