import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    currentBackground: 'default',
    backgrounds: {
      default: '/backgrounds/gradient-1.jpg',
      nature: '/backgrounds/nature.jpg',
      abstract: '/backgrounds/abstract.jpg',
      minimal: '/backgrounds/minimal.jpg',
      gradient2: '/backgrounds/gradient-2.jpg',
      gradient3: '/backgrounds/gradient-3.jpg'
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
    
    setCustomBackground(url) {
      this.customBackground = url
      this.currentBackground = 'custom'
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