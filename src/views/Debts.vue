<template>
  <div class="p-6 font-inter">
    <h2 class="text-2xl font-bold mb-6">Задолженности</h2>

    <!-- Tabs -->
    <div class="flex space-x-4 bg-[#F1EFFF] p-3 rounded-lg mb-4">
      <router-link to="/finance/reports/total-revenue" class="tab-button">Общая выручка</router-link>
      <router-link to="/finance/reports/debts" class="tab-button-active">Задолженности</router-link>
      <router-link to="/finance/reports/student-funding" class="tab-button">Финансирование студентов</router-link>
    </div>

    <!-- Filters -->
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

      <!-- Статус (дропдаун) -->
      <div class="relative w-40 status-dropdown">
        <button @click="toggleStatusDropdown" class="filter-select w-full flex justify-between items-center"
          type="button">
          {{ selectedStatus || 'Статус' }}
          <svg
            :class="['w-4 h-4 ml-2 transform transition-transform duration-200', showStatusDropdown ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <ul v-if="showStatusDropdown" class="absolute z-50 mt-2 w-full bg-white border border-purple-200
     rounded-lg shadow-lg overflow-hidden">
          <li @click="selectStatus('Оплачен')" class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === 'Оплачен' }">
            Оплачен
          </li>
          <li @click="selectStatus('Не оплачен')" class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === 'Не оплачен' }">
            Не оплачен
          </li>
        </ul>
      </div>
      <div class="relative">
        <button @click="clearAllFilters" class="filter-select w-full flex justify-between items-center">
          Очистить фильтры
        </button>
      </div>
    </div>
    <!-- Table -->
    <table class="w-full bg-white border border-purple-200 rounded-lg overflow-hidden text-left mt-6">
      <thead class="bg-[#ECE9FF] text-sm font-semibold">
        <tr>
          <th class="px-4 py-2 w-12">№</th>
          <th class="px-4 py-2">Студент</th>
          <th class="px-4 py-2">К оплате (тг)</th>
          <th class="px-4 py-2">Дата оплаты</th>
          <th class="px-4 py-2">Статус</th>
          <th class="px-4 py-2">Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in filteredRows" :key="item.id" class="border-t">
          <td class="px-4 py-2">
            <div
              class="w-6 h-6 rounded-md bg-[#F1ECFF] text-[rgb(98,82,254)] text-xs font-semibold flex items-center justify-center">
              {{ i + 1 }}
            </div>
          </td>
          <td class="px-4 py-2">{{ item.student }}</td>
          <td class="px-4 py-2">{{ item.amount.toLocaleString('ru-RU') }}</td>
          <td class="px-4 py-2">{{ item.paymentDate }}</td>
          <td class="px-4 py-2">
            <span :class="{
              'status-unpaid': item.status === 'Не оплачен',
              'status-paid': item.status === 'Оплачен'
            }">
              {{ item.status }}
            </span>
          </td>
          <td class="px-4 py-2">{{ item.comment }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Text Summary -->
    <div class="mt-6 w-full rounded-xl overflow-hidden border border-[#E0D7FF]">
      <div class="bg-[#ECE9FF] px-6 py-4 text-sm font-semibold text-black">
        Период {{ formattedPeriod }}
      </div>
      <div class="bg-white px-6 py-4 text-sm flex justify-between border-b border-gray-200/60">
        <div>Общая сумма платежей</div>
        <div>{{ totalPayments.toLocaleString('ru-RU') }} ₸</div>
      </div>
      <div class="bg-white px-6 py-4 text-sm flex justify-between border-b border-gray-200/60">
        <div>Оплаченная сумма</div>
        <div>{{ paidAmount.toLocaleString('ru-RU') }} ₸</div>
      </div>
      <div class="bg-white px-6 py-4 text-sm flex justify-between border-b border-gray-200/60">
        <div>Неоплаченная сумма</div>
        <div>{{ unpaidAmount.toLocaleString('ru-RU') }} ₸</div>
      </div>
      <div class="bg-[#ECE9FF] px-6 py-4 text-sm font-semibold flex justify-between">
        <div>Общая задолженность</div>
        <div>{{ unpaidAmount.toLocaleString('ru-RU') }} ₸</div>
      </div>
    </div>

    <!-- Download -->
    <div class="mt-4 flex justify-end">
      <button @click="downloadExcel" class="download-btn">Сохранить в Excel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import Datepicker from 'vue3-datepicker'


// Даты и фильтры
const startDate = ref(null)
const endDate = ref(null)
const showStartPicker = ref(false)
const showEndPicker = ref(false)
const popupPosition = ref({ start: '', end: '' })

const startPickerRef = ref(null)
const endPickerRef = ref(null)

// Таблица данных
const rows = ref([])

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/debts`)
    const students = response.data

    // Параллельно загружаем paymentSchedule для каждого студента
    const updatedRows = await Promise.all(
      students.map(async (student) => {
        let status = 'Не оплачен'
        let paymentDate = '-'

        // 💡 приоритет: если amount_remaining === 0 — значит всё оплачено
        if (student.amount_remaining === 0) {
          status = 'Оплачен'
        } else {
          // иначе пробуем получить график и проверить по нему
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/students/${student.id}/payment-schedule`)
            const schedule = res.data.paymentSchedule

            if (Array.isArray(schedule) && schedule.length > 0) {
              const allPaid = schedule.every(item => item.paid)
              if (allPaid) {
                status = 'Оплачен'
              }

              const sortedByDate = schedule
                .filter(item => item.date)
                .sort((a, b) => new Date(a.date) - new Date(b.date))

              if (sortedByDate.length > 0) {
                const nextUnpaid = sortedByDate.find(item => !item.paid)
                const lastPaid = [...sortedByDate].reverse().find(item => item.paid)

                if (nextUnpaid) {
                  paymentDate = new Date(nextUnpaid.date).toLocaleDateString('ru-RU')
                } else if (lastPaid) {
                  paymentDate = new Date(lastPaid.date).toLocaleDateString('ru-RU')
                }
              }
            }
          } catch (err) {
            console.warn(`Не удалось получить график студента ID ${student.id}`, err)
          }
        }

        return {
          id: student.id,
          student: student.full_name,
          amount: student.amount_remaining,
          paidAmount: student.paid_amount || 0,
          paymentDate,
          status,
          comment: ''
        }
      })
    )

    // 🧹 Оставляем только тех, у кого есть задолженность
    rows.value = updatedRows.filter(row => row.amount > 0)
  } catch (e) {
    console.error('Ошибка при загрузке задолженностей:', e)
  }
})



onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const filteredRows = computed(() => {
  let result = [...rows.value]

  if (selectedStatus.value) {
    result = result.filter(row => row.status === selectedStatus.value)
  }

  return result.sort((a, b) => a.id - b.id)
})

function selectStatus(status) {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const totalPayments = computed(() =>
  filteredRows.value.reduce((sum, row) => sum + (row.amount || 0), 0)
)
const paidAmount = computed(() =>
  filteredRows.value.reduce((sum, row) => sum + (row.paidAmount || 0), 0)
)
const unpaidAmount = computed(() => totalPayments.value - paidAmount.value)

const formattedPeriod = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`
  }
  return 'не выбран'
})

const formatDate = (date) =>
  new Date(date).toLocaleDateString('ru-RU')

// Календарь
function toggleStartPicker(event) {
  showStartPicker.value = !showStartPicker.value

  if (showStartPicker.value) {
    showEndPicker.value = false // ✅ Закрыть другой календарь
    const rect = event.target.getBoundingClientRect()
    popupPosition.value.start = `position: absolute; top: ${rect.bottom + window.scrollY + 5}px; left: ${rect.left}px; z-index: 9999;`
  }
}
function toggleEndPicker(event) {
  showEndPicker.value = !showEndPicker.value

  if (showEndPicker.value) {
    showStartPicker.value = false // ✅ Закрыть другой календарь
    const rect = event.target.getBoundingClientRect()
    popupPosition.value.end = `position: absolute; top: ${rect.bottom + window.scrollY + 5}px; left: ${rect.left}px; z-index: 9999;`
  }
}

function toggleStatusDropdown() {
  showStatusDropdown.value = !showStatusDropdown.value
  // Закрываем календарь, если открыт
  showStartPicker.value = false
  showEndPicker.value = false
}


// Excel
const downloadExcel = () => {
  const data = filteredRows.value.map(row => ({
    Студент: row.student,
    Сумма: row.amount,
    Статус: row.status,
    Комментарий: row.comment,
  }))
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Задолженности')
  XLSX.writeFile(workbook, 'Задолженности.xlsx')
}

const selectedStatus = ref('')
const showStatusDropdown = ref(false)

function clearAllFilters() {
  startDate.value = null
  endDate.value = null
  selectedStatus.value = ''
  showStatusDropdown.value = false
}

function handleClickOutside(e) {
  const target = e.target

  if (!startPickerRef.value?.contains(target) && !target.closest('.start-picker-btn')) {
    showStartPicker.value = false
  }

  if (!endPickerRef.value?.contains(target) && !target.closest('.end-picker-btn')) {
    showEndPicker.value = false
  }

  const statusDropdown = document.querySelector('.status-dropdown')
  if (
    showStatusDropdown.value &&
    statusDropdown &&
    !statusDropdown.contains(target) &&
    !target.closest('.filter-select')
  ) {
    showStatusDropdown.value = false
  }
}
</script>

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
  background: #ffffff;
  color: #6252fe;
}

.tab-button-active {
  background: #6252fe;
  color: #ffffff;
}

.filter-select {
  background: #ffffff;
  color: #836eff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}

.datepicker-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: 10px;
  position: absolute;
  z-index: 50;
}

.status-unpaid {
  border: 1px solid #ed1c24;
  color: #ed1c24;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
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

.status-paid {
  border: 1px solid #28a745;
  color: #28a745;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
}
</style>
