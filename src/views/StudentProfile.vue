<template>
  <el-card class="p-6 mx-4 my-6">
    <h2 class="text-2xl font-semibold mb-6">Профиль студента</h2>
    <div class="grid grid-cols-2 gap-4 text-lg">
      <span class="font-medium">ФИО</span>
      <span>{{ student?.name || '—' }}</span>

      <span class="font-medium">ИИН</span>
      <span>{{ student?.iin || '—' }}</span>

      <span class="font-medium">Email</span>
      <span>{{ student?.email || '—' }}</span>

      <span class="font-medium">Телефон</span>
      <span>{{ student?.number || '—' }}</span>

      <span class="font-medium">Курс</span>
      <span>{{ student?.course || '—' }}</span>

      <span class="font-medium">Поток</span>
      <span>{{ student?.stream || '—' }}</span>

      <span class="font-medium">Статус</span>
      <span>{{ student?.status === 'active' ? 'Активный' : student?.status === 'graduated' ? 'Выпускник' : '—' }}</span>

      <span class="font-medium">Top Student</span>
      <span>{{ student?.top_student ? 'Да' : 'Нет' }}</span>

      <span class="font-medium">Финансирование</span>
      <span>{{ student?.funding_source || '—' }}</span>

      <span class="font-medium">Сумма оплачено</span>
      <span>{{ amountPaidFormatted }}</span>

      <span class="font-medium">Сумма к оплате</span>
      <span>{{ amountDueFormatted }}</span>
    </div>
    <div class="flex justify-end mt-6">
      <el-button @click="$router.back()">Назад</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'

const route = useRoute()
const router = useRouter()
const store = useStudentStore()
const id = Number(route.params.id)


onMounted(() => {
  if (!store.list.length) store.fetchStudents()
})


const student = computed<Student | undefined>(() =>
  store.list.find((s) => s.id === id)
)


const amountPaid = computed(() => 0)
const amountDue  = computed(() => 0)


const amountPaidFormatted = computed(() =>
  amountPaid.value.toLocaleString('ru-RU') || '—'
)
const amountDueFormatted = computed(() =>
  amountDue.value.toLocaleString('ru-RU') || '—'
)
</script>

<style scoped>
</style>
