<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
#app {
  font-family: 'Inter', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1d2129;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>