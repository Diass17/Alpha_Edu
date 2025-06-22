<template>
  <div class="bg-gray-100 min-h-screen p-6 sm:p-10">
    <h1 class="text-2xl font-bold mb-6">Все курсы</h1>

    <!-- Список курсов -->
    <div class="space-y-3 mb-10">
      <div
        v-for="course in courses"
        :key="course.id"
        class="flex items-center justify-between bg-white rounded-lg px-6 py-4 shadow-sm"
        @click="!isEditMode && goToFlows(course.id)"
      >
        <div class="flex items-center space-x-4">
          <el-checkbox
            v-if="isEditMode"
            v-model="selected"
            :label="course.id"
          />
          <span class="text-lg font-medium">{{ course.name }}</span>
        </div>

        <el-icon
          class="cursor-pointer text-gray-400 hover:text-purple-500"
          @click="goToFlows(course.id)"
        >
          <i-ep-arrow-right-bold />
        </el-icon>
      </div>
    </div>

    <!-- Кнопки снизу -->
    <div class="flex justify-end space-x-4">
      <el-button
        type="primary"
        size="large"
        @click="goToAdd"
        v-if="!isEditMode"
      >
        Добавить курс
      </el-button>

      <el-button
        size="large"
        @click="toggleEdit"
        :type="isEditMode ? 'success' : ''"
      >
        Редактировать
      </el-button>

      <el-button
        type="success"
        size="large"
        @click="editSelected"
        v-if="isEditMode"
        :disabled="selected.length !== 1"
      >
        <template #icon><i-ep-edit /></template>
        Редактировать
      </el-button>

      <el-button
        type="danger"
        size="large"
        @click="showDeleteConfirm = true"
        v-if="isEditMode"
        :disabled="selected.length === 0"
      >
        <template #icon><i-ep-delete /></template>
        Удалить
      </el-button>
    </div>

    <!-- Модалка подтверждения удаления -->
    <el-dialog
      v-model="showDeleteConfirm"
      title="Удалить"
      width="400px"
      align-center
    >
      <span>Вы действительно хотите удалить {{ selected.length }} курс(ов)?</span>
      <template #footer>
        <el-button @click="showDeleteConfirm = false">Отмена</el-button>
        <el-button type="danger" @click="removeSelected">Удалить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCourseStore, type Course } from '@/store/courseStore'

const router = useRouter()
const courseStore = useCourseStore()

const courses = ref<Course[]>([])
const isEditMode = ref(false)
const selected = ref<number[]>([])
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await fetchCourses()
})

async function fetchCourses() {
  await courseStore.fetchCourses()
  courses.value = courseStore.list
}

function goToAdd() {
  router.push({ name: 'AddCourse' })
}

function toggleEdit() {
  isEditMode.value = !isEditMode.value
  selected.value = []
}

function goToFlows(id: number) {
  router.push({ name: 'CourseFlows', params: { id } })
}

function editSelected() {
  if (selected.value.length === 1) {
    router.push({ name: 'EditCourse', params: { id: selected.value[0] } })
  } else {
    ElMessage.warning('Выберите один курс для редактирования')
  }
}

async function removeSelected() {
  for (const id of selected.value) {
    await courseStore.removeCourse(id)
  }
  await fetchCourses()
  selected.value = []
  showDeleteConfirm.value = false
  isEditMode.value = false
  ElMessage.success('Курсы успешно удалены')
}
</script>
