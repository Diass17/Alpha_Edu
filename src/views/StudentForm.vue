<!-- src/views/StudentForm.vue -->
<template>
  <div class="min-h-screen bg-white flex">
    <!-- Sidebar placeholder (real sidebar lives in Layout.vue) -->
    <div class="w-20"></div>

    <!-- Main area -->
    <div class="flex-1 p-8">
      <!-- Title with Close Button -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Добавить студента</h1>

        <button @click="router.back()"
          class="w-8 h-8 flex items-center justify-center bg-purple-50 hover:bg-purple-100 rounded-full shadow transition"
          aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      <!-- Form -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="space-y-4 validate-on-rule-change">
        <!-- Upper text fields с валидацией -->
        <el-form-item prop="surname">
          <el-input v-model="form.surname" placeholder="Фамилия" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <el-form-item prop="firstName">
          <el-input v-model="form.firstName" placeholder="Имя" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <el-form-item prop="patronymic">
          <el-input v-model="form.patronymic" placeholder="Отчество" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <el-form-item prop="iin">
          <el-input v-model="form.iin" placeholder="010101345678" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="ivanovivan@gmail.com" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="+77005677889" size="large" clearable
            class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        </el-form-item>

        <!-- Grouped selects -->
        <div class="mt-6 space-y-4">
          <!-- Course -->
          <el-form-item prop="subject">
            <el-select v-model="form.subject" placeholder="Курс" size="large" clearable
              class="w-full bg-purple-50 rounded-xl text-lg">
              <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.name" />
            </el-select>
          </el-form-item>

          <!-- Status + Top Student -->
          <div class="flex space-x-4">
            <el-form-item prop="status" class="flex-1">
              <el-select v-model="form.status" placeholder="Статус" size="large" clearable
                class="w-full bg-purple-50 rounded-xl text-lg">
                <el-option label="Студент" value="student" />
                <el-option label="Выпускник" value="graduate" />
              </el-select>
            </el-form-item>

            <div class="flex items-center bg-purple-50 rounded-xl px-4" style="height:3.5rem">
              <span class="text-lg text-gray-700 mr-2">Top Student</span>
              <el-checkbox v-model="form.topStudent" />
            </div>
          </div>

          <!-- Financing + Add Course -->
          <el-form-item prop="financing">
            <el-select v-model="form.financing" placeholder="Финансирование" size="large" clearable
              class="w-full bg-purple-50 rounded-xl text-lg">
              <el-option label="Полная оплата" value="full" />
              <el-option label="TechOrda" value="techorda" />
              <el-option label="Скидка 30%" value="discount_30" />
              <el-option label="Скидка 70%" value="discount_70" />
              <el-option label="Внутренний грант" value="internal_grant" />
            </el-select>
          </el-form-item>


          <!-- Кнопка "Добавить курс", отдельно под селектом и справа -->
          <div class="flex justify-end mb-4">
            <el-button type="primary" icon="Plus" size="large"
              class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white" @click="addCourse">
              Добавить курс
            </el-button>
          </div>

        </div>
      </el-form>


      <!-- Payments summary table -->
      <div class="mt-6 rounded-xl border border-purple-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-purple-50">
            <tr>
              <th class="py-3 px-6 text-left text-lg text-gray-800">
                Оплата за курс
              </th>
              <th class="py-3 px-6 text-right text-lg text-gray-800">
                <el-input v-model.number="form.coursePrice" placeholder="Введите сумму" size="large"
                  class="w-40 text-right" type="number" min="0">
                  <template #suffix>₸</template>
                </el-input>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="py-3 px-6 text-left text-lg text-gray-800">Сумма со скидкой</td>
              <td class="py-3 px-6 text-right text-lg text-gray-800">{{ discountedPrice }} ₸</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-6 text-left text-lg text-gray-800">Выбор период оплаты</td>
              <td class="py-3 px-6 text-right text-lg text-gray-800">
                <el-select v-model="form.paymentPeriod" placeholder="Выбрать" class="w-40 bg-white rounded-lg text-lg">
                  <el-option label="Полная сумма" :value="0" />
                  <el-option label="2 месяца" :value="2" />
                  <el-option label="3 месяца" :value="3" />
                  <el-option label="6 месяцев" :value="6" />
                  <el-option label="12 месяцев" :value="12" />
                </el-select>
              </td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-6 text-left text-lg text-gray-800">Сумма оплачено</td>
              <td class="py-3 px-6 text-right text-lg text-gray-800">
                <el-input v-model.number="form.amountPaid" placeholder="Введите сумму" size="large"
                  class="w-40 text-right" type="number" min="0">
                  <template #suffix>₸</template>
                </el-input>
              </td>
            </tr>


            <tr class="border-t">
              <td class="py-3 px-6 text-left text-lg text-gray-800">Сумма к оплате</td>
              <td class="py-3 px-6 text-right text-lg text-gray-800">{{ amountRemaining }} ₸</td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Save button -->
      <div class="flex justify-end mt-6">
        <el-button type="primary" size="large" class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
          @click="confirmSave">
          Сохранить профиль
        </el-button>
      </div>

      <!-- Success popup -->
      <el-dialog v-model="showSuccess" width="320px" show-close="false" center custom-class="success-dialog">
        <div class="text-center p-6">
          <el-icon class="text-green-500 text-4xl mb-2">
            <SuccessFilled />
          </el-icon>
          <h3 class="text-xl font-semibold mb-2">Готово!</h3>
          <p class="text-gray-700 mb-6">
            Аккаунт студента успешно сохранён
          </p>
          <el-button type="primary" size="small" @click="onSuccessContinue">
            Далее
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, SuccessFilled } from '@element-plus/icons-vue'
import { useStudentStore } from '@/store/studentStore'

