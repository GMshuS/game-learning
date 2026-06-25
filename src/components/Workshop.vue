<template>
  <div class="workshop">
    <GameTutorial
      v-if="showTutorial"
      title="🔨 数学工坊玩法说明"
      :steps="workshopTutorialSteps"
      @close="closeTutorial"
    />

    <div class="ws-header">
      <h2>🔨 数学工坊</h2>
      <div class="header-actions">
        <button class="btn-help" @click="showTutorial = true">❓ 玩法说明</button>
        <button class="btn-back" @click="$emit('back')">← 返回</button>
      </div>
    </div>

    <div class="ws-content">
      <!-- 材料区 -->
      <div class="ws-section">
        <h3>📦 材料</h3>
        <div class="material-grid">
          <div v-for="mat in store.materialList" :key="mat.id" class="material-item">
            <div class="mat-icon">{{ mat.icon }}</div>
            <div class="mat-name">{{ mat.name }}</div>
            <div class="mat-qty">×{{ mat.quantity }}</div>
          </div>
        </div>
        <div class="get-material-btn" @click="generateQuestion">
          答题获取材料
        </div>
      </div>

      <!-- 配方区 -->
      <div class="ws-section">
        <h3>📋 配方</h3>
        <div class="recipe-list">
          <div v-for="recipe in store.availableRecipes" :key="recipe.id" class="recipe-card">
            <div class="recipe-header">
              <span class="recipe-icon">{{ recipe.icon }}</span>
              <span class="recipe-name">{{ recipe.name }}</span>
            </div>
            <div class="recipe-materials">
              <span v-for="(qty, matId) in recipe.materials" :key="matId" class="mat-req">
                {{ getMaterialIcon(matId) }} ×{{ qty }}
              </span>
            </div>
            <div class="recipe-actions">
              <button
                class="btn-craft"
                :disabled="!store.canCraft(recipe.id)"
                @click="handleCraft(recipe.id)"
              >
                制作
              </button>
              <span class="base-price">💰 {{ recipe.basePrice }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 成品背包 -->
      <div v-if="store.craftedItems.length > 0" class="ws-section">
        <h3>🎒 成品背包</h3>
        <div class="crafted-list">
          <div v-for="item in store.craftedItems" :key="item.recipeId" class="crafted-item">
            <span class="crafted-icon">{{ getRecipeIcon(item.recipeId) }}</span>
            <span class="crafted-name">{{ getRecipeName(item.recipeId) }}</span>
            <span class="crafted-qty">×{{ item.quantity }}</span>
            <button class="btn-list" @click="openListDialog(item.recipeId)">上架</button>
          </div>
        </div>
      </div>

      <!-- 待售队列 -->
      <div v-if="store.pendingSales.length > 0" class="ws-section">
        <h3>🏷️ 待售中</h3>
        <div class="listed-list">
          <div v-for="(item, idx) in store.pendingSales" :key="idx" class="listed-item">
            <span class="listed-icon">{{ getRecipeIcon(item.recipeId) }}</span>
            <span class="listed-name">{{ getRecipeName(item.recipeId) }}</span>
            <span class="listed-price">💰 {{ item.price }}</span>
            <button class="btn-withdraw" @click="handleWithdraw(idx)">撤回</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 答题获取材料弹窗 -->
    <div v-if="showQuestionDialog" class="modal-overlay" @click.self="closeQuestion">
      <div class="modal">
        <h3>📝 答题获取材料</h3>
        <div class="question-text">{{ questionText }}</div>
        <div class="question-options">
          <button v-for="opt in questionOptions" :key="opt" class="q-opt" @click="answerQuestion(opt)">
            {{ opt }}
          </button>
        </div>
        <div v-if="questionResult" :class="['question-result', resultType]">
          {{ questionResult }}
        </div>
      </div>
    </div>

    <!-- 上架弹窗 -->
    <div v-if="showListDialog" class="modal-overlay" @click.self="showListDialog = false">
      <div class="modal">
        <h3>上架出售</h3>
        <p>{{ getRecipeName(listingRecipeId) }}</p>
        <div class="price-input">
          <label>价格: </label>
          <input v-model.number="listingPrice" type="number" :min="10" :step="5">
          <span>💰</span>
        </div>
        <div class="modal-actions">
          <button class="btn-confirm" @click="confirmList">确认上架</button>
          <button class="btn-cancel" @click="showListDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWorkshopStore } from '../store/workshopStore';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { useMathKnowledgeStore } from '../store/mathKnowledgeStore';
import { generateQuestion as generateQuizQuestion } from '../utils/questionGenerator';
import { questionToMultipleChoice } from '../utils/questionUtils';
import workshopConfig from '../config/workshop';
import GameTutorial from './GameTutorial.vue';

defineEmits(['back']);

const store = useWorkshopStore();
const gameStore = useGameStore();
// settingsStore 暂时保留以备后续使用
// const settingsStore = useSettingsStore();

const showTutorial = ref(false);

const workshopTutorialSteps = [
  {
    title: '答题获取材料',
    description: '点击"答题获取材料"按钮，回答数学题目。答对后随机获得一种材料，材料稀有度越高获得概率越低。'
  },
  {
    title: '材料类型',
    description: '共有6种材料：木材、石头、铁矿（普通，60%）、水晶、金矿（稀有，30%）、魔法粉尘（史诗，10%）。'
  },
  {
    title: '制作物品',
    description: '在配方区查看所需材料，材料充足时点击"制作"按钮。配方按年级解锁，高年级可制作更高级的物品。'
  },
  {
    title: '上架售卖',
    description: '制作好的成品在成品背包中，点击"上架"按钮设置售价（最低10金币）后即可上架待售。'
  },
  {
    title: '销售结算',
    description: '顾客会定期购买待售物品，售价越接近基础价格越容易售出。点击"撤回"可退回成品重新定价。'
  }
];

const closeTutorial = () => {
  showTutorial.value = false;
};

const showQuestionDialog = ref(false);
const questionText = ref('');
const questionOptions = ref([]);
const questionAnswer = ref(0);
const currentQuestionType = ref('');
const questionResult = ref('');
const resultType = ref('success');

const showListDialog = ref(false);
const listingRecipeId = ref('');
const listingPrice = ref(0);

function getMaterialIcon(id) {
  const mat = workshopConfig.materialTypes.find(m => m.id === id);
  return mat ? mat.icon : '?';
}

function getRecipeIcon(id) {
  const recipe = workshopConfig.recipes.find(r => r.id === id);
  return recipe ? recipe.icon : '?';
}

function getRecipeName(id) {
  const recipe = workshopConfig.recipes.find(r => r.id === id);
  return recipe ? recipe.name : id;
}

function handleCraft(recipeId) {
  if (store.craftRecipe(recipeId)) {
    gameStore.workshop = store.getSaveData();
    gameStore.saveGame();
  }
}

function openListDialog(recipeId) {
  const recipe = workshopConfig.recipes.find(r => r.id === recipeId);
  listingRecipeId.value = recipeId;
  listingPrice.value = recipe.basePrice;
  showListDialog.value = true;
}

function confirmList() {
  if (listingPrice.value >= 10) {
    store.listItem(listingRecipeId.value, listingPrice.value);
    gameStore.workshop = store.getSaveData();
    gameStore.saveGame();
    showListDialog.value = false;
  }
}

function handleWithdraw(idx) {
  store.withdrawItem(idx);
  gameStore.workshop = store.getSaveData();
  gameStore.saveGame();
}

function generateQuestion() {
  const settingsStore = useSettingsStore();
  const grade = settingsStore.gradeRange.max;
  const q = generateQuizQuestion(grade, 'random');
  const mcq = questionToMultipleChoice(q);
  questionText.value = mcq.question;
  questionOptions.value = mcq.options;
  questionAnswer.value = mcq.answer;
  currentQuestionType.value = q.type;
  showQuestionDialog.value = true;
}

function answerQuestion(selected) {
  const isCorrect = selected === questionAnswer.value;

  // 记录答题结果到知识库
  const mathKnowledgeStore = useMathKnowledgeStore();
  if (currentQuestionType.value) {
    mathKnowledgeStore.recordResult(currentQuestionType.value, isCorrect);
  }

  if (isCorrect) {
    const reward = store.rewardMaterial();
    gameStore.workshop = store.getSaveData();
    gameStore.saveGame();
    questionResult.value = `答对了！获得 ${reward.material.icon} ${reward.material.name} ×${reward.amount}`;
    resultType.value = 'success';
  } else {
    questionResult.value = '答错了，再试一次！';
    resultType.value = 'error';
  }
  setTimeout(closeQuestion, 1500);
}

function closeQuestion() {
  showQuestionDialog.value = false;
  questionResult.value = '';
}

onMounted(() => {
  store.loadData(gameStore.workshop);
  // 结算销售
  store.settleSales();
  gameStore.workshop = store.getSaveData();
  gameStore.saveGame();
});
</script>

<style scoped>
.workshop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: #fff;
  overflow-y: auto;
}

