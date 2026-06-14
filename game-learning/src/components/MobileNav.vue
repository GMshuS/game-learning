/**
 * 移动端导航组件
 */
import { ref, computed } from 'vue'

export default {
  name: 'MobileNav',
  
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['navigate'],
  
  setup(props, { emit }) {
    const isOpen = ref(false)
    
    const toggleMenu = () => {
      isOpen.value = !isOpen.value
    }
    
    const closeMenu = () => {
      isOpen.value = false
    }
    
    const navigate = (item) => {
      emit('navigate', item)
      closeMenu()
    }
    
    return {
      isOpen,
      toggleMenu,
      closeMenu,
      navigate
    }
  }
}
