/**
 * 可视化应用题组件 - 支持拖拽操作
 */
import { ref, computed, onMounted } from 'vue'
import { generateVisualWordProblem, wordProblemConfig } from '../config/wordProblems'

export default {
  name: 'VisualWordProblem',
  
  props: {
    grade: {
      type: Number,
      default: 1
    }
  },
  
  emits: ['answer', 'next', 'hint'],
  
  setup(props, { emit }) {
    const problem = ref(null)
    const currentStep = ref(0)
    const selectedAnswer = ref(null)
    const draggedItems = ref([])
    const showHint = ref(false)
    const isCorrect = ref(null)
    
    // 初始化题目
    const initProblem = () => {
      problem.value = generateVisualWordProblem(props.grade)
      currentStep.value = 0
      selectedAnswer.value = null
      draggedItems.value = []
      showHint.value = false
      isCorrect.value = null
    }
    
    // 当前步骤数据
    const stepData = computed(() => {
      if (!problem.value) return null
      return problem.value.steps[currentStep.value]
    })
    
    // 获取可视化物品列表
    const visualItems = computed(() => {
      if (!problem.value || !stepData.value) return []
      
      const items = []
      const count = stepData.value.visual?.count || 0
      
      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          icon: problem.value.item.icon,
          color: problem.value.item.color,
          isHighlighted: stepData.value.visual.highlighted === 'all' ||
                        (stepData.value.visual.highlighted === 'first' && i < problem.value.numbers.a) ||
                        (stepData.value.visual.highlighted === 'second' && i >= problem.value.numbers.a) ||
                        (stepData.value.visual.highlighted === 'removed' && i < problem.value.numbers.b) ||
                        (stepData.value.visual.highlighted === 'remaining' && i >= problem.value.numbers.b)
        })
      }
      
      return items
    })
    
    // 下一步
    const nextStep = () => {
      if (problem.value && currentStep.value < problem.value.steps.length - 1) {
        currentStep.value++
        emit('hint', { step: currentStep.value + 1, total: problem.value.steps.length })
      } else {
        // 显示答案输入
        showHint.value = true
      }
    }
    
    // 上一步
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }
    
    // 选择答案
    const selectAnswer = (answer) => {
      selectedAnswer.value = answer
    }
    
    // 提交答案
    const submitAnswer = () => {
      if (selectedAnswer.value === null || !problem.value) return
      
      isCorrect.value = selectedAnswer.value === problem.value.answer
      
      emit('answer', {
        correct: isCorrect.value,
        userAnswer: selectedAnswer.value,
        correctAnswer: problem.value.answer,
        problem: problem.value
      })
    }
    
    // 拖拽开始
    const dragStart = (item, event) => {
      draggedItems.value.push(item)
    }
    
    // 拖拽结束
    const dragEnd = () => {
      draggedItems.value = []
    }
    
    // 放下物品
    const dropItem = (zone) => {
      if (draggedItems.value.length > 0) {
        // 处理放置逻辑
        console.log('Dropped in zone:', zone)
      }
    }
    
    // 生成选项
    const generateOptions = () => {
      if (!problem.value) return []
      
      const correct = problem.value.answer
      const options = [correct]
      
      // 生成干扰选项
      while (options.length < 4) {
        const offset = Math.floor(Math.random() * 5) + 1
        const sign = Math.random() > 0.5 ? 1 : -1
        const wrong = correct + (offset * sign)
        
        if (wrong >= 0 && !options.includes(wrong)) {
          options.push(wrong)
        }
      }
      
      return options.sort(() => Math.random() - 0.5)
    }
    
    // 继续下一题
    const next = () => {
      initProblem()
      emit('next')
    }
    
    // 初始化
    onMounted(() => {
      initProblem()
    })
    
    return {
      problem,
      currentStep,
      selectedAnswer,
      draggedItems,
      showHint,
      isCorrect,
      stepData,
      visualItems,
      nextStep,
      prevStep,
      selectAnswer,
      submitAnswer,
      dragStart,
      dragEnd,
      dropItem,
      generateOptions,
      next,
      wordProblemConfig
    }
  }
}
