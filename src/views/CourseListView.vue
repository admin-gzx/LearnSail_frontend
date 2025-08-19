<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElRow, ElCol, ElButton, ElInput, ElSelect, ElOption, ElPagination } from 'element-plus';
import { Search, Filter, ArrowRight } from '@element-plus/icons-vue';

// 定义课程类型
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  image: string;
}

// 定义数据
const courses = ref<Course[]>([]);
const searchQuery = ref('');
const categoryFilter = ref('all');
const currentPage = ref(1);
const pageSize = ref(6);
const totalCourses = ref(0);

// 获取路由
const router = useRouter();

// 模拟获取课程数据
const fetchCourses = () => {
  // 模拟API请求
  const mockCourses = [
    {
      id: 1,
      title: 'Vue3实战开发',
      description: '掌握Vue3框架的核心概念和实战技巧，成为前端开发专家。',
      instructor: '张老师',
      rating: 4.8,
      students: 128,
      price: 299,
      image: '/course-images/vue3.jpg'
    },
    {
      id: 2,
      title: 'React组件设计',
      description: '深入学习React组件设计模式和最佳实践，构建高效可维护的前端应用。',
      instructor: '李老师',
      rating: 4.7,
      students: 95,
      price: 399,
      image: '/course-images/react.jpg'
    },
    {
      id: 3,
      title: 'JavaScript基础强化',
      description: '巩固JavaScript基础，深入理解闭包、原型链、异步编程等核心概念。',
      instructor: '王老师',
      rating: 4.9,
      students: 156,
      price: 199,
      image: '/course-images/js.jpg'
    },
    {
      id: 4,
      title: 'Node.js后端开发',
      description: '学习Node.js搭建后端服务，实现RESTful API，连接数据库等技能。',
      instructor: '赵老师',
      rating: 4.6,
      students: 87,
      price: 349,
      image: '/course-images/node.jpg'
    },
    {
      id: 5,
      title: '前端工程化',
      description: '掌握Webpack、Vite等构建工具，实现前端自动化部署和优化。',
      instructor: '陈老师',
      rating: 4.5,
      students: 72,
      price: 249,
      image: '/course-images/engineering.jpg'
    },
    {
      id: 6,
      title: 'TypeScript入门到精通',
      description: '从零基础学习TypeScript，提升代码质量和开发效率。',
      instructor: '杨老师',
      rating: 4.7,
      students: 63,
      price: 279,
      image: '/course-images/ts.jpg'
    }
  ];

  // 应用筛选
  let filteredCourses = mockCourses;
  if (searchQuery.value) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (categoryFilter.value !== 'all') {
    // 在实际应用中，这里会根据分类进行筛选
    // 此处为演示，暂不实现
  }

  // 分页处理
  totalCourses.value = filteredCourses.length;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  courses.value = filteredCourses.slice(startIndex, endIndex);
};

// 页面加载时获取数据
onMounted(() => {
  fetchCourses();
});

// 搜索课程
const handleSearch = () => {
  currentPage.value = 1;
  fetchCourses();
};

// 筛选课程
const handleFilterChange = () => {
  currentPage.value = 1;
  fetchCourses();
};

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchCourses();
};

// 查看课程详情
const viewCourseDetail = (courseId: number) => {
  router.push(`/course/${courseId}`);
};
</script>

<template>
  <div class="course-list">
    <div class="page-header">
      <h1>课程列表</h1>
      <p>探索我们的优质课程，提升您的技能</p>
    </div>

    <div class="search-filter-bar">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="search-input-wrapper">
            <el-input
              v-model="searchQuery"
              placeholder="搜索课程..."
              prefix-icon="Search"
              @keyup.enter="handleSearch"
            ></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="filter-wrapper">
            <el-select
              v-model="categoryFilter"
              placeholder="筛选分类"
              prefix-icon="Filter"
              @change="handleFilterChange"
            >
              <el-option label="全部课程" value="all"></el-option>
              <el-option label="前端开发" value="frontend"></el-option>
              <el-option label="后端开发" value="backend"></el-option>
              <el-option label="移动开发" value="mobile"></el-option>
              <el-option label="数据科学" value="data"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="courses-grid">
      <el-row :gutter="20">
        <el-col :span="8" v-for="course in courses" :key="course.id">
          <el-card class="course-card" @click="viewCourseDetail(course.id)">
            <div class="course-image">
              <img :src="course.image" alt="{{ course.title }}" />
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-meta">
                <div class="instructor">
                  <span>讲师: {{ course.instructor }}</span>
                </div>
                <div class="rating">
                  <span>评分: {{ course.rating }}</span>
                  <span class="students">{{ course.students }} 人已学习</span>
                </div>
              </div>
              <div class="course-price">
                <span>¥{{ course.price }}</span>
                <el-button type="primary" size="small" class="view-details-btn">
                  查看详情 <ArrowRight size="14" />
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[6, 12, 18]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCourses"
        @size-change="fetchCourses"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.course-list {
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

  .search-filter-bar {
    margin-bottom: 24px;
    .search-input-wrapper {
      display: flex;
      el-input {
        flex: 1;
        margin-right: 10px;
      }
    }
    .filter-wrapper {
      display: flex;
      justify-content: flex-end;
      el-select {
        width: 200px;
      }
    }
  }

  .courses-grid {
    margin-bottom: 24px;
    .course-card {
      height: 100%;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      &:hover {
        transform: translateY(-5px);
        box-shadow: $box-shadow-lg;
      }

      .course-image {
        height: 180px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .course-info {
        padding: 16px;

        .course-title {
          font-size: $font-size-h3;
          color: $text-color-primary;
          margin-bottom: 8px;
        }

        .course-description {
          color: $text-color-secondary;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: $font-size-small;
          color: $text-color-tertiary;
        }

        .course-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          span {
            font-size: $font-size-h4;
            font-weight: bold;
            color: $primary-color;
          }

          .view-details-btn {
            padding: 4px 12px;
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>