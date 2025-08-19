import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import CourseListView from '@/views/CourseListView.vue';
import CourseDetailView from '@/views/CourseDetailView.vue';
import LearningView from '@/views/LearningView.vue';
import ProfileView from '@/views/ProfileView.vue';
import TeacherDashboardView from '@/views/TeacherDashboardView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { useUserStore } from '@/store/modules/user';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/courses', name: 'courses', component: CourseListView },
  { path: '/courses/:id', name: 'courseDetail', component: CourseDetailView },
  { path: '/learn/:courseId/:lessonId', name: 'learning', component: LearningView },
  { 
    path: '/profile', 
    name: 'profile', 
    component: ProfileView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/teacher', 
    name: 'teacherDashboard', 
    component: TeacherDashboardView, 
    meta: { requiresAuth: true, role: 'teacher' } 
  },
  { 
    path: '/admin', 
    name: 'adminDashboard', 
    component: AdminDashboardView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn;
  const userRole = userStore.userInfo?.role;

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 未认证，重定向到登录页
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (to.meta.role && userRole !== to.meta.role) {
      // 没有权限，重定向到首页
      next({ name: 'home' });
    } else {
      // 已认证且有权限，继续
      next();
    }
  } else {
    // 不需要认证，继续
    next();
  }
});

export default router;