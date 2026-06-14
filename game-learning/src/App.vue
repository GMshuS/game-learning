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
</style>
