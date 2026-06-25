/**
 * 性能优化 Store
 */
import { defineStore } from 'pinia';
import { LazyLoader, PerformanceMonitor } from '../utils/performance';

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    fps: 60,
    frameTime: 16,
    memoryUsage: 0,
    loadTime: 0,
    isLowPerformance: false,
    lazyLoader: null,
    performanceMonitor: null,
    /** @type {number|null} setInterval ID，用于后续清理 */
    _metricsIntervalId: null
  }),

  getters: {
    // 是否性能良好
    isPerformant: (state) => {
      return state.fps >= 30 && state.frameTime <= 33;
    },
    
    // 性能等级
    performanceLevel: (state) => {
      if (state.fps >= 55) return 'excellent';
      if (state.fps >= 30) return 'good';
      if (state.fps >= 15) return 'fair';
      return 'poor';
    }
  },

  actions: {
    /**
     * 初始化性能系统
     */
    init() {
      this.lazyLoader = new LazyLoader();
      this.performanceMonitor = new PerformanceMonitor();
      this.performanceMonitor.start();
      
      // 定期更新状态（保存 interval ID 以便后续清理）
      this._metricsIntervalId = setInterval(() => {
        this.updateMetrics();
      }, 1000);
      
      // 检测性能
      this.detectPerformanceLevel();
    },

    /**
     * 更新指标
     */
    updateMetrics() {
      if (this.performanceMonitor) {
        const metrics = this.performanceMonitor.getMetrics();
        this.fps = metrics.fps;
        this.frameTime = metrics.frameTime;
        this.memoryUsage = metrics.memoryUsage;
      }
    },

    /**
     * 检测性能等级
     */
    detectPerformanceLevel() {
      // 简单检测：根据设备特性
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const deviceMemory = navigator.deviceMemory || 4;
      
      if (isMobile && deviceMemory <= 2) {
        this.isLowPerformance = true;
      } else if (deviceMemory <= 4) {
        this.isLowPerformance = true;
      }
    },

    /**
     * 预加载资源
     */
    async preloadResources(resources) {
      if (this.lazyLoader) {
        return this.lazyLoader.preload(resources);
      }
    },

    /**
     * 懒加载图片
     */
    lazyLoadImage(el, src) {
      if (this.lazyLoader) {
        return this.lazyLoader.load(src, 'image');
      }
    },

    /**
     * 记录加载时间
     */
    recordLoadTime(label, startTime) {
      if (this.performanceMonitor) {
        return this.performanceMonitor.recordLoadTime(label, startTime);
      }
    },

    /**
     * 降低画质模式
     */
    enableLowQualityMode() {
      this.isLowPerformance = true;
      // 可以触发事件通知其他组件降低画质
    },

    /**
     * 禁用低性能模式
     */
    disableLowQualityMode() {
      this.isLowPerformance = false;
    },

    /**
     * 销毁性能系统：清除计时器，释放资源
     * 应在组件卸载或 HMR 时调用
     */
    destroy() {
      if (this._metricsIntervalId !== null) {
        clearInterval(this._metricsIntervalId);
        this._metricsIntervalId = null;
      }
      if (this.performanceMonitor) {
        this.performanceMonitor.stop();
      }
      if (this.lazyLoader) {
        this.lazyLoader = null;
      }
    }
  }
});

export default usePerformanceStore;
