<template>
  <div class="p-6 font-inter">
    <h2 class="text-2xl font-bold mb-6">Общая выручка</h2>

<!-- Кнопки фильтрации вкладок -->
  <div class="flex space-x-4 bg-purple-50 p-3 rounded-lg mb-4">
    <router-link
      to="/finance/reports/total-revenue"
      class="tab-button"
      :class="{ 'tab-button-active': route.path === '/finance/reports/total-revenue' }"
    >Общая выручка</router-link>
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
      <div
        v-if="showStartPicker"
        class="datepicker-popup"
        :style="popupPosition.start"
        ref="startPickerRef"
      >
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
      <div
        v-if="showEndPicker"
        class="datepicker-popup"
        :style="popupPosition.end"
        ref="endPickerRef"
      >
        <Datepicker v-model="endDate" @update:modelValue="closeEndPicker" />
      </div>
    </teleport>
   </div>

<!--"Курс" -->
<div class="relative w-48">
  <button @click="toggleCourseDropdown" class="filter-select w-full flex justify-between items-center">
    {{ selectedCourse || 'Курс' }}
    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>
  <div
    v-if="showCourseDropdown"
    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
  >
    <input
      type="text"
      v-model="searchCourse"
      placeholder="Поиск курса"
      class="w-full px-3 py-2 text-sm border-b outline-none"
    />
    <ul>
      <li
        v-for="(course, index) in filteredCourses"
        :key="index"
        @click="selectCourse(course)"
        class="cursor-pointer px-4 py-2 hover:bg-gray-100"
        :class="{ 'text-[rgb(98,82,254)] font-medium': selectedCourse === course }"
      >
        {{ course }}
      </li>
    </ul>
  </div>
</div>



<!-- Оплата -->
<div class="relative w-48">
  <button @click="showPaymentDropdown = !showPaymentDropdown" class="filter-select w-full flex justify-between items-center">
    <span>{{ selectedPayment || 'Оплата' }}</span>
    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>

  <ul
    v-if="showPaymentDropdown"
    class="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-md"
  >
    <li
      v-for="option in paymentOptions"
      :key="option"
      @click="selectPayment(option)"
      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedPayment === option }"
    >
      {{ option }}
    </li>
  </ul>
</div>
</div>

<!-- Таблица -->
  <table class="w-full border border-purple-200 rounded-lg overflow-hidden text-left">
    <thead class="bg-[rgb(185,179,248)] text-sm font-semibold">
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

<!-- Summary Box: Always visible -->
  <div class="mt-6 w-full rounded-xl overflow-hidden border border-[#E0D7FF]">
  <!-- Период -->
  <div class="bg-[rgb(185,179,248)] px-6 py-4 text-sm font-semibold text-black">
    Период {{ formattedPeriod }}
  </div>
  <!-- Выручка -->
  <div class="bg-white px-6 py-4 text-sm flex justify-between items-center">
    <div>Выручка</div>
    <div>{{ totalAmountDisplay }} тг</div>
  </div>
  <!-- Общая выручка -->
  <div class="bg-[rgb(185,179,248)] px-6 py-4 text-sm font-semibold flex justify-between items-center">
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


<!-- Script -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Datepicker from 'vue3-datepicker'
import * as XLSX from 'xlsx'

const showCourseDropdown = ref(false)
const selectedCourse = ref('')
const searchCourse = ref('')

const selectedPayment = ref('')
const paymentOptions = ['Рассрочка', 'Полная оплата']


const courseList = [
  'Data Science',
  'Generative AI',
  'IT право',
  'Введение в программирование',
  'Вэб-разработка',
  'Графический и UI/UX дизайн',
  'Машинное обучение и ИИ',
  'Мобильная разработка',
  'Разработка игр',
  'Сети и информационная безопасность'
]

const filteredCourses = computed(() =>
  courseList.filter(course =>
    course.toLowerCase().includes(searchCourse.value.toLowerCase())
  )
)

function toggleCourseDropdown() {
  showCourseDropdown.value = !showCourseDropdown.value
}

function selectCourse(course) {
  selectedCourse.value = course
  showCourseDropdown.value = false
}

