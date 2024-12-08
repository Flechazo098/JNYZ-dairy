<template>
    <div class="flex items-center gap-2">
      <div class="relative h-10 min-w-[120px] border rounded">
        <!-- 加载状态 -->
        <div v-if="isLoading" 
             class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
          <svg class="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        
        <!-- 错误状态 -->
        <div v-if="hasError" 
             class="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 cursor-pointer"
             @click="retryLoadCaptcha">
          <div class="text-center">
            <span class="text-sm text-red-600 dark:text-red-400 block">加载失败</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 block">点击重试</span>
          </div>
        </div>
        
        <!-- 验证码图片 -->
        <img v-show="!isLoading && !hasError"
             :src="captchaImage" 
             alt="验证码" 
             class="h-full w-full object-cover cursor-pointer"
             @click="refreshCaptcha"
        />
      </div>
      
      <button @click="refreshCaptcha"
              :disabled="isLoading"
              class="text-primary-500 hover:text-primary-600 disabled:opacity-50 
                     disabled:cursor-not-allowed">
        <arrow-path-icon class="h-5 w-5" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ArrowPathIcon } from '@heroicons/vue/24/outline'
  import api from '@/services/api'
  
  const captchaImage = ref('')
  const isLoading = ref(true)
  const hasError = ref(false)
  const retryCount = ref(0)
  const MAX_RETRIES = 3
  const RETRY_DELAY = 1000 // 1秒后重试
  
  const loadCaptcha = async () => {
    try {
      isLoading.value = true
      hasError.value = false
      
      // 模拟验证码图片（开发测试用）
      // 实际开发时删除这段，使用下面注释的代码
      // await new Promise(resolve => setTimeout(resolve, 500))
      // captchaImage.value = `data:image/svg+xml;base64,${btoa(`
      //   <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      //     <rect width="100%" height="100%" fill="#f0f0f0"/>
      //     <text x="50%" y="50%" font-family="Arial" font-size="20" 
      //           text-anchor="middle" dominant-baseline="middle" fill="#666">
      //       1234
      //     </text>
      //   </svg>
      // `)}`
      
       //实际的API调用代码
      const response = await api.get('/auth/captcha', { 
        responseType: 'blob'
      })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        captchaImage.value = reader.result
      }
      reader.readAsDataURL(response)
  
      
      isLoading.value = false
      retryCount.value = 0
    } catch (error) {
      console.error('Failed to load captcha:', error)
      hasError.value = true
      isLoading.value = false
      
      // 自动重试
      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        setTimeout(() => {
          loadCaptcha()
        }, RETRY_DELAY * retryCount.value)
      }
    }
  }
  
  const retryLoadCaptcha = () => {
    if (retryCount.value >= MAX_RETRIES) {
      retryCount.value = 0
    }
    loadCaptcha()
  }
  
  const refreshCaptcha = () => {
    retryCount.value = 0
    loadCaptcha()
  }
  
  // 重置状态
  const reset = () => {
    retryCount.value = 0
    isLoading.value = true
    hasError.value = false
    loadCaptcha()
  }
  
  onMounted(() => {
    loadCaptcha()
  })
  
  defineExpose({
    refreshCaptcha,
    reset
  })
  </script> 