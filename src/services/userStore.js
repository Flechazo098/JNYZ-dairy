import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    async register(userData) {
      const response = await authService.register(userData)
      this.user = response.user
      this.isAuthenticated = true
      localStorage.setItem('token', response.token)
    },
    
    // ... 其他方法
  }
}) 