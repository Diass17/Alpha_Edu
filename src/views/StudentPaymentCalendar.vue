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
                {{ student.status || '—' }}
              </td>
            </tr>



            <!-- Top Student -->
            <tr>
              <td class="px-6 py-2">Top Student</td>
              <td class="px-6 py-2">
                {{ student.topStudent ? 'Да' : 'Нет' }}
              </td>
            </tr>
            <!-- Финансирование -->
            <tr>
              <td class="px-6 py-2">Финансирование</td>
              <td class="px-6 py-2">
                {{ student.funding_source || '—' }}
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
              <td class="px-6 py-2">{{ discountedPrice.toLocaleString('ru-RU') }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Период оплаты</td>
              <td class="px-6 py-2">{{ formatPaymentPeriod(student.paymentPeriod) }}</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма оплачено</td>
              <td class="px-6 py-2">{{ paidAmount.toLocaleString() }} ₸</td>
            </tr>
            <tr>
              <td class="px-6 py-2">Сумма к оплате</td>
              <td class="px-6 py-2">{{ amountDue.toLocaleString() }} ₸</td>
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
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/store/studentStore'

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
  paymentPeriod: number
  paymentSchedule: ScheduleItem[]
  topStudent: boolean
  funding_source: string
  amount_remaining: number
}


const route = useRoute()
const store = useStudentStore()
const student = ref<Student | null>(null)
const mode = ref<'calendar' | 'history'>('calendar')

const showNewStatusDropdown = ref(false)
const showAddPanel = ref(false)


const newPayment = reactive({
  date: undefined as Date | undefined,
  comment: '',
  status: '',
  amount: null as number | null
})

const amountPaid = computed(() =>
  student.value?.paymentSchedule
    ?.filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0) ?? 0
)

const discountedPrice = computed(() => {
  if (!student.value) return 0
  const total = student.value.totalCoursePrice
  const discount = student.value.discountPercent
  return Math.round(total * (1 - discount / 100))
})

const amountDue = computed(() => {
  return Math.max(discountedPrice.value - amountPaid.value, 0)
})

function onAddPayment() {
  console.log('Добавить платёж')
}

function toggleNewStatusDropdown() {
  console.log('Тоггл статуса')
}

function selectNewStatus(newStatus: string) {
  if (student.value) {
    student.value.status = newStatus
  }
  showNewStatusDropdown.value = false
}

onMounted(async () => {
  if (!store.list.length) await store.fetchStudents()

  const rawStudent = store.list.find(x => x.id === +route.params.id)!
  if (!rawStudent) return

  // Определяем скидку
  const discountPercent = rawStudent.discount_percent ?? 0

  const s: Student = {
    id: rawStudent.id,
    name: rawStudent.full_name,
    iin: rawStudent.iin,
    stream: rawStudent.stream || '',
    status: rawStudent.status || 'Студент',
    email: rawStudent.email || '',
    phone: rawStudent.phone || '',
    totalCoursePrice: rawStudent.total_cost,
    discountPercent: rawStudent.discount_percent,
    paymentPeriod: rawStudent.payment_period ?? 0,
    paymentSchedule: [],
    topStudent: rawStudent.top_student === true,
    funding_source: rawStudent.funding_source,
    amount_remaining: rawStudent.amount_remaining ?? 0
  }

  student.value = s

  // Пробуем загрузить график из БД
  try {
    const res = await axios.get(`/api/students/${s.id}/payment-schedule`)
    if (res.data.success && Array.isArray(res.data.paymentSchedule) && res.data.paymentSchedule.length > 0) {
      student.value.paymentSchedule = res.data.paymentSchedule
      return
    }
  } catch (err) {
    console.error('Ошибка при загрузке графика:', err)
  }

  // Если графика нет — генерируем новый
  const fullPrice = s.totalCoursePrice
  const discountAmount = Math.round(fullPrice * (s.discountPercent / 100))
  const discountedPrice = Math.round(fullPrice * (1 - s.discountPercent / 100))

  // Распределяем оставшуюся сумму по месяцам
  const amountPerMonth: number[] = []
  let left = discountedPrice  // discountedPrice уже с учётом скидки

  for (let i = 0; i < s.paymentPeriod; i++) {
    const avg = Math.floor(left / (s.paymentPeriod - i))
    amountPerMonth.push(avg)
    left -= avg
  }

  // Добавляем остаток в последний месяц
  amountPerMonth[amountPerMonth.length - 1] += left

  const schedule: ScheduleItem[] = []
  const today = new Date()

  for (let i = 0; i < s.paymentPeriod; i++) {
    const date = new Date(today)
    date.setMonth(date.getMonth() + i)
    schedule.push({
      date: date.toISOString().split('T')[0],
      amount: amountPerMonth[i],
      paid: false
    })
  }

  // Добавляем скидку как оплаченный платёж в начало
  if (discountAmount > 0) {
    schedule.unshift({
      date: today.toISOString().split('T')[0],
      amount: discountAmount,
      paid: true,
      comment: 'Скидка'
    })
  }

  student.value.paymentSchedule = schedule
  await savePaymentScheduleToDB()
})

async function savePaymentScheduleToDB() {
  if (!student.value) return
  try {
    await axios.put(`/api/students/${student.value.id}/payment-schedule`, {
      paymentSchedule: student.value.paymentSchedule
    })
  } catch (err) {
    console.error('Ошибка при сохранении графика:', err)
  }
}

function togglePaymentStatus(index: number) {
  if (!student.value) return
  const item = student.value.paymentSchedule[index]
  item.paid = !item.paid
  savePaymentScheduleToDB()
}

function saveNewPayment() {
  if (!student.value || !newPayment.date || !newPayment.amount || !newPayment.status) return

  student.value.paymentSchedule.push({
    date: newPayment.date.toISOString().slice(0, 10),
    amount: newPayment.amount,
    paid: newPayment.status === 'Оплачен',
    comment: newPayment.comment
  })

  Object.assign(newPayment, {
    date: undefined,
    comment: '',
    status: '',
    amount: null
  })

  mode.value = 'history'
  savePaymentScheduleToDB()
}

function formatPaymentPeriod(months: number): string {
  if (months === 1) return '1 месяц'
  if (months >= 2 && months <= 4) return `${months} месяца`
  return `${months} месяцев`
}

const paidAmount = computed(() => {
  if (!student.value || !student.value.paymentSchedule) return 0
  return student.value.paymentSchedule
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0)
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
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