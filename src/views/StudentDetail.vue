<template>
  <div class="p-6 min-h-screen flex flex-col items-center justify-start pt-12 pb-24 relative">
    <!-- Close Button -->
    <button
      class="absolute top-1 right-1 bg-[#F1EFFF] hover:bg-purple-100 rounded-lg w-7 h-7 flex items-center justify-center shadow"
      @click="goBack" aria-label="Close">
      <img src="@/assets/logos/close.png" alt="Close" class="w-6 h-6" />
    </button>

    <!-- Avatar and Name -->
    <div class="flex flex-col items-center mb-3">
      <div
        class="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4 overflow-hidden bg-white shadow">
        <img :src="defaultAvatar" class="object-cover w-full h-full" alt="Avatar" />
      </div>
      <h2 class="text-3xl font-bold mb-1 text-center">
        <template v-if="isEditing">
          <input v-model="editForm.full_name" class="input-basic text-center" />
        </template>
        <template v-else>
          {{ editForm.full_name || '—' }}
        </template>
      </h2>
    </div>

    <!-- Course and Stream -->
    <div class="mb-7 flex flex-col items-center">
      <div
        class="flex flex-col items-center border-2 border-[#E0D7FF] bg-white rounded-xl px-16 py-4 shadow-sm min-w-[310px]">
        <template v-if="isEditing">
          <CustomDropdown :options="coursesList" v-model="editForm.course" class="font-semi-bold text-[16px] w-56" />
          <CustomDropdown :options="flowsList" v-model="editForm.stream" class="text-[15px] text-blue-600 mt-1 w-32" />
        </template>
        <template v-else>
          <span class="font-bold text-[22px]">{{ editForm.course || '—' }}</span>
          <span class="text-[17px] text-blue-600 -mt-1">{{ editForm.stream || '—' }}</span>
        </template>
      </div>
    </div>

    <!-- Student Info -->
    <div class="w-full mb-10 rounded-2xl border border-[#E0D7FF] bg-white shadow overflow-hidden">
      <table class="w-full text-base">
        <thead class="bg-[#F1EFFF] text-black text-[18px] font-semibold">
          <tr>
            <th class="px-12 py-5 text-left rounded-tl-2xl">Данные</th>
            <th class="px-12 py-5 text-left rounded-tr-2xl">Информация о студенте</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF]">
          <tr v-for="field in studentFields" :key="field.key">
            <td class="px-12 py-3">{{ field.label }}</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <component :is="field.key === 'topStudent' ? 'input' : field.editType" v-model="editForm[field.key]"
                  v-bind="field.props" :checked="field.key === 'topStudent' ? editForm[field.key] : undefined"
                  :type="field.key === 'topStudent' ? 'checkbox' : undefined" />
              </template>
              <template v-else>
                <template v-if="field.key === 'topStudent'">
                  <input type="checkbox" :checked="editForm.topStudent"
                    class="form-checkbox accent-[#38D473] w-5 h-5 border-2 rounded" disabled />
                </template>
                <template v-else-if="field.key === 'amount_remaining'">
                  {{ formatTenge(editForm.amount_remaining ?? 0) }}
                </template>
                <template v-else-if="field.key === 'paymentPeriod'">
                  {{ formatPaymentPeriod(editForm.paymentPeriod) }}
                </template>
                <template v-else>
                  {{ editForm[field.key] || '—' }}
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Summary -->
    <div class="w-full mb-10 rounded-2xl border border-[#E0D7FF] bg-white shadow overflow-hidden">
      <table class="w-full text-base">
        <thead class="bg-[#F1EFFF] text-sm font-semibold">
          <tr>
            <th class="px-12 py-3">Оплата за курс</th>
            <th class="px-12 py-3 text-right">
              <template v-if="isEditing">
                <input v-model.number="editForm.totalCoursePrice" class="input-basic w-36 text-right" type="number" />
              </template>
              <template v-else>
                {{ formatTenge(editForm.totalCoursePrice ?? 0) }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF]">
          <tr>
            <td class="px-12 py-3">
              Сумма со скидкой
              <template v-if="isEditing">
                <input v-model.number="editForm.discountPercent" class="input-basic w-20 ml-2 text-right inline-block"
                  type="number" min="0" max="100" />%
              </template>
              <template v-else>
                {{ editForm.discountPercent ?? 0 }}%
              </template>
            </td>
            <td class="px-12 py-3 text-right">
              <template v-if="isEditing">
                <input v-model.number="editForm.discountedPrice" class="input-basic w-36 text-right" type="number" />
              </template>
              <template v-else>
                {{ formatTenge(editForm.discountedPrice ?? 0) }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Сумма оплачено</td>
            <td class="px-12 py-3 text-right">
              <template v-if="isEditing">
                <input v-model.number="editForm.paid_amount" class="input-basic w-36 text-right" type="number" />
              </template>
              <template v-else>
                {{ formatTenge(amountPaid) }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Сумма к оплате</td>
            <td class="px-12 py-3 text-right">
              {{ formatTenge(amountDue) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Action Buttons -->
    <div class="w-full flex justify-end">
      <button v-if="!isEditing" @click="startEdit" class="btn-primary">Редактировать профиль</button>
      <template v-else>
        <button @click="cancelEdit" class="btn-secondary mr-3">Cancel</button>
        <button @click="saveEdit" class="btn-primary">Save</button>
      </template>
    </div>

    <!-- Success Dialog -->
    <el-dialog v-model="showSuccess" width="350px" center show-close>
      <div class="text-center p-6">
        <div class="mx-auto rounded-lg bg-[#E7FFE6] w-12 h-12 mb-2 flex items-center justify-center">
          <svg width="32" height="32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#38D473" />
            <path d="M10 17l4 4 8-8" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Done!</h3>
        <p class="text-gray-600 mb-6">Changes saved successfully</p>
        <el-button type="primary" @click="goToList" style="background:#17D749;border:none">Continue</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore, StudentFull } from '@/store/studentStore'
import CustomDropdown from '@/components/CustomDropdown.vue'
import defaultAvatar from '@/assets/logos/default-avatar.png'

const router = useRouter()
const route = useRoute()
const store = useStudentStore()
const id = String(route.params.id)

const student = ref<StudentFull | null>(null)
const isEditing = ref(false)
const showSuccess = ref(false)
const editForm = ref<any>({})

const coursesList = ['Data Science', 'Generative AI', 'Mobile Dev']
const flowsList = ['DSF-1', 'A1', 'B2']
const statusOptions = ['Студент', 'Выпускник']
const financingOptions = ['TechOrda', '30% скидка', 'Грант']

const studentFields = [
  { key: 'iin', label: 'ИИН', editType: 'input', props: { class: 'input-basic' } },
  { key: 'email', label: 'Email', editType: 'input', props: { class: 'input-basic' } },
  { key: 'phone', label: 'Телефон', editType: 'input', props: { class: 'input-basic' } },
  { key: 'status', label: 'Статус', editType: CustomDropdown, props: { options: statusOptions, class: 'w-48' } },
  { key: 'topStudent', label: 'Top Student', editType: 'input', props: { type: 'checkbox' } },
  { key: 'financing', label: 'Финансирование', editType: CustomDropdown, props: { options: financingOptions, class: 'w-48' } },
  { key: 'paymentPeriod', label: 'Период оплаты', editType: 'input', props: { class: 'input-basic', type: 'number', min: 1, max: 12 } },
]



onMounted(async () => {
  if (!store.list.length) await store.fetchStudents()
  const res = await store.fetchById(id)
  student.value = res

  const discount = getDiscountPercent(res.funding_source)

  editForm.value = {
    full_name: res.full_name,
    course: res.subject,
    stream: res.stream,
    iin: res.iin,
    email: res.email,
    phone: res.phone,
    status: res.status,
    topStudent: res.top_student ?? false,
    financing: res.funding_source ?? '',
    paymentPeriod: typeof res.paymentPeriod === 'number' ? res.paymentPeriod : parseInt(res.paymentPeriod ?? '4'),
    totalCoursePrice: res.total_cost ?? 0,
    discountPercent: getDiscountPercent(res.funding_source),
    discountedPrice: Math.round((res.total_cost ?? 0) * (1 - getDiscountPercent(res.funding_source) / 100)),
    paid_amount: res.paid_amount ?? 0,
  }
})




const amountPaid = computed(() => student.value?.paid_amount ?? 0)
const amountDue = computed(() => (editForm.value.discountedPrice ?? 0) - amountPaid.value)

function formatTenge(val: number) {
  return val.toLocaleString('ru-RU') + ' тг'
}

function startEdit() {
  if (!student.value) return

  const discount = getDiscountPercent(student.value.funding_source)

  editForm.value = {
    full_name: student.value.full_name,
    course: student.value.subject,
    stream: student.value.stream,
    iin: student.value.iin,
    email: student.value.email,
    phone: student.value.phone,
    status: student.value.status,
    topStudent: student.value.top_student ?? false,
    financing: student.value.funding_source ?? '',
    paymentPeriod: student.value.paymentPeriod ?? 4,
    totalCoursePrice: student.value.total_cost ?? 0,
    discountPercent: getDiscountPercent(student.value.funding_source),
    discountedPrice: Math.round((student.value.total_cost ?? 0) * (1 - getDiscountPercent(student.value.funding_source) / 100)),
    paid_amount: student.value.paid_amount ?? 0,
  }

  isEditing.value = true
}



function getDiscountPercent(financing: string): number {
  switch (financing) {
    case 'TechOrda':
    case 'Внутренний грант':
      return 100
    case 'Скидка 70%':
      return 70
    case 'Скидка 30%':
      return 30
    default:
      return 0
  }
}

function formatPaymentPeriod(val: number): string {
  if (!val || val === 0) return 'Оплачено полностью'
  if (val === 1) return '1 месяц'
  return `${val} месяцев`
}




function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  if (!student.value) return

  const payload = {
    ...editForm.value,
    subject: editForm.value.course,
    stream: editForm.value.stream,
    top_student: editForm.value.topStudent,
    funding_source: editForm.value.financing,
    payment_period: Number(editForm.value.paymentPeriod),
    total_cost: Number(editForm.value.totalCoursePrice),
    discount_percent: Number(editForm.value.discountPercent),
    paid_amount: Number(editForm.value.paid_amount),
    amount_remaining: Number(editForm.value.discountedPrice ?? 0) - Number(editForm.value.paid_amount),
  }

  await store.updateStudent(student.value.id, payload)
  student.value = await store.fetchById(id)
  isEditing.value = false
  showSuccess.value = true
}


function goBack() {
  router.back()
}

function goToList() {
  showSuccess.value = false
  router.push('/students')
}
</script>

<style scoped>
.input-basic {
  border: 1.5px solid #E0D7FF;
  background: #fff;
  font-size: 1rem;
  color: #1a1a1a;
  border-radius: 8px;
  padding: 0.25rem 0.7rem;
  width: 100%;
  transition: border 0.2s;
}

.input-basic:focus {
  border-color: #6252FE;
  outline: none;
}

.btn-primary {
  background: #6252FE;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #4736b3;
}

.btn-secondary {
  background: white;
  border: 1.5px solid #6252FE;
  color: #6252FE;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: border 0.3s;
}
</style>