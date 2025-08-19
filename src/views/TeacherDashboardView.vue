<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { ElCard, ElRow, ElCol, ElStatistic, ElProgress, ElTable, ElTableColumn, ElButton, ElIcon } from 'element-plus';
import { Document, User, Clock, ArrowRight } from '@element-plus/icons-vue';
import { Trophy } from '@element-plus/icons-vue'; // 使用 Trophy 替代原有的 Award

// 定义课程类型
interface Course {
  id: number;
  title: string;
  students: number;
  progress: number;
  lastUpdated: string;
}

// 定义数据
const courseStats = ref({
  totalCourses: 0,
  totalStudents: 0,
  completionRate: 0
});

const recentCourses = ref<Course[]>([]);

// 获取用户存储
const userStore = useUserStore();

// 模拟获取数据
const fetchData = () => {
  // 模拟API请求
  courseStats.value = {
    totalCourses: 5,
    totalStudents: 128,
    completionRate: 78
  };

  recentCourses.value = [
    {
      id: 1,
      title: '高级JavaScript编程',
      students: 35,
      progress: 85,
      lastUpdated: '2023-06-15'
    },
    {
      id: 2,
      title: 'Vue3实战开发',
      students: 42,
      progress: 65,
      lastUpdated: '2023-06-10'
    },
    {
      id: 3,
      title: 'React组件设计',
      students: 28,
      progress: 90,
      lastUpdated: '2023-06-05'
    }
  ];
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="teacher-dashboard">
    <div class="page-header">
      <h1>教师仪表板</h1>
      <p>欢迎回来，{{ userStore.userInfo?.username }}</p>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><BookOpen /></div>
          <el-statistic
            title="总课程数"
            :value="courseStats.totalCourses"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><User /></div>
          <el-statistic
            title="总学生数"
            :value="courseStats.totalStudents"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-icon"><Award /></div>
          <el-statistic
            title="完成率"
            :value="courseStats.completionRate"
            suffix="%"
            :precision="0"
          ></el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="16">
        <el-card class="recent-courses-card">
          <template #header>
            <div class="card-header">
              <span>最近课程</span>
              <el-button type="text" class="view-all-btn">查看全部 <ChevronRight size="14" /></el-button>
            </div>
          </template>
          <el-table :data="recentCourses" style="width: 100%">
            <el-table-column prop="title" label="课程名称" width="300"></el-table-column>
            <el-table-column prop="students" label="学生数"></el-table-column>
            <el-table-column prop="progress" label="完成度">
              <template #default="scope">
                <el-progress :percentage="scope.row.progress" :text-inside="true" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="lastUpdated" label="最后更新"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" size="small">管理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="analytics-card">
          <template #header>
            <div class="card-header">
              <span>学习分析</span>
              <BarChart3 size="18" />
            </div>
          </template>
          <div class="chart-placeholder">
            <p>图表区域</p>
            <p>这里将显示学习数据分析图表</p>
          </div>
        </el-card>

        <el-card class="upcoming-card">
          <template #header>
            <div class="card-header">
              <span>即将开始的课程</span>
              <Clock size="18" />
            </div>
          </template>
          <div class="upcoming-item">
            <div class="date-badge">今天</div>
            <div class="upcoming-content">
              <h4>Web前端开发进阶</h4>
              <p>14:00 - 16:00</p>
            </div>
          </div>
          <div class="upcoming-item">
            <div class="date-badge">明天</div>
            <div class="upcoming-content">
              <h4>Node.js后端开发</h4>
              <p>10:00 - 12:00</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.teacher-dashboard {
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
    .recent-courses-card,
    .analytics-card,
    .upcoming-card {
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

    .chart-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: $bg-color-secondary;
      border-radius: $border-radius-md;
      color: $text-color-tertiary;
    }

    .upcoming-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .date-badge {
        background-color: $primary-color;
        color: white;
        padding: 4px 8px;
        border-radius: $border-radius-sm;
        font-size: $font-size-small;
        margin-right: 12px;
        height: fit-content;
      }

      .upcoming-content {
        flex: 1;
        h4 {
          font-size: $font-size-base;
          color: $text-color-primary;
          margin-bottom: 4px;
        }
        p {
          font-size: $font-size-small;
          color: $text-color-tertiary;
        }
      }
    }
  }
}
</style>