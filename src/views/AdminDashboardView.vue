<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
// 由于后续代码中多处使用到 ElMessageBox，保留该导入语句，此提示可能是因为检查工具误报，暂不做删除
import { ElMessageBox } from 'element-plus';

// 定义数据类型
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

// 状态管理
const loading = ref(true);
const users = ref<User[]>([]);
const courses = ref<Course[]>([]);
const stats = ref<{ totalUsers: number; totalCourses: number; totalEnrollments: number }>({
  totalUsers: 0,
  totalCourses: 0,
  totalEnrollments: 0
});
const error = ref<string | null>(null);

// 路由和用户信息
const router = useRouter();
const userStore = useUserStore();

// 检查用户权限
const checkPermission = () => {
  if (!userStore.isLoggedIn || userStore.userInfo?.role !== 'admin') {
    ElMessage.error('您没有权限访问此页面');
    router.push({ name: 'home' });
    return false;
  }
  return true;
};

// 获取统计数据
const fetchStats = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    stats.value = {
      totalUsers: 150,
      totalCourses: 25,
      totalEnrollments: 320
    };
  } catch (err) {
    error.value = '获取统计数据失败';
    ElMessage.error('获取统计数据失败');
    console.error('Failed to fetch stats:', err);
  }
};

// 获取用户列表
const fetchUsers = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    users.value = [
      { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'student', createdAt: '2023-01-15' },
      { id: '2', name: '李四', email: 'lisi@example.com', role: 'teacher', createdAt: '2023-02-20' },
      { id: '3', name: '王五', email: 'wangwu@example.com', role: 'admin', createdAt: '2023-03-10' },
      { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: 'student', createdAt: '2023-04-05' },
      { id: '5', name: '孙七', email: 'sunqi@example.com', role: 'student', createdAt: '2023-05-12' }
    ];
  } catch (err) {
    error.value = '获取用户列表失败';
    ElMessage.error('获取用户列表失败');
    console.error('Failed to fetch users:', err);
  }
};

// 获取课程列表
const fetchCourses = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    courses.value = [
      { id: '1', title: 'JavaScript基础', teacherName: '李四', studentCount: 45, createdAt: '2023-02-25' },
      { id: '2', title: 'Vue.js实战', teacherName: '李四', studentCount: 60, createdAt: '2023-03-15' },
      { id: '3', title: 'React入门', teacherName: '张三', studentCount: 30, createdAt: '2023-04-10' },
      { id: '4', title: 'Node.js后端开发', teacherName: '王五', studentCount: 25, createdAt: '2023-05-05' }
    ];
  } catch (err) {
    error.value = '获取课程列表失败';
    ElMessage.error('获取课程列表失败');
    console.error('Failed to fetch courses:', err);
  }
};

// 初始化数据
const initData = async () => {
  if (!checkPermission()) return;
  
  try {
    loading.value = true;
    await Promise.all([fetchStats(), fetchUsers(), fetchCourses()]);
  } finally {
    loading.value = false;
  }
};

// 删除用户
const deleteUser = (userId: string) => {
    ElMessageBox.confirm('确定要删除此用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 更新本地数据
      users.value = users.value.filter(user => user.id !== userId);
      stats.value.totalUsers -= 1;
      
      ElMessage.success('用户删除成功');
    } catch (err) {
      ElMessage.error('删除用户失败');
      console.error('Failed to delete user:', err);
    }
  }).catch(() => {
    // 用户取消操作
  });
};

// 删除课程
const deleteCourse = (courseId: string) => {
  ElMessageBox.confirm('确定要删除此课程吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 更新本地数据
      courses.value = courses.value.filter(course => course.id !== courseId);
      stats.value.totalCourses -= 1;
      
      ElMessage.success('课程删除成功');
    } catch (err) {
      ElMessage.error('删除课程失败');
      console.error('Failed to delete course:', err);
    }
  }).catch(() => {
    // 用户取消操作
  });
};

// 初始化
onMounted(() => {
  initData();
});
</script>

<template>
  <div class="admin-dashboard">
    <div v-if="loading" class="loading-overlay">
      <el-loading-spinner />Loading dashboard data...
    </div>

    <template v-else>
      <div class="dashboard-header">
        <h1>管理员控制台</h1>
        <div class="user-info">
          <span>欢迎，{{ userStore.user?.name }}</span>
          <el-button @click="userStore.logout()">退出登录</el-button>
        </div>
      </div>

      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-title">总用户数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-description">平台注册用户总数</div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-title">总课程数</div>
          <div class="stat-value">{{ stats.totalCourses }}</div>
          <div class="stat-description">平台发布课程总数</div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-title">总报名数</div>
          <div class="stat-value">{{ stats.totalEnrollments }}</div>
          <div class="stat-description">课程总报名人数</div>
        </el-card>
      </div>

      <div class="dashboard-sections">
        <div class="section">
          <div class="section-header">
            <h2>用户管理</h2>
            <el-button>添加用户</el-button>
          </div>

          <el-table :data="users" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="email" label="邮箱" width="200" />
            <el-table-column prop="role" label="角色" width="100" />
            <el-table-column prop="createdAt" label="注册日期" width="150" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>课程管理</h2>
            <el-button>添加课程</el-button>
          </div>

          <el-table :data="courses" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="课程名称" width="200" />
            <el-table-column prop="teacherName" label="讲师" width="120" />
            <el-table-column prop="studentCount" label="学生数" width="100" />
            <el-table-column prop="createdAt" label="创建日期" width="150" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCourse(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>

    <div v-if="loading" class="loading-overlay">
      <el-loading-spinner />Loading dashboard data...
    </div>

    <div v-else-if="error" class="error-message">
      <el-alert :message="error" type="error" show-icon />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.admin-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dashboard-header h1 {
  font-size: 1.5rem;
  color: $text-color-heading;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-cards {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.stat-title {
  font-size: 0.875rem;
  color: #86909c;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: $text-color-heading;
  margin-bottom: 0.25rem;
}

.stat-description {
  font-size: 0.75rem;
  color: #86909c;
}

.dashboard-sections {
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e6eb;
}

.section-header h2 {
  font-size: 1.25rem;
  color: $text-color-heading;
  margin: 0;
}

.error-message {
  padding: 2rem;
  text-align: center;
}
</style>