const router = useRouter()
const studentStore = useStudentStore()

const formRef = ref()
const showSuccess = ref(false)
const courses = ref<{ id: number; name: string; price?: number }[]>([])

const form = ref({
  surname: '',
  firstName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  status: '',
  topStudent: false,
  financing: '',
  paymentPeriod: 0,
  subject: '',
  coursePrice: 0,
  amountPaid: 0,
})


const rules = {
  surname: [
    { required: true, message: 'Фамилия обязательна', trigger: ['blur', 'change'] },
    { pattern: /^[А-Яа-яA-Za-z\-]{2,}$/, message: 'Только буквы, минимум 2 символа', trigger: ['blur', 'change'] }
  ],
  firstName: [
    { required: true, message: 'Имя обязательно', trigger: ['blur', 'change'] },
    { min: 2, message: 'Минимум 2 буквы', trigger: ['blur', 'change'] }
  ],
  iin: [
    { required: true, message: 'ИИН обязателен', trigger: ['blur', 'change'] },
    { pattern: /^\d{12}$/, message: 'ИИН должен содержать 12 цифр', trigger: ['blur', 'change'] }
  ],
  email: [
    { required: true, message: 'Email обязателен', trigger: ['blur', 'change'] },
    { type: 'email', message: 'Неверный формат email', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: 'Телефон обязателен', trigger: ['blur', 'change'] },
    { pattern: /^\+7\d{10}$/, message: 'Номер должен быть в формате: +7XXXXXXXXXX', trigger: ['blur', 'change'] }
  ],
  subject: [
    { required: true, message: 'Выберите курс', trigger: ['blur', 'change'] }
  ],
  financing: [
    { required: true, message: 'Выберите тип финансирования', trigger: ['blur', 'change'] }
  ],
  status: [
    { required: true, message: 'Выберите статус', trigger: ['blur', 'change'] }
  ],
  coursePrice: [
    { required: true, message: 'Введите стоимость курса', trigger: ['blur', 'change'] },
    { type: 'number', min: 1, message: 'Цена должна быть больше 0', trigger: ['blur', 'change'] }
  ],
  paymentPeriod: [
    { required: true, message: 'Выберите период оплаты', trigger: ['blur', 'change'] }
  ],
}



onMounted(async () => {
  try {
    const res = await fetch('/api/students/courses')
    courses.value = await res.json()
  } catch (err) {
    ElMessage.error('Ошибка при загрузке курсов')
  }
})

// Автозаполнение цены курса при выборе
watch(() => form.value.subject, (selected) => {
  const selectedCourse = courses.value.find(c => c.name === selected)
  form.value.coursePrice = selectedCourse?.price || 0 // по умолчанию 0
})

const discountedPrice = computed(() => {
  const price = form.value.coursePrice
  switch (form.value.financing) {
    case 'techorda':
    case 'internal_grant':
      return 0
    case 'discount_30':
      return Math.round(price * 0.7)
    case 'discount_70':
      return Math.round(price * 0.3)
    case 'full':
    default:
      return price
  }
})

const amountRemaining = computed(() =>
  Math.max(discountedPrice.value - form.value.amountPaid, 0)
)




function getDiscountPercent(type: string): number {
  switch (type) {
    case 'discount_30':
      return 30
    case 'discount_70':
      return 70
    case 'techorda':
    case 'internal_grant':
      return 100
    default:
      return 0
  }
}


function addCourse() {
  ElMessage.success('Курс добавлен')
}

async function confirmSave() {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      await studentStore.createStudent({
        full_name: `${form.value.surname} ${form.value.firstName} ${form.value.patronymic}`.trim(),
        iin: form.value.iin,
        email: form.value.email,
        phone: form.value.phone,
        status: form.value.status,
        top_student: form.value.topStudent,
        funding_source: form.value.financing,
        subject: form.value.subject,
        total_cost: form.value.coursePrice,
        discount_percent: getDiscountPercent(form.value.financing),
        paid_amount: form.value.amountPaid,
        amount_remaining: amountRemaining.value,
        paymentPeriod: form.value.paymentPeriod,
      })

      ElMessage.success('Студент успешно добавлен')
      showSuccess.value = true
      resetForm()
    } catch (err) {
      console.error(err)
      ElMessage.error('Ошибка при добавлении студента')
    }
  })
}

function resetForm() {
  form.value = {
    surname: '',
    firstName: '',
    patronymic: '',
    iin: '',
    email: '',
    phone: '',
    status: '',
    topStudent: false,
    financing: '',
    paymentPeriod: 0, // ← Заменено с '' на 0
    subject: '',
    coursePrice: 0,
    amountPaid: 0,
  }
}

function onSuccessContinue() {
  showSuccess.value = false
  router.push({ name: 'Students' })
}
</script>


<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>