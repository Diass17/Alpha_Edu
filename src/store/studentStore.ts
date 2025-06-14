import { defineStore } from 'pinia'
import axios from 'axios'

export interface Student {
  full_name: string
  id: number
  name: string
  iin: string
  email: string
  number: string
  status: string
  top_student: boolean
  funding_source: string
  course: string
  stream: string
}

export const useStudentStore = defineStore('student', {
  state: () => ({
    list: [] as Student[],
  }),
  actions: {
    async fetchStudents() {
      try {
        const res = await axios.get('/api/students');
        this.list = res.data;
      } catch (error) {
        console.error('Ошибка при загрузке студентов:', error)
      }
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
