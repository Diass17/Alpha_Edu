<template>
  <div class="student-payments">
    <!-- Верхняя панель -->
    <div class="top-bar">
      <h2>Оплаты студентов</h2>

      <!-- Поисковик -->
      <div class="search-wrapper">
        <img src="@/assets/logos/search.png" class="search-icon" />
        <input v-model="search" type="text" placeholder="Поиск" class="search-input" />
      </div>
    </div>


    <div class="filter-button-wrapper">
      <div class="filter-bar">
        <button :class="['filter-btn', { 'filter-btn--active': filtersVisible }]" @click="toggleFilters" type="button">
          <img src="@/assets/logos/filter.png" class="filter-icon" />
          <span>Фильтр</span>
        </button>
      </div>
    </div>


    <!-- Панель фильтров -->
    <div v-if="filtersVisible" class="filters-box">
      <!-- Тип финансирования -->
      <div class="relative w-48">
        <button @click="toggleFundingType" class="filter-select w-full flex justify-between items-center" type="button">
          {{ selectedFundingTypes.length ? selectedFundingTypes.join(', ') : 'Тип финансирования' }}
          <svg
            :class="['w-4 h-4 ml-2 transform transition-transform duration-200', showFundingType ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <ul v-if="showFundingType" class="funding-dropdown absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-md">
          <li v-for="option in fundingTypes" :key="option" @click="selectFundingType(option)"
            class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
            <span :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFundingTypes.includes(option) }">
              {{ option }}
            </span>
            <span v-if="selectedFundingTypes.includes(option)" class="text-[rgb(98,82,254)]">✔</span>
          </li>
        </ul>
      </div>

      <!-- Статус -->
      <div class="relative w-56">
        <button @click="toggleStatusDropdown" class="filter-select w-full flex justify-between items-center"
          type="button">
          {{ selectedStatus || 'Статус' }}
          <svg :class="[
            'w-4 h-4 ml-2 transform transition-transform duration-200',
            showStatusDropdown ? 'rotate-180' : ''
          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <ul v-if="showStatusDropdown"
          class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg">
          <li v-for="option in statusOptions" :key="option" @click="selectStatus(option)"
            class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === option }">
            {{ option }}
          </li>
        </ul>
      </div>

      <!-- Только с долгами -->
      <label class="filter-select checkbox-style">
        <input type="checkbox" v-model="withDebt" />
        Только с долгами
      </label>
    </div>

    <!-- Таблица -->
    <table class="student-table">
      <thead>
        <tr>
          <th class="w-12">#</th>
          <th>Студент</th>
          <th>ИИН</th>
          <th>Финансирование</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in filteredStudents" :key="student.id"
          @click="$router.push({ name: 'StudentPaymentCalendar', params: { id: student.id } })" class="cursor-pointer">
          <td>
            <div
              class=" w-6 h-6 rounded-md bg-[#F1EFFF] text-[rgb(98,82,254)] text-xs font-semibold flex items-center justify-center">
              {{ index + 1 }}
            </div>
          </td>
          <td>{{ student.name }}</td>
          <td>{{ student.iin }}</td>
          <td>{{ student.source }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Тип для студента
interface Student {
  id: number
  name: string
  iin: string
  source: string
  status: string
  paid: number
  remaining: number
  debt: boolean
}

// Реактивные переменные
const search = ref('')
const filtersVisible = ref(false)

const selectedFundingTypes = ref<string[]>([])
const selectedStatus = ref('')
const withDebt = ref(false)

const showFundingType = ref(false)
const showStatusDropdown = ref(false)
const showCourseDropdown = ref(false)
const showStartPicker = ref(false)
const showEndPicker = ref(false)

// Опции фильтров
const fundingTypes = ['TechOrda', 'Скидка 70%', 'Скидка 30%', 'Внутренний грант', 'Полная оплата']
const statusOptions = ['Студент', 'Выпускник']

// Список студентов
const students = ref<Student[]>([])

// Методы
const toggleFilters = () => {
  filtersVisible.value = !filtersVisible.value
}

const toggleFundingType = () => {
  showFundingType.value = !showFundingType.value
  showCourseDropdown.value = false
  showStartPicker.value = false
  showEndPicker.value = false
}

const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value
  showFundingType.value = false
}

const selectStatus = (opt: string) => {
  selectedStatus.value = opt
  showStatusDropdown.value = false
}

const selectFundingType = (option: string) => {
  const index = selectedFundingTypes.value.indexOf(option)
  if (index === -1) {
    selectedFundingTypes.value.push(option)
  } else {
    selectedFundingTypes.value.splice(index, 1)
  }
}

// Загрузка данных
onMounted(async () => {
  try {
    const res = await axios.get('/api/students')
    students.value = res.data.map((s: any) => ({
      id: s.id,
      name: s.full_name,
      iin: s.iin,
      source: s.funding_source || 'Не указано',
      status: s.status,
      paid: s.paid_amount,
      remaining: s.amount_remaining,
      debt: s.amount_remaining > 0
    }))
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error)
  }
})

// Фильтрация студентов
const filteredStudents = computed(() =>
  students.value
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.value.toLowerCase())
      const matchesFunding = selectedFundingTypes.value.length === 0 || selectedFundingTypes.value.includes(s.source)
      const matchesStatus = !selectedStatus.value || s.status === selectedStatus.value
      const matchesDebt = !withDebt.value || s.debt
      return matchesSearch && matchesFunding && matchesStatus && matchesDebt
    })
    .sort((a, b) => a.id - b.id)
)
</script>




<!-- Script -->
<style scoped>
.student-payments {
  padding: 30px;
  font-family: 'Inter', sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.top-bar h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.search-input {
  padding: 10px 15px 10px 38px;
  font-size: 14px;
  border-radius: 10px;
  background-color: #F1EFFF;
  width: 500px;
  outline: none;
  color: #5a4fcf;
}

.filter-bar {
  display: flex;
  margin-bottom: 10px;
}

.filter-btn {
  background-color: #f4f0ff;
  color: #6252FE;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
}

.filter-icon {
  width: 18px;
  height: 18px;
}

.filters-box {
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

.filter-select {
  background: #FFFFFF;
  color: #6252FE;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  text-align: left;
}

.checkbox-style {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  min-height: 40px;
  gap: 8px;
  color: #6252FE;
  background-color: #FFFFFF;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  border: #F1EFFF;
  border-radius: 10px;
  overflow: hidden;
  background-color: #FFFFFF;
}

.student-table thead {
  background-color: #F1EFFF;
  font-weight: 600;
}

.student-table th,
.student-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: white;
  color: #6252FE;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s, color 0.2s;
}

.filter-btn:hover {
  background-color: rgba(98, 82, 254, 0.1);
}

.filter-btn--active {
  background-color: #6252FE;
  color: white;
  border-color: #6252FE;
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.filter-btn--active .filter-icon {
  filter: brightness(0) invert(1);
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.filter-button-wrapper {
  background-color: #F1EFFF;
  border-radius: 12px;
  padding-top: 9px;
  margin-bottom: 20px;
  margin-left: 0px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
</style>