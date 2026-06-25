/**
 * 进货管理组件
 */
import { ref, computed } from 'vue'
import { getAllProducts, getProductById, shopConfig } from '../config/shop'

export default {
  name: 'RestockView',
  
  props: {
    coins: {
      type: Number,
      default: 500
    },
    inventory: {
      type: Array,
      default: () => []
    },
    maxStock: {
      type: Number,
      default: 100
    }
  },
  
  emits: ['restock', 'back'],
  
  setup(props, { emit }) {
    const selectedCategory = ref('all')
    const restockQuantities = ref({})
    
    const categories = computed(() => {
      return [
        { id: 'all', name: '全部', icon: '📦' },
        ...shopConfig.categories
      ]
    })
    
    const products = computed(() => {
      const all = getAllProducts()
      if (selectedCategory.value === 'all') {
        return all.map(product => {
          const invItem = props.inventory.find(i => i.productId === product.id)
          return {
            ...product,
            stock: invItem ? invItem.quantity : 0
          }
        })
      }
      return all
        .filter(p => p.category === selectedCategory.value)
        .map(product => {
          const invItem = props.inventory.find(i => i.productId === product.id)
          return {
            ...product,
            stock: invItem ? invItem.quantity : 0
          }
        })
    })
    
    const totalCost = computed(() => {
      return Object.entries(restockQuantities.value).reduce((sum, [productId, qty]) => {
        const product = getProductById(productId)
        return sum + (product?.costPrice || 0) * qty
      }, 0)
    })
    
    const totalItems = computed(() => {
      return Object.values(restockQuantities.value).reduce((sum, qty) => sum + qty, 0)
    })
    
    const canAfford = computed(() => {
      return totalCost.value <= props.coins
    })
    
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
    }
    
    const updateQuantity = (productId, quantity) => {
      const qty = Math.max(0, parseInt(quantity) || 0)
      if (qty > 0) {
        restockQuantities.value[productId] = qty
      } else {
        delete restockQuantities.value[productId]
      }
    }
    
    const quickAdd = (productId, amount) => {
      const current = restockQuantities.value[productId] || 0
      updateQuantity(productId, current + amount)
    }
    
    const confirmRestock = () => {
      if (!canAfford.value || totalItems.value === 0) return
      
      const items = Object.entries(restockQuantities.value).map(([productId, quantity]) => ({
        productId,
        quantity,
        cost: (getProductById(productId)?.costPrice || 0) * quantity
      }))
      
      emit('restock', {
        items,
        totalCost: totalCost.value,
        totalItems: totalItems.value
      })
      
      restockQuantities.value = {}
    }
    
    const back = () => {
      emit('back')
    }
    
    const getStockLevel = (stock) => {
      if (stock === 0) return { label: '缺货', color: '#ef4444' }
      if (stock < 10) return { label: '不足', color: '#f97316' }
      if (stock < 30) return { label: '充足', color: '#84cc16' }
      return { label: '满仓', color: '#22c55e' }
    }
    
    return {
      selectedCategory,
      restockQuantities,
      categories,
      products,
      totalCost,
      totalItems,
      canAfford,
      selectCategory,
      updateQuantity,
      quickAdd,
      confirmRestock,
      back,
      getStockLevel
    }
  }
}
