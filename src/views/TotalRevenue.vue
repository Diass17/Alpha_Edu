<template>
  <div class="p-6 font-inter">
    <h2 class="text-2xl font-bold mb-6">Общая выручка</h2>

    <!-- Кнопки фильтрации вкладок -->
    <div class="flex space-x-4 bg-[#F1EFFF] p-3 rounded-lg mb-4">
      <router-link to="/finance/reports/total-revenue" class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/total-revenue' }">Общая выручка</router-link>
      <router-link to="/finance/reports/debts" class="tab-button">Задолженности</router-link>
      <router-link to="/finance/reports/student-funding" class="tab-button">Финансирование студентов</router-link>
    </div>

    <!-- Фильтры -->
    <div class="filters-wrapper relative flex flex-wrap gap-3 mb-6">
      <!-- Начало периода -->
      <div class="relative">
        <button @click="toggleStartPicker" class="filter-select w-48 start-picker-btn">
          {{ startDate ? formatDate(startDate) : 'Начало периода' }}
        </button>
        <teleport to="body">
          <div v-if="showStartPicker" class="datepicker-popup" :style="popupPosition.start" ref="startPickerRef">
            <Datepicker v-model="startDate" @update:modelValue="closeStartPicker" />
          </div>
        </teleport>
      </div>

      <!-- Конец периода -->
      <div class="relative">
        <button @click="toggleEndPicker" class="filter-select w-48 end-picker-btn">
          {{ endDate ? formatDate(endDate) : 'Конец периода' }}
        </button>
        <teleport to="body">
          <div v-if="showEndPicker" class="datepicker-popup" :style="popupPosition.end" ref="endPickerRef">
            <Datepicker v-model="endDate" @update:modelValue="closeEndPicker" />
          </div>
        </teleport>
      </div>

      <!-- Курс -->
      <div class="relative w-48">
        <button @click="toggleCourseDropdown" class="filter-select w-full flex justify-between items-center"
          type="button">
          {{ selectedCourse || 'Курс' }}
          <svg
            :class="['w-4 h-4 ml-2 transform transition-transform duration-200', showCourseDropdown ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="showCourseDropdown"
          class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <input type="text" v-model="searchCourse" placeholder="Поиск курса"
            class="w-full px-3 py-2 text-sm border-b outline-none" />
          <ul>
            <li v-for="(course, index) in filteredCourses" :key="index" @click="selectCourse(course)"
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
              :class="{ 'text-[rgb(98,82,254)] font-medium': selectedCourse === course }">
              {{ course }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Тип финансирования -->
      <div class="relative w-48">
        <button @click="toggleFundingType" class="filter-select w-full flex justify-between items-center" type="button">
          {{ selectedFundingType || 'Тип финансирования' }}
          <svg
            :class="['w-4 h-4 ml-2 transform transition-transform duration-200', showFundingType ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <ul v-if="showFundingType" class="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-md">
          <li v-for="option in fundingTypes" :key="option" @click="selectFundingType(option)"
            class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFundingType === option }">
            {{ option }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Таблица -->
    <table class="w-full border bg-white border-purple-200 rounded-lg overflow-hidden text-left">
      <thead class="bg-[#ECE9FF] text-sm font-semibold">
        <tr>
          <th class="px-4 py-2">Дата</th>
          <th class="px-4 py-2">Сумма (тг)</th>
          <th class="px-4 py-2">Курс</th>
          <th class="px-4 py-2">Студент</th>
          <th class="px-4 py-2">Оплата</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t" v-for="(row, i) in filteredRows" :key="i">
          <td class="px-4 py-2">{{ row.date }}</td>
          <td class="px-4 py-2">{{ row.amount }}</td>
          <td class="px-4 py-2">{{ row.course }}</td>
          <td class="px-4 py-2">{{ row.student }}</td>
          <td class="px-4 py-2">{{ row.payment }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Summary Box -->
    <div class="mt-6 w-full rounded-xl overflow-hidden border border-[#E0D7FF]">
      <div class="bg-[#ECE9FF] px-6 py-4 text-sm font-semibold text-black">Период {{ formattedPeriod }}</div>
      <div class="bg-white px-6 py-4 text-sm flex justify-between items-center">
        <div>Выручка</div>
        <div>{{ totalAmountDisplay }} тг</div>
      </div>
      <div class="bg-[#ECE9FF] px-6 py-4 text-sm font-semibold flex justify-between items-center">
        <div>Общая выручка</div>
        <div>{{ totalAmountDisplay }} тг</div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-4 flex justify-end">
      <button @click="downloadExcel" class="download-btn">Сохранить в Excel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Datepicker from 'vue3-datepicker'
import * as XLSX from 'xlsx'

const route = useRoute()
const startDate = ref(null)
const endDate = ref(null)
const showStartPicker = ref(false)
const showEndPicker = ref(false)
const startPickerRef = ref(null)
const endPickerRef = ref(null)
const popupPosition = ref({ start: '', end: '' })
const showCourseDropdown = ref(false)
const selectedCourse = ref('')
const searchCourse = ref('')
const rows = ref([])


const filteredCourses = computed(() => {
  const courseSet = new Set(rows.value.map(r => r.course))
  return Array.from(courseSet).filter(course => course.toLowerCase().includes(searchCourse.value.toLowerCase()))
})

function toggleCourseDropdown() { showCourseDropdown.value = !showCourseDropdown.value }
function selectCourse(course) { selectedCourse.value = course; showCourseDropdown.value = false }
function formatDate(date) { return new Date(date).toLocaleDateString('ru-RU') }
function toggleStartPicker(e) { showStartPicker.value = !showStartPicker.value; if (showStartPicker.value) popupPosition.value.start = `position: absolute; top: ${e.target.getBoundingClientRect().bottom + window.scrollY + 5}px; left: ${e.target.getBoundingClientRect().left}px; z-index: 9999;` }
function toggleEndPicker(e) { showEndPicker.value = !showEndPicker.value; if (showEndPicker.value) popupPosition.value.end = `position: absolute; top: ${e.target.getBoundingClientRect().bottom + window.scrollY + 5}px; left: ${e.target.getBoundingClientRect().left}px; z-index: 9999;` }
function closeStartPicker() { showStartPicker.value = false }
function closeEndPicker() { showEndPicker.value = false }

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchStudentPaymentsLikeOldVersion()
})

