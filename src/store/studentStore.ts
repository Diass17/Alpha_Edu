import { defineStore } from 'pinia'
import axios from 'axios'
import * as XLSX from 'xlsx'

export interface Student {
  id: number
  full_name: string
  iin: string
  email: string
  phone: string
  status: string
  top_student: boolean
  funding_source: string
  subject: string
  total_cost: number
  discount_percent: number
  paid_amount: number
  amount_remaining: number    
  stream_id?: number
  stream?: string
}



export interface Stream {
  id: number
  name: string
}

export interface PaymentEntry {
  date: string    // 'YYYY-MM-DD'
  amount: number
  paid: boolean   // true, если status === 'Оплачено'
}

export interface StudentFull extends Student {
  financing: string
  totalCoursePrice: number
  discountPercent: number
  discountedPrice: number
  paymentSchedule: PaymentEntry[]
}

export const useStudentStore = defineStore('student', {
  state: () => ({
    list: [] as Student[],
    streams: {} as Record<number, string>,
  }),

  actions: {
    // Загрузка всех студентов
    async fetchStudents() {
      try {
        const res = await axios.get('/api/students')
        this.list = res.data
      } catch (err) {
        console.error('Ошибка при загрузке студентов:', err)
      }
    },
    async fetchById(id: number | string): Promise<StudentFull> {
      try {
        const res = await axios.get(`/api/students/${id}`)
        return res.data
      } catch (err) {
        console.error('Ошибка при загрузке студента по ID:', err)
        throw err
      }
    },

    // Загрузка всех потоков
    async fetchStreams() {
      try {
        const res = await axios.get('/api/streams')
        this.streams = Object.fromEntries(
          res.data.map((stream: Stream) => [stream.id, stream.name])
        )
      } catch (err) {
        console.error('Ошибка при загрузке потоков:', err)
      }
    },

    // Создание студента
    async createStudent(student: Omit<Student, 'id'>) {
      try {
        const res = await axios.post('/api/students', student)
        await this.fetchStudents()
        return res.data
      } catch (err) {
        console.error('Ошибка при создании студента:', err)
        throw err
      }
    },

    // Обновление студента
    async updateStudent(id: number, updatedData: Partial<Student>) {
      try {
        await axios.patch(`/api/students/${id}`, updatedData)
        const index = this.list.findIndex((s) => s.id === id)
        if (index !== -1) {
          this.list[index] = {
            ...this.list[index],
            ...updatedData,
          }
        }
      } catch (err) {
        console.error('Ошибка при обновлении студента:', err)
        throw err
      }
    },

    // Удаление студента
    async deleteStudent(id: number) {
      try {
        await axios.post(`/api/students/delete/${id}`)
        this.list = this.list.filter((s) => s.id !== id)
      } catch (err) {
        console.error('Ошибка при удалении студента:', err)
        throw err
      }
    },

    // Экспорт в Excel
    exportToExcel() {
      const rows = this.list.map((s) => ({
        ID: s.id,
        ФИО: s.full_name,
        ИИН: s.iin,
        Email: s.email,
        Телефон: s.phone,
        Статус: s.status,
        Топ: s.top_student ? 'Да' : 'Нет',
        Курс: s.subject,
        Финансирование: s.funding_source,
        Общая_стоимость: s.total_cost,
        Скидка: s.discount_percent,
        Оплачено: s.paid_amount,
        Осталось: s.total_cost - s.paid_amount,
      }))

      const sheet = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, sheet, 'Студенты')
      const now = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `students_${now}.xlsx`)
    },
  },
})