<template>
  <div class="p-6 font-inter">
    <!-- Загрузка -->
    <div v-if="!student" class="text-center py-10">Загрузка...</div>
    <div v-else>

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
                    <li v-for="opt in statusOptions" :key="opt" @click="selectStatus(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === opt }">
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
                <input type="checkbox" v-model="topStudent" class="h-5 w-5 text-green-500 border-gray-300 rounded" />
              </td>
            </tr>

            <!-- Финансирование -->
            <tr>
              <td class="px-6 py-2">Финансирование</td>
              <td class="px-6 py-2">
                <div class="relative w-48">
                  <button @click="toggleFinancingDropdown"
                    class="filter-select w-full flex justify-between items-center" type="button">
                    {{ selectedFinancing || 'Финансирование' }}
                    <svg :class="[
                      'w-4 h-4 ml-2 transform transition-transform duration-200',
                      showFinancingDropdown ? 'rotate-180' : ''
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul v-if="showFinancingDropdown"
                    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg">
                    <li v-for="opt in financingOptions" :key="opt" @click="selectFinancing(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFinancing === opt }">
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
              <th class="px-6 py-3 rounded-tr-lg">{{ student.totalCoursePrice.toLocaleString('ru-RU') }} ₸</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6E3F1]">
            <tr>
              <td class="px-6 py-2">Сумма со скидкой {{ student.discountPercent }}%</td>
              <td class="px-6 py-2">{{ student.discountedPrice.toLocaleString('ru-RU') }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Период оплаты</td>
              <td class="px-6 py-2">{{ formatPaymentPeriod(student.paymentPeriod) }}</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма оплачено</td>
              <td class="px-6 py-2">{{ amountDue.toLocaleString('ru-RU') }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма к оплате</td>
              <td class="px-6 py-2">{{ amountPaid.toLocaleString('ru-RU') }} ₸</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Переключатель режимов -->
      <div class="mt-14 mb-6">
        <div class="bg-[rgb(185,179,248)]  p-2 rounded-lg">
          <div class="flex space-x-3">
            <button :class="mode === 'calendar' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
              @click="mode = 'calendar'">
              Календарь платежей
            </button>
            <button :class="mode === 'history' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
              @click="mode = 'history'">
              История платежей
            </button>
          </div>
        </div>
      </div>

      <!-- Карточки платежей -->
      <div v-if="mode === 'calendar'" class="mt-6 grid grid-cols-4 gap-4">
        <div v-for="(item, i) in student.paymentSchedule" :key="i"
          class="flex items-center bg-[rgb(194,189,250)] rounded-lg p-4">
          <!-- Блок с галочкой -->
          <!-- Кнопка-галочка с фиксированным размером -->
          <button @click="togglePaymentStatus(i)" class="w-7 h-7 mr-4 flex items-center justify-center rounded border-2"
            :class="item.paid ? 'bg-[#6252FE] border-white' : 'bg-white border-gray-300'">
            <svg v-if="item.paid" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>



          <!-- Дата и статус -->
          <div class="flex flex-col">
            <div class="text-sm font-semibold leading-tight">{{ formatDate(item.date) }}</div>
            <div class="text-xs text-[#6252FE]">{{ item.paid ? 'Погашен' : 'Не погашен' }}</div>
          </div>

          <!-- Сумма -->
          <div class="ml-auto bg-white rounded-lg px-4 py-2 text-sm font-semibold">
            {{ item.amount.toLocaleString('ru-RU') }} ₸
          </div>
        </div>
      </div>

      <!--Режим «История платежей» -->
      <div v-else-if="mode === 'history'" class="space-y-6">
        <!-- Таблица с историей платежей (осталась на месте сверху) -->
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
            <tr v-for="(item, i) in student.paymentSchedule" :key="i" class="border-t bg-white">
              <td class="px-4 py-2">{{ formatDate(item.date) }}</td>
              <td class="px-4 py-2">{{ item.comment || `Платёж ${i + 1}` }}</td>
              <td class="px-4 py-2">
                <span :class="item.paid ? 'status-paid' : 'status-unpaid'">
                  {{ item.paid ? 'Оплачен' : 'Не оплачен' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ item.amount.toLocaleString('ru-RU') }} ₸</td>
            </tr>
          </tbody>
        </table>

        <!-- 1) Кнопка «Добавить платёж» -->
        <div v-if="!showAddPanel" class="flex justify-end">
          <button @click="onAddPayment" class="add-payment-btn" type="button">
            Добавить платёж
          </button>
        </div>

        <!-- 2) Форма добавления платежа в синем контейнере -->
        <div v-else class=" bg-[rgb(185,179,248)] p-6 rounded-lg flex items-center space-x-4">
          <!-- Дата платежа -->
          <div class="w-56">
            <Datepicker v-model="newPayment.date" placeholder="Дата платежа" format="dd.MM.yyyy"
              :input-class="'filter-select w-full'" :enable-time-picker="false" />
          </div>

          <!-- Комментарий -->
          <div class="w-56">
            <input v-model="newPayment.comment" type="text" placeholder="Комментарий"
              class="filter-select w-full focus:outline-none focus:ring-2 focus:ring-[#9a8ffd]" />
          </div>

          <!-- Статус оплаты (в выпадающем списке) -->
          <div class="relative w-40">
            <button @click="toggleNewStatusDropdown" class="filter-select w-full flex justify-between items-center"
              type="button">
              {{ newPayment.status || 'Статус' }}
              <svg :class="[
                'w-4 h-4 ml-2 transform transition-transform duration-200',
                showNewStatusDropdown ? 'rotate-180' : ''
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="showNewStatusDropdown" class="absolute z-50 mt-2 w-full bg-white border border-purple-200
           rounded-lg shadow-lg overflow-hidden">
              <li @click="selectNewStatus('Оплачен')" class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                :class="{ 'text-[rgb(98,82,254)] font-medium': newPayment.status === 'Оплачен' }">
                Оплачен
              </li>
              <li @click="selectNewStatus('Не оплачен')" class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                :class="{ 'text-[rgb(98,82,254)] font-medium': newPayment.status === 'Не оплачен' }">
                Не оплачен
              </li>
            </ul>
          </div>

          <!-- Сумма -->
          <div class="w-56">
            <input v-model.number="newPayment.amount" type="number" placeholder="Сумма"
              class="filter-select w-full focus:outline-none focus:ring-2 focus:ring-[#9a8ffd]" />
          </div>

          <!-- Кнопки Сохранить / Отмена -->
          <div class="flex space-x-2 ml-auto">
            <button @click="saveNewPayment" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              type="button">
              Сохранить
            </button>
            <button @click="showAddPanel = false" class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              type="button">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- Script -->
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import Datepicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import axios from 'axios'

