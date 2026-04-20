/**
 * 性能优化配置
 */
export const performanceConfig = {
  // 资源加载配置
  resourceLoading: {
    // 并发加载数量
    maxConcurrent: 4,
    // 重试次数
    retryCount: 3,
    // 重试延迟
    retryDelay: 1000,
    // 超时时间
    timeout: 10000
  },

  // 缓存配置
  cache: {
    // 启用缓存
    enabled: true,
    // 缓存过期时间（毫秒）
    expiry: 3600000,
    // 最大缓存数量
    maxSize: 100
  },

  // 渲染优化
  rendering: {
    // 使用 requestAnimationFrame
    useRAF: true,
    // 帧率限制
    fpsLimit: 60,
    // 节流间隔（毫秒）
    throttleInterval: 16,
    // 防抖延迟
    debounceDelay: 300
  },

  // 内存管理
  memory: {
    // 定期检查间隔
    checkInterval: 60000,
    // 警告阈值（MB）
    warningThreshold: 100,
    // 清理阈值（MB）
    cleanupThreshold: 150
  },

  // 网络优化
  network: {
    // 启用 CDN
    useCDN: true,
    // 启用压缩
    useCompression: true,
    // 启用 HTTP/2
    useHTTP2: true
  }
}

/**
 * 资源懒加载
 */
export class LazyLoader {
  constructor() {
    this.loaded = new Set()
    this.loading = new Map()
    this.queue = []
    this.isProcessing = false
  }

  /**
   * 懒加载资源
   */
  async load(src, type = 'image') {
    if (this.loaded.has(src)) {
      return Promise.resolve()
    }

    if (this.loading.has(src)) {
      return this.loading.get(src)
    }

    const promise = new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image()
        img.onload = () => {
          this.loaded.add(src)
          this.loading.delete(src)
          resolve(img)
        }
        img.onerror = reject
        img.src = src
      } else if (type === 'script') {
        const script = document.createElement('script')
        script.onload = () => {
          this.loaded.add(src)
          this.loading.delete(src)
          resolve()
        }
        script.onerror = reject
        script.src = src
        document.head.appendChild(script)
      } else if (type === 'style') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.onload = () => {
          this.loaded.add(src)
          this.loading.delete(src)
          resolve()
        }
        link.onerror = reject
        link.href = src
        document.head.appendChild(link)
      }
    })

    this.loading.set(src, promise)
    return promise
  }

  /**
   * 预加载资源
   */
  async preload(sources) {
    const promises = sources.map(([src, type]) => this.load(src, type))
    return Promise.all(promises)
  }

  /**
   * 清除缓存
   */
  clear() {
    this.loaded.clear()
    this.loading.clear()
    this.queue = []
  }
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      loadTime: 0
    }
    this.frameCount = 0
    this.lastTime = performance.now()
    this.running = false
  }

  /**
   * 开始监控
   */
  start() {
    this.running = true
    this.lastTime = performance.now()
    this.monitor()
  }

  /**
   * 停止监控
   */
  stop() {
    this.running = false
  }

  /**
   * 监控帧率
   */
  monitor() {
    if (!this.running) return

    const now = performance.now()
    const delta = now - this.lastTime

    this.frameCount++

    if (delta >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / delta)
      this.metrics.frameTime = Math.round(delta / this.frameCount)
      this.frameCount = 0
      this.lastTime = now

      // 内存使用（如果支持）
      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
      }

      console.log(`FPS: ${this.metrics.fps}, Frame Time: ${this.metrics.frameTime}ms`)
    }

    requestAnimationFrame(() => this.monitor())
  }

  /**
   * 获取指标
   */
  getMetrics() {
    return { ...this.metrics }
  }

  /**
   * 记录加载时间
   */
  recordLoadTime(label, startTime) {
    const loadTime = performance.now() - startTime
    this.metrics.loadTime = loadTime
    console.log(`${label} loaded in ${loadTime.toFixed(2)}ms`)
    return loadTime
  }
}

/**
 * 防抖函数
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 图片懒加载指令
 */
export function lazyImage(el, src) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = src
          observer.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px 0px'
    }
  )

  observer.observe(el)
}

export default {
  performanceConfig,
  LazyLoader,
  PerformanceMonitor,
  debounce,
  throttle,
  lazyImage
}
