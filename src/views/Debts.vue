<template>
  <div class="p-6 font-inter">
    <h2 class="text-2xl font-bold mb-6">Задолженности</h2>

<!-- Tabs -->
  <div class="flex space-x-4 bg-purple-50 p-3 rounded-lg mb-4">
    <router-link to="/finance/reports/total-revenue" class="tab-button">Общая выручка</router-link>
    <router-link to="/finance/reports/debts" class="tab-button-active">Задолженности</router-link>
    <router-link to="/finance/reports/student-funding" class="tab-button">Финансирование студентов</router-link>
  </div>
  
<!-- Filters -->
  <div class="filters-wrapper relative flex flex-wrap gap-3 mb-6">
<!-- Начало периода -->
  <div class="relative">
    <button @click="toggleStartPicker" class="filter-select w-48">
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
    <button @click="toggleEndPicker" class="filter-select w-48">
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

      <!-- Статус (дропдаун) -->
  <div class="relative w-40">
    <button
      @click="toggleStatusDropdown"
      class="filter-select w-full flex justify-between items-center"
  >
    {{ selectedStatus || 'Статус' }}
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
  <ul
    v-if="showStatusDropdown"
    class="absolute z-50 mt-2 w-full bg-white border border-purple-200
    rounded-lg shadow-lg overflow-hidden"
  >
  <li
    @click="selectStatus('Оплачен')"
    class="cursor-pointer px-4 py-2 hover:bg-gray-100"
    :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === 'Оплачен' }"
  >
    Оплачен
  </li>
  <li
    @click="selectStatus('Не оплачен')"
    class="cursor-pointer px-4 py-2 hover:bg-gray-100"
    :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === 'Не оплачен' }"
  >
    Не оплачен
  </li>
</ul>
</div>
</div>

<!-- Table -->
<table class="w-full border border-purple-200 rounded-lg overflow-hidden text-left">
  <thead class="bg-[rgb(185,179,248)] text-sm font-semibold">
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
  <tr v-for="(item, i) in filteredRows" :key="i" class="border-t">
<!-- Нумерация -->
  <td class="px-4 py-2">
    <div class=" w-6 h-6 rounded-md bg-[#F1ECFF] text-[rgb(98,82,254)] text-xs font-semibold flex items-center justify-center">
      {{ i + 1 }}
    </div>
  </td>
    <td class="px-4 py-2">{{ item.student }}</td>
    <td class="px-4 py-2">{{ item.amount }}</td>
    <td class="px-4 py-2">{{ item.paymentDate }}</td>
    <td class="px-4 py-2">
  <span :class="item.status === 'Оплачен' ? 'status-paid' : 'status-unpaid'">
    {{ item.status }}
  </span>
  </td>
  <td class="px-4 py-2">{{ item.comment }}</td>
  </tr>
</tbody>
</table>

<!-- Text Box for Debts -->
<div class="mt-6 w-full rounded-xl overflow-hidden border border-[#E0D7FF]">
<!-- Период -->
<div class="bg-[rgb(185,179,248)] px-6 py-4 text-sm font-semibold text-black">
  Период {{ formattedPeriod }}
</div>
<!-- Общая сумма платежей -->
<div class="bg-white px-6 py-4 text-sm flex justify-between items-center border-b border-gray-200/60">
  <div>Общая сумма платежей</div>
  <div>{{ totalPayments.toLocaleString('ru-RU') }} ₸</div>
</div>
<!-- Оплаченная сумма -->
<div class="bg-white px-6 py-4 text-sm flex justify-between items-center border-b border-gray-200/60">
  <div>Оплаченная сумма</div>
  <div>{{ paidAmount.toLocaleString('ru-RU') }} ₸</div>
</div>
<!-- Неоплаченная сумма -->
<div class="bg-white px-6 py-4 text-sm flex justify-between items-center border-b border-gray-200/60">
  <div>Неоплаченная сумма</div>
  <div>{{ unpaidAmount.toLocaleString('ru-RU') }} ₸</div>
</div>
<!-- Общая задолженность -->
<div class="bg-[rgb(185,179,248)] px-6 py-4 text-sm font-semibold flex justify-between items-center">
  <div>Общая задолженность</div>
  <div>{{ unpaidAmount.toLocaleString('ru-RU') }} ₸</div>
