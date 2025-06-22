import { defineStore } from 'pinia'
import axios from 'axios'

export interface Course {
  id: number
  name: string
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    list: [] as Course[]
  }),

  actions: {
    // Загрузить список курсов
    async fetchCourses() {
      try {
        const response = await axios.get('/api/courses')
        this.list = response.data
      } catch (error) {
        console.error('❌ Ошибка при загрузке курсов:', error)
      }
    },

    // Добавить новый курс
    async addCourse(course: { name: string }) {
      try {
        const response = await axios.post('/api/courses', course)
        this.list.push(response.data)
      } catch (error) {
        console.error('❌ Ошибка при добавлении курса:', error)
      }
    },

    // Удалить курс
    async removeCourse(id: number) {
      try {
        await axios.delete(`/api/courses/${id}`)
        this.list = this.list.filter(course => course.id !== id)
      } catch (error) {
        console.error('❌ Ошибка при удалении курса:', error)
      }
    },

    // Обновить курс
    async updateCourse(id: number, newName: string) {
      try {
        await axios.put(`/api/courses/${id}`, { name: newName })
        await this.fetchCourses() // Обновим весь список после изменения
      } catch (error) {
        console.error('❌ Ошибка при обновлении курса:', error)
      }
    }
  }
})
