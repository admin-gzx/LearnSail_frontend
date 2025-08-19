import { defineStore } from 'pinia';
import api from '@/services/api';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: '',
    isAuthenticated: false
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },
  actions: {
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      this.isAuthenticated = true;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    async fetchUserInfo() {
      try {
        const response = await api.get('/users/me');
        this.setUserInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        this.logout();
      }
    },
    login(token: string, userInfo: UserInfo) {
      this.setToken(token);
      this.setUserInfo(userInfo);
    },
    logout() {
      this.userInfo = null;
      this.token = '';
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    async initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        this.setToken(token);
        await this.fetchUserInfo();
      }
    }
  }
});