import { defineStore } from 'pinia'
import axios from 'axios'
import * as XLSX from 'xlsx'

// 📌 Тип студента из API
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
  payment_period: number
  stream_id?: number
  stream?: string

  // 👇 Добавь это
  payment_schedule?: {
    date: string
    amount: number
    paid: boolean
    comment?: string
  }[]
}


// 📌 Тип для потоков
export interface Stream {
  id: number
  name: string
}

// 📌 Единичный платёж
export interface PaymentEntry {
  date: string
  amount: number
  paid: boolean
}

// 📌 Полная модель студента на фронте
export interface StudentFull extends Omit<Student, 'payment_period'> {
  financing: string
  totalCoursePrice: number
  discountPercent: number
  discountedPrice: number
  paymentPeriod: number // ✅ адаптированное поле
  paymentSchedule: PaymentEntry[]
}

export const useStudentStore = defineStore('student', {
  state: () => ({
    list: [] as Student[],
    streams: {} as Record<number, string>,
  }),

  actions: {
    // 📥 Загрузка всех студентов
    async fetchStudents() {
      try {
        const res = await axios.get('/api/students')
        this.list = res.data
      } catch (err) {
        console.error('Ошибка при загрузке студентов:', err)
      }
    },

    // 📥 Загрузка одного студента
    async fetchById(id: number | string): Promise<StudentFull> {
      try {
        const res = await axios.get(`/api/students/${id}`)
        const s = res.data

        return {
          id: s.id,
          full_name: s.full_name,
          iin: s.iin,
          email: s.email,
          phone: s.phone,
          status: s.status,
          top_student: s.top_student,
          funding_source: s.funding_source,
          subject: s.subject,
          total_cost: s.total_cost,
          discount_percent: s.discount_percent,
          paid_amount: s.paid_amount,
          amount_remaining: s.amount_remaining,
          stream_id: s.stream_id,
          stream: s.stream,

          // 🔄 Преобразованные поля
          financing: s.funding_source || '',
          totalCoursePrice: s.total_cost,
          discountPercent: s.discount_percent,
          discountedPrice: Math.round(s.total_cost * (1 - s.discount_percent / 100)),
          paymentPeriod: s.payment_period,
          paymentSchedule: s.paymentSchedule ?? [],
        }
      } catch (err) {
        console.error('Ошибка при загрузке студента по ID:', err)
        throw err
      }
    },

    // 📥 Загрузка потоков
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

    // ➕ Создание студента
    async createStudent(student: Omit<StudentFull,
      'id' | 'discountedPrice' | 'paymentSchedule' | 'financing' | 'totalCoursePrice' | 'discountPercent'>) {
      try {
        const res = await axios.post('/api/students', student)
        await this.fetchStudents()
        return res.data
      } catch (err) {
        console.error('Ошибка при создании студента:', err)
        throw err
      }
    },

    // ✏️ Обновление студента
    async updateStudent(id: number, updatedData: Partial<Student>) {
      try {
        await axios.put(`/api/students/${id}`, updatedData)
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

    // ❌ Удаление студента
    async deleteStudent(id: number) {
      try {
        await axios.post(`/api/students/delete/${id}`)
        this.list = this.list.filter((s) => s.id !== id)
      } catch (err) {
        console.error('Ошибка при удалении студента:', err)
        throw err
      }
    },

    // 📤 Экспорт в Excel
    exportToExcel() {
      if (this.list.length === 0) return

      const s = this.list[0] // первый студент

      const rows = [{
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
        Период_оплаты: s.payment_period,
      }]

      const sheet = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, sheet, 'Студенты')
      XLSX.writeFile(wb, `student_${s.full_name}.xlsx`)
    }

  },
})
