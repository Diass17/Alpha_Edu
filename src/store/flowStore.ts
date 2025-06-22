import { defineStore } from 'pinia'
import axios from 'axios'

export type Flow = {
  id: number
  name: string
  mentor: string
  startDate?: string
  endDate?: string
  courseId: number
}

export const useFlowStore = defineStore('flow', {
  state: () => ({
    list: [] as Flow[],
    loading: false,
  }),

  actions: {
    // 🔄 Получить потоки по courseId
    async fetchFlows(courseId?: number) {
      this.loading = true
      try {
        const url = courseId
          ? `http://localhost:3000/api/flows/${courseId}`
          : 'http://localhost:3000/api/flows'
        const res = await axios.get(url)
        this.list = res.data
      } catch (err) {
        console.error('❌ Ошибка загрузки потоков:', err)
      } finally {
        this.loading = false
      }
    },

    // ➕ Создание потока
    async createFlow(data: Omit<Flow, 'id'>) {
      const res = await axios.post('http://localhost:3000/api/flows', {
        name: data.name,
        mentor: data.mentor,
        startDate: data.startDate,
        endDate: data.endDate,
        course_id: data.courseId, // 👈 важно: backend использует `course_id`
      })
      this.list.push(res.data)
    },

    // ✏️ Обновление потока
    async updateFlow(id: number, data: Partial<Flow>) {
      const res = await axios.put(`http://localhost:3000/api/flows/${id}`, data)
      const idx = this.list.findIndex(f => f.id === id)
      if (idx !== -1) {
        this.list[idx] = res.data
      }
    },

    // ❌ Удаление потока
    async removeFlow(id: number) {
      await axios.delete(`http://localhost:3000/api/flows/${id}`)
      this.list = this.list.filter(f => f.id !== id)
    }
  },
})
