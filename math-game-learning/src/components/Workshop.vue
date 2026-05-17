<template>
  <div class="workshop">
    <div class="ws-header">
      <h2>🔨 数学工坊</h2>
      <button class="btn-back" @click="$emit('back')">← 返回</button>
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
          <div v-if="store.materialList.length === 0" class="empty-msg">
            答题获取材料
          </div>
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
      <div class="ws-section" v-if="store.craftedItems.length > 0">
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
      <div class="ws-section" v-if="store.pendingSales.length > 0">
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
      </div>
    </div>

    <!-- 上架弹窗 -->
    <div v-if="showListDialog" class="modal-overlay" @click.self="showListDialog = false">
      <div class="modal">
        <h3>上架出售</h3>
        <p>{{ getRecipeName(listingRecipeId) }}</p>
        <div class="price-input">
          <label>价格: </label>
          <input v-model.number="listingPrice" type="number" :min="10" :step="5" />
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
import { ref, computed, onMounted } from 'vue'
import { useWorkshopStore } from '../store/workshopStore'
import { useGameStore } from '../store/gameStore'
import workshopConfig from '../config/workshop'

const emit = defineEmits(['back'])

const store = useWorkshopStore()
const gameStore = useGameStore()

const showQuestionDialog = ref(false)
const questionText = ref('')
const questionOptions = ref([])
const questionAnswer = ref(0)

const showListDialog = ref(false)
const listingRecipeId = ref('')
const listingPrice = ref(0)

function getMaterialIcon(id) {
  const mat = workshopConfig.materialTypes.find(m => m.id === id)
  return mat ? mat.icon : '?'
}

function getRecipeIcon(id) {
  const recipe = workshopConfig.recipes.find(r => r.id === id)
  return recipe ? recipe.icon : '?'
}

function getRecipeName(id) {
  const recipe = workshopConfig.recipes.find(r => r.id === id)
  return recipe ? recipe.name : id
}

function handleCraft(recipeId) {
  if (store.craftRecipe(recipeId)) {
    gameStore.saveGame()
  }
}

function openListDialog(recipeId) {
  const recipe = workshopConfig.recipes.find(r => r.id === recipeId)
  listingRecipeId.value = recipeId
  listingPrice.value = recipe.basePrice
  showListDialog.value = true
}

function confirmList() {
  if (listingPrice.value >= 10) {
    store.listItem(listingRecipeId.value, listingPrice.value)
    gameStore.saveGame()
    showListDialog.value = false
  }
}

function handleWithdraw(idx) {
  store.withdrawItem(idx)
  gameStore.saveGame()
}

function generateQuestion() {
  const grade = gameStore.playerGrade || 1
  const maxNum = grade <= 2 ? 20 : grade <= 4 ? 100 : 1000
  const a = Math.floor(Math.random() * maxNum) + 1
  const b = Math.floor(Math.random() * maxNum) + 1
  const ops = ['+', '-']
  if (grade >= 3) ops.push('×')
  if (grade >= 4) ops.push('÷')
  const op = ops[Math.floor(Math.random() * ops.length)]

  let answer
  switch (op) {
    case '+': answer = a + b; break
    case '-': answer = a - b; break
    case '×': answer = a * b; break
    case '÷': { const d = Math.floor(Math.random() * 10) + 1; answer = d; break }
  }

  questionText.value = `${a} ${op} ${b} = ?`
  questionAnswer.value = answer

  const opts = new Set([answer])
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10
    const val = answer + offset
    if (val !== answer) opts.add(val)
  }
  questionOptions.value = [...opts].sort(() => Math.random() - 0.5)
  showQuestionDialog.value = true
}

function answerQuestion(selected) {
  if (selected === questionAnswer.value) {
    const reward = store.rewardMaterial()
    gameStore.saveGame()
    alert(`答对了！获得 ${reward.material.icon} ${reward.material.name} ×${reward.amount}`)
  } else {
    alert('答错了，再试一次！')
  }
  closeQuestion()
}

function closeQuestion() {
  showQuestionDialog.value = false
}

onMounted(() => {
  // 结算销售
  store.settleSales()
  gameStore.saveGame()
})
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

.ws-header h2 { margin: 0; font-size: 1.6rem; }

.btn-back {
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
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

.empty-msg { opacity: 0.5; padding: 1rem; text-align: center; }

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
