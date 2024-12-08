import { defineStore } from 'pinia'
import api from './api'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    currentBackground: 'default',
    backgrounds: {
      default: '/api/static/backgrounds/gradient-1.jpg',
      nature: '/api/static/backgrounds/nature.jpg',
      abstract: '/api/static/backgrounds/abstract.jpg',
      minimal: '/api/static/backgrounds/minimal.jpg',
      gradient2: '/api/static/backgrounds/gradient-2.jpg',
      gradient3: '/api/static/backgrounds/gradient-3.jpg'
    },
    customBackground: null
  }),
  
  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
    },
    
    setBackground(background) {
      this.currentBackground = background
    },
    
    async setCustomBackground(file) {
      try {
        const formData = new FormData()
        formData.append('background', file)
        
        const response = await api.post('/user/background', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        this.customBackground = response.path
        this.currentBackground = 'custom'
      } catch (error) {
        console.error('Failed to upload background:', error)
        throw error
      }
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'theme-store',
        storage: localStorage,
      },
    ],
  }
}) 