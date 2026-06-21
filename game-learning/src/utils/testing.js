/**
 * 测试工具集
 */
import { generateQuestion } from '../utils/questionGenerator';

/**
 * 题目生成器测试
 */
export function testQuestionGenerator() {
  console.log('=== 题目生成器测试 ===');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };
  
  // 测试 1: 生成加法题目
  try {
    const q = generateQuestion(1, 'add');
    
    if (q.question && q.answer !== undefined) {
      results.passed++;
      console.log('✓ 加法题目生成成功');
    } else {
      results.failed++;
      results.errors.push('加法题目缺少必要字段');
    }
  } catch (e) {
    results.failed++;
    results.errors.push(`加法题目生成失败：${e.message}`);
  }
  
  // 测试 2: 生成减法题目（确保结果非负）
  try {
    const q = generateQuestion(1, 'subtract');
    
    if (q.answer >= 0) {
      results.passed++;
      console.log('✓ 减法题目结果非负');
    } else {
      results.failed++;
      results.errors.push('减法题目结果为负数');
    }
  } catch (e) {
    results.failed++;
    results.errors.push(`减法题目生成失败：${e.message}`);
  }
  
  // 测试 3: 生成除法题目（确保整除）
  try {
    const q = generateQuestion(3, 'divide');
    
    if (Number.isInteger(q.answer)) {
      results.passed++;
      console.log('✓ 除法题目结果整除');
    } else {
      results.failed++;
      results.errors.push('除法题目结果不是整数');
    }
  } catch (e) {
    results.failed++;
    results.errors.push(`除法题目生成失败：${e.message}`);
  }
  
  // 测试 4: 按年级生成题目
  for (let grade = 1; grade <= 6; grade++) {
    try {
      const q = generateQuestion(grade);
      
      if (q && q.question) {
        results.passed++;
        console.log(`✓ ${grade}年级题目生成成功`);
      } else {
        results.failed++;
        results.errors.push(`${grade}年级题目生成失败`);
      }
    } catch (e) {
      results.failed++;
      results.errors.push(`${grade}年级题目生成失败：${e.message}`);
    }
  }
  
  results.total = results.passed + results.failed;
  
  console.log(`\n测试结果：${results.passed}/${results.total} 通过`);
  if (results.errors.length > 0) {
    console.log('错误:', results.errors);
  }
  
  return results;
}

/**
 * 存储系统测试
 */
export function testStorageSystem() {
  console.log('=== 存储系统测试 ===');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };
  
  // 测试 localStorage 可用性
  try {
    const testKey = 'test_' + Date.now();
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value === 'test') {
      results.passed++;
      console.log('✓ localStorage 可用');
    } else {
      results.failed++;
      results.errors.push('localStorage 读写失败');
    }
  } catch (e) {
    results.failed++;
    results.errors.push(`localStorage 不可用：${e.message}`);
  }
  
  results.total = results.passed + results.failed;
  console.log(`\n测试结果：${results.passed}/${results.total} 通过`);
  
  return results;
}

/**
 * 性能基准测试
 */
export function runBenchmark() {
  console.log('=== 性能基准测试 ===');
  
  const results = {
    questionGeneration: 0,
    storage: 0,
    rendering: 0
  };
  
  // 测试题目生成速度
  const startGen = performance.now();
  for (let i = 0; i < 100; i++) {
    generateQuestion(Math.floor(Math.random() * 6) + 1);
  }
  results.questionGeneration = performance.now() - startGen;
  
  // 测试存储速度
  const startStorage = performance.now();
  for (let i = 0; i < 100; i++) {
    localStorage.setItem('bench_' + i, 'data_' + i);
  }
  for (let i = 0; i < 100; i++) {
    localStorage.getItem('bench_' + i);
  }
  for (let i = 0; i < 100; i++) {
    localStorage.removeItem('bench_' + i);
  }
  results.storage = performance.now() - startStorage;
  
  console.log('题目生成 (100 次):', results.questionGeneration.toFixed(2), 'ms');
  console.log('存储操作 (300 次):', results.storage.toFixed(2), 'ms');
  
  return results;
}

/**
 * 内存泄漏检测
 */
export function detectMemoryLeak() {
  if (!performance.memory) {
    console.log('内存 API 不支持');
    return null;
  }
  
  const initialMemory = performance.memory.usedJSHeapSize;
  console.log('初始内存:', Math.round(initialMemory / 1024 / 1024), 'MB');
  
  // 运行一些操作
  const questions = [];
  for (let i = 0; i < 1000; i++) {
    questions.push(generateQuestion(Math.floor(Math.random() * 6) + 1));
  }
  
  // 清理
  questions.length = 0;
  
  // 强制垃圾回收（如果可用，使用 try/catch 防止浏览器中 ReferenceError）
  try {
    if (global.gc) {
      global.gc();
    }
  } catch (e) {
    // 浏览器环境中 global 未定义，静默忽略
  }
  
  setTimeout(() => {
    const finalMemory = performance.memory.usedJSHeapSize;
    console.log('最终内存:', Math.round(finalMemory / 1024 / 1024), 'MB');
    console.log('内存变化:', Math.round((finalMemory - initialMemory) / 1024 / 1024), 'MB');
  }, 1000);
}

/**
 * 运行所有测试
 */
export function runAllTests() {
  console.log('\n========== 运行所有测试 ==========\n');
  
  testQuestionGenerator();
  console.log('\n');
  testStorageSystem();
  console.log('\n');
  runBenchmark();
  
  console.log('\n========== 测试完成 ==========');
}

export default {
  testQuestionGenerator,
  testStorageSystem,
  runBenchmark,
  detectMemoryLeak,
  runAllTests
};
