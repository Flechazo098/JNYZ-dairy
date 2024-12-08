import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    localStorage.setItem('token', response.token)
    return response.user
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      if (error.response) {
        switch (error.response.data.code) {
          case 'STUDENT_ID_EXISTS':
            throw new Error('该学号已被注册')
          case 'ID_CARD_EXISTS':
            throw new Error('该身份证号已被注册')
          case 'USERNAME_EXISTS':
            throw new Error('用户名已被使用')
          case 'INVALID_CAPTCHA':
            throw new Error('验证码错误')
          case 'INVALID_STUDENT_ID':
            throw new Error('无效的学号')
          case 'INVALID_ID_CARD':
            throw new Error('无效的身份证号')
          default:
            throw new Error('注册失败，请稍后重试')
        }
      }
      throw error
    }
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  async getCurrentUser() {
    return await api.get('/auth/me')
  }
} 