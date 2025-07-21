// src/store/flowStore.ts
import { defineStore } from 'pinia'

export type Flow = {
  id: number
  name: string
  mentor: string
  startDate?: string
  endDate?: string
  courseId: number
  studentIds: number[]   // ← track which students belong to this flow
}

// Payload when creating a new flow (no id, and studentIds will default to empty)
export type NewFlowPayload = Omit<Flow, 'id' | 'studentIds'>

export const useFlowStore = defineStore('flow', {
  state: () => ({
    list: [] as Flow[],
    loading: false,
  }),

  actions: {
    /** Fetch flows (mock) */
    async fetchFlows() {
      this.loading = true
      await new Promise((r) => setTimeout(r, 300))
      if (!this.list.length) {
        this.list = [
          {
            id: 1,
            name: 'DSF-1',
            mentor: 'Иванов Иван',
            startDate: '2025-01-01',
            endDate:   '2025-06-01',
            courseId: 1,
            studentIds: []
          },
          {
            id: 2,
            name: 'DSF-2',
            mentor: 'Петров Петр',
            startDate: '2025-02-01',
            endDate:   '2025-07-01',
            courseId: 1,
            studentIds: []
          },
        ]
      }
      this.loading = false
    },

    /** Create a new flow */
    async createFlow(data: NewFlowPayload) {
      const newId =
        this.list.length > 0
          ? Math.max(...this.list.map((f) => f.id)) + 1
          : 1

      const newFlow: Flow = {
        id: newId,
        ...data,
        studentIds: [],  // start with no students
      }

      this.list.push(newFlow)
    },

    /** Update existing flow fields (but not students) */
    async updateFlow(
      id: number,
      data: Partial<Omit<Flow, 'id' | 'studentIds'>>
    ) {
      const idx = this.list.findIndex((f) => f.id === id)
      if (idx !== -1) {
        this.list[idx] = {
          ...this.list[idx],
          ...data,
        }
      }
    },

    /** Remove a flow entirely */
    async removeFlow(id: number) {
      this.list = this.list.filter((f) => f.id !== id)
    },

    /** Add a student to a flow (if not already present) */
    async addStudentToFlow(flowId: number, studentId: number) {
      const flow = this.list.find((f) => f.id === flowId)
      if (flow && !flow.studentIds.includes(studentId)) {
        flow.studentIds.push(studentId)
      }
    },

    /** Remove a student from a flow */
    async removeStudentFromFlow(flowId: number, studentId: number) {
      const flow = this.list.find((f) => f.id === flowId)
      if (flow) {
        flow.studentIds = flow.studentIds.filter((id) => id !== studentId)
      }
    },
  },
})
