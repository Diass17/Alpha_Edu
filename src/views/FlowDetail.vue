<!-- src/views/FlowDetail.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- 1) Header + Search -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
      <h1 class="text-2xl font-semibold mb-4 md:mb-0">
        {{ currentFlow?.name || 'Список студентов' }}
      </h1>
      <div class="relative w-full md:w-1/3">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск"
          clearable
          class="w-full bg-purple-50 border border-purple-200 rounded-lg pl-10 pr-4 py-2"
          @clear="applyFilters"
          @keyup.enter="applyFilters"
        >
          <template #prefix>
            <Search class="text-purple-400" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- 2) Actions panel -->
    <div class="mb-6 bg-purple-50 p-4 rounded-lg flex flex-wrap gap-2 items-center">
      <!-- always “Add student” -->
      <el-button
        type="primary"
        size="small"
        @click="enterAddMode"
      >
        Добавить студента
      </el-button>

      <!-- only show “Edit flow” when there’s ≥1 student -->
      <el-button
        v-if="currentFlow && currentFlow.studentIds.length"
        plain
        size="small"
        @click="goEditFlow"
      >
        <el-icon><Edit /></el-icon>
        Редактировать поток
      </el-button>
    </div>

    <!-- 3) Add‐mode: filter panel -->
    <el-card
      v-if="adding"
      shadow="never"
      class="mb-6 bg-purple-50 p-4 rounded-lg"
    >
      <div class="flex flex-wrap items-center gap-4">
        <el-select
          v-model="filter.course"
          placeholder="Выбрать курс"
          clearable
          class="w-48"
          @clear="applyFilters"
          @change="applyFilters"
        >
          <el-option
            v-for="c in courses"
            :key="c"
            :label="c"
            :value="c"
          />
        </el-select>

        <el-select
          v-model="filter.stream"
          placeholder="Выбрать поток"
          clearable
          class="w-48"
          @clear="applyFilters"
          @change="applyFilters"
        >
          <el-option
            v-for="s in streams"
            :key="s"
            :label="s"
            :value="s"
          />
        </el-select>

        <div class="flex items-center">
          <el-checkbox v-model="filter.topStudent" @change="applyFilters" />
          <span class="ml-2 select-none">Top Student</span>
        </div>

        <el-button
          type="primary"
          size="small"
          class="ml-auto"
          @click="saveSelection"
        >
          Добавить
        </el-button>
      </div>
    </el-card>

    <!-- 4) Students table -->
    <div class="overflow-auto">
      <table class="min-w-full bg-white border rounded-lg">
        <thead class="bg-purple-50">
          <tr>
            <th class="px-6 py-3 text-purple-700 text-left">Студент</th>
            <th class="px-6 py-3 text-purple-700 text-left">ИИН</th>
            <th v-if="adding" class="w-12 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in displayedStudents"
            :key="s.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-6 py-4">{{ s.name }}</td>
            <td class="px-6 py-4">{{ s.iin }}</td>
            <td v-if="adding" class="px-6 py-4 text-center">
              <el-checkbox
                :model-value="selected.includes(s.id)"
                @change="(v: boolean) => toggleCheckbox(s.id, v)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5) Success dialog -->
    <el-dialog
      v-model:="showSuccess"
      width="320px"
      show-close="false"
      center
      custom-class="success-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-green-500 text-4xl mb-2"><SuccessFilled /></el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Студенты добавлены в поток</p>
        <el-button type="primary" size="small" @click="onContinue">
          Далее
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from '@/store/studentStore'
import { useFlowStore, Flow } from '@/store/flowStore'
import { Search, Filter, Plus, Edit, SuccessFilled } from '@element-plus/icons-vue'

// router & stores
const route        = useRoute()
const router       = useRouter()
const studentStore = useStudentStore()
const flowStore    = useFlowStore()

// derive flowId
const flowId = Number(route.query.flowId ?? route.params.flowId)

// find the flow
const currentFlow = computed<Flow|undefined>(
  () => flowStore.list.find(f => f.id === flowId)
)

// UI state
const adding      = ref(false)
const showSuccess = ref(false)
const searchQuery = ref('')
const filter      = ref({ course: '', stream: '', topStudent: false })
const selected    = ref<number[]>([])

// filter options
const courses = [
  'Data Science','Generative AI','IT право',
  'Введение в программирование','Вэб-разработка',
  'Графический и UI/UX дизайн','Машинное обучение и ИИ',
  'Мобильная разработка','Разработка игр',
  'Сети и информационная безопасность',
]
const streams = ['A1','B2','C3','D4']

// fetch once
onMounted(async () => {
  if (!studentStore.list.length) await studentStore.fetchStudents()
  if (!flowStore.list.length)    await flowStore.fetchFlows()
})

// all students matching filters
const filteredStudents = computed(() =>
  studentStore.list.filter(s => {
    const bySearch = !searchQuery.value
      || s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const byCourse = !filter.value.course || s.course === filter.value.course
    const byStream = !filter.value.stream || s.stream === filter.value.stream
    const byTop    = !filter.value.topStudent || s.topStudent
    return bySearch && byCourse && byStream && byTop
  })
)

// which students to actually show in the table
const displayedStudents = computed(() => {
  if (adding.value) {
    return filteredStudents.value
  } else if (currentFlow.value) {
    return studentStore.list.filter(s =>
      currentFlow.value!.studentIds.includes(s.id)
    )
  }
  return []
})

// enter adding mode
function enterAddMode() {
  adding.value = true
  // pre-select the ones already in the flow
  selected.value = currentFlow.value
    ? [...currentFlow.value.studentIds]
    : []
}

// go edit-flow (metadata) if you have a page
function goEditFlow() {
  if (flowId) router.push({ name: 'EditFlow', params: { id: flowId } })
}

// clear search & filters
function applyFilters() {}

// toggle a checkbox
function toggleCheckbox(id: number, checked: boolean) {
  if (checked) {
    if (!selected.value.includes(id)) selected.value.push(id)
  } else {
    selected.value = selected.value.filter(x => x !== id)
  }
}

// commit additions
async function saveSelection() {
  if (!currentFlow.value) return
  for (const sid of selected.value) {
    await flowStore.addStudentToFlow(flowId, sid)
  }
  showSuccess.value = true
}

// close popup & return to view mode
function onContinue() {
  showSuccess.value = false
  adding.value      = false
  filter.value      = { course: '', stream: '', topStudent: false }
  searchQuery.value = ''
  selected.value    = []
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
