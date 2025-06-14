<template>
  <div class="bg-gray-100 min-h-screen p-6 sm:p-8 lg:p-10">

    <h1 class="text-2xl sm:text-3xl font-bold mb-8">
      Редактировать название курса
    </h1>


    <div class="mb-6">
      <el-input
        v-model="form.name"
        placeholder="Название курса"
        clearable
        size="large"
        class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
      />
    </div>


    <div class="flex justify-end">
      <el-button type="primary" size="large" @click="saveCourse">
        Сохранить
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore, Course } from '@/store/courseStore'


const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()


const id = Number(route.params.id)


const form = ref({ name: '' })

onMounted(async () => {
  if (!courseStore.list.length) {
    await courseStore.fetchCourses()
  }
  const course: Course | undefined = courseStore.list.find(c => c.id === id)
  if (course) {
    form.value.name = course.name
  } else {
    router.push({ name: 'Flows' })
  }
})

async function saveCourse() {
  const trimmedName = form.value.name.trim()
  if (trimmedName === '') {
    return
  }
  await courseStore.updateCourse(id, trimmedName)
  router.push({ name: 'Flows' })
}
</script>

<style scoped>
</style>
