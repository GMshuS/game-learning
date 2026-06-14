/**
 * 构建优化配置 - Vite
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',
  
  build: {
    // 输出目录
    outDir: 'dist',
    // 资源目录
    assetsDir: 'assets',
    // 资源大小警告阈值
    chunkSizeWarningLimit: 500,
    // 生成 source maps
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        // 手动分块
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'phaser': ['phaser']
        },
        // 资源命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console.log
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除纯函数调用
        pure_funcs: ['console.log']
      },
      format: {
        // 移除注释
        comments: false
      }
    }
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'pinia', 'phaser'],
    exclude: []
  },

  // 服务器配置
  server: {
    port: 3000,
    open: true,
    // 热更新
    hmr: true
  },

  // 预览配置
  preview: {
    port: 4173,
    open: true
  }
});
