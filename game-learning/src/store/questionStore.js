/**
 * 题库 Store - 管理题目生成和答题状态
 */
import { defineStore } from 'pinia';
import { generateQuestion, generateQuestionSet } from '../utils/questionGenerator';
import {
  getQuestionsFromBank,
  questionToMultipleChoice,
  checkAnswer
} from '../utils/questionUtils';
import { useMathKnowledgeStore } from './mathKnowledgeStore';

export const useQuestionStore = defineStore('question', {
  state: () => ({
    currentQuestion: null,
    questionSet: [],
    currentIndex: 0,
    answeredQuestions: [],
    correctCount: 0,
    wrongCount: 0,
    streak: 0,          // 连续答对次数
    bestStreak: 0,      // 最佳连击记录
    isAnswered: false,  // 当前题目是否已作答
    lastAnswer: null,   // 最后一次答案
    isCorrect: null     // 最后一次答案是否正确
  }),

  getters: {
    // 当前题目序号
    currentNumber: (state) => state.currentIndex + 1,
    
    // 题目总数
    totalQuestions: (state) => state.questionSet.length,
    
    // 进度百分比
    progressPercent: (state) => {
      if (state.questionSet.length === 0) return 0;
      return Math.round((state.currentIndex / state.questionSet.length) * 100);
    },
    
    // 正确率
    accuracy: (state) => {
      const total = state.correctCount + state.wrongCount;
      if (total === 0) return 0;
      return Math.round((state.correctCount / total) * 100);
    },
    
    // 是否有下一题
    hasNext: (state) => state.currentIndex < state.questionSet.length - 1,
    
    // 是否完成所有题目
    isCompleted: (state) => state.currentIndex >= state.questionSet.length - 1 && state.isAnswered
  },

  actions: {
    /**
     * 生成单个题目
     */
    generateSingleQuestion(grade, type = 'random') {
      this.currentQuestion = generateQuestion(grade, type);
      this.isAnswered = false;
      this.lastAnswer = null;
      this.isCorrect = null;
      return this.currentQuestion;
    },

    /**
     * 生成一组题目
     */
    generateQuestionSet(grade, count = 10, options = {}) {
      const questions = generateQuestionSet(grade, count, options);
      this.questionSet = questions.map(q => questionToMultipleChoice(q));
      this.currentIndex = 0;
      this.currentQuestion = this.questionSet[0];
      this.answeredQuestions = [];
      this.correctCount = 0;
      this.wrongCount = 0;
      this.streak = 0;
      this.isAnswered = false;
      this.lastAnswer = null;
      this.isCorrect = null;
      return this.questionSet;
    },

    /**
     * 加载题库中的题目
     */
    loadFromBank(grade, type, count = 10) {
      const questions = getQuestionsFromBank(grade, type, count);
      this.questionSet = questions.map(q => questionToMultipleChoice(q));
      this.currentIndex = 0;
      this.currentQuestion = this.questionSet[0];
      return this.questionSet;
    },

    /**
     * 提交答案
     */
    submitAnswer(answer) {
      if (!this.currentQuestion || this.isAnswered) return null;

      const result = checkAnswer(this.currentQuestion, answer);

      // 记录错题到知识库
      const mathKnowledgeStore = useMathKnowledgeStore();
      const knowledgeId = result.knowledgeId || this.currentQuestion?.type;
      if (knowledgeId) {
        mathKnowledgeStore.recordResult(knowledgeId, result.correct);
      }

      this.isAnswered = true;
      this.lastAnswer = answer;
      this.isCorrect = result.correct;

      if (result.correct) {
        this.correctCount++;
        this.streak++;
        if (this.streak > this.bestStreak) {
          this.bestStreak = this.streak;
        }
      } else {
        this.wrongCount++;
        this.streak = 0;
      }

      this.answeredQuestions.push({
        question: this.currentQuestion,
        userAnswer: answer,
        correct: result.correct,
        correctAnswer: result.correctAnswer
      });

      return result;
    },

    /**
     * 下一题
     */
    nextQuestion() {
      if (this.currentIndex < this.questionSet.length - 1) {
        this.currentIndex++;
        this.currentQuestion = this.questionSet[this.currentIndex];
        this.isAnswered = false;
        this.lastAnswer = null;
        this.isCorrect = null;
        return this.currentQuestion;
      }
      return null;
    },

    /**
     * 上一题
     */
    previousQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.currentQuestion = this.questionSet[this.currentIndex];
        this.isAnswered = false;
        this.lastAnswer = null;
        this.isCorrect = null;
        return this.currentQuestion;
      }
      return null;
    },

    /**
     * 跳转到指定题目
     */
    goToQuestion(index) {
      if (index >= 0 && index < this.questionSet.length) {
        this.currentIndex = index;
        this.currentQuestion = this.questionSet[index];
        this.isAnswered = false;
        this.lastAnswer = null;
        this.isCorrect = null;
        return this.currentQuestion;
      }
      return null;
    },

    /**
     * 重置答题状态
     */
    reset() {
      this.currentQuestion = null;
      this.questionSet = [];
      this.currentIndex = 0;
      this.answeredQuestions = [];
      this.correctCount = 0;
      this.wrongCount = 0;
      this.streak = 0;
      this.bestStreak = 0;
      this.isAnswered = false;
      this.lastAnswer = null;
      this.isCorrect = null;
    },

    /**
     * 获取答题统计
     */
    getStatistics() {
      return {
        total: this.correctCount + this.wrongCount,
        correct: this.correctCount,
        wrong: this.wrongCount,
        accuracy: this.accuracy,
        streak: this.streak,
        bestStreak: this.bestStreak,
        progress: this.progressPercent,
        answeredQuestions: this.answeredQuestions
      };
    }
  }
});

export default useQuestionStore;
