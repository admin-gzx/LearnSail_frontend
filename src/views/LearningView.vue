<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 定义课程和章节类型
interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  materials: Array<{ name: string; url: string }>;
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

// 获取路由参数
const route = useRoute();
const router = useRouter();
const courseId = route.params.courseId as string;
const lessonId = route.params.lessonId as string;

// 状态管理
const course = ref<Course | null>(null);
const currentLesson = ref<Lesson | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const videoProgress = ref(0);

// 获取课程和章节数据
const fetchCourseData = async () => {
  try {
    loading.value = true;
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    const mockCourse: Course = {
      id: courseId,
      title: 'JavaScript 高级编程',
      lessons: [
        {
          id: '1',
          title: 'ES6 新特性',
          description: '介绍ES6中的重要特性，包括箭头函数、解构赋值等',
          videoUrl: 'https://example.com/video1.mp4',
          duration: 1200,
          materials: [
            { name: 'ES6 手册', url: 'https://example.com/es6-handbook.pdf' }
          ]
        },
        {
          id: '2',
          title: 'Promise 和异步编程',
          description: '深入理解Promise和异步编程模式',
          videoUrl: 'https://example.com/video2.mp4',
          duration: 1500,
          materials: [
            { name: '异步编程指南', url: 'https://example.com/async-guide.pdf' }
          ]
        },
        {
          id: lessonId,
          title: 'Vue 组件开发',
          description: '学习Vue组件的开发和通信方式',
          videoUrl: 'https://example.com/video3.mp4',
          duration: 1800,
          materials: [
            { name: 'Vue 组件文档', url: 'https://example.com/vue-components.pdf' }
          ]
        }
      ]
    };
    
    course.value = mockCourse;
    currentLesson.value = mockCourse.lessons.find(l => l.id === lessonId) || null;
    
    if (!currentLesson.value) {
      error.value = '找不到指定的章节';
      ElMessage.error('找不到指定的章节');
      router.push({ name: 'courseDetail', params: { id: courseId } });
    }
  } catch (err) {
    error.value = '获取课程数据失败';
    ElMessage.error('获取课程数据失败');
    console.error('Failed to fetch course data:', err);
  } finally {
    loading.value = false;
  }
};

// 保存学习进度
const saveProgress = () => {
  // 模拟保存进度到服务器
  ElMessage.success('学习进度已保存');
};

// 上一课/下一课
const goToLesson = (direction: 'prev' | 'next') => {
  if (!course.value || !currentLesson.value) return;
  
  const currentIndex = course.value.lessons.findIndex(l => l.id === currentLesson.value?.id);
  let nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
  
  if (nextIndex >= 0 && nextIndex < course.value.lessons.length) {
    const nextLesson = course.value.lessons[nextIndex];
    router.push({ name: 'learning', params: { courseId, lessonId: nextLesson.id } });
  } else {
    ElMessage.info(direction === 'prev' ? '已经是第一课' : '已经是最后一课');
  }
};

// 初始化
onMounted(() => {
  fetchCourseData();
});
</script>

<template>
  <div class="learning-container">
    <div v-if="loading" class="loading-overlay">
      <el-loading-spinner />Loading course data...
    </div>

    <template v-else-if="currentLesson">
      <div class="course-header">
        <h1>{{ course?.title }}</h1>
        <div class="course-nav">
          <el-button @click="router.push({ name: 'courseDetail', params: { id: courseId } })"
            >返回课程详情</el-button
          >
        </div>
      </div>

      <div class="learning-content">
        <div class="video-section">
          <h2>{{ currentLesson.title }}</h2>
          <div class="video-player">
            <video
              controls
              :src="currentLesson.videoUrl"
              @timeupdate="videoProgress = $event.target.currentTime / $event.target.duration * 100"
              @ended="saveProgress"
            >
              您的浏览器不支持视频播放
            </video>
            <div class="progress-bar">
              <el-progress
                :percentage="videoProgress"
                :format="() => `${Math.round(videoProgress)}%`"
              />
            </div>
          </div>

          <div class="lesson-description">
            <h3>课程描述</h3>
            <p>{{ currentLesson.description }}</p>
          </div>

          <div class="lesson-materials">
            <h3>学习资料</h3>
            <el-list v-if="currentLesson.materials.length > 0">
              <el-list-item
                v-for="material in currentLesson.materials"
                :key="material.name"
                class="material-item"
              >
                <el-link :href="material.url" target="_blank">{{ material.name }}</el-link>
              </el-list-item>
            </el-list>
            <p v-else>暂无学习资料</p>
          </div>
        </div>

        <div class="navigation-section">
          <h3>课程大纲</h3>
          <el-list>
            <el-list-item
              v-for="lesson in course?.lessons"
              :key="lesson.id"
              :class="{ 'active-lesson': lesson.id === currentLesson.id }"
              @click="router.push({ name: 'learning', params: { courseId, lessonId: lesson.id } })"
            >
              <div class="lesson-title">{{ lesson.title }}</div>
              <div class="lesson-duration">{{ formatDuration(lesson.duration) }}</div>
            </el-list-item>
          </el-list>

          <div class="lesson-navigation">
            <el-button @click="goToLesson('prev')" :disabled="!hasPrevLesson()">上一课</el-button>
            <el-button @click="goToLesson('next')" :disabled="!hasNextLesson()">下一课</el-button>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="error" class="error-message">
      <el-alert :message="error" type="error" show-icon />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.learning-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e5e6eb;
}

.course-header h1 {
  font-size: 1.5rem;
  color: $text-color-heading;
  margin: 0;
}

.learning-content {
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 2rem;
}

.video-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.video-player {
  width: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-player video {
  width: 100%;
  height: auto;
}

.progress-bar {
  padding: 10px;
  background-color: #000;
}

.lesson-description,
.lesson-materials {
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.lesson-description h3,
.lesson-materials h3 {
  margin-top: 0;
  color: $text-color-heading;
}

.navigation-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lesson-item {
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f5f7fa;
  }
}

.active-lesson {
  background-color: #e6f7ff;
  border-left: 4px solid $primary-color;
}

.lesson-title {
  font-weight: 500;
}

.lesson-duration {
  color: #86909c;
  font-size: 0.875rem;
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.error-message {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .learning-content {
    flex-direction: column;
  }
}
</style>