/**
 * 响应式断点配置
 */
export const breakpoints = {
  // 手机
  xs: 0,
  sm: 576,
  // 平板
  md: 768,
  // 桌面
  lg: 1024,
  xl: 1280,
  // 大桌面
  '2xl': 1536
};

/**
 * 响应式样式工具类
 */
export const responsiveStyles = {
  // 字体大小
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'  // 36px
  },

  // 间距
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    base: '1rem',     // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem'     // 48px
  },

  // 按钮尺寸
  buttonSizes: {
    xs: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    base: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    xl: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' }
  },

  // 容器最大宽度
  containerMaxWidth: {
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
    '2xl': '1320px'
  }
};

/**
 * 媒体查询生成器
 */
export function mediaQuery(minWidth, maxWidth = null) {
  let query = '@media screen and (min-width: ' + minWidth + 'px)';
  if (maxWidth) {
    query = '@media screen and (min-width: ' + minWidth + 'px) and (max-width: ' + maxWidth + 'px)';
  }
  return query;
}

/**
 * 获取当前断点名称
 */
export function getBreakpointName(width) {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * 响应式工具类生成
 */
export function generateResponsiveClasses() {
  return `
/* ========== 响应式基础样式 ========== */

/* 容器 */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
  }
}

/* ========== Flex 布局 ========== */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.align-center {
  align-items: center;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 1rem; }
.gap-4 { gap: 1.5rem; }
.gap-5 { gap: 2rem; }

/* ========== Grid 布局 ========== */
.grid {
  display: grid;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* ========== 响应式显示 ========== */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }

@media (max-width: 575px) {
  .xs\\:hidden { display: none; }
  .xs\\:block { display: block; }
}

@media (min-width: 576px) and (max-width: 767px) {
  .sm\\:hidden { display: none; }
  .sm\\:block { display: block; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .md\\:hidden { display: none; }
  .md\\:block { display: block; }
}

@media (min-width: 1024px) {
  .lg\\:hidden { display: none; }
  .lg\\:block { display: block; }
}

/* ========== 响应式间距 ========== */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 2rem; }

.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 1rem; }
.m-4 { margin: 1.5rem; }
.m-5 { margin: 2rem; }

/* ========== 响应式宽度 ========== */
.w-full { width: 100%; }
.w-auto { width: auto; }
.w-1\\/2 { width: 50%; }
.w-1\\/3 { width: 33.333%; }
.w-1\\/4 { width: 25%; }

@media (max-width: 767px) {
  .mobile\\:w-full { width: 100%; }
  .mobile\\:p-4 { padding: 1rem; }
}

/* ========== 触控优化 ========== */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.touch-scroll {
  -webkit-overflow-scrolling: touch;
}

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* ========== 安全区域（iOS） ========== */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}
`;
}

export default {
  breakpoints,
  responsiveStyles,
  mediaQuery,
  getBreakpointName,
  generateResponsiveClasses
};
