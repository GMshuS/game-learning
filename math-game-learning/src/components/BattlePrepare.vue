<template>
  <div class="battle-prepare">
    <div class="prepare-header">
      <h2>⚔️ 战斗准备</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
    </div>

    <div class="prepare-content">
      <p class="guide-text">选择要带入战斗的道具（最多 5 个）：</p>

      <!-- 战斗槽位 -->
      <div class="battle-slots">
        <div
          v-for="(slot, index) in battleSlots"
          :key="index"
          class="slot-item"
          :class="{ 'slot-filled': slot !== null, 'slot-empty': slot === null, 'slot-active': selectedSlot === index }"
          @click="onSlotClick(index)"
        >
          <template v-if="slot">
            <div class="slot-icon">{{ getItemById(slot)?.icon || '❓' }}</div>
            <div class="slot-name">{{ getItemById(slot)?.name || '未知' }}</div>
            <div class="slot-qty">×{{ getItemById(slot)?.quantity || 0 }}</div>
            <button class="btn-unequip" @click.stop="unequipSlot(index)">✕</button>
          </template>
          <template v-else>
            <div class="slot-empty-icon">＋</div>
            <div class="slot-empty-text">空槽位</div>
          </template>
        </div>
      </div>

      <!-- 背包物品选择列表 -->
      <div v-if="selectedSlot !== null && battleSlots[selectedSlot] === null" class="item-select-panel">
        <h3>🎒 选择道具</h3>
        <div v-if="availableItems.length === 0" class="empty-items">
          背包中没有可装备的战斗道具
        </div>
        <div v-else class="item-grid">
          <div
            v-for="item in availableItems"
            :key="item.id"
            class="item-card"
            @click="equipItem(item.id)"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-qty">×{{ item.quantity }}</div>
            <div class="item-effect">{{ item.effect?.description || '' }}</div>
          </div>
        </div>
      </div>

      <!-- 当前装备摘要 -->
      <div class="equipped-summary">
        <h3>📦 已装备道具</h3>
        <div v-if="equippedItems.length === 0" class="empty-summary">
          尚未装备任何道具
        </div>
        <div v-else class="summary-list">
          <div
            v-for="item in equippedItems"
            :key="item.id"
            class="summary-item"
          >
            <span>{{ item.icon }} {{ item.name }} ×{{ item.quantity }}</span>
            <span class="summary-effect">{{ item.effect?.description || '' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="prepare-footer">
      <button
        class="btn-start"
        @click="startBattle"
        :disabled="equippedItems.length === 0"
      >
        ⚔️ 进入战斗！
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../store/inventoryStore'

const inventoryStore = useInventoryStore()
const emit = defineEmits(['back', 'startBattle'])

const selectedSlot = ref(null)

const battleSlots = computed(() => {
  return inventoryStore.battleSlots
})

const equippedItems = computed(() => {
  return inventoryStore.getEquippedBattleItems
})

/**
 * 获取可装备到战斗栏的物品（不在槽位中的战斗道具）
 */
const availableItems = computed(() => {
  const equippedIds = inventoryStore.battleSlots.filter(id => id !== null)
  return inventoryStore.items.filter(item => {
    // 只显示战斗道具（有 effect 且 type 非 collectible）
    if (!item.effect || item.effect.target === 'collectible') return false
    if (item.quantity <= 0) return false
    if (equippedIds.includes(item.id)) return false
    return true
  })
})

function getItemById(itemId) {
  return inventoryStore.items.find(i => i.id === itemId) || null
}

function onSlotClick(index) {
  const slot = battleSlots.value[index]
  if (slot !== null) {
    // 点击已装备的槽位 → 卸下
    inventoryStore.unequipFromBattleSlot(index)
    selectedSlot.value = null
  } else {
    // 点击空槽位 → 弹出选择面板（切换选中状态）
    if (selectedSlot.value === index) {
      selectedSlot.value = null
    } else {
      selectedSlot.value = index
    }
  }
}

function unequipSlot(index) {
  inventoryStore.unequipFromBattleSlot(index)
  if (selectedSlot.value === index) {
    selectedSlot.value = null
  }
}

function equipItem(itemId) {
  if (selectedSlot.value !== null) {
    inventoryStore.equipToBattleSlot(itemId, selectedSlot.value)
    selectedSlot.value = null
  }
}

function startBattle() {
  if (equippedItems.value.length === 0) return
  emit('startBattle', equippedItems.value)
}
</script>

<style scoped>
.battle-prepare {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.prepare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.prepare-header h2 {
  margin: 0;
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

.prepare-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.guide-text {
  text-align: center;
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
}

/* 战斗槽位 */
.battle-slots {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.slot-item {
  width: 120px;
  height: 140px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.slot-filled {
  background: rgba(74, 222, 128, 0.15);
  border: 2px solid rgba(74, 222, 128, 0.3);
}

.slot-filled:hover {
  transform: translateY(-3px);
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

.slot-active {
  border-color: #667eea !important;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
}

.slot-icon {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.slot-name {
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-qty {
  font-size: 0.8rem;
  color: #fbbf24;
  margin-top: 0.2rem;
}

.btn-unequip {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.7);
  color: #fff;
  font-size: 0.8rem;
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

.slot-empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
  margin-bottom: 0.3rem;
}

.slot-empty-text {
  font-size: 0.8rem;
  opacity: 0.4;
}

/* 物品选择面板 */
.item-select-panel {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.2rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.item-select-panel h3 {
  margin: 0 0 1rem 0;
}

.empty-items {
  text-align: center;
  opacity: 0.6;
  padding: 2rem;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.8rem;
}

.item-card {
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.item-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(102, 126, 234, 0.5);
}

.item-icon {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.item-name {
  font-size: 0.9rem;
  font-weight: bold;
}

.item-qty {
  font-size: 0.8rem;
  color: #fbbf24;
}

.item-effect {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.3rem;
  line-height: 1.3;
}

/* 装备摘要 */
.equipped-summary {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.2rem;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.equipped-summary h3 {
  margin: 0 0 0.8rem 0;
}

.empty-summary {
  text-align: center;
  opacity: 0.6;
  padding: 1rem;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.summary-effect {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 底部 */
.prepare-footer {
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.btn-start {
  padding: 0.8rem 3rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
