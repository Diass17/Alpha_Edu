import { defineStore } from 'pinia'
import axios from 'axios'

export interface StreamStudent {
  id: number
  full_name: string
  iin: string
}

export const useStreamStudentStore = defineStore('streamStudent', {
  state: () => ({
    students: [] as StreamStudent[],
  }),

  actions: {
    // Получить всех студентов в потоке
    async fetchStudentsForStream(streamId: number) {
      try {
        const res = await axios.get(`/api/stream-students/${streamId}`)
        this.students = res.data
      } catch (err) {
        console.error('Ошибка при загрузке студентов потока:', err)
      }
    },

    // Добавить студента в поток
    async addStudentToStream(streamId: number, studentId: number) {
      try {
        await axios.post('/api/stream-students', {
          stream_id: streamId,
          student_id: studentId,
        })
        await this.fetchStudentsForStream(streamId)
      } catch (err) {
        console.error('Ошибка при добавлении студента в поток:', err)
        throw err
      }
    },

    // Удалить студента из потока
    async removeStudentFromStream(streamId: number, studentId: number) {
      try {
        await axios.delete(`/api/stream-students/${streamId}/${studentId}`)
        await this.fetchStudentsForStream(streamId)
      } catch (err) {
        console.error('Ошибка при удалении студента из потока:', err)
        throw err
      }
    },
  },
})
