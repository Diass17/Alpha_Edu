<template>
  <div>
    <!-- КОНТЕНТ: покажем, только когда student не null -->
    <div v-if="student" class="p-6 font-inter">

      <!-- Аватар + имя -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 mb-3 rounded-full border-2 border-purple-200"></div>
        <h2 class="text-2xl font-bold">{{ student.name }}</h2>
      </div>

      <!-- Блок 1: Информация о студенте -->
      <div class="mb-6 w-full rounded-xl border border-[#E0D7FF] overflow-visible">
        <table class="w-full text-left">
          <thead class="bg-[rgb(185,179,248)] text-sm font-semibold">
            <tr>
              <th class="px-6 py-3 rounded-tl-lg">Данные</th>
              <th class="px-6 py-3 rounded-tr-lg">Информация о студенте</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6E3F1]">
            <tr>
              <td class="px-6 py-2">ИИН</td>
              <td class="px-6 py-2">{{ student.iin }}</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Email</td>
              <td class="px-6 py-2">{{ student.email }}</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Телефон</td>
              <td class="px-6 py-2">{{ student.phone }}</td>
            </tr>
            <!-- Статус -->
            <tr>
              <td class="px-6 py-2">Статус</td>
              <td class="px-6 py-2">
                <div class="relative w-48">
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
                    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
                  >
                    <li
                      v-for="opt in statusOptions"
                      :key="opt"
                      @click="selectStatus(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === opt }"
                    >
                      {{ opt }}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <!-- Top Student -->
            <tr>
              <td class="px-6 py-2">Top Student</td>
              <td class="px-6 py-2">
                <input
                  type="checkbox"
                  v-model="topStudent"
                  class="h-5 w-5 text-green-500 border-gray-300 rounded"
                />
              </td>
            </tr>
            <!-- Финансирование -->
            <tr>
              <td class="px-6 py-2">Финансирование</td>
              <td class="px-6 py-2">
                <div class="relative w-48">
                  <button
                    @click="toggleFinancingDropdown"
                    class="filter-select w-full flex justify-between items-center"
                  >
                    {{ selectedFinancing || 'Финансирование' }}
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <ul
                    v-if="showFinancingDropdown"
                    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
                  >
                    <li
                      v-for="opt in financingOptions"
                      :key="opt"
                      @click="selectFinancing(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFinancing === opt }"
                    >
                      {{ opt }}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Блок 2: Сводка платежей -->
      <div class="mb-6 w-full rounded-xl border border-[#E0D7FF] overflow-visible">
        <table class="w-full text-left">
          <thead class="bg-[rgb(185,179,248)] text-sm font-semibold">
            <tr>
              <th class="px-6 py-3 rounded-tl-lg">Оплата за курс</th>
              <th class="px-6 py-3 rounded-tr-lg">
                {{ student.totalCoursePrice.toLocaleString('ru-RU') }} ₸
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6E3F1]">
            <tr>
              <td class="px-6 py-2">Сумма со скидкой {{ student.discountPercent }}%</td>
              <td class="px-6 py-2">{{ student.discountedPrice.toLocaleString('ru-RU') }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Период оплаты</td>
              <td class="px-6 py-2">{{ student.paymentPeriod }}</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма оплачено</td>
              <td class="px-6 py-2">{{ student.amountPaid.toLocaleString('ru-RU') }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма к оплате</td>
              <td class="px-6 py-2">{{ student.amountDue.toLocaleString('ru-RU') }} ₸</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Переключатель режимов -->
      <div class="mt-14 mb-6">
        <div class="bg-[rgb(185,179,248)] p-2 rounded-lg">
          <div class="flex space-x-3">
            <button
              :class="mode === 'calendar' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
              @click="mode = 'calendar'"
            >
              Календарь платежей
            </button>
            <button
              :class="mode === 'history' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
              @click="mode = 'history'"
            >
              История платежей
            </button>
          </div>
        </div>
      </div>

      <!-- Календарь платежей -->
      <div v-if="mode === 'calendar'" class="mt-6 grid grid-cols-4 gap-4">
        <div
          v-for="(item, i) in student.paymentSchedule"
          :key="i"
          class="flex items-center bg-[rgb(194,189,250)] rounded-lg p-4"
        >
          <div class="p-1 mr-4 flex-shrink-0 bg-[#6252FE] rounded border-2 border-white">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <div class="text-sm font-semibold leading-tight">{{ formatDate(item.date) }}</div>
            <div class="text-xs text-[#6252FE]">{{ item.paid ? 'Погашен' : 'Не погашен' }}</div>
          </div>
          <div class="ml-auto bg-white rounded-lg px-4 py-2 text-sm font-semibold">
            {{ item.amount.toLocaleString('ru-RU') }} ₸
          </div>
        </div>
      </div>

      <!-- История платежей -->
      <div v-else-if="mode === 'history'" class="space-y-6">
        <table class="w-full border border-purple-200 rounded-lg overflow-hidden text-left">
          <thead class="bg-[rgb(185,179,248)] text-sm font-semibold">
            <tr>
              <th class="px-4 py-2">Дата платежа</th>
              <th class="px-4 py-2">Комментарий</th>
              <th class="px-4 py-2">Статус</th>
              <th class="px-4 py-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in student.paymentSchedule"
              :key="i"
              class="border-t bg-white"
            >
              <td class="px-4 py-2">{{ formatDate(item.date) }}</td>
              <td class="px-4 py-2">{{ item.comment || `Платёж ${i+1}` }}</td>
              <td class="px-4 py-2">
                <span :class="item.paid ? 'status-paid' : 'status-unpaid'">
                  {{ item.paid ? 'Оплачен' : 'Не оплачен' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ item.amount.toLocaleString('ru-RU') }} ₸</td>
            </tr>
          </tbody>
        </table>

        <!-- Кнопка «Добавить платёж» -->
        <div v-if="!showAddPanel" class="flex justify-end">
          <button @click="onAddPayment" class="add-payment-btn" type="button">
            Добавить платёж
          </button>
        </div>

        <!-- Форма добавления платежа -->
        <div
          v-else
          class="bg-[rgb(185,179,248)] p-6 rounded-lg flex items-center space-x-4"
        >
          <div class="w-56">
            <Datepicker
              v-model="newPayment.date"
              placeholder="Дата платежа"
              format="dd.MM.yyyy"
              :input-class="'filter-select w-full'"
              :enable-time-picker="false"
            />
          </div>
          <div class="w-56">
            <input
              v-model="newPayment.comment"
              type="text"
              placeholder="Комментарий"
              class="filter-select w-full"
            />
          </div>
          <div class="w-56">
            <select v-model="newPayment.status" class="filter-select w-full">
              <option value="" disabled>Статус</option>
              <option v-for="opt in historyStatusOptions" :key="opt">
                {{ opt }}
              </option>
            </select>
          </div>
          <div class="w-56">
            <input
              v-model.number="newPayment.amount"
              type="number"
              placeholder="Сумма"
              class="filter-select w-full"
            />
          </div>
          <div class="flex space-x-2 ml-auto">
            <button
              @click="saveNewPayment"
              class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              type="button"
            >
              Сохранить
            </button>
            <button
              @click="showAddPanel = false"
              class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              type="button"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Загрузка, когда student ещё null -->
    <div v-else class="text-center py-10">Загрузка...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import Datepicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import { Student } from '@/store/studentStore' // ✅ обычный импорт, не `import type`

interface PaymentScheduleItem {
  date: string
  amount: number
  paid: boolean
  comment?: string
}

type DetailedStudent = Student & {
  totalCoursePrice: number
  discountPercent: number
  discountedPrice: number
  paymentPeriod: string
  amountPaid: number
  amountDue: number
  paymentSchedule: PaymentScheduleItem[]
}

interface RouteProps { id: string }
const props = defineProps<RouteProps>()
const store = useStudentStore()

const student = ref<DetailedStudent | null>(null) // ✅ Тип исправлен
const mode = ref<'calendar' | 'history'>('calendar')

// UI-состояния
const statusOptions = ['Студент', 'Выпускник']
const selectedStatus = ref<string>('')
const showStatusDropdown = ref(false)
const topStudent = ref(false)

const financingOptions = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант']
const selectedFinancing = ref<string>('')
const showFinancingDropdown = ref(false)

const historyStatusOptions = ['Оплачен', 'Не оплачен']

const showAddPanel = ref(false)
const newPayment = reactive<{ date?: Date; comment: string; status: string; amount: number | null }>({
  date: undefined, comment: '', status: '', amount: null
})

// Выпадающие списки
function toggleStatusDropdown() {
  showStatusDropdown.value = !showStatusDropdown.value
  showFinancingDropdown.value = false
}
function selectStatus(opt: string) {
  selectedStatus.value = opt
  showStatusDropdown.value = false
}
function toggleFinancingDropdown() {
  showFinancingDropdown.value = !showFinancingDropdown.value
  showStatusDropdown.value = false
}
function selectFinancing(opt: string) {
  selectedFinancing.value = opt
  showFinancingDropdown.value = false
}
function onAddPayment() {
  showAddPanel.value = !showAddPanel.value
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

async function saveNewPayment() {
  if (!newPayment.date || newPayment.amount == null || !newPayment.status) return

  student.value!.paymentSchedule.push({
    date: newPayment.date.toISOString().slice(0, 10),
    amount: newPayment.amount,
    paid: newPayment.status === 'Оплачен',
    comment: newPayment.comment
  })

  newPayment.date = undefined
  newPayment.comment = ''
  newPayment.status = ''
  newPayment.amount = null
  mode.value = 'history'
  showAddPanel.value = false
}

onMounted(async () => {
  if (!store.list.length) {
    await store.fetchStudents()
  }

  const basic = store.list.find(s => s.id === +props.id)
  if (!basic) return

  student.value = {
    ...basic,
    stream: basic.stream ?? '',
    totalCoursePrice: 850000,
    discountPercent: 30,
    discountedPrice: 595000,
    paymentPeriod: '6 месяца',
    amountPaid: 595000,
    amountDue: 0,
    paymentSchedule: []
  }

  selectedStatus.value = basic.status === 'graduated' ? 'Выпускник' : 'Студент'
  topStudent.value = Boolean((basic as any).top_student)
})
</script>


<style scoped>
.filter-select {
  background: #f4f0ff;
  color: #6252FE;
  border: 1px solid #cfc0ff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.btn-primary {
  background: #6252fe;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
}
.btn-secondary {
  background: #f4f0ff;
  color: #6252FE;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
}
.status-paid {
  display: inline-block;
  background-color: #DCFCE7;
  color: #16A34A;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
.status-unpaid {
  display: inline-block;
  background-color: #FEE2E2;
  color: #DC2626;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
.add-payment-btn {
  background-color: #6252FE;
  color: #FFFFFF;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.add-payment-btn:hover {
  background-color: #5140E5;
}
</style>
