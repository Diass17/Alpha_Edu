<template>
  <div class="flex items-center justify-center h-full bg-gray-100 p-6">
    <el-card class="w-full max-w-xl px-6 py-8 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-6">Добавить поток</h2>

      <el-form :model="form" ref="formRef" label-width="0" class="space-y-6">
        <!-- 1) Название потока -->
        <el-input
          v-model="form.name"
          placeholder="Название потока (например, DSF-1)"
          clearable
          size="large"
          class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
        />

        <!-- 2) Ментор -->
        <el-input
          v-model="form.mentor"
          placeholder="Ментор"
          clearable
          size="large"
          class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
        />

        <!-- 3) Даты начала и окончания -->
        <div class="grid grid-cols-2 gap-4">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="Дата начала"
            size="large"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
          />
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="Дата окончания"
            size="large"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
          />
        </div>

        <!-- 4) Кнопка -->
        <div class="flex justify-end mt-4">
          <el-button type="primary" size="large" @click="submitFlow">
            Создать поток
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 5) Диалог успеха -->
    <el-dialog
      v-model="showFlowCreated"
      width="320px"
      show-close="false"
      center
      custom-class="success-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-green-500 text-4xl mb-2">
          <SuccessFilled class="w-8 h-8" />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Поток успешно создан</p>
        <el-button type="primary" size="small" @click="onFlowCreatedContinue">
          Далее
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useFlowStore, Flow } from '@/store/flowStore'
import { SuccessFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const flowStore = useFlowStore()

// ✅ Получаем courseId из маршрута (не из query!)
const courseId = Number(route.params.courseId)
if (isNaN(courseId)) {
  ElMessage.error('Ошибка: courseId отсутствует в маршруте.')
  router.push('/courses')
}

const formRef = ref()
const form = ref({
  name: '',
  mentor: '',
  startDate: '',
  endDate: '',
})

// 🎉 диалог успешного создания
const showFlowCreated = ref(false)

async function submitFlow() {
  if (!form.value.name.trim()) {
    ElMessage.warning('Введите название потока')
    return
  }

  try {
    const newFlow: Omit<Flow, 'id'> = {
      name: form.value.name.trim(),
      mentor: form.value.mentor.trim(),
      startDate: form.value.startDate || undefined,
      endDate: form.value.endDate || undefined,
      courseId,
    }

    await flowStore.createFlow(newFlow)
    await flowStore.fetchFlows()
    showFlowCreated.value = true
  } catch (err) {
    console.error('Ошибка при создании потока:', err)
    ElMessage.error('Не удалось создать поток')
  }
}

function onFlowCreatedContinue() {
  showFlowCreated.value = false
  router.push(`/courses/${courseId}/flows`)
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
