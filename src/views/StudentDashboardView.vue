<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { ElCard, ElRow, ElCol, ElStatistic, ElProgress, ElTable, ElTableColumn, ElButton, ElIcon } from 'element-plus';
import { BookOpen, Clock, Award, ChevronRight, Calendar } from '@element-plus/icons-vue';

// 定义课程类型
interface Course {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  instructor: string;
}

// 定义数据
const learningStats = ref({
  totalCourses: 0,
  completedCourses: 0,
  overallProgress: 0
});

const ongoingCourses = ref<Course[]>([]);
const upcomingDeadlines = ref<Course[]>([]);

// 获取用户存储
const userStore = useUserStore();

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 计算剩余天数
const calculateDaysRemaining = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays}天` : '今天截止';
};

// 模拟获取数据
const fetchData = () => {
  // 模拟API请求
  learningStats.value = {
    totalCourses: 4,
    completedCourses: 1,
    overallProgress: 45
  };

  ongoingCourses.value = [
    {
      id: 1,
      title: 'Vue3实战开发',
      progress: 60,
      deadline: '2023-07-15',
      instructor: '张老师'
    },
    {
      id: 2,
      title: 'JavaScript基础强化',
      progress: 30,
      deadline: '2023-07-20',
      instructor: '李老师'
    },
    {
      id: 3,
      title: '前端工程化',
      progress: 0,
      deadline: '2023-08-01',
      instructor: '王老师'
    }
  ];

  upcomingDeadlines.value = [
    {
      id: 1,
      title: 'Vue3实战开发 - 作业3',
      progress: 0,
      deadline: '2023-06-20',
      instructor: '张老师'
    },
    {
      id: 2,
      title: 'JavaScript基础强化 - 测验',
      progress: 0,
      deadline: '2023-06-25',
      instructor: '李老师'
    }
  ];
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="student-dashboard">
    <div class="page-header">
      <h1>学习仪表板</h1>
      <p>欢迎回来，{{ userStore.userInfo?.username }}</p>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><BookOpen /></div>
          <el-statistic
            title="总课程数"
            :value="learningStats.totalCourses"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><Award /></div>
          <el-statistic
            title="已完成课程"
            :value="learningStats.completedCourses"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><Clock /></div>
          <el-statistic
            title="总体进度"
            :value="learningStats.overallProgress"
            suffix="%"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="16">
        <el-card class="ongoing-courses-card">
          <template #header>
            <div class="card-header">
              <span>进行中的课程</span>
              <el-button type="text" class="view-all-btn">查看全部 <ChevronRight size="14" /></el-button>
            </div>
          </template>
          <el-table :data="ongoingCourses" style="width: 100%">
            <el-table-column prop="title" label="课程名称" width="300"></el-table-column>
            <el-table-column prop="instructor" label="讲师"></el-table-column>
            <el-table-column prop="progress" label="进度">
              <template #default="scope">
                <el-progress :percentage="scope.row.progress" :text-inside="true" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止日期"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" size="small">继续学习</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="progress-card">
          <template #header>
            <div class="card-header">
              <span>学习进度</span>
            </div>
          </template>
          <div class="progress-container">
            <el-progress type="circle" :percentage="learningStats.overallProgress" />            
            <div class="progress-text">
              <p>总体完成度</p>
              <p class="percentage">{{ learningStats.overallProgress }}%</p>
            </div>
          </div>
        </el-card>

        <el-card class="deadlines-card">
          <template #header>
            <div class="card-header">
              <span>即将截止</span>
              <Calendar size="18" />
            </div>
          </template>
          <div class="deadline-item" v-for="item in upcomingDeadlines" :key="item.id">
            <div class="date-badge">
              {{ formatDate(item.deadline) }}
            </div>
            <div class="deadline-content">
              <h4>{{ item.title }}</h4>
              <p>剩余时间: {{ calculateDaysRemaining(item.deadline) }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.student-dashboard {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;
    h1 {
      font-size: $font-size-h1;
      color: $text-color-primary;
      margin-bottom: 8px;
    }
    p {
      color: $text-color-secondary;
    }
  }

  .stats-row {
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    padding: 16px;

    .stat-icon {
      font-size: 24px;
      color: $primary-color;
      margin-right: 16px;
    }
  }

  .content-row {
    .ongoing-courses-card,
    .progress-card,
    .deadlines-card {
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .view-all-btn {
      color: $primary-color;
      padding: 0;
    }

    .progress-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;

      .progress-text {
        margin-left: 20px;
        text-align: center;

        .percentage {
          font-size: $font-size-h3;
          font-weight: bold;
          color: $primary-color;
        }
      }
    }

    .deadline-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .date-badge {
        background-color: $warning-c