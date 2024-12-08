<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Settings</h1>
  
        <!-- Theme Settings -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-6">Appearance</h2>
          
          <!-- Theme Toggle -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-medium">Dark Mode</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <button @click="toggleTheme" 
                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <sun-icon v-if="isDark" class="h-6 w-6 text-gray-200" />
              <moon-icon v-else class="h-6 w-6 text-gray-600" />
            </button>
          </div>
  
          <!-- Background Settings -->
          <div class="mb-6">
            <h3 class="font-medium mb-4">Background</h3>
            <div class="grid grid-cols-3 gap-4 mb-4">
              <button v-for="(bg, key) in backgrounds" 
                      :key="key"
                      @click="setBackground(key)"
                      class="relative aspect-video rounded-lg overflow-hidden group">
                <img :src="bg" 
                     :alt="key"
                     class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 
                            group-hover:opacity-100 transition-opacity">
                  <check-circle-icon v-if="currentBackground === key" 
                                   class="h-8 w-8 text-white" />
                </div>
              </button>
            </div>
            
            <label class="inline-flex items-center px-4 py-2 bg-primary-500 text-white 
                          rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              <upload-icon class="h-5 w-5 mr-2" />
              <span>Upload Custom</span>
              <input type="file" 
                     @change="handleBackgroundUpload" 
                     accept="image/*" 
                     class="hidden" />
            </label>
          </div>
        </section>
  
        <!-- Account Settings -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-6">Account</h2>
          
          <!-- Profile Settings -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-2">Display Name</label>
              <input type="text" 
                     v-model="displayName"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            focus:ring-2 focus:ring-primary-500 dark:bg-gray-700" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input type="email" 
                     v-model="email"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            focus:ring-2 focus:ring-primary-500 dark:bg-gray-700" />
            </div>
          </div>
  
          <!-- Password Change -->
          <div class="space-y-4">
            <h3 class="font-medium">Change Password</h3>
            <div>
              <label class="block text-sm font-medium mb-2">Current Password</label>
              <input type="password" 
                     v-model="currentPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            focus:ring-2 focus:ring-primary-500 dark:bg-gray-700" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">New Password</label>
              <input type="password" 
                     v-model="newPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            focus:ring-2 focus:ring-primary-500 dark:bg-gray-700" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Confirm New Password</label>
              <input type="password" 
                     v-model="confirmPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            focus:ring-2 focus:ring-primary-500 dark:bg-gray-700" />
            </div>
            
            <button @click="changePassword"
                    class="px-6 py-2 bg-primary-500 text-white rounded-lg 
                           hover:bg-primary-600 transition-colors">
              Update Password
            </button>
          </div>
        </section>
  
        <!-- Calendar Settings -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-6">Calendar</h2>
          
          <div class="space-y-6">
            <!-- Week Start -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">Week Starts On</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred first day of the week
                </p>
              </div>
              <select v-model="weekStart"
                      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             focus:ring-2 focus:ring-primary-500 dark:bg-gray-700">
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
              </select>
            </div>
  
            <!-- Default View -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">Default View</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Choose the default calendar view
                </p>
              </div>
              <select v-model="defaultView"
                      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             focus:ring-2 focus:ring-primary-500 dark:bg-gray-700">
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useThemeStore } from '@/stores/themeStore'
  import { useUserStore } from '@/stores/userStore'
  import { 
    SunIcon, 
    MoonIcon, 
    CheckCircleIcon,
    ArrowUpTrayIcon as UploadIcon
  } from '@heroicons/vue/24/outline'
  
  const themeStore = useThemeStore()
  const userStore = useUserStore()
  
  // Theme settings
  const isDark = ref(themeStore.isDark)
  const currentBackground = ref(themeStore.currentBackground)
  const backgrounds = themeStore.backgrounds
  
  // User settings
  const displayName = ref(userStore.user?.displayName || '')
  const email = ref(userStore.user?.email || '')
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  
  // Calendar settings
  const weekStart = ref('0')
  const defaultView = ref('month')
  
  const toggleTheme = () => {
    themeStore.toggleDarkMode()
    isDark.value = themeStore.isDark
  }
  
  const setBackground = (background) => {
    themeStore.setBackground(background)
    currentBackground.value = background
  }
  
  const handleBackgroundUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
  
    // 在实际应用中，这里应该上传到服务器
    const url = URL.createObjectURL(file)
    themeStore.setCustomBackground(url)
    currentBackground.value = 'custom'
  }
  
  const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      // TODO: Show error message
      return
    }
  
    try {
      // TODO: Implement password change logic
      console.log('Changing password...')
    } catch (error) {
      console.error('Failed to change password:', error)
    }
  }
  </script> 