import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStore } from '@/store/modules/user';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// 请求拦截器
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const userStore = useUserStore();
    if (userStore.getToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${userStore.getToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;