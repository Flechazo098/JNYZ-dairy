<template>
  <div class="min-h-screen transition-all duration-300"
       :style="backgroundStyle">
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="./assets/schoolBadge.png" 
               alt="School Badge" 
               class="h-10 w-auto" />
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">我的日记</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <button @click="toggleTheme" 
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <sun-icon v-if="isDark" class="h-5 w-5" />
            <moon-icon v-else class="h-5 w-5" />
          </button>
          
          <!-- 用户头像和菜单 -->
          <div class="relative" 
               ref="menuContainer"
               @mouseenter="showMenu = true"
               @mouseleave="handleMouseLeave">
            <!-- 头像 -->
            <div class="w-10 h-10 rounded-full overflow-hidden cursor-pointer
                      ring-2 ring-offset-2 ring-transparent
                      hover:ring-blue-500 transition-all duration-200">
              <img v-if="isAuthenticated && userStore.user?.avatarUrl"
                   :src="userStore.user.avatarUrl"
                   alt="User Avatar"
                   class="w-full h-full object-cover" />
              <div v-else
                   class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600
                          flex items-center justify-center text-white font-bold">
                {{ isAuthenticated ? userStore.user?.displayName?.charAt(0) : '?' }}
              </div>
            </div>

            <!-- 下拉菜单 -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2">
              <div v-show="showMenu"
                   class="absolute right-0 top-[calc(100%+8px)] w-48
                          backdrop-blur-sm bg-white/90 dark:bg-gray-800/90
                          rounded-xl shadow-lg overflow-hidden
                          ring-1 ring-black/5 dark:ring-white/5">
                <!-- 已登录菜单 -->
                <template v-if="isAuthenticated">
                  <div class="px-4 py-2 border-b dark:border-gray-700">
                    <div class="font-medium">{{ userStore.user?.displayName }}</div>
                    <div class="text-sm text-gray-500">{{ userStore.user?.email }}</div>
                  </div>
                  
                  <button @click="handleChangeBackground"
                          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                                 dark:hover:bg-gray-700/50 flex items-center gap-2">
                    <photo-icon class="h-4 w-4" />
                    <span>更换背景</span>
                  </button>
                  
                  <button @click="handleChangeAvatar"
                          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                                 dark:hover:bg-gray-700/50 flex items-center gap-2">
                    <user-circle-icon class="h-4 w-4" />
                    <span>更换头像</span>
                  </button>
                  
                  <template v-if="isAdmin">
                    <div class="border-t dark:border-gray-700 my-1"></div>
                    <button @click="router.push('/admin')"
                            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                                   dark:hover:bg-gray-700/50 flex items-center gap-2">
                      <cog-6-tooth-icon class="h-4 w-4" />
                      <span>管理后台</span>
                    </button>
                  </template>
                  
                  <div class="border-t dark:border-gray-700 my-1"></div>
                  <button @click="handleLogout"
                          class="w-full px-4 py-2 text-left text-sm text-red-500
                                 hover:bg-red-50 dark:hover:bg-red-900/20
                                 flex items-center gap-2">
                    <arrow-right-on-rectangle-icon class="h-4 w-4" />
                    <span>退出登录</span>
                  </button>
                </template>
                
                <!-- 未登录菜单 -->
                <template v-else>
                  <button @click="handleChangeBackground"
                          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                                 dark:hover:bg-gray-700/50 flex items-center gap-2">
                    <photo-icon class="h-4 w-4" />
                    <span>更换背景</span>
                  </button>
                  <div class="border-t dark:border-gray-700 my-1"></div>
                  <router-link to="/login"
                              class="block px-4 py-2 text-sm hover:bg-gray-50
                                     dark:hover:bg-gray-700/50">
                    登录
                  </router-link>
                  <router-link to="/register"
                              class="block px-4 py-2 text-sm hover:bg-gray-50
                                     dark:hover:bg-gray-700/50">
                    注册
                  </router-link>
                </template>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-6">
      <router-view></router-view>
    </main>

    <!-- 背景选择器 -->
    <background-picker v-model="showBackgroundPicker"
                      :current-background="currentBackground"
                      @select="handleBackgroundSelect" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import BackgroundPicker from '@/components/BackgroundPicker.vue'  // 添加导入
