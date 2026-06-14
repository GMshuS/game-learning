<template>
  <div id="app">
    <GameApp />
  </div>
</template>

<script setup>
import GameApp from './components/GameApp.vue';
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-header {
  padding: 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

.game-header h1 {
  margin: 0;
  color: #fff;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.game-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
}
</style>