interface ScheduleItem {
  date: string
  amount: number
  paid: boolean
  comment?: string
}

interface Student {
  id: number
  name: string
  iin: string
  stream: string
  status: string
  email: string
  phone: string
  totalCoursePrice: number
  discountPercent: number
  discountedPrice: number
  paymentPeriod: number
  amountPaid: number
  amountDue: number
  paymentSchedule: ScheduleItem[]
}

interface RouteProps { id: string }
const props = defineProps<RouteProps>()

// Хранилище
const store = useStudentStore()

// Основные состояния
const student = ref<Student | null>(null)
const mode = ref<'calendar' | 'history'>('calendar')

// Выпадающий список статуса
const statusOptions = ['Студент', 'Выпускник']
const selectedStatus = ref('')
const showStatusDropdown = ref(false)

// Флаг "Top Student"
const topStudent = ref(false)

// Выпадающий список финансирования
const financingOptions = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант']
const selectedFinancing = ref('')
const showFinancingDropdown = ref(false)

// Форма добавления платежа
const showAddPanel = ref(false)
const showNewStatusDropdown = ref(false)
const newPayment = reactive({
  date: undefined as Date | undefined,
  comment: '',
  status: '',
  amount: null as number | null
})

// Методы переключения
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

function toggleNewStatusDropdown() {
  showNewStatusDropdown.value = !showNewStatusDropdown.value
}

