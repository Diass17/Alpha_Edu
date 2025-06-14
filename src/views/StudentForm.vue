<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Заголовок -->
      <h2 class="text-3xl font-semibold mb-6">Добавить студента</h2>

      <el-form :model="form" ref="formRef" label-width="0" class="space-y-6 bg-white p-6 rounded-lg shadow">
        <!-- ФИО -->
        <el-input v-model="form.surname" placeholder="Фамилия" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />
        <el-input v-model="form.firstName" placeholder="Имя" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />
        <el-input v-model="form.patronymic" placeholder="Отчество" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />

        <!-- ИИН, Email, Телефон -->
        <el-input v-model="form.iin" placeholder="ИИН" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />
        <el-input v-model="form.email" placeholder="Email" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />
        <el-input v-model="form.phone" placeholder="+7(xxx)-xxx-xx-xx" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />

        <!-- Статус и Top Student -->
        <div class="flex gap-4">
          <el-select v-model="form.status" placeholder="Статус" clearable size="large"
            class="flex-1 bg-purple-50 placeholder-purple-300 text-lg">
            <el-option label="Студент" value="active" />
            <el-option label="Выпускник" value="graduated" />
          </el-select>
          <div class="flex items-center">
            <span class="mr-2 text-lg text-gray-700">Top Student</span>
            <el-checkbox v-model="form.topStudent" />
          </div>
        </div>

        <!-- Финансирование -->
        <el-select v-model="form.financing" placeholder="Финансирование" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg">
          <el-option label="Полная оплата" value="full" />
          <el-option label="Со скидкой 30%" value="discount" />
          <el-option label="Грант" value="grant" />
        </el-select>

        <!-- Предмет -->
        <el-input v-model="form.subject" placeholder="Предмет" clearable size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg" />

        <!-- Ввод суммы оплаты и оплачено -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-lg text-gray-700">Оплата за курс</label>
            <el-input-number v-model="coursePrice" :min="0" :step="1000" controls-position="right" size="large"
              class="w-full" />
          </div>
          <div>
            <label class="block mb-1 text-lg text-gray-700">Сумма оплачено</label>
            <el-input-number v-model="amountPaid" :min="0" :max="discountPrice" :step="1000" controls-position="right"
              size="large" class="w-full" />
          </div>
        </div>

        <!-- Таблица оплаты -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden">
          <table class="w-full divide-y divide-purple-200">
            <thead class="bg-purple-100">
              <tr>
                <th class="px-6 py-3 text-left text-lg text-purple-700">Показатель</th>
                <th class="px-6 py-3 text-right text-lg text-purple-700">Сумма</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr class="border-t">
                <td class="px-6 py-4">Оплата за курс</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(coursePrice) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма со скидкой 30%</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(discountPrice) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма оплачено</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountPaid) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма к оплате</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountDue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Кнопка Сохранить -->
        <div class="flex justify-end mt-6">
          <el-button type="primary" size="large" @click="submitForm" class="rounded-lg">
            Сохранить профиль
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'


interface StudentFormModel {
  surname: string
  firstName: string
  patronymic: string
  iin: string
  email: string
  phone: string
  status: string
  topStudent: boolean
  financing: string
  subject: string
}

const router = useRouter()
const store = useStudentStore()


const formRef = ref()
const form = ref<StudentFormModel>({
  surname: '',
  firstName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  status: '',
  topStudent: false,
  financing: '',
  subject: '',
})


const coursePrice = ref(150000)
const amountPaid = ref(0)
const discountPrice = computed(() => Math.round(coursePrice.value * 0.7))
const amountDue = computed(() => discountPrice.value - amountPaid.value)

function formatTenge(value: number) {
  return value >= 0 ? value.toLocaleString('ru-RU') + ' тг' : '—'
}


async function submitForm() {
  const fullName = `${form.value.surname} ${form.value.firstName} ${form.value.patronymic}`.trim()

  const payload: Omit<Student, 'id'> = {
    name: fullName,               
    iin: form.value.iin,
    email: form.value.email,
    number: form.value.phone,
    status: form.value.status,
    top_student: form.value.topStudent,
    funding_source: form.value.financing,
    course: form.value.subject,
    stream: '',
    full_name: fullName         
  }

  await store.createStudent(payload)
  router.push({ name: 'Students' })
}
</script>

<style scoped>
.el-input__inner,
.el-select .el-input__inner {
  background-color: #faf5ff;
  border-color: #e9d8fd;
  border-radius: 0.5rem;
  font-size: 1.125rem;
}

.el-input__inner::placeholder,
.el-select .el-input__inner::placeholder {
  color: #c4b5fd;
}
</style>
