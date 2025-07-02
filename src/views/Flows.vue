<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Потоки курса: {{ courseName || '...' }}</h2>

    <div v-if="flows.length">
      <div
        v-for="flow in flows"
        :key="flow.id"
        class="bg-white rounded p-4 mb-3 shadow flex justify-between items-center cursor-pointer hover:bg-gray-50"
        @click="goToDetail(flow.id)"
        role="button"
        tabindex="0"
      >
        <div>
          <h3 class="text-lg font-semibold">{{ flow.name }}</h3>
          <p class="text-gray-500">{{ flow.mentor || 'Без ментора' }}</p>
        </div>

        <!-- Важно: @click.stop чтобы не срабатывал клик на родителя -->
        <el-button size="small" @click.stop="goToEdit(flow.id)">
          Редактировать
        </el-button>
      </div>
    </div>

    <div v-else class="text-gray-500 mt-4">Пока нет потоков</div>

    <div class="mt-6">
      <el-button type="primary" @click="goToAddFlow">Добавить поток</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlowStore } from '@/store/flowStore'
import { useCourseStore } from '@/store/courseStore'

const route = useRoute()
const router = useRouter()

const courseId = Number(route.params.id)

const flowStore = useFlowStore()
const courseStore = useCourseStore()

const courseName = ref('')
const flows = computed(() =>
  flowStore.list.filter((f) => f.courseId === courseId)
)

onMounted(async () => {
  await flowStore.fetchFlows(courseId)

  if (!courseStore.list.length) {
    await courseStore.fetchCourses()
  }
  const course = courseStore.list.find((c) => c.id === courseId)
  if (course) {
    courseName.value = course.name
  }
})

function goToDetail(flowId: number) {
  router.push({ name: 'FlowDetail', params: { flowId } })
}

function goToEdit(flowId: number) {
  router.push({ name: 'EditFlow', params: { flowId } })
}

function goToAddFlow() {
  router.push({ name: 'AddFlow', params: { courseId } })
}
</script>
