<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Потоки курса: {{ courseName || '...' }}</h2>

    <div v-if="flows.length">
      <div
        v-for="flow in flows"
        :key="flow.id"
        class="bg-white rounded p-4 mb-3 shadow flex justify-between items-center"
      >
        <div>
          <h3 class="text-lg font-semibold">{{ flow.name }}</h3>
          <p class="text-gray-500">{{ flow.mentor || 'Без ментора' }}</p>
        </div>
        <el-button size="small" @click="goToEdit(flow.id)">Редактировать</el-button>
      </div>
    </div>

    <div v-else class="text-gray-500 mt-4">Пока нет потоков</div>

    <div class="mt-6">
      <el-button type="primary" @click="goToAddFlow">Добавить поток</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlowStore } from '@/store/flowStore'
import { useCourseStore } from '@/store/courseStore'

const router = useRouter()
const route = useRoute()

const flowStore = useFlowStore()
const courseStore = useCourseStore()

const courseId = Number(route.params.id)
const courseName = ref('')

const flows = ref([])

onMounted(async () => {
  await flowStore.fetchFlows(courseId)
  flows.value = flowStore.list

  // Опционально получаем имя курса
  if (!courseStore.list.length) {
    await courseStore.fetchCourses()
  }
  const course = courseStore.list.find((c) => c.id === courseId)
  if (course) {
    courseName.value = course.name
  }
})

function goToAddFlow() {
  router.push({ name: 'AddFlow', query: { courseId: courseId.toString() } })
}

function goToEdit(flowId: number) {
  router.push({ name: 'EditFlow', params: { flowId } })
}
</script>
