<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElCard, ElRow, ElCol, ElButton, ElTag, ElRate, ElTabs, ElTabPane, ElImage, ElProgress } from 'element-plus';
import { Calendar, Clock, User, Document, Star, VideoPlay } from '@element-plus/icons-vue';

// 定义课程章节类型
interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

// 定义课程详情类型
interface CourseDetail {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  rating: number;
  students: number;
  price: number;
  image: string;
  startDate: string;
  endDate: string;
  duration: string;
  level: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
}

// 定义数据
const course = ref<CourseDetail | null>(null);
const activeTab = ref('overview');

// 获取路由和用户存储
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const courseId = parseInt(route.params.id as string);

// 模拟获取课程详情
const fetchCourseDetail = () => {
  // 模拟API请求
  course.value = {
    id: courseId,
    title: courseId === 1 ? 'Vue3实战开发' : courseId === 2 ? 'React组件设计' : 'JavaScript基础强化',
    description: '这是一门深入讲解' + (courseId === 1 ? 'Vue3' : courseId === 2 ? 'React' : 'JavaScript') + '的实战课程，通过项目实战帮助学员掌握核心概念和开发技巧。课程内容包括基础语法、组件设计、状态管理、路由、性能优化等方面。',
    instructor: courseId === 1 ? '张老师' : courseId === 2 ? '李老师' : '王老师',
    instructorBio: courseId === 1 ? '张老师，10年Web前端开发经验，Vue.js认证讲师，曾任职于多家知名互联网公司，拥有丰富的实战经验和教学经验。' : courseId === 2 ? '李老师，8年React开发经验，曾参与多个大型React项目的架构设计和开发工作，现任某科技公司前端技术负责人。' : '王老师，12年JavaScript开发经验，精通JavaScript核心概念和各种设计模式，著有《JavaScript高级编程实战》一书。',
    rating: courseId === 1 ? 4.8 : courseId === 2 ? 4.7 : 4.9,
    students: courseId === 1 ? 128 : courseId === 2 ? 95 : 156,
    price: courseId === 1 ? 299 : courseId === 2 ? 399 : 199,
    image: courseId === 1 ? '/course-images/vue3.jpg' : courseId === 2 ? '/course-images/react.jpg' : '/course-images/js.jpg',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    duration: '3个月',
    level: courseId === 1 ? '中级' : courseId === 2 ? '高级' : '初级',
    lessons: [
      { id: 1, title: '课程介绍与环境搭建', duration: '45分钟', completed: true },
      { id: 2, title: '核心概念讲解', duration: '60分钟', completed: true },
      { id: 3, title: '组件设计与通信', duration: '75分钟', completed: false },
      { id: 4, title: '状态管理', duration: '60分钟', completed: false },
      { id: 5, title: '路由与导航', duration: '45分钟', completed: false },
      { id: 6, title: '项目实战', duration: '90分钟', completed: false }
    ],
    totalLessons: 6,
    completedLessons: 2
  };
};

// 页面加载时获取数据
onMounted(() => {
  fetchCourseDetail();
});

// 开始学习课程
const startLearning = (lessonId: number) => {
  router.push(`/course/${courseId}/lesson/${lessonId}`);
};

// 计算课程完成进度
const getCompletionRate = () => {
  if (!course.value) return 0;
  return Math.round((course.value.completedLessons / course.value.totalLessons) * 100);
};
</script>

