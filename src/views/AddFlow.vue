<template>
  <div class="add-flow-container">
    <h2 class="title">Добавить поток</h2>

    <div class="form">
      <el-input
        v-model="form.name"
        placeholder="Название"
        class="custom-input"
      />
      <el-input
        v-model="form.mentor"
        placeholder="Преподаватель"
        class="custom-input"
      />

      <div class="date-row">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="Начало потока"
          class="custom-date-picker"
        />
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="Завершение потока"
          class="custom-date-picker"
        />
      </div>

      <el-button
        type="primary"
        class="create-button"
        @click="createFlow"
      >
        Создать поток
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useFlowStore } from '@/store/flowStore'

const flowStore = useFlowStore()
const router = useRouter()
const route = useRoute()

// ✅ Получаем courseId из маршрута
const courseId = Number(route.params.courseId)

const form = ref({
  name: '',
  mentor: '',
  startDate: '',
  endDate: '',
})

const createFlow = async () => {
  try {
    await flowStore.createFlow({
      name: form.value.name,
      mentor: form.value.mentor,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      courseId: courseId, // 👈 обязательно явно!
    })

    ElMessage.success('Поток успешно создан!')
    router.push(`/courses/${courseId}/flows`)
  } catch (error) {
    console.error('❌ Ошибка при создании потока:', error)
    ElMessage.error('Ошибка при создании потока')
  }
}
</script>

<style scoped>
.add-flow-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.custom-input ::v-deep(.el-input__wrapper) {
  background-color: #F1EFFF;
  border: none;
  border-radius: 6px;
  box-shadow: none;
  padding: 0 !important;
  height: 48px;
}

.custom-input ::v-deep(.el-input__inner) {
  background-color: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  color: #BBB4FF;
}

.date-row {
  display: flex;
  gap: 20px;
}

.custom-date-picker {
  --el-input-bg-color: #BBB4FF;
  --el-input-border-color: #BBB4FF;
  border-radius: 12px;
  width: 300px;
  height: 50px;
  background-color: #BBB4FF;
  border: none;
  display: flex;
  align-items: center;
  padding-left: 12px;
  font-size: 16px;
  color: #333;
}

.custom-date-picker .el-input__wrapper {
  border-radius: 12px !important;
  background-color: #BBB4FF !important;
  box-shadow: none !important;
  padding-left: 12px;
}

.custom-date-picker .el-input__inner {
  background-color: transparent !important;
}

.create-button {
  align-self: flex-end;
  background-color: #6252FE;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  padding: 12px 24px;
  font-size: 14px;
}
</style>