const route = useRoute()
const startDate = ref(null)
const endDate = ref(null)
const showStartPicker = ref(false)
const showEndPicker = ref(false)
const startPickerRef = ref(null)
const endPickerRef = ref(null)
const popupPosition = ref({ start: '', end: '' })
const showPaymentDropdown = ref(false)

function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU')
}

function toggleStartPicker(event) {
  showStartPicker.value = !showStartPicker.value
  if (showStartPicker.value) {
    const rect = event.target.getBoundingClientRect()
    popupPosition.value.start = `position: absolute; top: ${rect.bottom + window.scrollY + 5}px; left: ${rect.left}px; z-index: 9999;`
  }
}

function toggleEndPicker(event) {
  showEndPicker.value = !showEndPicker.value
  if (showEndPicker.value) {
    const rect = event.target.getBoundingClientRect()
    popupPosition.value.end = `position: absolute; top: ${rect.bottom + window.scrollY + 5}px; left: ${rect.left}px; z-index: 9999;`
  }
}

function closeStartPicker() {
  showStartPicker.value = false
}
function closeEndPicker() {
  showEndPicker.value = false
}

function handleClickOutside(event) {
  const isClickInsideStart =
    startPickerRef.value?.contains(event.target) ||
    event.target.closest('.start-picker-btn')

  const isClickInsideEnd =
    endPickerRef.value?.contains(event.target) ||
    event.target.closest('.end-picker-btn')

  if (!isClickInsideStart && !isClickInsideEnd) {
    showStartPicker.value = false
    showEndPicker.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const formattedPeriod = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`
  }
  return 'не выбран'
})

const filteredRows = computed(() => {
  return rows.filter(row => {
    const rowDate = new Date(row.date.split('.').reverse().join('-'))
    const inPeriod = (!startDate.value || rowDate >= startDate.value)
                   && (!endDate.value   || rowDate <= endDate.value)
    const courseMatch  = !selectedCourse.value || row.course === selectedCourse.value
    const paymentMatch = !selectedPayment.value
                       || row.payment === selectedPayment.value
                       || row.payment.startsWith(selectedPayment.value)

    return inPeriod && courseMatch && paymentMatch
  })
})


const totalAmount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return filteredRows.value.reduce((sum, row) => {
    const cleaned = row.amount.replace(/[^\d]/g, '')  // удаляем все кроме цифр
    const num = parseInt(cleaned) || 0
    return sum + num
  }, 0)
})

const totalAmountDisplay = computed(() => {
  return totalAmount.value.toLocaleString('ru-RU')
})

const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredRows.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчёт')
  XLSX.writeFile(workbook, 'Отчёт.xlsx')
}

function selectPayment(option) {
  selectedPayment.value = option
  showPaymentDropdown.value = false
}

const rows = [
  { date: '31.05.2025', amount: '150.000', course: 'Data Science', student: 'Сеитов А.К.', payment: 'Полная оплата' },
  { date: '31.05.2025', amount: '120.000', course: 'Мобильная разработка', student: 'Муратова И.Н.', payment: 'Рассрочка, 3 платеж' },
  { date: '31.05.2025', amount: '90.000', course: 'Программирование', student: 'Ахметов Е.М.', payment: 'Рассрочка, 3 платеж' },
  { date: '29.05.2025', amount: '550.000', course: 'Разработка игр', student: 'Ким А.С.', payment: 'Полная оплата' },
  { date: '28.05.2025', amount: '45.000', course: 'Машинное обучение и ИИ', student: 'Жанабаева Р.Ш.', payment: 'Полная оплата' },
  { date: '28.05.2025', amount: '77.000', course: 'Вэб-разработка', student: 'Сергеев Д.И.', payment: 'Рассрочка, 2 платеж' },
  { date: '28.05.2025', amount: '39.000', course: 'IT право', student: 'Имангазин А.А.', payment: 'Рассрочка, 1 платеж' },
]
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
  background: #f4f0ff;
  color: #836eff;
}
.tab-button-active {
  background: #836eff;
  color: white;
}
.filter-select {
  background: #f4f0ff;
  color: #6252FE;
  border: 1px solid #cfc0ff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.datepicker-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: 10px;
}
.download-btn {
  background-color: #6252fe;
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
</style>