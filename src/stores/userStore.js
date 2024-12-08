import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials) {
      // TODO: Implement actual login
      this.isAuthenticated = true
      this.user = {
        email: credentials.email,
        displayName: 'User'
      }
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
}) 