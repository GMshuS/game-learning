/**
 * 装备管理 Vue 组件
 */
import { ref, computed } from 'vue'
import { getEquipmentByType, getEquipmentForGrade, getEquipmentById, rarityConfig } from '../config/equipment'

export default {
  name: 'EquipmentManager',
  
  props: {
    character: {
      type: Object,
      default: () => ({
        name: '冒险者',
        level: 1,
        grade: 1,
        equipment: {
          weapon: null,
          armor: null,
          accessory: null
        },
        stats: {
          attack: 10,
          defense: 5,
          luck: 0
        }
      })
    },
    inventory: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['equip', 'unequip', 'close'],
  
  setup(props, { emit }) {
    const selectedTab = ref('weapon')
    const selectedItem = ref(null)
    
    const tabs = [
      { id: 'weapon', label: '武器', icon: '⚔️' },
      { id: 'armor', label: '防具', icon: '🛡️' },
      { id: 'accessory', label: '饰品', icon: '💍' }
    ]
    
    const currentEquipment = computed(() => {
      return props.character.equipment || {
        weapon: null,
        armor: null,
        accessory: null
      }
    })
    
    const availableEquipment = computed(() => {
      return getEquipmentForGrade(props.character.grade || 1)
    })
    
    const filteredEquipment = computed(() => {
      return availableEquipment.value.filter(item => item.type === selectedTab.value)
    })
    
    const totalStats = computed(() => {
      const base = props.character.stats || { attack: 10, defense: 5, luck: 0 }
      const equipment = currentEquipment.value
      
      let bonus = { attack: 0, defense: 0, luck: 0 }
      
      Object.values(equipment).forEach(item => {
        if (item) {
          bonus.attack += item.attack || 0
          bonus.defense += item.defense || 0
          bonus.luck += item.luck || 0
        }
      })
      
      return {
        attack: base.attack + bonus.attack,
        defense: base.defense + bonus.defense,
        luck: base.luck + bonus.luck
      }
    })
    
    const getRarityStyle = (rarity) => {
      const config = rarityConfig[rarity] || rarityConfig.common
      return {
        color: config.color,
        border: `2px solid ${config.color}`
      }
    }
    
    const getRarityName = (rarity) => {
      return rarityConfig[rarity]?.name || '普通'
    }
    
    const selectItem = (item) => {
      selectedItem.value = item
    }
    
    const equipItem = () => {
      if (selectedItem.value) {
        emit('equip', {
          type: selectedTab.value,
          item: selectedItem.value
        })
        selectedItem.value = null
      }
    }
    
    const unequipItem = (type) => {
      emit('unequip', type)
    }
    
    const close = () => {
      emit('close')
    }
    
    return {
      selectedTab,
      selectedItem,
      tabs,
      currentEquipment,
      availableEquipment,
      filteredEquipment,
      totalStats,
      getRarityStyle,
      getRarityName,
      selectItem,
      equipItem,
      unequipItem,
      close
    }
  }
}
