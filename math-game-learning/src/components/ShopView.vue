<template>
  <div class="shop-view">
    <!-- 经营商店玩法说明 -->
    <GameTutorial
      v-if="showTutorial"
      title="🏪 经营商店玩法说明"
      :steps="shopTutorialSteps"
      @close="closeTutorial"
    />
    
    <div class="shop-header">
      <h2>🏪 文具商店</h2>
      <div class="header-actions">
        <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
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
          @click="selectProduct(product)"
        >
          <div class="product-image">{{ product.icon }}</div>
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-price">
              <span class="price-icon">💰</span>
              {{ product.sellPrice }}
            </p>
            <p class="product-desc">{{ product.description }}</p>
          </div>
          <button 
            class="btn-add-cart"
            @click.stop="addToCart(product)"
            :disabled="!canAddToCart(product)"
          >
            {{ getCartItem(product)?.quantity ? '已选 x' + getCartItem(product)?.quantity : '加入购物车' }}
          </button>
        </div>
      </div>

      <!-- 购物车 -->
      <div class="cart-section">
        <h3>🛒 购物车 ({{ cartItemCount }} 件商品)</h3>
        <div v-if="shoppingCart.length === 0" class="empty-cart">
          购物车空空如也，请点击商品添加到购物车
        </div>
        <div v-else class="cart-list">
          <div
            v-for="item in shoppingCart"
            :key="item.product.id"
            class="cart-item"
          >
            <span class="cart-icon">{{ item.product.icon }}</span>
            <span class="cart-name">{{ item.product.name }}</span>
            <span class="cart-price">¥{{ item.product.sellPrice }} × {{ item.quantity }}</span>
            <div class="cart-actions">
              <button class="cart-btn" @click="updateCartQuantity(item.product.id, -1)">-</button>
              <span class="cart-qty">{{ item.quantity }}</span>
              <button class="cart-btn" @click="updateCartQuantity(item.product.id, 1)">+</button>
              <button class="cart-btn remove" @click="removeFromCart(item.product.id)">×</button>
            </div>
          </div>
        </div>
        
        <div v-if="shoppingCart.length > 0" class="cart-total">
          <span>合计：</span>
          <span class="total-amount">💰 {{ cartTotal }}</span>
        </div>
        
        <button 
          v-if="shoppingCart.length > 0"
          class="btn-checkout" 
          @click="checkout"
          :disabled="playerCoins < cartTotal"
        >
          确认购买 ({{ cartTotal }} 💰)
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
import { ref, computed, onMounted } from 'vue'
import { getAllProducts, getProductsByCategory, shopConfig } from '../config/shop'
import GameTutorial from './GameTutorial.vue'

const showTutorial = ref(false)

const shopTutorialSteps = [
  {
    title: '浏览商品',
    description: '在商店中浏览各种商品，商品分为文具区、书籍区、零食区和玩具区四个分类。'
  },
  {
    title: '加入购物车',
    description: '点击商品卡片上的"加入购物车"按钮，可以将商品添加到购物车。可以添加多个不同商品。'
  },
  {
    title: '管理购物车',
    description: '在购物车区域可以调整商品数量，或删除不需要的商品。购物车会显示所有商品的总价。'
  },
  {
    title: '确认购买',
    description: '金币足够时，点击"确认购买"按钮完成购买。购买后金币会减少，商品会添加到你的库存中。'
  },
  {
    title: '收银游戏',
    description: '点击"收银游戏"按钮可以玩找零游戏，练习收银技巧，赢取额外金币奖励！'
  }
]

const closeTutorial = () => {
  showTutorial.value = false
}

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
const shoppingCart = ref([])

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

// 购物车商品数量
const cartItemCount = computed(() => {
  return shoppingCart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 购物车总价
const cartTotal = computed(() => {
  return shoppingCart.value.reduce((sum, item) => sum + item.product.sellPrice * item.quantity, 0)
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedProduct.value = null
}

const selectProduct = (product) => {
  selectedProduct.value = product
}

// 获取购物车中的商品
const getCartItem = (product) => {
  return shoppingCart.value.find(item => item.product.id === product.id)
}

// 是否可以添加到购物车
const canAddToCart = (product) => {
  return true // 总是可以添加
}

// 加入购物车
const addToCart = (product) => {
  const existing = shoppingCart.value.find(item => item.product.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    shoppingCart.value.push({
      product,
      quantity: 1
    })
  }
}

// 更新购物车数量
const updateCartQuantity = (productId, delta) => {
  const item = shoppingCart.value.find(item => item.product.id === productId)
  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(productId)
    }
  }
}

// 从购物车移除
const removeFromCart = (productId) => {
  const index = shoppingCart.value.findIndex(item => item.product.id === productId)
  if (index !== -1) {
    shoppingCart.value.splice(index, 1)
  }
}

// 结账
const checkout = () => {
  if (shoppingCart.value.length === 0) return
  
  if (props.playerCoins < cartTotal.value) {
    alert('金币不足！')
    return
  }
  
  // 发送购买事件，包含所有购物车商品
  emit('buy', {
    items: shoppingCart.value.map(item => ({
      product: item.product,
      quantity: item.quantity
    })),
    total: cartTotal.value
  })
  
  // 清空购物车
  shoppingCart.value = []
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

.btn-help {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.btn-help:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
  position: relative;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
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

.btn-add-cart {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-cart:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.cart-section h3 {
  margin: 0 0 1rem 0;
}

.empty-cart {
  text-align: center;
  opacity: 0.6;
  padding: 2rem;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-name {
  flex: 1;
  font-weight: bold;
}

.cart-price {
  color: #fbbf24;
  font-size: 0.9rem;
}

.cart-actions {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.cart-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cart-btn.remove {
  background: rgba(239, 68, 68, 0.5);
}

.cart-btn.remove:hover {
  background: rgba(239, 68, 68, 0.8);
}

.cart-qty {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.cart-total {
  margin-top: 1rem;
  text-align: right;
  font-size: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.total-amount {
  color: #fbbf24;
  font-weight: bold;
  margin-left: 0.5rem;
}

.btn-checkout {
  width: 100%;
  margin-top: 1rem;
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

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
}

.btn-checkout:disabled {
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
