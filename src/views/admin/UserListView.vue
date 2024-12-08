<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold">用户管理</h1>
        
        <!-- 搜索框 -->
        <div class="flex gap-4">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="搜索用户名/邮箱"
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              @input="handleSearch"
            />
            <magnifying-glass-icon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <!-- 状态筛选 -->
          <select 
            v-model="statusFilter"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
            @change="loadUsers"
          >
            <option value="">所有状态</option>
            <option value="ACTIVE">活跃</option>
            <option value="LOCKED">已锁定</option>
            <option value="DELETED">已删除</option>
          </select>
        </div>
      </div>
  
      <!-- 用户列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                用户信息
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                统计
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                注册时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <!-- 用户信息 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img 
                      :src="user.avatarPath || '/default-avatar.png'" 
                      class="h-10 w-10 rounded-full object-cover"
                      alt="avatar"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.displayName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- 状态 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-green-100 text-green-800': user.status === 'ACTIVE',
                  'bg-red-100 text-red-800': user.status === 'LOCKED',
                  'bg-gray-100 text-gray-800': user.status === 'DELETED'
                }">
                  {{ statusText[user.status] }}
                </span>
              </td>
              
              <!-- 统计信息 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  日记: {{ user.diaryCount }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  图片: {{ user.imageCount }}
                </div>
              </td>
              
              <!-- 注册时间 -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(user.createdAt) }}
              </td>
              
              <!-- 操作按钮 -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button 
                    @click="viewUserDetail(user)"
                    class="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                  >
                    查看
                  </button>
                  <button 
                    v-if="user.status !== 'LOCKED'"
                    @click="lockUser(user)"
                    class="text-red-600 hover:text-red-900"
                  >
                    锁定
                  </button>
                  <button 
                    v-else
                    @click="unlockUser(user)"
                    class="text-green-600 hover:text-green-900"
                  >
                    解锁
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          共 {{ totalUsers }} 条记录
        </div>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
  
      <!-- 用户详情弹窗 -->
      <div v-if="selectedUser" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">用户详情</h2>
            <button @click="selectedUser = null">
              <x-mark-icon class="h-6 w-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- 用户基本信息 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
                <div class="mt-1">{{ selectedUser.username }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱</label>
                <div class="mt-1">{{ selectedUser.email }}</div>
              </div>
            </div>
            
            <!-- 统计信息 -->
            <div class="border-t pt-4">
              <h3 class="font-medium mb-2">使用统计</h3>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <div class="text-sm text-gray-500">日记数量</div>
                  <div class="text-2xl font-semibold">{{ selectedUser.diaryCount }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">图片数量</div>
                  <div class="text-2xl font-semibold">{{ selectedUser.imageCount }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">存储空间</div>
                  <div class="text-2xl font-semibold">{{ formatStorage(selectedUser.storageUsed) }}</div>
                </div>
              </div>
            </div>
            
            <!-- 最近登录记录 -->
            <div class="border-t pt-4">
              <h3 class="font-medium mb-2">最近登录记录</h3>
              <div class="space-y-2">
                <div v-for="log in selectedUser.recentLogs" :key="log.id" 
                     class="flex justify-between text-sm">
                  <span>{{ formatDate(log.loginTime) }}</span>
                  <span class="text-gray-500">{{ log.ipAddress }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { 
    MagnifyingGlassIcon, 
    XMarkIcon 
  } from '@heroicons/vue/24/outline'
  import dayjs from 'dayjs'
  
  // 状态和数据
  const users = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalUsers = ref(0)
  const searchQuery = ref('')
  const statusFilter = ref('')
  const selectedUser = ref(null)
  
  const statusText = {
    'ACTIVE': '活跃',
    'LOCKED': '已锁定',
    'DELETED': '已删除'
  }
  
  // 加载用户数据
  const loadUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?page=${currentPage.value}&search=${searchQuery.value}&status=${statusFilter.value}`)
      const data = await response.json()
      users.value = data.content
      totalPages.value = data.totalPages
      totalUsers.value = data.totalElements
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }
  
  // 搜索处理（带防抖）
  let searchTimeout
  const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      currentPage.value = 1
      loadUsers()
    }, 300)
  }
  
  // 分页处理
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      loadUsers()
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      loadUsers()
    }
  }
  
  // 用户操作
  const viewUserDetail = async (user) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/detail`)
      const detailData = await response.json()
      selectedUser.value = detailData
    } catch (error) {
      console.error('Failed to load user detail:', error)
    }
  }
  
  const lockUser = async (user) => {
    if (confirm(`确定要锁定用户 ${user.displayName} 吗？`)) {
      try {
        await fetch(`/api/admin/users/${user.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'LOCKED' })
        })
        loadUsers()
      } catch (error) {
        console.error('Failed to lock user:', error)
      }
    }
  }
  
  const unlockUser = async (user) => {
    try {
      await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' })
      })
      loadUsers()
    } catch (error) {
      console.error('Failed to unlock user:', error)
    }
  }
  
  // 工具函数
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
  
  const formatStorage = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
  
  // 初始加载
  onMounted(() => {
    loadUsers()
  })
  </script> 