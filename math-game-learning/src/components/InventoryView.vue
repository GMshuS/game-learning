/**
 * 库存管理组件
 */
import { ref, computed } from 'vue'
import { getAllProducts, getProductById } from '../config/shop'

export default {
  name: 'InventoryView',
  
  props: {
    inventory: {
      type: Array,
      default: () => []
    },
    maxStock: {
      type: Number,
      default: 100
    }
  },
  
  emits: ['discard', 'back'],
  
  setup(props, { emit }) {
    const selectedCategory = ref('all')
    const discardQuantities = ref({})
    
    const categories = computed(() => {
      return [
        { id: 'all', name: '全部', icon: '📦' },
        ...getAllProducts().reduce((cats, p) => {
          if (!cats.find(c => c.id === p.category)) {
            cats.push({ id: p.category, name: p.category, icon: '🏷️' })
          }
          return cats
        }, [])
      ]
    })
    
    const inventoryItems = computed(() => {
      const items = props.inventory.map(item => {
        const product = getProductById(item.productId)
        return {
          ...item,
          product,
          name: product?.name || '未知商品',
          icon: product?.icon || '📦',
          sellPrice: product?.sellPrice || 0,
          costPrice: product?.costPrice || 0,
          value: (product?.costPrice || 0) * item.quantity
        }
      })
      
      if (selectedCategory.value === 'all') {
        return items
      }
      
      return items.filter(item => item.product?.category === selectedCategory.value)
    })
    
    const totalStock = computed(() => {
      return inventoryItems.value.reduce((sum, item) => sum + item.quantity, 0)
    })
    
    const totalValue = computed(() => {
      return inventoryItems.value.reduce((sum, item) => sum + item.value, 0)
    })
    
    const stockUsage = computed(() => {
      return Math.round((totalStock.value / props.maxStock) * 100)
    })
    
    const updateDiscardQuantity = (productId, quantity) => {
      const qty = Math.max(0, parseInt(quantity) || 0)
      if (qty > 0) {
        discardQuantities.value[productId] = qty
      } else {
        delete discardQuantities.value[productId]
      }
    }
    
    const confirmDiscard = () => {
      const items = Object.entries(discardQuantities.value).map(([productId, quantity]) => ({
        productId,
        quantity
      }))
      
      if (items.length > 0) {
        emit('discard', items)
        discardQuantities.value = {}
      }
    }
    
    const back = () => {
      emit('back')
    }
    
    const getStockLevelStyle = (quantity) => {
      if (quantity === 0) return { bg: '#fee2e2', text: '#ef4444' }
      if (quantity < 10) return { bg: '#ffedd5', text: '#f97316' }
      if (quantity < 30) return { bg: '#dcfce7', text: '#22c55e' }
      return { bg: '#f0fdf4', text: '#15803d' }
    }
    
    return {
      selectedCategory,
      discardQuantities,
      categories,
      inventoryItems,
      totalStock,
      totalValue,
      stockUsage,
      updateDiscardQuantity,
      confirmDiscard,
      back,
      getStockLevelStyle
    }
  }
}
