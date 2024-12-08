<template>
  <Modal :model-value="modelValue" 
         @update:model-value="$emit('update:modelValue')"
         width="max-w-5xl">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold">更换背景</h3>
        <button @click="handleClose" 
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <x-mark-icon class="h-5 w-5" />
        </button>
      </div>

      <!-- 标签页 -->
      <div class="flex gap-4 mb-6 border-b dark:border-gray-700">
        <button v-for="tab in tabs" 
                :key="tab.id"
                @click="currentTab = tab.id"
                class="px-4 py-2 -mb-px font-medium transition-all duration-200 flex items-center gap-2"
                :class="[
                  currentTab === tab.id 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                ]">
          <component :is="tab.icon" class="h-5 w-5" />
          {{ tab.name }}
        </button>
      </div>

      <!-- 预设背景网格 -->
      <div class="grid grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2 relative">
        <div v-for="bg in currentBackgrounds" 
             :key="bg.id"
             class="group relative aspect-video rounded-lg overflow-hidden cursor-pointer
                    ring-2 ring-transparent hover:ring-blue-500 transition-all duration-200
                    transform hover:scale-105"
             @click="previewBackground(bg)">
          <!-- 纯色背景 -->
          <div v-if="bg.color" 
               class="w-full h-full"
               :style="{ backgroundColor: bg.url }" />
          
          <!-- 渐变背景 -->
          <div v-else-if="bg.gradient" 
               class="w-full h-full"
               :style="{ backgroundImage: bg.url }" />
          
          <!-- 图片背景 -->
          <img v-else 
               :src="bg.thumbnail || bg.url" 
               :alt="bg.name"
               class="w-full h-full object-cover" />

          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                      flex items-center justify-center transition-all duration-200">
            <span class="text-white font-medium text-sm text-center px-2">
              {{ bg.name }}
            </span>
          </div>

          <!-- 当前选中标记 -->
          <div v-if="bg.url === currentBackground"
               class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full
                      flex items-center justify-center">
            <check-icon class="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <!-- 自定义上传 -->
      <div v-if="currentTab === 'custom'" class="mt-4">
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600
                    rounded-lg p-8 text-center transition-colors duration-200"
             :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/10': isDragging }"
             @dragenter.prevent="isDragging = true"
             @dragleave.prevent="isDragging = false"
             @dragover.prevent
             @drop.prevent="handleDrop">
          <div class="space-y-2">
            <cloud-arrow-up-icon class="h-12 w-12 mx-auto text-gray-400" />
            <div class="text-gray-500">
              拖放图片到这里，或者
              <button @click="$refs.fileInput.click()"
                      class="text-blue-500 hover:text-blue-600 transition-colors">
                点击上传
              </button>
            </div>
            <div class="text-sm text-gray-400">
              支持 JPG、PNG 格式，最大 5MB
            </div>
          </div>
          <input ref="fileInput"
                 type="file"
                 accept="image/*"
                 class="hidden"
                 @change="handleFileSelect" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { 
  XMarkIcon, 
  CheckIcon, 
  CloudArrowUpIcon,
  SwatchIcon,
  SparklesIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['update:modelValue', 'select'])
const props = defineProps({
  modelValue: Boolean,
  currentBackground: String
})

const tabs = [
  { id: 'solid', name: '纯色', icon: SwatchIcon },
  { id: 'gradient', name: '渐变', icon: SparklesIcon },
  { id: 'cartoon', name: '卡通', icon: PaintBrushIcon },
  { id: 'scifi', name: '科幻', icon: RocketLaunchIcon },
  { id: 'nature', name: '自然', icon: StarIcon },
  { id: 'custom', name: '自定义', icon: CloudArrowUpIcon }
]

const currentTab = ref('solid')
const isDragging = ref(false)
const fileInput = ref(null)
const uploadedBackgrounds = ref([])

