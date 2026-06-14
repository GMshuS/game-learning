/**
 * 可拖拽物品组件
 */
import { ref } from 'vue'

export default {
  name: 'DraggableItem',
  
  props: {
    item: {
      type: Object,
      required: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 50
    }
  },
  
  emits: ['dragStart', 'dragEnd', 'click'],
  
  setup(props, { emit }) {
    const isDragging = ref(false)
    const position = ref({ x: 0, y: 0 })
    
    const onDragStart = (event) => {
      if (!props.draggable) return
      
      isDragging.value = true
      emit('dragStart', { item: props.item, event })
    }
    
    const onDragEnd = () => {
      isDragging.value = false
      emit('dragEnd', { item: props.item })
    }
    
    const onClick = () => {
      emit('click', props.item)
    }
    
    const itemStyle = {
      width: `${props.size}px`,
      height: `${props.size}px`,
      fontSize: `${props.size * 0.6}px`,
      cursor: props.draggable ? 'grab' : 'default',
      opacity: isDragging.value ? 0.5 : 1,
      transition: 'transform 0.2s, opacity 0.2s'
    }
    
    return {
      isDragging,
      position,
      onDragStart,
      onDragEnd,
      onClick,
      itemStyle
    }
  }
}