async function fetchStudentPaymentsLikeOldVersion() {
  try {
    const [studentsRes, coursesRes] = await Promise.all([
      axios.get('/api/students'),
      axios.get('/api/courses')
    ])

    const courses = coursesRes.data

    rows.value = studentsRes.data.map((student) => {
      const courseObj = courses.find(c => c.id === student.course_id || c.name === student.subject)
      return {
        date: new Date().toLocaleDateString('ru-RU'), // если есть created_at, подставь сюда
        amount: (student.paid_amount || 0).toLocaleString('ru-RU'),
        course: courseObj?.name || student.subject || '–––',
        student: student.full_name || '',
        payment: student.funding_source || ''
      }
    })
  } catch (err) {
    console.error('Ошибка при загрузке студентов или курсов:', err)
  }
}

function handleClickOutside(e) {
  if (!startPickerRef.value?.contains(e.target) && !e.target.closest('.start-picker-btn')) showStartPicker.value = false
  if (!endPickerRef.value?.contains(e.target) && !e.target.closest('.end-picker-btn')) showEndPicker.value = false
}

const formattedPeriod = computed(() => (startDate.value && endDate.value) ? `${formatDate(startDate.value)} - ${formatDate(endDate.value)}` : 'не выбран')

const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const date = new Date(row.date.split('.').reverse().join('-'))
    const inRange = (!startDate.value || date >= startDate.value) && (!endDate.value || date <= endDate.value)
    const courseMatch = !selectedCourse.value || row.course === selectedCourse.value
    const fundingMatch = !selectedFundingType.value || row.payment === selectedFundingType.value
    return inRange && courseMatch && fundingMatch
  })
})

const totalAmount = computed(() => filteredRows.value.reduce((sum, row) => sum + parseInt(row.amount.replace(/[^\d]/g, '')) || 0, 0))
const totalAmountDisplay = computed(() => totalAmount.value.toLocaleString('ru-RU'))
function downloadExcel() {
  const worksheet = XLSX.utils.json_to_sheet(filteredRows.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчёт')
  XLSX.writeFile(workbook, 'Отчёт.xlsx')
}

const fundingTypes = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант']
const selectedFundingType = ref('')
const showFundingType = ref(false)

function toggleFundingType() {
  showFundingType.value = !showFundingType.value
  showCourseDropdown.value = false
  showStartPicker.value = false
  showEndPicker.value = false
}

function selectFundingType(option) {
  selectedFundingType.value = option
  showFundingType.value = false
}



</script>


<!-- Styles-->
<style scoped>
.tab-button,
.tab-button-active {
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
}

.tab-button {
  background: #FFFFFF;
  color: #6252FE;
}

.tab-button-active {
  background: #6252FE;
  color: #FFFFFF;
}

.filter-select {
  background: #ffffff;
  color: #6252FE;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}

.download-btn {
  background-color: #6252FE;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background-color: #5140e5;
}

.custom-dropdown-header {
  background-color: white;
  border: 1px solid #E6E3F1;
  font-size: 14px;
  color: #121926;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 400;
}

.custom-dropdown-menu {
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #E6E3F1;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 6px 0;
  z-index: 50;
}

.custom-dropdown-search {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 14px;
  border: 1px solid #E6E3F1;
  border-radius: 8px;
  outline: none;
  font-weight: 400;
}

.custom-dropdown-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #121926;
  cursor: pointer;
}

.custom-dropdown-item:hover {
  background-color: #F4F0FF;
}

.custom-dropdown-item.selected {
  color: #6252FE;
  font-weight: 600;
}

.filters-wrapper {
  background-color: #F1EFFF;
  border-radius: 12px;
  padding: 9px;
  margin-bottom: 16px;
  margin-left: 0px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
</style>