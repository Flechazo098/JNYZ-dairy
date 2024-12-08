import api from './api'

export const userService = {
  async updateProfile(data) {
    const formData = new FormData()
    
    if (data.displayName) {
      formData.append('displayName', data.displayName)
    }
    
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }
    
    return await api.post('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  async getProfile() {
    return await api.get('/user/profile')
  }
} 