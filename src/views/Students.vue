<template>
  <div class="p-4 md:p-6 bg-white min-h-full">
    <div class="md:hidden">
      <!-- Поиск -->
      <div class="mb-4">
        <el-input v-model="searchQuery" placeholder="Поиск" class="search-mobile-final">
          <template #prefix>
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </template>
        </el-input>
      </div>

      <!-- Заголовок -->
      <h1 class="text-xl font-bold text-gray-800 mb-4">Список студентов</h1>

      <!-- Блок кнопок -->
      <div class="p-2 bg-[#EFEFFD] rounded-xl mb-4">
        <div class="flex flex-col gap-2 items-start">
          <div class="flex gap-2">
            <button @click="onAddStudent" class="mobile-action-btn-sized w-[171px] h-[35px]">
              <svg class="w-5 h-5 text-[#6252FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span>Добавить студента</span>
            </button>
            <button @click="showFilter = !showFilter" class="mobile-action-btn-sized w-[88px] h-[35px]" :class="{ 'filter-active': showFilter }">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              <span>Фильтр</span>
            </button>
          </div>
          <div class="flex gap-2">
             <button @click="triggerExcelInput" class="mobile-action-btn-sized w-[171px] h-[35px]">
               <svg class="w-5 h-5 text-[#6252FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Загрузить из файла</span>
            </button>
            <button @click="onSaveExcel" class="mobile-action-btn-sized w-[148px] h-[35px]">
              <svg class="w-5 h-5 text-[#6252FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Скачать шаблон</span>
            </button>
          </div>
        </div>
      </div>

      <!-- НОВАЯ Панель фильтров для мобильных -->
      <div v-if="showFilter" class="p-2 bg-[#EFEFFD] rounded-xl mb-6">
          <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                  <el-select v-model="filter.course" placeholder="Выбрать курс" class="mobile-filter-select flex-1" clearable />
                  <el-select v-model="filter.stream" placeholder="Выбрать поток" class="mobile-filter-select flex-1" clearable />
              </div>
              <div class="mobile-filter-checkbox">
                 <el-checkbox v-model="filter.topStudent" label="Top Student" size="large" />
              </div>
          </div>
      </div>


      <!-- Список студентов -->
      <div class="bg-white rounded-xl overflow-hidden border-2 border-[#E0DEFB] shadow-sm">
        <div class="p-3 bg-[#EFEFFD] font-bold text-gray-800 text-left border-b-2 border-b-[#E0DEFB]">Студент</div>
        <div v-for="(s, idx) in filteredList" :key="`mobile-${s.id}`" @click="goToProfile(s.id)" class="flex items-center p-3 space-x-4 cursor-pointer" :class="idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FE]'">
          <span class="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#EFEFFD] text-[#6B52FE] font-bold text-sm">{{ idx + 1 }}</span>
          <span class="text-gray-900 truncate">{{ s.name }}</span>
        </div>
      </div>
    </div>


    <div class="hidden md:block">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Список студентов</h1>
        <div class="relative w-1/4">
          <el-input v-model="searchQuery" placeholder="Поиск" clearable @clear="applyFilters" @keyup.enter="applyFilters" class="desktop-search">
            <template #prefix><svg class="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></template>
          </el-input>
        </div>
      </div>
      <div class="mt-4 flex items-center space-x-2 bg-[#F1EFFF] p-1">
        <el-button @click="onAddStudent" class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"><img :src="addStudentLogo" alt="Добавить" class="w-5 h-5 mr-2" /> Добавить студента</el-button>
        <el-button @click="showFilter = !showFilter" :class="['flex items-center text-purple-600 hover:bg-purple-100', showFilter ? 'bg-purple-500 text-white' : 'bg-white border border-purple-200']"><img :src="filterLogo" alt="Фильтр" class="w-5 h-5 mr-2" /> Фильтр</el-button>
        <input type="file" ref="excelInput" accept=".xlsx,.xls" style="display: none" @change="handleExcelFile" />
        <el-button @click="triggerExcelInput" class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"><img :src="arrowDownLogo" alt="Импорт" class="w-5 h-5 mr-2" /> Импорт из Excel</el-button>
        <el-button @click="onSaveExcel" class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"><img :src="arrowUpLogo" alt="Экспорт" class="w-5 h-5 mr-2" /> Сохранить в Excel</el-button>
      </div>
      <!-- Панель фильтров для десктопа -->
      <el-card v-if="showFilter" class="mt-4 bg-purple-50 border-purple-200 rounded-xl" shadow="never">
        <div class="flex flex-wrap gap-4 items-center">
          <el-select v-model="filter.course" placeholder="Выбрать курс" clearable class="w-48" />
          <el-select v-model="filter.stream" placeholder="Выбрать поток" clearable class="w-48" />
          <el-checkbox v-model="filter.topStudent">Top Student</el-checkbox>
          <el-button type="primary" @click="onResetFilters" size="small" class="rounded-xl">Сбросить</el-button>
        </div>
      </el-card>
      <div class="mt-6 overflow-x-auto bg-white border border-purple-200 rounded-xl">
        <table class="min-w-full">
          <thead class="bg-purple-50">
            <tr>
              <th class="px-6 py-3 text-left text-purple-700"></th>
              <th class="px-6 py-3 text-left text-purple-700">Студент</th>
              <th class="px-6 py-3 text-left text-purple-700">ИИН</th>
              <th class="px-6 py-3 text-left text-purple-700">Email</th>
              <th class="px-6 py-3 text-left text-purple-700">Номер телефона</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, idx) in filteredList" :key="s.id" class="cursor-pointer hover:bg-gray-50 even:bg-purple-50" @click="goToProfile(s.id)">
              <td class="px-6 py-4"><span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-purple-100 text-purple-600">{{ idx + 1 }}</span></td>
              <td class="px-6 py-4 text-md text-gray-900">{{ s.name }}</td>
              <td class="px-6 py-4 text-md text-gray-900">{{ s.iin }}</td>
              <td class="px-6 py-4 text-md text-gray-900">{{ s.email }}</td>
              <td class="px-6 py-4 text-md text-gray-900">{{ s.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import addStudentLogo from '@/assets/logos/addstudent.png'
import filterLogo from '@/assets/logos/filter.png'
import arrowDownLogo from '@/assets/logos/arrow-down.png'
import arrowUpLogo from '@/assets/logos/arrow-up.png'

const router = useRouter()
const store = useStudentStore()

const searchQuery = ref('')
const showFilter  = ref(false)
const filter = ref({ course: '', stream: '', topStudent: false })

const courses = ['Data Science', 'Generative AI', 'IT право', 'Введение в программирование', 'Вэб-разработка', 'Графический и UI/UX дизайн', 'Машинное обучение и ИИ', 'Мобильная разработка', 'Разработка игр', 'Сети и информационная безопасность']
const streams = ['A1', 'B2', 'C3', 'D4']

onMounted(async () => { await store.fetchStudents() })

function onAddStudent() { router.push({ name: 'NewStudent' }) }
function goToProfile(id: number) { router.push({ name: 'StudentDetail', params: { id } }) }

const excelInput = ref<HTMLInputElement | null>(null);
function triggerExcelInput() { excelInput.value?.click(); }
function handleExcelFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) { alert('Вы выбрали файл: ' + file.name); }
}
function onSaveExcel() { store.exportToExcel() }

