<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-8">欢迎回来</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">邮箱</label>
          <input type="email" 
                 v-model="email"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" 
                 required />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">密码</label>
          <input type="password" 
                 v-model="password"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" 
                 required />
        </div>
        
        <button type="submit" 
                class="w-full py-3 px-4 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors">
          登录
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <router-link to="/register" class="text-blue-500 hover:text-blue-600">
          还没有账号？立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
  
const router = useRouter()
const userStore = useUserStore()
  
const email = ref('')
const password = ref('')
  
const handleLogin = async () => {
  try {
    await userStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    // TODO: Add error handling
  }
}
</script> 