<template>
  <div v-if="course" class="course-detail">
    <div class="page-header">
      <h1>{{ course.title }}</h1>
    </div>

    <el-row :gutter="20" class="course-header-row">
      <el-col :span="16">
        <div class="course-banner">
          <img :src="course.image" alt="{{ course.title }}" />
        </div>
      </el-col>
      <el-col :span="8">
        <el-card class="course-info-card">
          <div class="course-price">¥{{ course.price }}</div>
          <div class="course-meta">
            <div class="meta-item">
              <Calendar size="16" /> {{ course.startDate }} - {{ course.endDate }}
            </div>
            <div class="meta-item">
              <Clock size="16" /> {{ course.duration }}
            </div>
            <div class="meta-item">
              <User size="16" /> {{ course.students }} 人已学习
            </div>
            <div class="meta-item">
              <Award size="16" /> <el-rate :value="course.rating" disabled :max="5" show-score />
            </div>
            <div class="meta-item">
              <BookOpen size="16" /> {{ course.level }}
            </div>
          </div>
          <el-button type="primary" size="large" class="enroll-btn" @click="startLearning(course.lessons[0].id)">
            立即学习
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="course-tabs">
      <el-tab-pane label="课程概述" name="overview">
        <el-card class="overview-card">
          <h2>课程简介</h2>
          <p class="course-description">{{ course.description }}</p>

          <h2>讲师介绍</h2>
          <div class="instructor-info">
            <div class="instructor-avatar"></div>
            <div class="instructor-details">
              <h3>{{ course.instructor }}</h3>
              <p>{{ course.instructorBio }}</p>
            </div>
          </div>

          <h2>学习目标</h2>
          <ul class="learning-objectives">
            <li>掌握{{ course.title.split('实战')[0] }}的核心概念和基本语法</li>
            <li>学会使用{{ course.title.split('实战')[0] }}构建现代化的Web应用</li>
            <li>理解{{ course.title.split('实战')[0] }}的性能优化技巧</li>
            <li>具备独立开发{{ course.title.split('实战')[0] }}项目的能力</li>
          </ul>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="课程章节" name="curriculum">
        <el-card class="curriculum-card">
          <div class="course-progress">
            <span>课程进度: {{ getCompletionRate() }}%</span>
            <el-progress :percentage="getCompletionRate()" />
          </div>

          <div class="lessons-list">
            <div v-for="lesson in course.lessons" :key="lesson.id" class="lesson-item">
              <div class="lesson-header">
                <div class="lesson-title">
                  <Play size="16" v-if="!lesson.completed" class="play-icon" />
                  <Award size="16" v-if="lesson.completed" class="completed-icon" />
                  <span>{{ lesson.title }}</span>
                </div>
                <div class="lesson-meta">
                  <span>{{ lesson.duration }}</span>
                  <el-button
                    type="primary"
                    size="small"
                    @click="startLearning(lesson.id)"
                    :disabled="lesson.completed"
                  >
                    {{ lesson.completed ? '已完成' : '学习' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="学员评价" name="reviews">
        <el-card class="reviews-card">
          <div class="reviews-placeholder">
            <p>学员评价区域</p>
            <p>这里将显示学员对本课程的评价</p>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.course-detail {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;
    h1 {
      font-size: $font-size-h1;
      color: $text-color-primary;
    }
  }

  .course-header-row {
    margin-bottom: 24px;

    .course-banner {
      height: 300px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .course-info-card {
      height: 100%;
      .course-price {
        font-size: $font-size-h1;
        font-weight: bold;
        color: $primary-color;
        margin-bottom: 16px;
      }

      .course-meta {
        margin-bottom: 24px;
        .meta-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          color: $text-color-secondary;
          svg {
            margin-right: 8px;
          }
        }
      }

      .enroll-btn {
        width: 100%;
      }
    }
  }

  .course-tabs {
    .overview-card {
      .course-description {
        color: $text-color-secondary;
        line-height: $line-height-base;
        margin-bottom: 24px;
      }

      .instructor-info {
        display: flex;
        margin-bottom: 24px;
        .instructor-avatar {
          width: 80px;
          height: 80px;
          background-color: $secondary-color;
          border-radius: 50%;
          margin-right: 16px;
        }
        .instructor-details {
          flex: 1;
          h3 {
            font-size: $font-size-h3;
            color: $text-color-primary;
            margin-bottom: 8px;
          }
          p {
            color: $text-color-secondary;
            line-height: $line-height-base;
          }
        }
      }

      .learning-objectives {
        padding-left: 20px;
        li {
          margin-bottom: 8px;
          color: $text-color-secondary;
          position: relative;
          &::before {
            content: '•';
            color: $primary-color;
            position: absolute;
            left: -16px;
          }
        }
      }
    }

    .curriculum-card {
      .course-progress {
        margin-bottom: 24px;
        span {
          display: block;
          margin-bottom: 8px;
          color: $text-color-primary;
        }
      }

      .lessons-list {
        .lesson-item {
          border-bottom: 1px solid $border-color;
          &:last-child {
            border-bottom: none;
          }

          .lesson-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;

            .lesson-title {
              display: flex;
              align-items: center;
              color: $text-color-primary;
              .play-icon {
                color: $primary-color;
                margin-right: 8px;
              }
              .completed-icon {
                color: $success-color;
                margin-right: 8px;
              }
            }

            .lesson-meta {
              display: flex;
              align-items: center;
              span {
                margin-right: 16px;
                color: $text-color-tertiary;
                font-size: $font-size-small;
              }
            }
          }
        }
      }
    }

    .reviews-card {
      .reviews-placeholder {
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: $bg-color-secondary;
        border-radius: $border-radius-md;
        color: $text-color-tertiary;
      }
    }
  }
}
</style>