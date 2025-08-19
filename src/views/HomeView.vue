<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { ElCarousel, ElCarouselItem, ElCard, ElButton } from 'element-plus';

// 定义数据
type Course = {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  price: number;
  rating: number;
};

const popularCourses = ref<Course[]>([]);
const newCourses = ref<Course[]>([]);
const banners = ref<{id: number; image: string; title: string}[]>([]);

// 获取数据
const fetchData = async () => {
  try {
    // 获取热门课程
    const popularResponse = await api.get('/courses?ordering=-rating&page_size=6');
    popularCourses.value = popularResponse.data.results;

    // 获取新课程
    const newResponse = await api.get('/courses?ordering=-created_at&page_size=6');
    newCourses.value = newResponse.data.results;

    // 获取轮播图数据
    banners.value = [
      { id: 1, image: '/banner1.jpg', title: '欢迎来到智慧云课堂' },
      { id: 2, image: '/banner2.jpg', title: '提升技能，改变未来' },
      { id: 3, image: '/banner3.jpg', title: '专业讲师，优质课程' }
    ];
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

// 挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <el-carousel height="400px" :interval="5000" arrow="always">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <div class="banner" :style="{ backgroundImage: `url(${banner.image})` }">
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>探索数千门优质课程，提升你的技能水平</p>
            <el-button type="primary" size="large">立即开始</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 热门课程 -->
    <section class="courses-section">
      <div class="section-header">
        <h2>热门课程</h2>
        <a href="/courses" class="view-all">查看全部 →</a>
      </div>
      <div class="courses-grid">
        <el-card v-for="course in popularCourses" :key="course.id" class="course-card">
          <img :src="course.cover_image" alt="课程封面" class="course-image" />
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-rating">
              <span class="star">★</span> {{ course.rating.toFixed(1) }}
            </div>
            <div class="course-price">
              {{ course.price > 0 ? '¥' + course.price : '免费' }}
            </div>
            <el-button type="primary" size="small" class="enroll-btn">立即学习</el-button>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 新课程 -->
    <section class="courses-section">
      <div class="section-header">
        <h2>新课程</h2>
        <a href="/courses" class="view-all">查看全部 →</a>
      </div>
      <div class="courses-grid">
        <el-card v-for="course in newCourses" :key="course.id" class="course-card">
          <img :src="course.cover_image" alt="课程封面" class="course-image" />
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-rating">
              <span class="star">★</span> {{ course.rating.toFixed(1) }}
            </div>
            <div class="course-price">
              {{ course.price > 0 ? '¥' + course.price : '免费' }}
            </div>
            <el-button type="primary" size="small" class="enroll-btn">立即学习</el-button>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.banner-content {
  z-index: 1;
  text-align: center;
  max-width: 800px;
  h2 {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }
  p {
    font-size: 1.2rem;
    margin-bottom: 24px;
  }
}

.courses-section {
  margin: 60px 0;
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    h2 {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .view-all {
      color: #165dff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  .course-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    .course-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    .course-info {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .course-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .course-rating {
      color: #ff7d00;
      margin-bottom: 8px;
      .star {
        margin-right: 4px;
      }
    }
    .course-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f53f3f;
      margin-bottom: 16px;
    }
    .enroll-btn {
      margin-top: auto;
    }
  }
}
</style>