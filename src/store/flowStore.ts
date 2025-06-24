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
    // 🔄 Загрузка потоков (всех или по courseId)
    async fetchFlows(courseId?: number) {
      this.loading = true
      try {
        const url = courseId
          ? `http://localhost:3000/api/flows/${courseId}`
          : 'http://localhost:3000/api/flows'

        const res = await axios.get(url)

        // Преобразуем snake_case в camelCase
        this.list = res.data.map((flow: any) => ({
          id: flow.id,
          name: flow.name,
          mentor: flow.mentor,
          startDate: flow.start_date,
          endDate: flow.end_date,
          courseId: flow.course_id,
        }))
      } catch (err) {
        console.error('❌ Ошибка загрузки потоков:', err)
      } finally {
        this.loading = false
      }
    },

    // ➕ Добавление нового потока
    async createFlow(data: Omit<Flow, 'id'>) {
      try {
        const res = await axios.post('http://localhost:3000/api/flows', {
          name: data.name,
          mentor: data.mentor,
          startDate: data.startDate,
          endDate: data.endDate,
          course_id: data.courseId,
        })

        // Добавляем с маппингом
        const newFlow = {
          id: res.data.id,
          name: res.data.name,
          mentor: res.data.mentor,
          startDate: res.data.start_date,
          endDate: res.data.end_date,
          courseId: res.data.course_id,
        }

        this.list.push(newFlow)
      } catch (err) {
        console.error('❌ Ошибка создания потока:', err)
      }
    },

    // ✏️ Обновление потока
    async updateFlow(id: number, data: Partial<Flow>) {
      try {
        const res = await axios.put(`http://localhost:3000/api/flows/${id}`, data)

        const updatedFlow = {
          id: res.data.id,
          name: res.data.name,
          mentor: res.data.mentor,
          startDate: res.data.start_date,
          endDate: res.data.end_date,
          courseId: res.data.course_id,
        }

        const index = this.list.findIndex((f) => f.id === id)
        if (index !== -1) {
          this.list[index] = updatedFlow
        }
      } catch (err) {
        console.error('❌ Ошибка обновления потока:', err)
      }
    },

    // ❌ Удаление потока
    async removeFlow(id: number) {
      try {
        await axios.delete(`http://localhost:3000/api/flows/${id}`)
        this.list = this.list.filter((f) => f.id !== id)
      } catch (err) {
        console.error('❌ Ошибка удаления потока:', err)
      }
    },
  },
})
