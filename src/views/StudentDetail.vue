<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <el-card class="mx-auto max-w-4xl p-6 bg-white rounded-lg shadow">
      <!-- Avatar & Name -->
      <div class="text-center mb-8">
        <el-avatar :src="defaultAvatar" size="100" class="mx-auto mb-4" style="border: 2px solid #E9D8FD;" />
        <h2 class="text-3xl font-bold mb-4 flex justify-center">
          <template v-if="!isEditing">{{ student?.full_name || '—' }}</template>
          <template v-else>
            <el-input v-model="form.full_name" size="large" class="w-64" />
          </template>
        </h2>
        <div class="flex items-center">
          <div class="flex-1 border-t border-purple-200"></div>
          <div class="mx-4 px-6 py-2 text-lg bg-white border-2 border-purple-300 rounded-md">
            <template v-if="!isEditing">
              <div>{{ student?.subject || '—' }}</div>
              <div class="text-sm text-gray-500">{{ student?.stream || '—' }}</div>
            </template>
            <template v-else>
              <el-input v-model="form.subject" size="small" placeholder="Курс" class="mb-1" />
              <el-input v-model="form.stream" size="small" placeholder="Поток" />
            </template>
          </div>
          <div class="flex-1 border-t border-purple-200"></div>
        </div>
      </div>

      <!-- Student Data Table -->
      <table class="w-full bg-purple-50 border border-purple-200 rounded-lg divide-y divide-purple-200">
        <thead>
          <tr class="bg-purple-100">
            <th class="px-6 py-3 text-left text-lg">Данные</th>
            <th class="px-6 py-3 text-left text-lg">Информация о студенте</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <!-- IIN -->
          <tr class="border-t">
            <td class="px-6 py-4">ИИН</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">{{ student?.iin || '—' }}</template>
              <template v-else>
                <el-input v-model="form.iin" size="small" />
              </template>
            </td>
          </tr>
          <!-- Email -->
          <tr class="border-t">
            <td class="px-6 py-4">Email</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">{{ student?.email || '—' }}</template>
              <template v-else>
                <el-input v-model="form.email" size="small" />
              </template>
            </td>
          </tr>

          <!-- Телефон -->
          <tr class="border-t">
            <td class="px-6 py-4">Телефон</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">{{ student?.phone || '—' }}</template>
              <template v-else>
                <el-input v-model="form.phone" size="small" />
              </template>
            </td>
          </tr>

          <!-- Статус -->
          <tr class="border-t">
            <td class="px-6 py-4">Статус</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">{{ statusLabel(student?.status) }}</template>
              <template v-else>
                <el-select v-model="form.status" size="small">
                  <el-option label="Активный" value="Студент" />
                  <el-option label="Выпускник" value="Выпускник" />
                </el-select>
              </template>
            </td>
          </tr>

          <!-- Top Student -->
          <tr class="border-t">
            <td class="px-6 py-4">Top Student</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">
                <el-icon>
                  <component :is="student?.top_student ? SuccessFilled : CircleCloseFilled" />
                </el-icon>
              </template>
              <template v-else>
                <el-checkbox v-model="form.top_student" />
              </template>
            </td>
          </tr>

          <!-- Финансирование -->
          <tr class="border-t">
            <td class="px-6 py-4">Финансирование</td>
            <td class="px-6 py-4">
              <template v-if="!isEditing">{{ fundingLabel(student?.funding_source) }}</template>
              <template v-else>
                <el-select v-model="form.funding_source" size="small">
                  <el-option label="Полная оплата" value="Полная оплата" />
                  <el-option label="Со скидкой 30%" value="Со скидкой 30%" />
                  <el-option label="Грант" value="Грант" />
                </el-select>
              </template>
            </td>
          </tr>

        </tbody>
      </table>

      <!-- Finance Table -->
      <table class="w-full mt-6 bg-purple-50 border border-purple-200 rounded-lg divide-y divide-purple-200">
        <tbody>
          <tr>
            <td class="px-6 py-4">Оплата за курс</td>
            <td class="px-6 py-4 text-right">{{ formatTenge(coursePrice) }}</td>
          </tr>
          <tr>
            <td class="px-6 py-4">Сумма со скидкой 30%</td>
            <td class="px-6 py-4 text-right">{{ formatTenge(discountPrice) }}</td>
          </tr>
          <tr>
            <td class="px-6 py-4">Сумма оплачено</td>
            <td class="px-6 py-4 text-right">
              <template v-if="!isEditing">{{ formatTenge(amountPaid) }}</template>
              <template v-else>
                <el-input-number v-model="formPaid" :min="0" :max="discountPrice" size="small" />
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4">Сумма к оплате</td>
            <td class="px-6 py-4 text-right">{{ formatTenge(amountDue) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Action Buttons -->
      <div class="flex justify-end mt-6 space-x-4">
        <el-button v-if="isEditing" @click="cancelEdit">Отмена</el-button>
        <el-button v-if="isEditing" type="primary" @click="saveEdit">Сохранить</el-button>
        <el-button v-else type="primary" icon="el-icon-edit" @click="startEdit">Редактировать профиль</el-button>
      </div>
    </el-card>

    <!-- Success Dialog -->
    <el-dialog v-model="showSuccess" width="320px" show-close="false" center custom-class="success-dialog">
      <div class="text-center p-6">
        <el-icon class="text-green-500 mb-2">
          <SuccessFilled />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Изменения успешно сохранены</p>
        <el-button type="primary" @click="onContinue">Далее</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/logos/default-avatar.png'

const route = useRoute()
const router = useRouter()
const store = useStudentStore()
const id = Number(route.params.id)


const isEditing = ref(false)
const showSuccess = ref(false)


onMounted(() => {
  if (!store.list.length) store.fetchStudents()
})


const student = computed<Student | undefined>(() => store.list.find(s => s.id === id))


const form = ref<Partial<Student>>({})
const formPaid = ref(0)


const coursePrice = computed(() => student.value ? 150000 : 0)
const discountPrice = computed(() => Math.round(coursePrice.value * 0.7))
const amountPaid = computed(() => formPaid.value)
const amountDue = computed(() => discountPrice.value - amountPaid.value)


function formatTenge(val: number) {
  return val.toLocaleString('ru-RU') + ' тг'
}


function startEdit() {
  if (student.value) {
    form.value = { ...student.value }
    formPaid.value = student.value.paid_amount || 0
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
}
async function saveEdit() {
  if (!student.value) return
  await store.updateStudent(id, { ...form.value })
  showSuccess.value = true
  isEditing.value = false
}

function onContinue() {
  showSuccess.value = false
  router.push({ name: 'Students' })
}

function statusLabel(val?: string) {
  if (val === 'Студент') return 'Активный'
  if (val === 'Выпускник') return 'Выпускник'
  return '—'
}

function fundingLabel(val?: string) {
  if (val === 'Полная оплата') return 'Полная оплата'
  if (val === 'Со скидкой 30%') return 'Со скидкой 30%'
  if (val === 'Грант') return 'Грант'
  return '—'
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>