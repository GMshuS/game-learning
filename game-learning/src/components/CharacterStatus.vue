/**
 * 角色状态 Vue 组件
 */
import { computed } from 'vue'

export default {
  name: 'CharacterStatus',
  
  props: {
    character: {
      type: Object,
      default: () => ({
        name: '冒险者',
        level: 1,
        exp: 0,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        luck: 0,
        coins: 0
      })
    }
  },
  
  emits: ['openEquipment', 'openSettings'],
  
  setup(props, { emit }) {
    const expProgress = computed(() => {
      const expNeeded = props.character.level * 100
      return Math.round((props.character.exp / expNeeded) * 100)
    })
    
    const hpPercent = computed(() => {
      return Math.round((props.character.hp / props.character.maxHp) * 100)
    })
    
    const openEquipment = () => {
      emit('openEquipment')
    }
    
    const openSettings = () => {
      emit('openSettings')
    }
    
    return {
      expProgress,
      hpPercent,
      openEquipment,
      openSettings
    }
  }
}