.ws-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.ws-header h2 { margin: 0; font-size: 1.6rem; }

.btn-back {
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
}

.btn-help {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-help:hover {
  background: rgba(102, 126, 234, 0.5);
}

.ws-content { display: flex; flex-direction: column; gap: 1.5rem; }

.ws-section h3 { margin: 0 0 0.8rem; font-size: 1.1rem; }

.material-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.material-item {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.8rem;
  text-align: center;
  min-width: 70px;
}

.mat-icon { font-size: 1.5rem; }
.mat-name { font-size: 0.8rem; margin: 0.3rem 0; }
.mat-qty { font-weight: bold; color: #fbbf24; }

.recipe-list { display: flex; flex-direction: column; gap: 0.8rem; }

.recipe-card {
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1rem;
}

.recipe-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.recipe-icon { font-size: 1.3rem; }
.recipe-name { font-weight: bold; }

.recipe-materials { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; font-size: 0.85rem; }

.recipe-actions { display: flex; align-items: center; gap: 1rem; }

.btn-craft {
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 15px;
  color: #fff;
  cursor: pointer;
}

.btn-craft:disabled { opacity: 0.4; cursor: not-allowed; }

.base-price { font-size: 0.85rem; color: #fbbf24; }

.crafted-list, .listed-list { display: flex; flex-direction: column; gap: 0.5rem; }

.crafted-item, .listed-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255,255,255,0.05);
  padding: 0.6rem 1rem;
  border-radius: 8px;
}

.btn-list {
  margin-left: auto;
  padding: 0.3rem 0.8rem;
  background: #3b82f6;
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
}

.btn-withdraw {
  margin-left: auto;
  padding: 0.3rem 0.8rem;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
}

.get-material-btn {
  margin-top: 0.8rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}
.get-material-btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1e1e32;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h3 { margin: 0 0 1rem; }

.question-text { font-size: 1.5rem; margin-bottom: 1rem; }

.question-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

.q-opt {
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.q-opt:hover { background: rgba(255,255,255,0.2); }

.question-result {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: bold;
}
.question-result.success {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}
.question-result.error {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.price-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.price-input input {
  width: 80px;
  padding: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: #fff;
  text-align: center;
  font-size: 1rem;
}

.modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }

.btn-confirm { padding: 0.5rem 1.5rem; background: #10b981; border: none; border-radius: 15px; color: #fff; cursor: pointer; }
.btn-cancel { padding: 0.5rem 1.5rem; background: rgba(255,255,255,0.2); border: none; border-radius: 15px; color: #fff; cursor: pointer; }

@media (max-width: 768px) {
  .workshop { padding: 1rem; }
}
</style>
