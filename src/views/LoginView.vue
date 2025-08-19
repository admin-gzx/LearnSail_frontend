<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

// 定义表单数据
const form = ref({
  username: '',
  password: ''
});

// 定义表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
};

// 获取路由和用户存储
const router = useRouter();
const userStore = useUserStore();

// 登录函数
const handleLogin = async () => {
  try {
    // 模拟登录请求
    // 实际开发中应该调用api.post('/auth/login', form.value)
    const response = {
      token: 'dummy-token',
      user: {
        id: 1,
        username: form.value.username,
        email: '${form.value.username}@example.com',
        role: 'student'
      }
    };

    // 登录成功，存储token和用户信息
    userStore.login(response.token, response.user);
    ElMessage.success('登录成功');

    // 跳转到首页或之前的重定向页面
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect as string);
    } else {
      router.push('/');
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码');
    console.error('Login error:', error);
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2 class="form-title">用户登录</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="register-link">
        还没有账号？<a href="/register">立即注册</a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-color-secondary;
}

.login-form-wrapper {
  width: 400px;
  padding: 30px;
  background-color: $bg-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-md;
}

.form-title {
  text-align: center;
  margin-bottom: 24px;
  color: $text-color-heading;
}

.login-form {
  .login-btn {
    width: 100%;
  }
}

.register-link {
  text-align: center;
  margin-top: 16px;
  color: $text-color-secondary;
  a {
    color: $primary-color;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>