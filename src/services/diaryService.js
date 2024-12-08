import api from './api'

export const diaryService = {
  // 获取指定日期的日记
  async getDiaryEntry(date) {
    return await api.get(`/diary/${date}`)
  },

  // 获取日期范围内的日记列表
  async getDiaryEntries(startDate, endDate) {
    return await api.get('/diary', {
      params: { startDate, endDate }
    })
  },

  // 创建或更新日记
  async saveDiaryEntry(date, data) {
    const formData = new FormData()
    
    // 添加文本内容
    formData.append('content', data.content)
    
    // 添加图片文件
    if (data.images) {
      data.images.forEach((image, index) => {
        if (image.file) {  // 新上传的图片
          formData.append('images', image.file)
          formData.append(`captions[${index}]`, image.caption || '')
          formData.append(`isPreview[${index}]`, image.isPreview || false)
        }
      })
    }
    
    // 添加已有图片的信息更新
    if (data.existingImages) {
      formData.append('existingImages', JSON.stringify(data.existingImages))
    }

    return await api.post(`/diary/${date}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 删除日记
  async deleteDiaryEntry(date) {
    return await api.delete(`/diary/${date}`)
  },

  // 删除图片
  async deleteImage(date, imageName) {
    return await api.delete(`/diary/${date}/images/${imageName}`)
  }
} 