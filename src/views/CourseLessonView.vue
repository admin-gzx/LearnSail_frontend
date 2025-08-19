<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElCard, ElRow, ElCol, ElButton, ElProgress, ElTag } from 'element-plus';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Fullscreen, Clock, BookOpen } from '@element-plus/icons-vue';

// 定义章节详情类型
interface LessonDetail {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  courseId: number;
  courseTitle: string;
  nextLessonId: number | null;
  prevLessonId: number | null;
}

// 定义数据
const lesson = ref<LessonDetail | null>(null);
const currentTime = ref(0);
const totalDuration = ref(600); // 秒
const isPlaying = ref(false);
const volume = ref(80);
const isFullscreen = ref(false);

// 获取路由和用户存储
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const courseId = parseInt(route.params.courseId as string);
const lessonId = parseInt(route.params.lessonId as string);

// 模拟获取章节详情
const fetchLessonDetail = () => {
  // 模拟API请求
  lesson.value = {
    id: lessonId,
    title: `第${lessonId}课: ${lessonId === 1 ? '课程介绍与环境搭建' : lessonId === 2 ? '核心概念讲解' : '组件设计与通信'}`,
    description: `这是${courseId === 1 ? 'Vue3实战开发' : courseId === 2 ? 'React组件设计' : 'JavaScript基础强化'}课程的第${lessonId}章节，主要讲解${lessonId === 1 ? '课程介绍与环境搭建' : lessonId === 2 ? '核心概念讲解' : '组件设计与通信'}的相关内容。`,
    videoUrl: '/videos/lesson.mp4',
    duration: '45分钟',
    courseId: courseId,
    courseTitle: courseId === 1 ? 'Vue3实战开发' : courseId === 2 ? 'React组件设计' : 'JavaScript基础强化',
    nextLessonId: lessonId < 6 ? lessonId + 1 : null,
    prevLessonId: lessonId > 1 ? lessonId - 1 : null
  };
};

// 页面加载时获取数据
onMounted(() => {
  fetchLessonDetail();
});

// 播放/暂停视频
const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
};

// 调整音量
const handleVolumeChange = (value: number) => {
  volume.value = value;
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  // 实际应用中需要调用浏览器全屏API
};

// 跳转到上一章节
const goToPrevLesson = () => {
  if (lesson.value?.prevLessonId) {
    router.push(`/course/${courseId}/lesson/${lesson.value.prevLessonId}`);
  }
};

// 跳转到下一章节
const goToNextLesson = () => {
  if (lesson.value?.nextLessonId) {
    router.push(`/course/${courseId}/lesson/${lesson.value.nextLessonId}`);
  }
};

// 计算进度百分比
const getProgressPercentage = () => {
  return (currentTime.value / totalDuration.value) * 100;
};
</script>

