<template>
  <div class="p-6 font-inter">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold mb-6">Финансирование студентов</h2>

      <!-- Поисковик -->
      <div class="search-wrapper">
        <img src="@/assets/logos/search.png" class="search-icon" />
        <input v-model="search" type="text" placeholder="Поиск" class="search-input" />
      </div>
    </div>

    <!-- Кнопки фильтрации вкладок -->
    <div class="flex space-x-4 bg-[#F1EFFF] p-3 rounded-lg mb-4">
      <router-link to="/finance/reports/total-revenue" class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/total-revenue' }">
        Общая выручка</router-link>
      <router-link to="/finance/reports/debts" class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/debts' }">
        Задолженности</router-link>
      <router-link to="/finance/reports/student-funding" class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/student-funding' }">
        Финансирование студентов</router-link>
    </div>

    <!-- Фильтры -->
    <div class="filters-wrapper relative flex flex-wrap gap-3 mb-6">

      <!-- Тип финансирования -->
      <!-- Тип финансирования -->
      <div class="relative w-56">
        <button @click="toggleFundingType" class="filter-select w-full flex justify-between items-center funding-btn"
          type="button">
          {{ selectedFundingTypes.length ? selectedFundingTypes.join(', ') : 'Тип финансирования' }}
          <svg
            :class="['w-4 h-4 ml-2 transform transition-transform duration-200', showFundingType ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <ul v-if="showFundingType"
          class="funding-dropdown absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <li v-for="option in fundingTypes" :key="option" @click="selectFundingType(option)"
            class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
            <span :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFundingTypes.includes(option) }">
              {{ option }}
            </span>
            <span v-if="selectedFundingTypes.includes(option)" class="text-[rgb(98,82,254)]">✔</span>
          </li>
        </ul>
      </div>


      <!-- Очистить фильтры -->
      <div class="relative">
        <button @click="clearFilters" class="filter-select w-full flex justify-between items-center coverage-btn"
          type="button">
          Очистить фильтры
        </button>
      </div>

    </div>

    <!-- Таблица студентов -->
    <table class="w-full bg-white text-left border border-purple-200 rounded-lg overflow-hidden">
      <thead class="bg-[#ECE9FF] text-sm font-semibold">
        <tr>
          <th class="px-4 py-2 w-12">№</th>
          <th class="px-4 py-2">Студент</th>
          <th class="px-4 py-2">Тип финансирования</th>
          <th class="px-4 py-2">Стоимость обучения (тг)</th>
          <th class="px-4 py-2">Cумма скидки (тг)</th>
          <th class="px-4 py-2">К оплате (тг)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in filteredStudents" :key="i" class="border-t">
          <td class="px-4 py-2">
            <span
              class="inline-block bg-[#F1ECFF] text-[#6252FE] font-semibold text-xs rounded-full w-6 h-6 text-center leading-6">
              {{ i + 1 }}
            </span>
          </td>
          <td class="px-4 py-2">{{ s.name }}</td>
          <td class="px-4 py-2">{{ s.funding }}</td>
          <td class="px-4 py-2">{{ s.total }}</td>
          <td class="px-4 py-2">{{ s.covered }}</td>
          <td class="px-4 py-2">{{ s.pay }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Итоговая таблица -->
    <div class="mt-6 w-full bg-white overflow-hidden rounded-xl border border-[#E0D7FF]">
      <table class="w-full text-sm text-left border-collapse">
        <thead>
          <tr class="bg-[#ECE9FF] font-semibold divide-x divide-[#E0D7FF]">
            <th class="px-4 py-2">Тип финансирования</th>
            <th class="px-4 py-2">Кол-во студентов</th>
            <th class="px-4 py-2">Покрытие (%)</th>
            <th class="px-4 py-2">Общая сумма скидки (тг)</th>
            <th class="px-4 py-2">Всего оплачено студентами (тг)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF]">
          <tr v-for="(group, i) in fundingSummary" :key="i" class="divide-x divide-[#E0D7FF]">
            <td class="px-4 py-2">{{ group.type }}</td>
            <td class="px-4 py-2">{{ group.count }}</td>
            <td class="px-4 py-2">{{ group.percent }}</td>
            <td class="px-4 py-2">{{ group.covered }}</td>
            <td class="px-4 py-2">{{ group.paid }}</td>
          </tr>
          <tr class="bg-[#ECE9FF] font-semibold divide-x divide-[#E0D7FF]">
            <td class="px-4 py-2">Итого</td>
            <td class="px-4 py-2">{{ fundingTotal.count }}</td>
            <td class="px-4 py-2">-</td>
            <td class="px-4 py-2">{{ fundingTotal.covered }}</td>
            <td class="px-4 py-2">{{ fundingTotal.paid }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка Сохранить Excel -->
    <div class="mt-4 flex justify-end">
      <button @click="downloadExcel" class="download-btn">Сохранить в Excel</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

const fundingTypes = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант', 'Полная оплата']

const selectedFundingTypes = ref([])
const showFundingType = ref(false)

const students = ref([])

const search = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('/api/students')
    document.addEventListener('click', handleClickOutside)
    students.value = res.data.map(s => {
      const total = s.total_cost || 0

      // Определяем процент покрытия
      let percentNumber = 0
      let percentLabel = '0%'

      if (s.funding_source === 'TechOrda' || s.funding_source === 'Внутренний грант') {
        percentNumber = 100
        percentLabel = '100%'
      } else if (s.funding_source === 'Скидка 70%') {
        percentNumber = 70
        percentLabel = '70%'
      } else if (s.funding_source === 'Скидка 30%') {
        percentNumber = 30
        percentLabel = '30%'
      } else if (s.funding_source === 'Полная оплата') {
        percentNumber = 0
        percentLabel = '-'
      }

      const covered = Math.round(total * percentNumber / 100)

      // 👇 Используй реальное значение paid_amount, если оно есть
      const paidByStudent = typeof s.paid_amount === 'number'
        ? s.paid_amount
        : total - covered

      return {
        name: s.full_name,
        funding: s.funding_source || 'Не указано',
        percent: percentLabel,
        total: total.toLocaleString('ru-RU'),
        covered: covered.toLocaleString('ru-RU'),
        pay: paidByStudent.toLocaleString('ru-RU'),
        raw: {
          covered,
          pay: paidByStudent
        }
      }
    })
  } catch (error) {
    console.error('Ошибка при получении данных студентов:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})


const fundingOrder = {
  'TechOrda': 1,
  'Скидка 70%': 2,
  'Скидка 30%': 3,
  'Внутренний грант': 4
}

const filteredStudents = computed(() => {
  return students.value
    .filter(s => {
      const matchType = selectedFundingTypes.value.length === 0 || selectedFundingTypes.value.includes(s.funding)
      return matchType
    })
    .sort((a, b) => {
      return (fundingOrder[a.funding] || 99) - (fundingOrder[b.funding] || 99)
    })
})


function toggleFundingType() {
  showFundingType.value = !showFundingType.value
}

function selectFundingType(option) {
  const index = selectedFundingTypes.value.indexOf(option)
  if (index === -1) {
    selectedFundingTypes.value.push(option)
  } else {
    selectedFundingTypes.value.splice(index, 1)
  }
}



const fundingSummary = computed(() => {
  const groups = {}

  for (const s of filteredStudents.value) {
    if (!groups[s.funding]) {
      groups[s.funding] = {
        type: s.funding,
        count: 0,
        percentList: [],
        covered: 0,
        paid: 0
      }
    }

    groups[s.funding].count++
    groups[s.funding].percentList.push(s.percent)
    groups[s.funding].covered += s.raw.covered || 0
    groups[s.funding].paid += s.raw.pay || 0
  }

  return Object.values(groups).map(g => {
    const uniquePercents = [...new Set(g.percentList)]
    return {
      type: g.type,
      count: g.count,
      percent: uniquePercents.length === 1 ? uniquePercents[0] : '-',
      covered: g.covered.toLocaleString('ru-RU'),
      paid: g.paid.toLocaleString('ru-RU')
    }
  })
})

function handleClickOutside(e) {
  const target = e.target

  const fundingDropdown = document.querySelector('.funding-dropdown')
  const fundingBtn = document.querySelector('.funding-btn')

  const percentDropdown = document.querySelector('.coverage-dropdown')
  const percentBtn = document.querySelector('.coverage-btn')

  if (
    showFundingType.value &&
    !document.querySelector('.funding-dropdown')?.contains(target) &&
    !document.querySelector('.funding-btn')?.contains(target)
  ) {
    showFundingType.value = false
  }


  if (
    showCoveragePercent.value &&
    !percentDropdown?.contains(target) &&
    !percentBtn?.contains(target)
  ) {
    showCoveragePercent.value = false
  }
}

function clearFilters() {
  selectedFundingTypes.value = []
  showFundingType.value = false
}




const fundingTotal = computed(() => {
  let count = 0
  let covered = 0
  let paid = 0

  for (const s of filteredStudents.value) {
    count++
    covered += s.raw.covered || 0
    paid += s.raw.pay || 0
  }

  return {
    count,
    covered: covered.toLocaleString('ru-RU'),
    paid: paid.toLocaleString('ru-RU')
  }
})

function downloadExcel() {
  const ws = XLSX.utils.json_to_sheet(
    filteredStudents.value.map(s => ({
      Студент: s.name,
      'Тип финансирования': s.funding,
      'Стоимость обучения': s.total,
      'Сумма покрытия': s.covered,
      'К оплате': s.pay
    }))
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Финансирование')
  XLSX.writeFile(wb, 'Финансирование.xlsx')
}

const filteredRows = computed(() => {
  const endPlusOne = endDate.value
    ? new Date(endDate.value.getFullYear(), endDate.value.getMonth(), endDate.value.getDate() + 1)
    : null

  return rows.value.filter(row => {
    const date = new Date(row.date.split('.').reverse().join('-'))

    const inRange =
      (!startDate.value || date >= startDate.value) &&
      (!endPlusOne || date < endPlusOne)

    const courseMatch = !selectedCourse.value || row.course === selectedCourse.value
    const fundingMatch =
      selectedFundingTypes.value.length === 0 ||
      selectedFundingTypes.value.includes(row.payment)

    const searchMatch = row.student.toLowerCase().includes(search.value.toLowerCase())

    return inRange && courseMatch && fundingMatch && searchMatch
  })
})

</script>

<!-- Styles -->
<style scoped>
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

.tab-button {
  background: #FFFFFF;
  color: #6252FE;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
}

.tab-button-active {
  background: #6252FE;
  color: #FFFFFF;
}

.download-btn:hover {
  background-color: #5140e5;
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

.search-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 6px 12px;
  border: 1px solid #e0d7ff;
  width: 250px;
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #121926;
}
</style>