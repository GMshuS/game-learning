/**
 * 定价策略组件
 */
import { ref, computed } from 'vue'
import { getAllProducts, getProductById } from '../config/shop'

export default {
  name: 'PricingView',
  
  props: {
    inventory: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['updatePrice', 'back'],
  
  setup(props, { emit }) {
    const customPrices = ref({})
    const selectedProduct = ref(null)
    
    const products = computed(() => {
      return getAllProducts().map(product => {
        const invItem = props.inventory.find(i => i.productId === product.id)
        const customPrice = customPrices.value[product.id]
        return {
          ...product,
          stock: invItem ? invItem.quantity : 0,
          currentPrice: customPrice || product.sellPrice,
          isCustomPrice: !!customPrice
        }
      })
    })
    
    const selectProduct = (product) => {
      selectedProduct.value = product
    }
    
    const updatePrice = (productId, price) => {
      const product = getProductById(productId)
      if (!product) return
      
      const newPrice = Math.max(1, parseInt(price) || product.sellPrice)
      customPrices.value[productId] = newPrice
      
      emit('updatePrice', {
        productId,
        oldPrice: product.sellPrice,
        newPrice
      })
    }
    
    const resetPrice = (productId) => {
      const product = getProductById(productId)
      if (!product) return
      
      delete customPrices.value[productId]
      
      emit('updatePrice', {
        productId,
        oldPrice: customPrices.value[productId],
        newPrice: product.sellPrice
      })
    }
    
    const calculateProfit = (product) => {
      const profit = product.currentPrice - product.costPrice
      const margin = ((profit / product.currentPrice) * 100).toFixed(1)
      return { profit, margin }
    }
    
    const getPriceAdvice = (product) => {
      const margin = calculateProfit(product).margin
      
      if (margin < 20) {
        return { text: '利润偏低', color: '#ef4444' }
      }
      if (margin < 50) {
        return { text: '合理', color: '#f97316' }
      }
      if (margin < 100) {
        return { text: '利润良好', color: '#84cc16' }
      }
      return { text: '高价策略', color: '#22c55e' }
    }
    
    const back = () => {
      emit('back')
    }
    
    return {
      selectedProduct,
      products,
      selectProduct,
      updatePrice,
      resetPrice,
      calculateProfit,
      getPriceAdvice,
      back
    }
  }
}
