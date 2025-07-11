<!-- src/views/StudentForm.vue -->
<template>
  <div class="min-h-screen bg-white flex">
    <!-- Sidebar placeholder (real sidebar lives in Layout.vue) -->
    <div class="w-20"></div>

    <!-- Main area -->
    <div class="flex-1 p-8">
      <!-- Title -->
      <h1 class="text-3xl font-bold mb-6">Добавить студента</h1>

      <!-- Form -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="space-y-4">
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
              <el-option label="Полная оплата" value="Полная оплата" />
              <el-option label="TechOrda" value="TechOrda" />
              <el-option label="Скидка 30%" value="Скидка 30%" />
              <el-option label="Скидка 70%" value="Скидка 70%" />
              <el-option label="Внутренний грант" value="Внутренний грант" />
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
                {{ form.coursePrice }} ₸
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
                <el-select v-model="form.paymentPeriod" placeholder="Выбрать" clearable
                  class="w-40 bg-white rounded-lg text-lg">
                  <el-option label="Полная сумма" value="full" />
                  <el-option label="2 месяца" value="2" />
                  <el-option label="3 месяца" value="3" />
                  <el-option label="6 месяцев" value="6" />
                  <el-option label="12 месяцев" value="12" />
                </el-select>
              </td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-6 text-left text-lg text-gray-800">Сумма оплачено</td>
              <td class="py-3 px-6 text-right text-lg text-gray-800">{{ form.amountPaid }} ₸</td>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, SuccessFilled } from '@element-plus/icons-vue'
import { useStudentStore } from '@/store/studentStore'

const studentStore = useStudentStore()
const courses = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  const res = await fetch('/api/students/courses')
  courses.value = await res.json()
})



const discountedPrice = computed(() => {
  const price = form.value.coursePrice
  switch (form.value.financing) {
    case 'TechOrda':
    case 'Внутренний грант':
      return 0
    case 'Скидка 30%':
      return Math.round(price * 0.7)
    case 'Скидка 70%':
      return Math.round(price * 0.3)
    case 'Полная оплата':
    default:
      return price
  }
})



const amountRemaining = computed(() =>
  Math.max(discountedPrice.value - form.value.amountPaid, 0)
)


interface StudentForm {
  surname: string
  firstName: string
  patronymic: string
  iin: string
  email: string
  phone: string
  course: string
  status: string
  topStudent: boolean
  financing: string
  paymentPeriod: string
}

const router = useRouter()
const formRef = ref()
const form = ref({
  surname: '',
  firstName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  course: '',
  status: '',
  topStudent: false,
  financing: '',
  paymentPeriod: '',
  subject: '',
  coursePrice: 0,
  amountPaid: 0,
})

const rules = {
  surname: [
    { required: true, message: 'Фамилия обязательна', trigger: 'blur' },
    { pattern: /^[А-Яа-яA-Za-z\-]{2,}$/, message: 'Только буквы, минимум 2 символа', trigger: 'blur' }
  ],
  firstName: [
    { required: true, message: 'Имя обязательно', trigger: 'blur' },
    { min: 2, message: 'Минимум 2 буквы', trigger: 'blur' }
  ],
  iin: [
    { required: true, message: 'ИИН обязателен', trigger: 'blur' },
    { pattern: /^\d{12}$/, message: 'ИИН должен содержать 12 цифр', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email обязателен', trigger: 'blur' },
    { type: 'email', message: 'Неверный формат email', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: 'Телефон обязателен', trigger: 'blur' },
    { pattern: /^\+7\d{10}$/, message: 'Номер должен быть в формате: +7XXXXXXXXXX', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: 'Выберите курс', trigger: 'change' }
  ],
}





// Control success dialog
const showSuccess = ref(false)

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
        paymentPeriod: parseInt(form.value.paymentPeriod || '4'),
      })

      ElMessage.success('Студент успешно добавлен')
      showSuccess.value = true
      resetForm()
    } catch (err) {
      ElMessage.error('Ошибка при добавлении студента')
    }
  })
}

function getDiscountPercent(type: string): number {
  switch (type) {
    case 'Скидка 30%':
      return 30
    case 'Скидка 70%':
      return 70
    case 'TechOrda':
    case 'Внутренний грант':
      return 100
    case 'Полная оплата':
    default:
      return 0
  }
}



function resetForm() {
  form.value = {
    surname: '',
    firstName: '',
    patronymic: '',
    iin: '',
    email: '',
    phone: '',
    course: '',
    status: '',
    topStudent: false,
    financing: '',
    paymentPeriod: '',
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