<template>
  <div class="bg-gray-100 min-h-full p-4 sm:p-6 lg:p-8">
    <!-- Заголовок курса -->
    <h1 class="text-2xl sm:text-3xl font-bold mb-6">
      {{ courseName }}
    </h1>

    <!-- ======== РЕЖИМ 1: Нет потоков ======== -->
    <div
      v-if="flowsForCourse.length === 0 && !isEditing"
      class="flex flex-col items-center justify-center mt-12 space-y-4"
    >
      <p class="text-lg text-gray-700 text-center">
        Потоки еще не добавлены<br />
        Нажмите “Добавить поток”, чтобы начать
      </p>
      <el-button type="primary" size="large" @click="onAddFlow">
        Добавить поток
      </el-button>
    </div>

    <!-- ======== РЕЖИМ 2: Есть потоки (не в режиме редактирования) ======== -->
    <div v-else-if="flowsForCourse.length > 0 && !isEditing" class="space-y-3">
      <el-card
        v-for="flow in flowsForCourse"
        :key="flow.id"
        shadow="never"
        class="p-0 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
        @click="viewStudents(flow.id)"
      >
        <div
          class="w-full flex justify-between items-center px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8"
        >
          <span class="text-base sm:text-lg lg:text-xl font-medium">
            {{ flow.name }}
          </span>
          <el-icon>
            <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-500" />
          </el-icon>
        </div>
      </el-card>

      <div class="flex justify-end mt-6 space-x-2">
        <el-button type="success" @click="startEdit" size="small">
          Редактировать
        </el-button>
        <el-button type="primary" @click="onAddFlow" size="small">
          Добавить поток
        </el-button>
      </div>
    </div>

    <!-- ======== РЕЖИМ 3: РЕДАКТИРОВАНИЕ ======== -->
    <div v-else-if="isEditing" class="space-y-3">
      <el-checkbox-group v-model="selectedIds">
        <el-card
          v-for="flow in flowsForCourse"
          :key="flow.id"
          shadow="never"
          class="p-0 bg-white rounded-lg hover:bg-gray-50"
        >
          <div
            class="w-full flex items-center px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8 space-x-4"
          >
            <span class="flex-1 text-base sm:text-lg lg:text-xl font-medium">
              {{ flow.name }}
            </span>

            <el-icon class="text-purple-500">
              <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </el-icon>

            <el-checkbox :label="flow.id" class="ml-4" @click.stop />
          </div>
        </el-card>
      </el-checkbox-group>

      <div class="flex justify-end mt-6 space-x-2">
        <el-button type="success" @click="onApplyEdit" size="small">
          Редактировать
        </el-button>
        <el-button type="danger" @click="confirmDelete" size="small">
          Удалить
        </el-button>
      </div>
    </div>

    <!-- ======== DIALOG: Подтверждение удаления ======== -->
    <el-dialog
      v-model="showDeleteDialog"
      width="400px"
      show-close="false"
      center
      custom-class="delete-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-red-500 text-4xl mb-2">
          <Delete class="w-8 h-8" />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Удалить</h3>
        <p class="text-gray-700 mb-6 text-sm">
          Вы действительно хотите удалить
          <template v-if="selectedIds.length === 1">этот поток?</template>
          <template v-else>эти потоки?</template>
        </p>
        <div class="flex justify-center space-x-4">
          <el-button @click="showDeleteDialog = false" size="small">
            Отмена
          </el-button>
          <el-button type="danger" @click="onDelete" size="small">
            Удалить
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/store/courseStore'
import { useFlowStore, Flow } from '@/store/flowStore'
import { ArrowRight, Delete } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.id)

const courseStore = useCourseStore()
const flowStore = useFlowStore()

onMounted(async () => {
  await courseStore.fetchCourses()
  await flowStore.fetchFlows()
})

const courseName = computed<string>(() => {
  const c = courseStore.list.find((c) => c.id === courseId)
  return c ? c.name : 'Курс не найден'
})

const flowsForCourse = computed<Flow[]>(() =>
  flowStore.list.filter((f) => f.courseId === courseId)
)

const isEditing = ref(false)
const selectedIds = ref<number[]>([])
const showDeleteDialog = ref(false)

function startEdit() {
  isEditing.value = true
  selectedIds.value = []
}

function onApplyEdit() {
  if (selectedIds.value.length === 1) {
    const flowId = selectedIds.value[0]
    router.push({
      name: 'EditFlow',
      params: { courseId, flowId },
    })
  }
}

function onAddFlow() {
  router.push({ name: 'AddFlow', params: { courseId } })
}

// ✅ Здесь было FlowStudents — заменено на FlowDetail
function viewStudents(flowId: number) {
  router.push({ name: 'FlowDetail', params: { flowId } })
}

function confirmDelete() {
  if (selectedIds.value.length > 0) {
    showDeleteDialog.value = true
  }
}

function onDelete() {
  for (const id of selectedIds.value) {
    flowStore.removeFlow(id)
  }
  showDeleteDialog.value = false
  isEditing.value = false
  selectedIds.value = []
}
</script>

<style scoped>
.delete-dialog .el-dialog__body {
  padding: 0;
}
</style>