// 背景集合
const backgrounds = {
  solid: [
    { id: 'solid-1', name: '深邃蓝', url: '#1a237e', color: true },
    { id: 'solid-2', name: '森林绿', url: '#1b5e20', color: true },
    { id: 'solid-3', name: '皇家紫', url: '#4a148c', color: true },
    { id: 'solid-4', name: '暗夜黑', url: '#212121', color: true },
    { id: 'solid-5', name: '海洋蓝', url: '#01579b', color: true },
    { id: 'solid-6', name: '珊瑚红', url: '#bf360c', color: true },
    { id: 'solid-7', name: '薄荷绿', url: '#004d40', color: true },
    { id: 'solid-8', name: '暖阳橙', url: '#e65100', color: true },
    { id: 'solid-9', name: '浅灰白', url: '#f5f5f5', color: true },
    { id: 'solid-10', name: '玫瑰红', url: '#b71c1c', color: true }
  ],
  gradient: [
    { 
      id: 'gradient-1', 
      name: '晨曦', 
      url: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-2', 
      name: '极光', 
      url: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-3', 
      name: '日落', 
      url: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-4', 
      name: '深海', 
      url: 'linear-gradient(120deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-5', 
      name: '紫罗兰', 
      url: 'linear-gradient(to right, #c471f5 0%, #fa71cd 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-6', 
      name: '青柠', 
      url: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-7', 
      name: '黄昏', 
      url: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-8', 
      name: '薄暮', 
      url: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-9', 
      name: '清晨', 
      url: 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)', 
      gradient: true 
    },
    { 
      id: 'gradient-10', 
      name: '极夜', 
      url: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', 
      gradient: true 
    }
  ],
  cartoon: [
    { id: 'cartoon-1', name: '童话森林', url: '[您的URL]/cartoon1.jpg' },
    { id: 'cartoon-2', name: '梦幻城堡', url: '[您的URL]/cartoon2.jpg' },
    // ... 更多卡通背景
  ],
  scifi: [
    { id: 'scifi-1', name: '赛博朋克', url: '[您的URL]/scifi1.jpg' },
    { id: 'scifi-2', name: '太空站', url: '[您的URL]/scifi2.jpg' },
    // ... 更多科幻背景
  ],
  nature: [
    { id: 'nature-1', name: '山川湖泊', url: '[您的URL]/nature1.jpg' },
    { id: 'nature-2', name: '森林', url: '[您的URL]/nature2.jpg' },
    // ... 更多自然背景
  ]
}

const currentBackgrounds = computed(() => {
  if (currentTab.value === 'custom') {
    return uploadedBackgrounds.value
  }
  return backgrounds[currentTab.value] || []
})

// 预览背景
const previewBackground = (bg) => {
  if (bg.color) {
    emit('select', bg.url)
  } else if (bg.gradient) {
    emit('select', bg.url)
  } else {
    emit('select', bg.url)
  }
}

// 取消预览
const cancelPreview = () => {
  previewUrl.value = null
  document.body.style.backgroundImage = props.currentBackground ? 
    `url(${props.currentBackground})` : 'none'
}

// 应用背景
const applyBackground = () => {
  emit('select', previewUrl.value)
  previewUrl.value = null
}

// 处理文件拖放
const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    handleFile(file)
  }
}

// 处理文件选择
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    handleFile(file)
  }
}

// 处理文件上传
const handleFile = async (file) => {
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过5MB')
    return
  }

  try {
    // 创建本地预览URL
    const url = URL.createObjectURL(file)
    
    // 添加到上传历史
    const newBg = {
      id: Date.now(),
      name: file.name,
      url: url,
      thumbnail: url
    }
    
    uploadedBackgrounds.value.unshift(newBg)
    
    // 直接应用新背景
    emit('select', url)
  } catch (error) {
    console.error('上传失败:', error)
    alert('上传失败，请重试')
  }
}

// 删除背景
const deleteBackground = async (bg) => {
  if (confirm('确定要删除这个背景吗？')) {
    try {
      // TODO: 调用后端API删除文件
      // await api.delete(`/api/user/background/${bg.id}`)
      
      uploadedBackgrounds.value = uploadedBackgrounds.value.filter(
        item => item.id !== bg.id
      )
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }
}

// 关闭处理函数
const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 优化预览图片的过渡 */
.group:hover img {
  transition: transform 0.3s ease;
  transform: scale(1.05);
}

/* 优化选项卡切换动画 */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 