function applyFilters() {}
function onResetFilters() {
  filter.value = { course: '', stream: '', topStudent: false }
  searchQuery.value = ''
}

const filteredList = computed<Student[]>(() =>
  store.list.filter((s) => {
    const bySearch = !searchQuery.value || s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || s.iin.includes(searchQuery.value)
    const byCourse = !filter.value.course || s.course === filter.value.course
    const byStream = !filter.value.stream || s.stream === filter.value.stream
    const byTop = !filter.value.topStudent || s.topStudent
    return bySearch && byCourse && byStream && byTop
  })
)
</script>

<style>
.search-mobile-final .el-input__wrapper {
  background-color: #F1EFFF;
  border-radius: 10px;
  box-shadow: none;
  padding: 6px 15px;
}
.desktop-search .el-input__wrapper {
  background-color: #F1EFFF;
}
.mobile-action-btn-sized {
  margin: 0 !important;
  padding: 0 10px;
  background: white;
  border: none;
  color: #6252FE;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
}
.mobile-action-btn-sized.filter-active {
    background-color: #6252FE;
    color: white;
}
.mobile-action-btn-sized.filter-active svg {
    color: white;
}

/* Стили для мобильных фильтров */
.mobile-filter-select .el-input__wrapper {
    background-color: white !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    border: none !important;
    height: 35px;
    font-weight: 500;
}
.mobile-filter-checkbox {
    background-color: white;
    padding: 0 12px;
    height: 35px;
    border-radius: 8px;
    display: flex;
    align-items: center;
}
.mobile-filter-checkbox .el-checkbox__label {
    font-weight: 500;
    color: #333;
}
</style>