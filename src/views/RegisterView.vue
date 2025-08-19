<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

// 定义表单数据
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 定义表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

// 获取路由
const router = useRouter();

// 注册函数
const handleRegister = async () => {
  try {
    // 模拟注册请求
    // 实际开发中应该调用api.post('/auth/register', form.value)
    const response = {
      success: true
    };

    if (response.success) {
      ElMessage.success('注册成功，请登录');
      // 跳转到登录页面
      router.push('/login');
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后再试');
    console.error('Register error:', error);
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <h2 class="form-title">用户注册</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="registerForm"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
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
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="register-btn"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <p class="login-link">
        已有账号？<a href="/login">立即登录</a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-color-secondary;
}

.register-form-wrapper {
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

.register-form {
  .register-btn {
    width: 100%;
  }
}

.login-link {
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