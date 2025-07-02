<template>
  <div class="p-6 space-y-6">
    <RouterLink to="/flows" class="text-gray-600 hover:underline">← Назад</RouterLink>

    <div class="bg-white rounded shadow p-6">
      <h1 class="text-2xl font-bold mb-4">Поток: {{ stream?.name }}</h1>

      <div class="flex items-center justify-between mb-4">
        <div class="space-x-2">
          <button class="bg-violet-600 text-white px-4 py-2 rounded" @click="isAdding = true">
            Добавить студента
          </button>
          <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded">Редактировать поток</button>
        </div>
        <input
          v-model="search"
          placeholder="Поиск"
          class="border rounded px-3 py-2 text-sm w-64"
        />
      </div>

      <div class="bg-white rounded-lg border">
        <table class="w-full table-auto text-sm">
          <thead class="bg-gray-100 text-violet-700 text-left">
            <tr>
              <th class="px-4 py-2 border-b">№</th>
              <th class="px-4 py-2 border-b">Студент</th>
              <th class="px-4 py-2 border-b">ИИН</th>
              <th class="px-4 py-2 border-b">Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, index) in filteredStudents"
              :key="student.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
              <td class="px-4 py-2 border-b">{{ student.full_name }}</td>
              <td class="px-4 py-2 border-b">{{ student.iin }}</td>
              <td class="px-4 py-2 border-b">
                <button
                  class="text-red-600 hover:underline"
                  @click="removeStudent(student.id)"
                >
                  Удалить
                </button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="4" class="text-center text-gray-500 py-4">
                Нет студентов в этом потоке.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модалка: Добавление студента -->
    <div v-if="isAdding" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl space-y-4">
        <h2 class="text-lg font-semibold">Выберите студентов</h2>

        <input
          v-model="modalSearch"
          placeholder="Поиск"
          class="w-full border px-3 py-2 rounded"
        />

        <div class="max-h-[300px] overflow-y-auto border rounded">
          <table class="w-full table-auto text-sm">
            <thead class="bg-gray-100 text-violet-700 text-left">
              <tr>
                <th class="px-4 py-2">№</th>
                <th class="px-4 py-2">Студент</th>
                <th class="px-4 py-2">ИИН</th>
                <th class="px-4 py-2">Выбрать</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, index) in filteredAvailableStudents"
                :key="student.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ index + 1 }}</td>
                <td class="px-4 py-2">{{ student.full_name }}</td>
                <td class="px-4 py-2">{{ student.iin }}</td>
                <td class="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    v-model="selectedIds"
                    :value="student.id"
                    class="w-4 h-4"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="isAdding = false" class="px-4 py-2 bg-gray-200 rounded">Отмена</button>
          <button
            :disabled="selectedIds.length === 0"
            @click="addStudents"
            class="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-50"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомление -->
    <div
      v-if="showSuccess"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 border border-green-300 px-6 py-4 rounded shadow z-50"
    >
      ✅ Готово! Студент добавлен в поток
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useStudentStore } from '@/store/studentStore'
import { useFlowStore } from '@/store/flowStore'
import { useStreamStudentStore } from '@/store/streamStudentStore'

const studentStore = useStudentStore()
const streamStore = useFlowStore()
const streamStudentStore = useStreamStudentStore()


const route = useRoute()
const flowId = Number(route.params.flowId)

const isAdding = ref(false)
const modalSearch = ref('')
const search = ref('')
const selectedIds = ref<number[]>([])
const showSuccess = ref(false)

const stream = computed(() =>
  streamStore.list.find((s) => s.id === flowId) || null
)

onMounted(async () => {
  await Promise.all([
    streamStore.fetchFlows(),
    studentStore.fetchStudents(),
    streamStudentStore.fetchStudentsForStream(flowId),
  ])
})

const filteredStudents = computed(() =>
  streamStudentStore.students.filter((s) =>
    s.full_name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const availableStudents = computed(() => {
  const assigned = new Set(streamStudentStore.students.map((s) => s.id))
  return studentStore.list.filter((s) => !assigned.has(s.id))
})

const filteredAvailableStudents = computed(() =>
  availableStudents.value.filter((s) =>
    s.full_name.toLowerCase().includes(modalSearch.value.toLowerCase())
  )
)

const addStudents = async () => {
  try {
    for (const id of selectedIds.value) {
      await streamStudentStore.addStudentToStream(flowId, id)
    }
    selectedIds.value = []
    isAdding.value = false
    showSuccess.value = true
    await streamStudentStore.fetchStudentsForStream(flowId)

    setTimeout(() => {
      showSuccess.value = false
    }, 2500)
  } catch (err) {
    console.error('Ошибка при добавлении студентов:', err)
  }
}

const removeStudent = async (studentId: number) => {
  try {
    await streamStudentStore.removeStudentFromStream(flowId, studentId)
    await streamStudentStore.fetchStudentsForStream(flowId)
  } catch (err) {
    console.error('Ошибка при удалении студента:', err)
  }
}
</script>
