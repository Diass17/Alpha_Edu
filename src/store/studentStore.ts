// src/store/studentStore.ts

import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'

/** Оригинальная запись платежа из БЭКа */
export type Payment = {
  date: string    // ISO формат 'YYYY-MM-DD'
  amount: number
  status: string  // 'Оплачено' или 'Не оплачено'
}

/** Запись платежа для фронта */
export interface PaymentEntry {
  date: string    // 'YYYY-MM-DD'
  amount: number
  paid: boolean   // true, если status === 'Оплачено'
}

/** Базовый объект студента */
export interface Student {
  id: number
  name: string
  iin: string
  course?: string
  stream: string        // например 'A1', 'B2' или строка финансирования
  topStudent: boolean
  email?: string
  phone?: string
  status?: string       // 'active' | 'graduated'
  financing?: string
}

/** Расширенный объект студента с графиком платежей и скидками */
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
    payments: {} as Record<number, Payment[]>,
    loading: false,
  }),
  actions: {
    /** Загрузить список студентов (симуляция) */
    async fetchStudents() {
      this.loading = true
      await new Promise(r => setTimeout(r, 300))
      if (!this.list.length) {
        this.list = [
          { id: 1, name: 'Ахметова Айдана Данибековна',    iin: '990101350128', course: 'Data Science',                     stream: 'A1', topStudent: false, email: 'aidana@example.com',   phone: '+7 700 000 00 01', status: 'студент' },
          { id: 2, name: 'Талгатов Али Ермекович',         iin: '870213400917', course: 'Generative AI',                   stream: 'B2', topStudent: true,  email: 'ali@example.com',      phone: '+7 700 000 00 02', status: 'выпускник' },
          { id: 3,  name: 'Файзулла Мухамед Ахметович',      iin: '950624300675', course: 'Вэб-разработка',                   stream: 'C3', topStudent: false, email: 'muhamed@example.com', phone: '+7 700 000 00 03', status: 'студент'  },
          { id: 4,  name: 'Мейыржанов Асыл Райымбекович',    iin: '010501600338', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false, email: 'asil@example.com',    phone: '+7 700 000 00 04', status: 'выпускник'  },
          { id: 5,  name: 'Кулжанова Салтанат Айдаровна',    iin: '980315240512', course: 'Мобильная разработка',               stream: 'A1', topStudent: false, email: 'saltanat@example.com',phone: '+7 700 000 00 05', status: 'студент'  },
          { id: 6,  name: 'Нургазиев Ерлан Серикович',      iin: '900712560123', course: 'Машинное обучение и ИИ',             stream: 'B2', topStudent: true,  email: 'erlan@example.com',   phone: '+7 700 000 00 06', status: 'студент'  },
          { id: 7,  name: 'Сейткалиев Ербол Ахметович',      iin: '921023470987', course: 'IT право',                           stream: 'C3', topStudent: false, email: 'erbol@example.com',   phone: '+7 700 000 00 07', status: 'выпускник'  },
          { id: 8,  name: 'Тайырова Жанна Ермековна',        iin: '991110110223', course: 'Data Science',                     stream: 'D4', topStudent: false, email: 'zhanna@example.com',  phone: '+7 700 000 00 08', status: 'выпускник'  },
          { id: 9,  name: 'Базарбаев Мади Талгатович',       iin: '890405670543', course: 'Разработка игр',                     stream: 'A1', topStudent: false, email: 'madi@example.com',     phone: '+7 700 000 00 09', status: 'студент'  },
          { id: 10, name: 'Ибраева Аида Данияровна',         iin: '000101330123', course: 'Вэб-разработка',                   stream: 'B2', topStudent: true,  email: 'aida@example.com',     phone: '+7 700 000 00 10', status: 'выпускник'  },
          { id: 11, name: 'Жумабаев Азат Серикович',         iin: '940825780654', course: 'Сети и информационная безопасность', stream: 'C3', topStudent: false, email: 'azat@example.com',     phone: '+7 700 000 00 11', status: 'студент'  },
          { id: 12, name: 'Рахимова Лаура Кайратовна',       iin: '970709450321', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false, email: 'laura@example.com',    phone: '+7 700 000 00 12', status: 'выпускник'  },
          // … добавить ваши реальные данные или запрос к API …
        ]
      }
      this.loading = false
    },

    /** Добавить нового студента */
    async createStudent(data: Omit<Student, 'id'>) {
      const newId = this.list.length
        ? Math.max(...this.list.map(s => s.id)) + 1
        : 1
      this.list.push({ id: newId, ...data })
    },

    /** Обновить существующего студента */
    async updateStudent(id: number, data: Partial<Student>) {
      const idx = this.list.findIndex(s => s.id === id)
      if (idx !== -1) this.list[idx] = { ...this.list[idx], ...data }
    },

    /** Экспорт списка студентов в Excel */
    exportToExcel() {
      const data = this.list.map(s => ({
        Студент:   s.name,
        ИИН:       s.iin,
        Email:     s.email ?? '',
        Телефон:   s.phone ?? '',
      }))
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook  = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Студенты')
      XLSX.writeFile(workbook, 'students.xlsx')
    },

    /** Получить одного студента вместе с расписанием платежей */
    async fetchById(id: string): Promise<StudentFull> {
      this.loading = true
      await new Promise(r => setTimeout(r, 300))
      const sid = Number(id)
      const basic = this.list.find(s => s.id === sid)
      if (!basic) {
        this.loading = false
        throw new Error('Student not found')
      }

      // подгружаем raw-платежи
      const raw = await this.fetchPayments(id)

      // конвертируем в PaymentEntry
      const schedule: PaymentEntry[] = raw.map(p => ({
        date:   p.date,
        amount: p.amount,
        paid:   p.status === 'Оплачено',
      }))

      // определяем параметры скидки по stream/financing
      const financing       = basic.financing ?? basic.stream
      const percentMap: Record<string, number> = {
        'A1':       100,
        'B2':        30,
        'A1_full':  70,
        // … ваши правила …
      }
      const discountPercent   = percentMap[financing] ?? 0
      const totalCoursePrice  = 850000
      const discountedPrice   = Math.round(totalCoursePrice * (100 - discountPercent) / 100)

      this.loading = false
      return {
        ...basic,
        financing,
        totalCoursePrice,
        discountPercent,
        discountedPrice,
        paymentSchedule: schedule,
      }
    },

    /** Получить все raw-платежи студента */
    async fetchPayments(id: string): Promise<Payment[]> {
      const sid = Number(id)
      if (!this.payments[sid]) {
        await new Promise(r => setTimeout(r, 300))
        this.payments[sid] = [
          { date: '2025-05-01', amount: 100000, status: 'Оплачено' },
          { date: '2025-06-01', amount: 100000, status: 'Оплачено' },
          { date: '2025-07-01', amount: 100000, status: 'Не оплачено' },
        ]
      }
      return this.payments[sid]
    },

    /** Получить raw-платежи за конкретную дату */
    async fetchPaymentsByDate(id: string, date: string): Promise<Payment[]> {
      const all = await this.fetchPayments(id)
      return all.filter(p => p.date === date)
    },
  },
})
