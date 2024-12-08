<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">
              {{ formattedDate }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
              {{ dayOfWeek }}
            </p>
          </div>
          
          <button @click="$router.back()" 
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <x-mark-icon class="h-6 w-6" />
          </button>
        </div>
  
        <!-- Image Gallery -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Photos</h2>
            <label class="cursor-pointer px-4 py-2 bg-primary-500 text-white rounded-lg 
                          hover:bg-primary-600 transition-colors">
              <span>Add Photos</span>
              <input type="file" 
                     @change="handleImageUpload" 
                     multiple 
                     accept="image/*" 
                     class="hidden" />
            </label>
          </div>
  
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(image, index) in images" 
                 :key="index" 
                 class="relative group aspect-square">
              <img :src="getImageUrl(image)" 
                   :alt="image.caption || image.name || 'Photo'" 
                   class="w-full h-full object-cover rounded-lg" />
              
              <!-- Image Actions -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                          transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button @click="setPreviewImage(index)"
                        class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                        :class="{ 'bg-primary-500': image.isPreview }">
                  <star-icon class="h-5 w-5" />
                </button>
                <button @click="editCaption(index)"
                        class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <pencil-icon class="h-5 w-5" />
                </button>
                <button @click="deleteImage(index)"
                        class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <trash-icon class="h-5 w-5" />
                </button>
              </div>
  
              <!-- Caption -->
              <p v-if="image.caption" 
                 class="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white 
                        text-sm rounded-b-lg truncate">
                {{ image.caption }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Diary Entry -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Diary</h2>
          <textarea v-model="diaryContent"
                    rows="6"
                    class="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                    placeholder="Write about your day..."></textarea>
          
          <div class="mt-4 flex justify-end">
            <button @click="saveDiary"
                    class="px-6 py-2 bg-primary-500 text-white rounded-lg 
                           hover:bg-primary-600 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
  
      <!-- Caption Edit Modal -->
      <div v-if="showCaptionModal" 
           class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">Edit Caption</h3>
          <input v-model="editingCaption"
                 type="text"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                 placeholder="Enter caption" />
          
          <div class="mt-6 flex justify-end gap-4">
            <button @click="showCaptionModal = false"
                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                           dark:hover:bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button @click="saveCaption"
                    class="px-4 py-2 bg-primary-500 text-white rounded-lg 
                           hover:bg-primary-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import { 
    XMarkIcon, 
    StarIcon, 
    PencilIcon, 
    TrashIcon 
  } from '@heroicons/vue/24/outline'
  import { diaryService } from '../services/diaryService'
  
  const route = useRoute()
  const date = computed(() => dayjs(route.params.date))
  
  const formattedDate = computed(() => date.value.format('MMMM D, YYYY'))
  const dayOfWeek = computed(() => date.value.format('dddd'))
  
  // Images
  const images = ref([])
  const showCaptionModal = ref(false)
  const editingCaption = ref('')
  const editingImageIndex = ref(null)
  
  // Diary
  const diaryContent = ref('')
  
  const getImageUrl = (image) => {
    if (image.file) {
      // 新上传的图片，使用本地 URL
      return URL.createObjectURL(image.file)
    }
    // 已保存的图片，使用服务器路径
    return `${import.meta.env.VITE_API_BASE_URL}/storage/${image.path}`
  }
  
  const handleImageUpload = (event) => {
    const files = event.target.files
    if (!files.length) return
  
    Array.from(files).forEach(file => {
      images.value.push({
        file,  // 保存文件对象以供上传
        name: file.name,
        caption: '',
        isPreview: images.value.length === 0
      })
    })
  }
  
  const setPreviewImage = (index) => {
    images.value.forEach((image, i) => {
      image.isPreview = i === index
    })
  }
  
  const editCaption = (index) => {
    editingImageIndex.value = index
    editingCaption.value = images.value[index].caption
    showCaptionModal.value = true
  }
  
  const saveCaption = () => {
    if (editingImageIndex.value !== null) {
      images.value[editingImageIndex.value].caption = editingCaption.value
    }
    showCaptionModal.value = false
  }
  
  const deleteImage = async (index) => {
    const image = images.value[index]
    
    try {
      if (!image.file) {  // 只有已保存的图片需要从服务器删除
        await diaryService.deleteImage(
          date.value.format('YYYY-MM-DD'), 
          image.name
        )
      }
      
      images.value.splice(index, 1)
      addToast('Image deleted successfully')
    } catch (error) {
      console.error('Failed to delete image:', error)
      addToast('Failed to delete image', 'error')
    }
  }
  
  const saveDiary = async () => {
    try {
      isLoading.value = true
      
      // 准备已有图片的更新信息
      const existingImages = images.value
        .filter(img => !img.file)
        .map(img => ({
          path: img.path,
          caption: img.caption,
          isPreview: img.isPreview
        }))
  
      // 准备新图片信息
      const newImages = images.value
        .filter(img => img.file)
        .map(img => ({
          file: img.file,
          caption: img.caption,
          isPreview: img.isPreview
        }))
  
      await diaryService.saveDiaryEntry(date.value.format('YYYY-MM-DD'), {
        content: diaryContent.value,
        images: newImages,
        existingImages
      })
  
      addToast('Diary saved successfully')
    } catch (error) {
      console.error('Failed to save diary:', error)
      addToast('Failed to save diary', 'error')
    } finally {
      isLoading.value = false
    }
  }
  </script> 