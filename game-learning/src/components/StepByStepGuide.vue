/**
 * 分步解题引导组件
 */
import { ref, computed } from 'vue'

export default {
  name: 'StepByStepGuide',
  
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    currentStep: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => ({ icon: '🍎', color: '#ef4444' })
    }
  },
  
  emits: ['stepChange', 'complete'],
  
  setup(props, { emit }) {
    const currentStepIndex = ref(props.currentStep)
    const completedSteps = ref(new Set())
    
    const currentStepData = computed(() => {
      return props.steps[currentStepIndex.value] || null
    })
    
    const progress = computed(() => {
      if (props.steps.length === 0) return 0
      return Math.round(((currentStepIndex.value + 1) / props.steps.length) * 100)
    })
    
    const goToStep = (index) => {
      if (index >= 0 && index < props.steps.length) {
        currentStepIndex.value = index
        emit('stepChange', { index, step: props.steps[index] })
      }
    }
    
    const nextStep = () => {
      if (currentStepIndex.value < props.steps.length - 1) {
        completedSteps.value.add(currentStepIndex.value)
        goToStep(currentStepIndex.value + 1)
      } else {
        completedSteps.value.add(currentStepIndex.value)
        emit('complete')
      }
    }
    
    const prevStep = () => {
      if (currentStepIndex.value > 0) {
        goToStep(currentStepIndex.value - 1)
      }
    }
    
    const isStepCompleted = (index) => {
      return completedSteps.value.has(index)
    }
    
    const getVisualItems = () => {
      const visual = currentStepData.value?.visual
      if (!visual) return []
      
      const items = []
      const count = visual.count || visual.total || 0
      
      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          icon: props.item.icon,
          highlighted: visual.highlighted === 'all' ||
                      (visual.highlighted === 'first' && i < visual.firstCount) ||
                      (visual.highlighted === 'second' && i >= visual.firstCount)
        })
      }
      
      return items
    }
    
    return {
      currentStepIndex,
      completedSteps,
      currentStepData,
      progress,
      goToStep,
      nextStep,
      prevStep,
      isStepCompleted,
      getVisualItems
    }
  }
}
