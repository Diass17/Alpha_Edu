<template>
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Список студентов</h1>

      <div class="relative w-1/3">
        <button @click="applyFilters" type="button"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 z-10"
          aria-label="Search">
          <Search class="h-5 w-5" />
        </button>

        <el-input v-model="searchQuery" placeholder="Поиск" clearable
          class="w-full bg-purple-50 border border-purple-200 rounded-lg pl-12 pr-4 py-2" @clear="applyFilters"
          @keyup.enter="applyFilters">
        </el-input>
      </div>
    </div>



    <div class="mt-4 flex items-center space-x-2 bg-purple-50 p-4 rounded-lg">
      <el-button class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"
        @click="onAddStudent" size="small">
        <Plus class="mr-2" /> Добавить студента
      </el-button>
      <el-button type="primary" class="flex items-center bg-purple-500 hover:bg-purple-600"
        @click="showFilter = !showFilter" size="small">
        <Filter class="mr-2" /> Фильтр
      </el-button>
    </div>

    <el-card v-if="showFilter" class="mt-4 bg-purple-50 border border-purple-200 rounded-lg" shadow="never">
      <div class="flex flex-wrap gap-4">
        <div>
          <el-select v-model="filter.course" placeholder="Выбрать курс" clearable class="w-48">
            <el-option v-for="c in courses" :key="c" :label="c" :value="c" />
          </el-select>
        </div>
        <div>
          <el-select v-model="filter.stream" placeholder="Выбрать поток" clearable class="w-48">
            <el-option v-for="s in streams" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
        <el-checkbox v-model="filter.top_student">
          Top Student
        </el-checkbox>
        <el-button type="primary" @click="onResetFilters" size="small">
          Сбросить
        </el-button>
      </div>
    </el-card>

    <div class="mt-6 overflow-auto">
      <table class="min-w-full bg-white border rounded-lg">
        <thead class="bg-purple-50">
          <tr>
            <th class="px-6 py-6 text-purple-700 text-left">#</th>
            <th class="px-6 py-6 text-purple-700 text-left w-1/3">Студент</th>
            <th class="px-6 py-6 text-purple-700 text-left">ИИН</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, idx) in filteredList" :key="s.id" class="border-t hover:bg-gray-50 cursor-pointer"
            @click="goToProfile(s.id)">
            <td class="px-6 py-8 text-sm text-gray-900">{{ idx + 1 }}</td>
            <td class="px-6 py-8 text-sm text-gray-900">{{ s.full_name }}</td>
            <td class="px-6 py-8 text-sm text-gray-900">{{ s.iin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import { Search, Plus, Filter } from '@element-plus/icons-vue'

const students = ref([]);
const router = useRouter()
const store = useStudentStore()

const searchQuery = ref('')
const showFilter = ref(false)
const filter = ref({
  course: '' as string,
  stream: '' as string,
  top_student: false,
})

const courses = [
  'Data Science', 'Generative AI', 'IT право',
  'Введение в программирование', 'Вэб-разработка',
  'Графический и UI/UX дизайн', 'Машинное обучение и ИИ',
  'Мобильная разработка', 'Разработка игр',
  'Сети и информационная безопасность',
]
const streams = ['A1', 'B2', 'C3', 'D4']

async function fetchStudents() {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) throw new Error('Ошибка при загрузке данных');
    students.value = await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Ошибка:', error);
      alert(error.message);
    } else {
      console.error('Неизвестная ошибка:', error);
      alert('Произошла ошибка при загрузке студентов');
    }
  }
}

onMounted(() => {
  fetchStudents();
});

onMounted(async () => {
  await store.fetchStudents()
})

function onAddStudent() {
  router.push({ name: 'NewStudent' })
}
function goToProfile(id: number) {
  router.push({ name: 'StudentDetail', params: { id } })
}

function applyFilters() {
}
function onResetFilters() {
  filter.value = { course: '', stream: '', top_student: false }
  searchQuery.value = ''
}

const filteredList = computed<Student[]>(() =>
  store.list.filter((s) => {
    const bySearch =
      !searchQuery.value ||
      s.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.iin.includes(searchQuery.value)
    const byCourse =
      !filter.value.course || s.course === filter.value.course
    const byStream =
      !filter.value.stream || s.stream === filter.value.stream
    const byTop =
      !filter.value.top_student || Boolean(s.top_student)
    return bySearch && byCourse && byStream && byTop
  })
)
</script>

<style scoped></style>