</div>
</div>

<!-- Download Button -->
<div class="mt-4 flex justify-end">
  <button @click="downloadExcel" class="download-btn">
    Сохранить в Excel
  </button>
  </div>
</div>
</template>

<!-- Script -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Datepicker from 'vue3-datepicker'
import * as XLSX from 'xlsx'

const startDate = ref(null)
const endDate = ref(null)
const selectedStatus = ref('')
const showStartPicker = ref(false)
const showEndPicker = ref(false)
const startPickerRef = ref(null)
const endPickerRef = ref(null)
const popupPosition = ref({ start: '', end: '' })
const showStatusDropdown = ref(false)


function toggleStatusDropdown() {
  showStatusDropdown.value = !showStatusDropdown.value
}

function selectStatus(status) {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

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
  if (
    (startPickerRef.value && !startPickerRef.value.contains(event.target)) &&
    (endPickerRef.value && !endPickerRef.value.contains(event.target))
  ) {
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
    const rowDate = new Date(row.paymentDate.split('.').reverse().join('-'))
    const inPeriod = (!startDate.value || rowDate >= startDate.value) && (!endDate.value || rowDate <= endDate.value)
    const statusMatch = !selectedStatus.value || row.status === selectedStatus.value
    return inPeriod && statusMatch
  })
})

const totalAmount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return filteredRows.value.reduce((sum, row) => {
    return sum + Number(row.amount.replace('.', '').replace(',', '.'))
  }, 0)
})

const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredRows.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Задолженности')
  XLSX.writeFile(workbook, 'Задолженности.xlsx')
}

const rows = [
  { student: 'Сеитов А.К.', amount: '150.000', paymentDate: '13.06.2025', status: 'Оплачен', comment: 'Рассрочка, 2 платеж' },
  { student: 'Муратова И.Н.', amount: '120.000', paymentDate: '31.06.2025', status: 'Не оплачен', comment: 'Напоминание отправлено' },
  { student: 'Ахметов Е.М.', amount: '90.000', paymentDate: '31.06.2025', status: 'Не оплачен', comment: 'Рассрочка, 3 платеж' },
  { student: 'Ким А.С.', amount: '550.000', paymentDate: '29.06.2025', status: 'Не оплачен', comment: 'Рассрочка, 4 платеж' },
  { student: 'Жанабаева Р.Ш.', amount: '45.000', paymentDate: '28.06.2025', status: 'Оплачен', comment: '3/4 оплачено' },
  { student: 'Сергеев Д.И.', amount: '77.000', paymentDate: '28.06.2025', status: 'Оплачен', comment: '1/2 оплачено' },
  { student: 'Имангазин А.А.', amount: '39.000', paymentDate: '28.06.2025', status: 'Не оплачен', comment: 'Рассрочка, 1 платеж' },
  { student: 'Каиров К.А.', amount: '39.000', paymentDate: '28.06.2025', status: 'Не оплачен', comment: 'Рассрочка, 1 платеж' },
  { student: 'Амагелди С.В.', amount: '45,000', paymentDate: '28.06.2025', status: 'Оплачен', comment: 'Рассрочка, 1 платеж' },
  { student: 'Бейсенова С.А.', amount: '39.000', paymentDate: '28.06.2025', status: 'Не оплачен', comment: 'Рассрочка, 3 платеж' },
  { student: 'Сеитов Д.Ш.', amount: '100,000', paymentDate: '28.06.2025', status: 'Оплачен', comment: '1/2 оплачено' },
]

const totalPayments = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  return filteredRows.value.reduce((sum, row) => sum + parseInt(row.amount.replace(/\D/g, '')) || 0, 0);
});

const paidAmount = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  return filteredRows.value
    .filter(row => row.status === 'Оплачен')
    .reduce((sum, row) => sum + parseInt(row.amount.replace(/\D/g, '')) || 0, 0);
});

const unpaidAmount = computed(() => totalPayments.value - paidAmount.value);

</script>

<!--Styles-->
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
  color: #836eff;
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
.status-paid {
  border: 1px solid #00b050;
  color: #00b050;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
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
</style>