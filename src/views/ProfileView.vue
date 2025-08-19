<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { ElCard, ElRow, ElCol, ElForm, ElFormItem, ElInput, ElButton, ElAvatar, ElUpload, ElMessage } from 'element-plus';
import { User, Camera, Edit, Check, ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

// 定义用户资料类型
interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

// 定义数据
const userProfile = ref<UserProfile | null>(null);
const isEditing = ref(false);
const form = ref({
  username: '',
  email: '',
  bio: ''
});
const avatarUrl = ref('');

// 获取用户存储和路由
const userStore = useUserStore();
const router = useRouter();

// 模拟获取用户资料
const fetchUserProfile = () => {
  // 模拟API请求
  if (userStore.userInfo) {
    userProfile.value = {
      id: userStore.userInfo.id,
      username: userStore.userInfo.username,
      email: userStore.userInfo.email,
      avatar: '/avatars/default-avatar.png',
      bio: '我是一名学习爱好者，正在使用智慧云课堂提升自己的技能。',
      createdAt: '2023-01-15'
    };

    // 初始化表单数据
    form.value = {
      username: userProfile.value.username,
      email: userProfile.value.email,
      bio: userProfile.value.bio
    };

    avatarUrl.value = userProfile.value.avatar;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchUserProfile();
});

// 切换编辑状态
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 取消编辑，重置表单
    form.value = {
      username: userProfile.value?.username || '',
      email: userProfile.value?.email || '',
      bio: userProfile.value?.bio || ''
    };
  }
};

// 保存用户资料
const saveProfile = async () => {
  try {
    // 模拟API请求
    // 实际开发中应该调用api.put('/user/profile', form.value)
    if (userProfile.value) {
      userProfile.value.username = form.value.username;
      userProfile.value.email = form.value.email;
      userProfile.value.bio = form.value.bio;
      if (avatarUrl.value !== userProfile.value.avatar) {
        userProfile.value.avatar = avatarUrl.value;
      }
    }

    isEditing.value = false;
    ElMessage.success('资料更新成功');
  } catch (error) {
    ElMessage.error('资料更新失败，请稍后再试');
    console.error('Save profile error:', error);
  }
};

// 处理头像上传
const handleAvatarUpload = (uploadFile: any) => {
  // 模拟上传成功
  // 实际开发中应该调用上传API
  avatarUrl.value = URL.createObjectURL(uploadFile.raw);
};
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <el-button type="text" @click="router.go(-1)"><ArrowLeft size="16" /> 返回</el-button>
      <h1>个人资料</h1>
    </div>

    <el-card class="profile-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="avatar-container">
            <el-avatar :src="avatarUrl" class="user-avatar" :size="120" />
            <div class="avatar-upload">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarUpload"
                accept="image/*"
              >
                <el-button type="primary" icon="Camera" size="small">更换头像</el-button>
              </el-upload>
            </div>
            <div class="user-info">
              <h2>{{ userProfile?.username }}</h2>
              <p class="join-date">加入时间: {{ userProfile?.createdAt }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="edit-button-container">
            <el-button
              type="primary"
              icon="Edit"
              @click="toggleEdit"
              v-if="!isEditing"
            >
              编辑资料
            </el-button>
            <el-button
              type="success"
              icon="Save"
              @click="saveProfile"
              v-if="isEditing"
              class="save-button"
            >
              保存
            </el-button>
            <el-button
              type="text"
              @click="toggleEdit"
              v-if="isEditing"
            >
              取消
            </el-button>
          </div>

          <el-form :model="form" class="profile-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" :disabled="!isEditing" type="email"></el-input>
            </el-form-item>
            <el-form-item label="个人简介" prop="bio">
              <el-input v-model="form.bio" :disabled="!isEditing" type="textarea" rows="4"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><User /></div>
          <div class="stat-content">
            <p class="stat-value">3</p>
            <p class="stat-label">已参加课程</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><Award /></div>
          <div class="stat-content">
            <p class="stat-value">2</p>
            <p class="stat-label">已获得证书</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><Camera /></div>
          <div class="stat-content">
            <p class="stat-value">45%</p>
            <p class="stat-label">学习进度</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;
    h1 {
      font-size: $font-size-h1;
      color: $text-color-primary;
      margin-top: 8px;
    }
  }

  .profile-card {
    margin-bottom: 24px;

    .avatar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      .user-avatar {
        margin-bottom: 16px;
      }

      .avatar-upload {
        margin-bottom: 16px;
      }

      .user-info {
        text-align: center;
        h2 {
          font-size: $font-size-h2;
          color: $text-color-primary;
          margin-bottom: 4px;
        }
        .join-date {
          color: $text-color-tertiary;
          font-size: $font-size-small;
        }
      }
    }

    .edit-button-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;

      .save-button {
        margin-right: 10px;
      }
    }

    .profile-form {
      el-form-item {
        margin-bottom: 20px;
      }
    }
  }

  .stats-row {
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;

      .stat-icon {
        font-size: 24px;
        color: $primary-color;
        margin-right: 16px;
      }

      .stat-content {
        .stat-value {
          font-size: $font-size-h2;
          font-weight: bold;
          color: $text-color-primary;
          margin-bottom: 4px;
        }
        .stat-label {
          color: $text-color-secondary;
        }
      }
    }
  }
}
</style>