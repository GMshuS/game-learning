/**
 * 成就解锁通知组件
 */
import { ref, computed } from 'vue'

export default {
  name: 'AchievementNotification',
  
  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['dismiss', 'dismissAll'],
  
  setup(props, { emit }) {
    const visible = ref(true)
    
    const visibleNotifications = computed(() => {
      return props.notifications.slice(0, 5)
    })
    
    const dismiss = (index) => {
      emit('dismiss', index)
    }
    
    const dismissAll = () => {
      emit('dismissAll')
    }
    
    const getRarityColor = (rarity) => {
      const colors = {
        common: '#9ca3af',
        uncommon: '#4ade80',
        rare: '#60a5fa',
        epic: '#a78bfa',
        legendary: '#fbbf24'
      }
      return colors[rarity] || colors.common
    }
    
    return {
      visible,
      visibleNotifications,
      dismiss,
      dismissAll,
      getRarityColor
    }
  }
}