import { 
  SunIcon, 
  MoonIcon,
  PhotoIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()
const menuContainer = ref(null)
const showMenu = ref(false)
const menuTimeout = ref(null)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.user?.role === 'ADMIN')
const isDark = ref(false)

// 添加背景相关的状态
const showBackgroundPicker = ref(false)
const currentBackground = ref(localStorage.getItem('background') || '')

// 修改背景样式计算属性
const backgroundStyle = computed(() => {
  if (!currentBackground.value) return {}
  
  const baseStyle = {
    transition: 'background-color 0.5s ease, background-image 0.5s ease',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }

  if (currentBackground.value.startsWith('#')) {
    return {
      ...baseStyle,
      backgroundColor: currentBackground.value,
      backgroundImage: 'none'
    }
  } else if (currentBackground.value.startsWith('linear-gradient')) {
    return {
      ...baseStyle,
      backgroundImage: currentBackground.value,
      backgroundColor: 'transparent'
    }
  } else {
    return {
      ...baseStyle,
      backgroundImage: `url(${currentBackground.value})`,
      backgroundColor: 'transparent',
      backgroundSize: 'cover'  // 自动缩放以覆盖整个容器
    }
  }
})

// 处理鼠标离开事件
const handleMouseLeave = (event) => {
  // 检查鼠标是否真的离开了菜单区域
  const rect = menuContainer.value.getBoundingClientRect()
  const isInMenuArea = (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= (rect.bottom + (showMenu.value ? 300 : 0)) // 300px 是菜单的预估高度
  )

  if (!isInMenuArea) {
    menuTimeout.value = setTimeout(() => {
      showMenu.value = false
    }, 200) // 200ms 延迟，使过渡更平滑
  }
}

// 修改背景更换处理函数
const handleChangeBackground = () => {
  showBackgroundPicker.value = true
  showMenu.value = false
}

// 修改背景选择处理函数
const handleBackgroundSelect = (url) => {
  currentBackground.value = url
  showBackgroundPicker.value = false
}

// 处理头像更换
const handleChangeAvatar = () => {
  // TODO: 实现头像更换逻辑
}

// 清理定时器
onUnmounted(() => {
  if (menuTimeout.value) {
    clearTimeout(menuTimeout.value)
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

// 监听背景变化并保存
watch(currentBackground, (newValue) => {
  if (newValue) {
    localStorage.setItem('background', newValue)
  } else {
    localStorage.removeItem('background')
  }
  
  updateBodyBackground(newValue)
})

// 修改背景更新函数
const updateBodyBackground = (background) => {
  if (!background) {
    document.body.style.backgroundImage = 'none'
    document.body.style.backgroundColor = ''
    return
  }

  const baseStyles = {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    transition: 'background-color 0.5s ease, background-image 0.5s ease'
  }

  Object.assign(document.body.style, baseStyles)

  if (background.startsWith('#')) {
    document.body.style.backgroundImage = 'none'
    document.body.style.backgroundColor = background
  } else if (background.startsWith('linear-gradient')) {
    document.body.style.backgroundImage = background
    document.body.style.backgroundColor = 'transparent'
  } else {
    document.body.style.backgroundImage = `url(${background})`
    document.body.style.backgroundColor = 'transparent'
    document.body.style.backgroundSize = 'cover'
  }
}

// 在组件挂载时应用保存的背景
onMounted(() => {
  if (currentBackground.value) {
    updateBodyBackground(currentBackground.value)
  }
})
</script>

<style scoped>
/* 菜单动画 */
.transform {
  transition-property: transform, opacity;
}

/* 确保菜单在其他元素之上 */
.absolute {
  z-index: 50;
}

/* 添加背景过渡效果 */
.min-h-screen {
  transition: background-color 0.3s ease, background-image 0.3s ease;
}
</style> 