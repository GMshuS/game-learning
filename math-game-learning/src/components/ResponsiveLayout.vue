/**
 * 响应式布局组件
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { breakpoints, getBreakpointName } from '../config/responsive'

export default {
  name: 'ResponsiveLayout',
  
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: null
    }
  },
  
  setup(props) {
    const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
    const breakpoint = computed(() => getBreakpointName(windowWidth.value))
    
    const isMobile = computed(() => windowWidth.value < breakpoints.md)
    const isTablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
    const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)
    
    const containerStyle = computed(() => {
      const style = {
        width: props.fluid ? '100%' : 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }
      
      if (!props.fluid && props.maxWidth) {
        style.maxWidth = props.maxWidth
      } else if (!props.fluid) {
        style.maxWidth = `${breakpoints[breakpoint.value] || 1200}px`
      }
      
      return style
    })
    
    const onResize = () => {
      windowWidth.value = window.innerWidth
    }
    
    onMounted(() => {
      window.addEventListener('resize', onResize)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
    })
    
    return {
      windowWidth,
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      containerStyle
    }
  }
}