function selectNewStatus(opt: string) {
  newPayment.status = opt
  showNewStatusDropdown.value = false
}

function onAddPayment() {
  showAddPanel.value = !showAddPanel.value
}

const amountPaid = computed(() => {
  if (!student.value) return 0
  // Теперь считаем только НЕоплаченные платежи
  return student.value.paymentSchedule.reduce((sum, item) => {
    return !item.paid ? sum + item.amount : sum
  }, 0)
})

const amountDue = computed(() => {
  if (!student.value) return 0
  return student.value.discountedPrice - amountPaid.value
})


// Форматирование даты
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatPaymentPeriod(val: number | null | undefined): string {
  if (!val || val === 0) return 'Оплачено полностью'
  if (val === 1) return '1 месяц'
  return `${val} месяцев`
}


// Добавление нового платежа
function saveNewPayment() {
  if (!student.value || !newPayment.date || !newPayment.amount || !newPayment.status) return

  student.value.paymentSchedule.push({
    date: newPayment.date.toISOString().slice(0, 10),
    amount: newPayment.amount,
    paid: newPayment.status === 'Оплачен',
    comment: newPayment.comment
  })

  // Сброс формы
  Object.assign(newPayment, {
    date: undefined,
    comment: '',
    status: '',
    amount: null
  })

  mode.value = 'history'
  showAddPanel.value = false
}

// Загрузка данных студента
onMounted(async () => {
  if (!store.list.length) {
    await store.fetchStudents()
  }

  const s = store.list.find(x => x.id === +props.id)
  if (!s) return

  // Расчёт скидки
  let discountPercent = 0
  const fs = s.funding_source
  if (fs === 'TechOrda' || fs === 'Внутренний грант') discountPercent = 100
  else if (fs === 'Скидка 70%' || fs === 'со скидкой 70%') discountPercent = 70
  else if (fs === 'Скидка 30%' || fs === 'со скидкой 30%') discountPercent = 30

  const discountedPrice = s.total_cost - (s.total_cost * discountPercent / 100)
  const amountDue = discountedPrice - s.paid_amount

  student.value = {
    id: s.id,
    name: s.full_name,
    iin: s.iin,
    stream: s.stream || '',
    status: s.status || 'Активен',
    email: s.email || 'example@mail.com',
    phone: s.phone || '+7(777)-111-11-11',
    totalCoursePrice: s.total_cost,
    discountPercent,
    discountedPrice,
    paymentPeriod: s.payment_period ?? 0,
    amountPaid: s.paid_amount,
    amountDue,
    paymentSchedule: []
  }

  // 💾 Загрузка платежей из БД
  const response = await axios.get(`/api/student-payments/${s.id}`)
  student.value.paymentSchedule = response.data
})


async function togglePaymentStatus(index: number) {
  if (!student.value) return
  const item = student.value.paymentSchedule[index]
  item.paid = !item.paid

  // Сохрани на сервер (если нужно)
  try {
    await axios.put(`/api/students/${student.value.id}/payments`, {
      schedule: student.value.paymentSchedule
    })
  } catch (err) {
    console.error('Ошибка при сохранении платежа', err)
  }
}

</script>


<!-- Styles -->
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

/* Таблица */
table {
  border-collapse: collapse;
}

/* Стили для статуса (зеленый фон) */
.status-paid {
  display: inline-block;
  border: 1px solid #22C55E;
  color: #22C55E;
  background: transparent;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Стили для статуса (красный фон) */
.status-unpaid {
  display: inline-block;
  border: 1px solid #EF4444;
  color: #EF4444;
  background: transparent;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Кнопка «Добавить платёж» */
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

button:hover svg {
  opacity: 0.85;
}
</style>
