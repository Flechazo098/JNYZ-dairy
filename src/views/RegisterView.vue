<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-8">创建账号</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- 学号 -->
          <div>
            <label class="block text-sm font-medium mb-2">学号</label>
            <input type="text" 
                   v-model="studentId"
                   :class="{ 'border-red-500': errors.studentId }"
                   class="input"
                   autocomplete="off"
                   required
                   pattern="\d{8,12}"
                   title="请输入8-12位数字学号" />
            <p v-if="errors.studentId" class="mt-1 text-sm text-red-500">
              {{ errors.studentId }}
            </p>
          </div>
          
          <!-- 身份证号 -->
          <div>
            <label class="block text-sm font-medium mb-2">身份证号</label>
            <input type="text" 
                   v-model="idCard"
                   :class="{ 'border-red-500': errors.idCard }"
                   class="input"
                   autocomplete="off"
                   required
                   pattern="[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]"
                   title="请输入18位身份证号" />
            <p v-if="errors.idCard" class="mt-1 text-sm text-red-500">
              {{ errors.idCard }}
            </p>
          </div>
          
          <!-- 用户名 -->
          <div>
            <label class="block text-sm font-medium mb-2">用户名</label>
            <input type="text" 
                   v-model="username"
                   :class="{ 'border-red-500': errors.username }"
                   class="input"
                   autocomplete="username"
                   required />
            <p v-if="errors.username" class="mt-1 text-sm text-red-500">
              {{ errors.username }}
            </p>
          </div>
          
          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium mb-2">密码</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'"
                     v-model="password"
                     :class="{ 'border-red-500': errors.password }"
                     class="input pr-10"
                     autocomplete="new-password"
                     required />
              <button type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <eye-icon v-if="showPassword" class="h-5 w-5" />
                <eye-slash-icon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>
          
          <!-- 确认密码 -->
          <div>
            <label class="block text-sm font-medium mb-2">确认密码</label>
            <div class="relative">
              <input :type="showConfirmPassword ? 'text' : 'password'"
                     v-model="confirmPassword"
                     :class="{ 'border-red-500': errors.confirmPassword }"
                     class="input pr-10"
                     autocomplete="new-password"
                     required />
              <button type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <eye-icon v-if="showConfirmPassword" class="h-5 w-5" />
                <eye-slash-icon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>
          
          <!-- 验证码 -->
          <div>
            <label class="block text-sm font-medium mb-2">验证码</label>
            <div class="flex gap-4">
              <input type="text" 
                     v-model="captcha"
                     :class="{ 'border-red-500': errors.captcha }"
                     class="input"
                     autocomplete="off"
                     maxlength="4"
                     required />
              <captcha-image ref="captchaRef" />
            </div>
            <p v-if="errors.captcha" class="mt-1 text-sm text-red-500">
              {{ errors.captcha }}
            </p>
          </div>
          
          <!-- 提交按钮 -->
          <button type="submit" 
                  :disabled="!isFormValid || isLoading"
                  class="btn btn-primary w-full">
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              注册中...
            </span>
            <span v-else>注册</span>
          </button>
        </form>
        
        <!-- 登录链接 -->
        <div class="mt-6 text-center">
          <router-link to="/login" class="text-primary-500 hover:text-primary-600">
            已有账号？立即登录
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/userStore'
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
  import CaptchaImage from '@/components/common/CaptchaImage.vue'
  
  const router = useRouter()
  const userStore = useUserStore()
  const captchaRef = ref(null)
  
  // 表单字段
  const studentId = ref('')
  const idCard = ref('')
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const captcha = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const isLoading = ref(false)
  
  // 表单错误
  const errors = ref({})
  
  // 表单验证
  const isFormValid = computed(() => {
    return studentId.value.length >= 8 &&
           idCard.value.length === 18 &&
           username.value.length >= 3 &&
           password.value.length >= 8 &&
           password.value === confirmPassword.value &&
           captcha.value.length === 4
  })
  
  const validateForm = () => {
    errors.value = {}
    
    if (studentId.value.length < 8) {
      errors.value.studentId = '学号长度不能小于8位'
    }
    
    if (!/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(idCard.value)) {
      errors.value.idCard = '请输入正确的身份证号'
    }
    
    if (username.value.length < 3) {
      errors.value.username = '用户名长度不能小于3个字符'
    }
    
    if (password.value.length < 8) {
      errors.value.password = '密码长度不能小于8个字符'
    }
    
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = '两次输入的密码不一致'
    }
    
    if (captcha.value.length !== 4) {
      errors.value.captcha = '请输入4位验证码'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const handleRegister = async () => {
    if (!validateForm()) return
    
    isLoading.value = true
    
    try {
      await userStore.register({
        studentId: studentId.value,
        idCard: idCard.value,
        username: username.value,
        password: password.value,
        captcha: captcha.value
      })
      router.push('/')
    } catch (error) {
      console.error('Registration failed:', error)
      if (error.response?.data?.code === 'INVALID_CAPTCHA') {
        errors.value.captcha = '验证码错误'
        captchaRef.value?.refreshCaptcha()
        captcha.value = ''
      } else {
        // 处理其他错误...
      }
    } finally {
      isLoading.value = false
    }
  }
  </script> 