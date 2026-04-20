<template>
  <div class="shop-view">
    <div class="shop-header">
      <h2>🏪 文具商店</h2>
      <div class="header-actions">
        <div class="coins-display">
          <span class="coin-icon">💰</span>
          <span class="coin-amount">{{ playerCoins }}</span>
        </div>
        <button class="btn-cashier" @click="$emit('startCashier')">
          🧾 收银游戏
        </button>
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </div>

    <div class="shop-content">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-tab"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          :class="{ selected: selectedProduct?.id === product.id }"
          @click="selectProduct(product)"
        >
          <div class="product-image">{{ product.icon }}</div>
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-price">
              <span class="price-icon">💰</span>
              {{ product.price }}
            </p>
            <p class="product-desc">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- 购买面板 -->
      <div v-if="selectedProduct" class="purchase-panel">
        <h3>购买商品</h3>
        <div class="product-detail">
          <span class="detail-icon">{{ selectedProduct.icon }}</span>
          <div class="detail-info">
            <span class="detail-name">{{ selectedProduct.name }}</span>
            <span class="detail-price">💰 {{ selectedProduct.price }}</span>
          </div>
        </div>
        
        <div class="quantity-selector">
          <button class="qty-btn" @click="buyQuantity = Math.max(1, buyQuantity - 1)">-</button>
          <span class="qty-value">{{ buyQuantity }}</span>
          <button class="qty-btn" @click="buyQuantity++">+</button>
        </div>
        
        <div class="total-price">
          总价：<span class="total-amount">💰 {{ selectedProduct.price * buyQuantity }}</span>
        </div>
        
        <button 
          class="btn-buy" 
          @click="buyItem"
          :disabled="playerCoins < selectedProduct.price * buyQuantity"
        >
          确认购买
        </button>
      </div>

      <!-- 库存信息 -->
      <div class="inventory-info">
        <h3>📦 我的库存</h3>
        <div v-if="playerInventory.length === 0" class="empty-inventory">
          库存空空如也
        </div>
        <div v-else class="inventory-list">
          <div v-for="item in playerInventory" :key="item.id" class="inventory-item">
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAllProducts, getProductsByCategory, shopConfig } from '../config/shop'

const props = defineProps({
  playerCoins: {
    type: Number,
    default: 100
  },
  shopLevel: {
    type: Number,
    default: 1
  },
  inventory: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['buy', 'sell', 'upgrade', 'back', 'startCashier'])

const selectedCategory = ref('all')
const selectedProduct = ref(null)
const buyQuantity = ref(1)

const categories = computed(() => {
  return [
    { id: 'all', name: '全部', icon: '🏪' },
    ...shopConfig.categories
  ]
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return getAllProducts()
  }
  return getProductsByCategory(selectedCategory.value)
})

const playerInventory = computed(() => {
  return props.inventory || []
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedProduct.value = null
}

const selectProduct = (product) => {
  selectedProduct.value = product
  buyQuantity.value = 1
}

const buyItem = () => {
  if (selectedProduct.value && buyQuantity.value > 0) {
    emit('buy', {
      product: selectedProduct.value,
      quantity: buyQuantity.value
    })
  }
}

const sellItem = () => {
  if (selectedProduct.value && sellQuantity.value > 0) {
    emit('sell', {
      product: selectedProduct.value,
      quantity: sellQuantity.value
    })
  }
}

const upgradeShop = (upgrade) => {
  emit('upgrade', upgrade)
}
</script>

<style scoped>
.shop-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.shop-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  color: #000;
  font-weight: bold;
}

.btn-cashier,
.btn-back {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cashier:hover,
.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.shop-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.category-tab:hover {
  transform: translateY(-2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.product-card.selected {
  border-color: #fbbf24;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
}

.product-image {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.product-price {
  margin: 0 0 0.3rem 0;
  color: #fbbf24;
  font-weight: bold;
}

.product-desc {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

.purchase-panel {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.purchase-panel h3 {
  margin: 0 0 1rem 0;
}

.product-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-icon {
  font-size: 2.5rem;
}

.detail-info {
  flex: 1;
}

.detail-name {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.detail-price {
  color: #fbbf24;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  transform: scale(1.1);
}

.qty-value {
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.total-price {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.total-amount {
  color: #fbbf24;
  font-weight: bold;
}

.btn-buy {
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

.btn-buy:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.inventory-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 15px;
}

.inventory-info h3 {
  margin: 0 0 1rem 0;
}

.empty-inventory {
  text-align: center;
  opacity: 0.6;
  padding: 2rem;
}

.inventory-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  flex: 1;
  font-size: 0.9rem;
}

.item-quantity {
  color: #fbbf24;
  font-size: 0.8rem;
}
</style>
