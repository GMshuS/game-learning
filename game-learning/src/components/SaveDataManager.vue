/**
 * 存档管理组件
 */
import { ref, computed } from 'vue'

export default {
  name: 'SaveDataManager',
  
  props: {
    saveData: {
      type: Object,
      default: null
    },
    saveSlots: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['save', 'load', 'delete', 'export', 'import', 'close'],
  
  setup(props, { emit }) {
    const selectedSlot = ref(null)
    const importData = ref('')
    const showImportDialog = ref(false)
    const showConfirmDelete = ref(false)
    
    const currentSaveInfo = computed(() => {
      if (!props.saveData) return null
      
      return {
        playerName: props.saveData.player?.name || '未知',
        grade: props.saveData.player?.grade || 1,
        level: props.saveData.player?.level || 1,
        playTime: formatPlayTime(props.saveData.progress?.totalPlayTime || 0),
        lastSaved: formatDate(props.saveData.progress?.lastSavedAt)
      }
    })
    
    const formatPlayTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      }
      return `${minutes}分钟`
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '从未保存'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
    
    const saveGame = (slotIndex) => {
      emit('save', slotIndex)
    }
    
    const loadGame = (slotIndex) => {
      emit('load', slotIndex)
    }
    
    const deleteGame = (slotIndex) => {
      selectedSlot.value = slotIndex
      showConfirmDelete.value = true
    }
    
    const confirmDelete = () => {
      if (selectedSlot.value !== null) {
        emit('delete', selectedSlot.value)
        showConfirmDelete.value = false
        selectedSlot.value = null
      }
    }
    
    const cancelDelete = () => {
      showConfirmDelete.value = false
      selectedSlot.value = null
    }
    
    const exportData = () => {
      emit('export')
    }
    
    const showImport = () => {
      showImportDialog.value = true
    }
    
    const confirmImport = () => {
      if (importData.value.trim()) {
        emit('import', importData.value.trim())
        importData.value = ''
        showImportDialog.value = false
      }
    }
    
    const cancelImport = () => {
      importData.value = ''
      showImportDialog.value = false
    }
    
    const close = () => {
      emit('close')
    }
    
    return {
      selectedSlot,
      showImportDialog,
      showConfirmDelete,
      importData,
      currentSaveInfo,
      formatPlayTime,
      formatDate,
      saveGame,
      loadGame,
      deleteGame,
      confirmDelete,
      cancelDelete,
      exportData,
      showImport,
      confirmImport,
      cancelImport,
      close
    }
  }
}
