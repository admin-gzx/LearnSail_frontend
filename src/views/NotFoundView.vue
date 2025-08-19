<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const countdown = ref(5);

// 自动跳转倒计时
const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push({ name: 'home' });
    }
  }, 1000);
};

// 初始化倒计时
startCountdown();
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <div class="actions">
        <el-button @click="router.push({ name: 'home' })">返回首页</el-button>
      </div>
      <p class="auto-redirect">
        或将在 {{ countdown }} 秒后自动返回首页
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  padding: 3rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-code {
  font-size: 4rem;
  font-weight: 700;
  color: $primary-color;
  margin: 0 0 1rem;
}

h2 {
  font-size: 1.5rem;
  color: $text-color-heading;
  margin: 0 0 1rem;
}

p {
  color: #86909c;
  margin: 0 0 2rem;
}

.actions {
  margin-bottom: 2rem;
}

.auto-redirect {
  font-size: 0.875rem;
}
</style>