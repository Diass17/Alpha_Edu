<template>
  <div>
    <!-- Page Title -->
    <h2 class="text-2xl font-bold mb-4">Профиль студента</h2>

    <!-- Search Input with Filter Icon -->
    <div class="relative mb-6">
      <input v-model="searchTerm" type="text" placeholder="Поиск"
        class="w-full py-3 px-4 bg-[#E0DEFB] rounded-lg placeholder-gray-600 focus:outline-none" />
      <el-icon class="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Filter />
      </el-icon>
    </div>

    <!-- Section Header -->
    <h3 class="text-lg font-semibold mb-2">Data Science</h3>

    <!-- Column Titles Row -->
    <!-- Column Titles -->
    <div class="grid grid-cols-4 items-center p-4 bg-white rounded-lg shadow mb-4">
      <span class="font-medium">ФИО</span>
      <span class="text-center text-gray-500">ID</span>
      <span class="text-right text-gray-700">DSF-100</span>
      <el-icon class="justify-self-end">
        <ArrowRight />
      </el-icon>
    </div>


    <!-- Student List Items -->
    <div class="space-y-4">
      <div v-for="student in filteredStudents" :key="student.id"
        class="grid grid-cols-4 items-center p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        @click="goToStudent(student.id)">
        <span class="font-medium">{{ student.name }}</span>
        <span class="text-center text-gray-500">{{ student.iin }}</span>
        <span class="text-right text-gray-700">{{ student.stream }}</span>
        <el-icon class="justify-self-end">
          <ArrowRight />
        </el-icon>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import { useRouter } from 'vue-router'
import { Filter, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStudentStore()
const searchTerm = ref('')

onMounted(() => {
  store.fetchStudents()
})

const filteredStudents = computed(() =>
  store.list
    .filter(s =>
      searchTerm.value
        ? s.full_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          s.iin.includes(searchTerm.value)
        : true
    )
    .map(s => ({
      id: s.id,
      name: s.full_name,
      iin: s.iin,
      stream: s.stream
    }))
)





function goToStudent(id: number) {
  router.push(`/students/${id}`)
}
</script>

<style scoped>
/* additional scoped styles if needed */
</style>
