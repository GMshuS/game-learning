/**
 * 顾客交互组件
 */
import { ref, computed } from 'vue'

export default {
  name: 'CustomerInteraction',
  
  props: {
    customers: {
      type: Array,
      default: () => []
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['serve', 'checkout'],
  
  setup(props, { emit }) {
    const selectedCustomer = ref(null)
    
    const waitingCustomers = computed(() => {
      return props.customers.filter(c => c.status === 'waiting')
    })
    
    const selectCustomer = (customer) => {
      selectedCustomer.value = customer
    }
    
    const serveCustomer = () => {
      if (selectedCustomer.value) {
        emit('serve', selectedCustomer.value)
      }
    }
    
    const checkout = () => {
      if (selectedCustomer.value) {
        emit('checkout', selectedCustomer.value)
        selectedCustomer.value = null
      }
    }
    
    const formatTotal = (total) => {
      return `¥${total}`
    }
    
    return {
      selectedCustomer,
      waitingCustomers,
      selectCustomer,
      serveCustomer,
      checkout,
      formatTotal
    }
  }
}
