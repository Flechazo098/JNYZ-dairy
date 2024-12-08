<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="previousMonth" 
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <chevron-left-icon class="h-6 w-6" />
          </button>
          
          <div class="flex items-center gap-2">
            <select v-model="currentMonth" 
                    class="bg-transparent border-none text-xl font-semibold focus:ring-0">
              <option v-for="(month, index) in months" 
                      :key="index" 
                      :value="index">
                {{ month }}
              </option>
            </select>
            
            <select v-model="currentYear" 
                    class="bg-transparent border-none text-xl font-semibold focus:ring-0">
              <option v-for="year in yearRange" 
                      :key="year" 
                      :value="year">
                {{ year }}年
              </option>
            </select>
          </div>
          
          <button @click="nextMonth" 
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <chevron-right-icon class="h-6 w-6" />
          </button>
        </div>
        
        <button @click="today" 
                class="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          今天
        </button>
      </div>
      
      <div class="grid grid-cols-7 gap-4">
        <!-- 星期标题 -->
        <div v-for="day in weekDays" 
             :key="day" 
             class="text-center font-semibold text-gray-500">
          {{ day }}
        </div>
        
        <!-- 日历单元格 -->
        <div v-for="(day, index) in calendarDays" 
             :key="index"
             class="relative aspect-square group cursor-pointer"
             @click="handleDayClick(day)">
          <!-- 格子背景 -->
          <div class="absolute inset-0 bg-white/30 dark:bg-gray-800/30 
                      backdrop-blur-[2px] rounded-2xl border-2 transition-all duration-300
                      group-hover:bg-white/50 dark:group-hover:bg-gray-800/50
                      group-hover:backdrop-blur-md group-hover:scale-105 group-hover:shadow-lg"
               :class="[
                 { 'opacity-40 dark:opacity-30': !day.isCurrentMonth },
                 { 'border-blue-500/50 shadow-blue-100/30 dark:shadow-blue-900/20': isToday(day.date) },
                 { 'border-gray-200/30 dark:border-gray-700/30': !isToday(day.date) },
                 { 'group-hover:border-blue-500/50': day.isCurrentMonth }
               ]">
            <!-- 今日高光效果 -->
            <div v-if="isToday(day.date)"
                 class="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-blue-500/5
                        dark:from-blue-400/5 dark:to-blue-500/10 rounded-2xl" />
          </div>

          <!-- 日期数字 -->
          <div class="relative p-2">
            <span class="font-medium text-lg transition-colors backdrop-blur-none"
                  :class="[
                    isToday(day.date) ? 'text-blue-600/90 dark:text-blue-400/90 font-bold' : 
                                      'text-gray-700/90 dark:text-gray-200/90',
                    !day.isCurrentMonth && 'text-gray-400/70 dark:text-gray-600/70'
                  ]">
              {{ day.dayOfMonth }}
            </span>
          </div>

          <!-- 日记内容预览 -->
          <div v-if="day.hasContent" 
               class="absolute inset-x-3 bottom-3 top-8 rounded-lg overflow-hidden
                      transition-all duration-300 group-hover:ring-2 ring-blue-500/30">
            <div class="w-full h-full">
              <img v-if="day.previewImage" 
                   :src="day.previewImage" 
                   class="w-full h-full object-cover transition-transform duration-300
                          opacity-80 group-hover:opacity-100 group-hover:scale-110" />
              <div v-else 
                   class="w-full h-full bg-gradient-to-br from-blue-50/50 to-blue-100/50
                          dark:from-blue-900/20 dark:to-blue-800/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/userStore'
  import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
  import dayjs from 'dayjs'
  
  const router = useRouter()
  const userStore = useUserStore()
  const isAuthenticated = computed(() => userStore.isAuthenticated)
  
  const currentMonth = ref(dayjs().month())
  const currentYear = ref(dayjs().year())
  
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  
  const yearRange = computed(() => {
    const currentYear = dayjs().year()
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  })
  
  const calendarDays = computed(() => {
    const firstDay = dayjs().year(currentYear.value).month(currentMonth.value).startOf('month')
    const lastDay = firstDay.endOf('month')
    const daysInMonth = lastDay.date()
    const startPadding = firstDay.day()
    
    const days = []
    
    // Add padding days
    for (let i = 0; i < startPadding; i++) {
      days.push({
        date: firstDay.subtract(startPadding - i, 'day'),
        dayOfMonth: firstDay.subtract(startPadding - i, 'day').date(),
        isCurrentMonth: false,
        hasContent: false
      })
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: firstDay.add(i - 1, 'day'),
        dayOfMonth: i,
        isCurrentMonth: true,
        hasContent: Math.random() > 0.7 // Temporary random content
      })
    }
    
    // Add remaining padding
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: lastDay.add(i, 'day'),
        dayOfMonth: lastDay.add(i, 'day').date(),
        isCurrentMonth: false,
        hasContent: false
      })
    }
    
    return days
  })
  
  const isToday = (date) => {
    return dayjs(date).isSame(dayjs(), 'day')
  }
  
  const previousMonth = () => {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }
  
  const nextMonth = () => {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }
  
  const today = () => {
    currentMonth.value = dayjs().month()
    currentYear.value = dayjs().year()
  }
  
  const showLoginPrompt = ref(false)
  
  const handleDayClick = (day) => {
    if (day.hasContent) {
      if (!isAuthenticated.value) {
        showLoginPrompt.value = true
        return
      }
      router.push(`/day/${day.date.format('YYYY-MM-DD')}`)
    } else if (isAuthenticated.value) {
      // 如果是登录用户，允许创建新日记
      router.push(`/day/${day.date.format('YYYY-MM-DD')}`)
    }
  }
  </script> 
  
  <style scoped>
  .aspect-square {
    aspect-ratio: 1;
  }
  
  /* 添加玻璃拟态效果 */
  .backdrop-blur-sm {
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  
  .group:hover .backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  /* 优化阴影效果 */
  .group:hover .group-hover\:shadow-lg {
    box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.05),
                0 6px 10px -6px rgba(59, 130, 246, 0.05);
  }
  
  /* 添加内容预览的悬浮效果 */
  .group:hover .ring-blue-500\/30 {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
  
  /* 优化过渡效果 */
  .transition-all {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  </style> 