<template>
  <div v-if="lesson" class="course-lesson">
    <div class="page-header">
      <el-button type="text" @click="router.go(-1)">返回</el-button>
      <h1>{{ lesson.title }}</h1>
      <p>{{ lesson.courseTitle }}</p>
    </div>

    <el-row :gutter="20" class="lesson-content-row">
      <el-col :span="16">
        <el-card class="video-card">
          <div class="video-container">
            <div class="video-placeholder">
              <img src="/video-placeholder.jpg" alt="视频播放区域" />
              <div class="play-button" @click="togglePlay">
                <Play size="48" v-if="!isPlaying" />
                <Pause size="48" v-if="isPlaying" />
              </div>
            </div>
            <div class="video-controls">
              <el-button type="text" @click="togglePlay" class="control-btn">
                <Play size="20" v-if="!isPlaying" />
                <Pause size="20" v-if="isPlaying" />
              </el-button>
              <div class="progress-bar">
                <el-progress
                  :percentage="getProgressPercentage()"
                  class="custom-progress"
                  @click="handleProgressClick"
                />
              </div>
              <div class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
              </div>
              <el-button type="text" class="control-btn">
                <Volume2 size="20" />
              </el-button>
              <div class="volume-control">
                <el-slider
                  v-model="volume"
                  :min="0"
                  :max="100"
                  @change="handleVolumeChange"
                  class="volume-slider"
                />
              </div>
              <el-button type="text" class="control-btn" @click="toggleFullscreen">
                <Fullscreen size="20" />
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card class="lesson-materials-card">
          <template #header>
            <div class="card-header">
              <span>课程资料</span>
            </div>
          </template>
          <div class="materials-list">
            <div class="material-item">
              <BookOpen size="16" />
              <span>课程讲义.pdf</span>
              <el-button type="text" size="small">下载</el-button>
            </div>
            <div class="material-item">
              <BookOpen size="16" />
              <span>代码示例.zip</span>
              <el-button type="text" size="small">下载</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="lesson-info-card">
          <h2>章节信息</h2>
          <p class="lesson-description">{{ lesson.description }}</p>
          <div class="lesson-meta">
            <div class="meta-item">
              <Clock size="16" /> {{ lesson.duration }}
            </div>
            <div class="meta-item">
              <ElTag type="success" size="small">视频</ElTag>
            </div>
          </div>

          <div class="navigation-buttons">
            <el-button
              type="primary"
              size="large"
              class="nav-btn"
              @click="goToPrevLesson"
              :disabled="!lesson.prevLessonId"
            >
              <ChevronLeft size="16" /> 上一章节
            </el-button>
            <el-button
              type="primary"
              size="large"
              class="nav-btn"
              @click="goToNextLesson"
              :disabled="!lesson.nextLessonId"
            >
              下一章节 <ChevronRight size="16" />
            </el-button>
          </div>
        </el-card>

        <el-card class="course-outline-card">
          <template #header>
            <div class="card-header">
              <span>课程大纲</span>
            </div>
          </template>
          <div class="outline-list">
            <div class="outline-item" :class="{ 'active': item.id === lessonId }" v-for="item in [1,2,3,4,5,6]" :key="item.id">
              <div class="outline-title">
                <span>第{{ item }}课: {{ item === 1 ? '课程介绍与环境搭建' : item === 2 ? '核心概念讲解' : item === 3 ? '组件设计与通信' : item === 4 ? '状态管理' : item === 5 ? '路由与导航' : '项目实战' }}</span>
              </div>
              <div class="outline-meta">
                <span>{{ item === 1 || item === 2 ? '已完成' : '未开始' }}</span>
                <span>{{ item === 1 || item === 3 ? '45分钟' : item === 2 || item === 4 ? '60分钟' : item === 5 ? '45分钟' : '90分钟' }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.course-lesson {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;
    h1 {
      font-size: $font-size-h1;
      color: $text-color-primary;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    p {
      color: $text-color-secondary;
    }
  }

  .lesson-content-row {
    .video-card {
      margin-bottom: 24px;
      .video-container {
        position: relative;

        .video-placeholder {
          height: 400px;
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.7;
          }
          .play-button {
            position: absolute;
            width: 80px;
            height: 80px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
            &:hover {
              background-color: rgba(22, 93, 255, 0.7);
            }
          }
        }

        .video-controls {
          display: flex;
          align-items: center;
          padding: 12px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;

          .control-btn {
            color: white;
            margin-right: 16px;
          }

          .progress-bar {
            flex: 1;
            margin-right: 16px;
            .custom-progress {
              --el-progress-color: $primary-color;
              --el-progress-text-color: white;
            }
          }

          .time-display {
            margin-right: 16px;
            font-size: $font-size-small;
          }

          .volume-control {
            width: 100px;
            margin-right: 16px;
            .volume-slider {
              --el-slider-rail-color: rgba(255, 255, 255, 0.3);
              --el-slider-track-color: white;
              --el-slider-handle-color: white;
            }
          }
        }
      }
    }

    .lesson-materials-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .materials-list {
        .material-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid $border-color;
          &:last-child {
            border-bottom: none;
          }
          svg {
            margin-right: 8px;
            color: $primary-color;
          }
        }
      }
    }

    .lesson-info-card {
      margin-bottom: 24px;
      h2 {
        font-size: $font-size-h2;
        color: $text-color-primary;
        margin-bottom: 16px;
      }

      .lesson-description {
        color: $text-color-secondary;
        margin-bottom: 16px;
        line-height: $line-height-base;
      }

      .lesson-meta {
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

      .navigation-buttons {
        .nav-btn {
          width: 100%;
          margin-bottom: 12px;
        }
      }
    }

    .course-outline-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .outline-list {
        .outline-item {
          padding: 12px;
          border-radius: $border-radius-sm;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          &:hover {
            background-color: $bg-color-secondary;
          }
          &.active {
            background-color: $secondary-color;
            border-left: 3px solid $primary-color;
          }

          .outline-title {
            margin-bottom: 4px;
            color: $text-color-primary;
          }

          .outline-meta {
            display: flex;
            justify-content: space-between;
            font-size: $font-size-small;
            color: $text-color-tertiary;
          }
        }
      }
    }
  }
}
</style>