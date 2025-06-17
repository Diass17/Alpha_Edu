import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export interface Student {
  full_name: string 
  id: number
  name: string
  iin: string
  email: string
  phone: string
  status: string
  top_student: boolean
  funding_source: string
  total_cost : number
  discount_percent: number
  paid_amount:number
  subject: string
  stream?: string
  stream_id?: number  // <-- знак вопроса здесь
}



export const useStudentStore = defineStore('student', {
  state: () => ({
    list: [] as Student[],
    streams: {} as Record<number, string>,
  }),
  actions: {
    async fetchStudents() {
      try {
        const res = await axios.get('/api/students')
        this.list = res.data.map((s: any): Student => ({
          id: s.id,
          name: s.full_name,
          full_name: s.full_name,
          iin: s.iin,
          email: s.email,
          phone: s.phone_number || '',
          status: s.status || '',
          top_student: s.top_student,
          funding_source: s.funding_source || '',
          subject: s.subject || '',
          stream: s.stream ,
          stream_id: s.stream_id,
          total_cost: s.total_cost,
          paid_amount: s.paid_amount,
          discount_percent:s.discount_percent
        }))
      } catch (error) {
        console.error('Ошибка при загрузке студентов:', error)
      }
    },
    async fetchStreams() {
      const streams = ref<Record<number, string>>({})
      const res = await fetch('/api/streams')
      const data = await res.json()
      this.streams = Object.fromEntries(data.map((s: any) => [s.id, s.name]))
      console.log('Streams map:', this.streams)
    },
    async updateStudent(id: number, updatedData: Partial<Student>) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Failed to update student');
        const updatedStudent = await response.json();

        const index = this.list.findIndex(s => s.id === id);
        if (index !== -1) {
          this.list[index] = updatedStudent;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createStudent(newStudent: Omit<Student, 'id'>) {
      try {
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent),
        });
        if (!response.ok) throw new Error('Failed to create student');
        const createdStudent = await response.json();

        this.list.push(createdStudent);
      } catch (error) {
        console.error('Ошибка при создании студента:', error);
        throw error;
      }
    }
  },
})
