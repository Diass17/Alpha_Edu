<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="mb-6 text-3xl font-semibold">Добавить студента</h2>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="0"
        class="space-y-6 bg-white p-6 rounded-lg shadow">
        <!-- Личные данные -->
        <el-form-item prop="surname">
          <el-input v-model="form.surname" placeholder="Фамилия" size="large" class="input-purple" />
        </el-form-item>

        <el-form-item prop="firstName">
          <el-input v-model="form.firstName" placeholder="Имя" size="large" class="input-purple" />
        </el-form-item>

        <el-form-item prop="patronymic">
          <el-input v-model="form.patronymic" placeholder="Отчество" size="large" class="input-purple" />
        </el-form-item>

        <!-- Контактные данные -->
        <el-form-item prop="iin">
          <el-input v-model="form.iin" placeholder="ИИН" size="large" class="input-purple" />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="Email" size="large" class="input-purple" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="Телефон" size="large" class="input-purple" />
        </el-form-item>

        <!-- Статус и Top Student -->
        <div class="flex gap-4">
          <el-select v-model="form.status" placeholder="Статус" size="large" class="flex-1 input-purple">
            <el-option label="Студент" value="Студент" />
            <el-option label="Выпускник" value="Выпускник" />
          </el-select>

          <div class="flex items-center">
            <span class="mr-2 text-lg text-gray-700">Top Student</span>
            <el-checkbox v-model="form.topStudent" />
          </div>
        </div>

        <!-- Финансирование -->
        <el-select v-model="form.financing" placeholder="Финансирование" size="large" class="w-full input-purple">
          <el-option label="Полная оплата" value="full" />
          <el-option label="Со скидкой 30%" value="discount" />
          <el-option label="Грант" value="grant" />
        </el-select>

        <!-- Предмет -->
        <!-- Предмет -->
        <el-form-item prop="subject">
          <el-select v-model="form.subject" placeholder="Выберите предмет" size="large" class="w-full input-purple">
            <el-option label="Вэб-разработка" value="Вэб-разработка" />
            <el-option label="Дизайн" value="Дизайн" />
            <el-option label="Машинное обучение и ИИ" value="Машинное обучение и ИИ" />
            <el-option label="Мобильная разработка" value="Мобильная разработка" />
            <el-option label="Программирование" value="Программирование" />
            <el-option label="Разработка игр" value="Разработка игр" />
          </el-select>
        </el-form-item>


        <!-- Финансовые данные -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-lg text-gray-700">Оплата за курс</label>
            <el-input-number v-model="coursePrice" :min="0" :step="1000" controls-position="right" size="large"
              class="w-full" />
          </div>
          <div>
            <label class="block mb-1 text-lg text-gray-700">Сумма оплачено</label>
            <el-input-number v-model="amountPaid" :min="0" :max="discountedPrice" :step="1000" controls-position="right"
              size="large" class="w-full" />
          </div>
        </div>

        <!-- Подсчёты -->
        <div class="rounded-lg border border-purple-200 bg-purple-50 overflow-hidden">
          <table class="w-full divide-y divide-purple-200">
            <thead class="bg-purple-100">
              <tr>
                <th class="px-6 py-3 text-left text-lg text-purple-700">Показатель</th>
                <th class="px-6 py-3 text-right text-lg text-purple-700">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-6 py-4">Оплата за курс</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(coursePrice) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4">Сумма со скидкой 30%</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(discountedPrice) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4">Сумма оплачено</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountPaid) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4">Сумма к оплате</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountDue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Сохранить -->
        <div class="mt-6 flex justify-end">
          <el-button type="primary" size="large" @click="submitForm" class="rounded-lg">Сохранить</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useStudentStore } from '@/store/studentStore'

const studentStore = useStudentStore()

const formRef = ref<FormInstance | null>(null)

// Используем reactive для формы
const form = reactive({
  surname: '',
  firstName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  status: '',
  topStudent: false,
  financing: '',
  subject: ''
})

// Валидация
const rules = reactive<FormRules>({
  surname: [{ required: true, message: 'Введите фамилию', trigger: 'blur' }],
  firstName: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  patronymic: [], // НЕ обязательное поле

  iin: [
    { required: true, message: 'Введите ИИН', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('Введите ИИН'));
        } else if (!/^\d{12}$/.test(value)) {
          callback(new Error('ИИН должен содержать ровно 12 цифр'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: 'Введите номер телефона', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const valid = /^[\d+\-\s()]+$/.test(value); // допустимы цифры, пробелы, +, -, ()
        if (!valid || value.length < 10) {
          callback(new Error('Введите корректный номер телефона'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],

  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Введите корректный email',
      trigger: ['blur', 'change']
    }
  ],

  subject: [{ required: true, message: 'Введите предмет', trigger: 'blur' }],
});


// Финансовые поля
const coursePrice = ref(0)
const amountPaid = ref(0)

const discountedPrice = computed(() => {
  return form.financing === 'discount' ? Math.floor(coursePrice.value * 0.7) : coursePrice.value
})

const amountDue = computed(() => {
  return Math.max(discountedPrice.value - amountPaid.value, 0)
})

function formatTenge(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(amount)
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      const newStudent = {
        full_name: `${form.surname} ${form.firstName} ${form.patronymic}`,
        name: `${form.firstName} ${form.patronymic}`,
        iin: form.iin,
        email: form.email,
        phone: form.phone,
        status: form.status,
        top_student: form.topStudent,
        funding_source: form.financing,
        subject: form.subject,
        total_cost: coursePrice.value,
        discount_percent: form.financing === 'discount' ? 30 : 0,
        paid_amount: amountPaid.value,
      }

      await studentStore.createStudent(newStudent)
      ElMessage.success('Студент успешно добавлен')

      // Очистка
      Object.assign(form, {
        surname: '',
        firstName: '',
        patronymic: '',
        iin: '',
        email: '',
        phone: '',
        status: '',
        topStudent: false,
        financing: '',
        subject: ''
      })
      coursePrice.value = 0
      amountPaid.value = 0
    } catch (error) {
      ElMessage.error('Ошибка при добавлении студента')
      console.error(error)
    }
  })
}
</script>




<style scoped>
.input-purple .el-input__inner {
  background-color: #faf5ff;
  border-color: #e9d8fd;
  border-radius: 0.5rem;
  font-size: 1.125rem;
}

.input-purple .el-input__inner::placeholder {
  color: #c4b5fd;
}
</style>
