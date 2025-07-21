<!-- src/views/StudentForm.vue -->
<template>
  <div class="min-h-screen bg-white md:flex">
    <div class="hidden md:block w-20"></div>
    <div class="hidden md:block flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6">Добавить студента</h1>
      <el-form ref="formRef" :model="form" label-width="0" class="space-y-4">
        <el-input v-model="form.surname" placeholder="Фамилия" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <el-input v-model="form.firstName" placeholder="Имя" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <el-input v-model="form.patronymic" placeholder="Отчество" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <el-input v-model="form.iin" placeholder="010101345678" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <el-input v-model="form.email" placeholder="ivanovivan@gmail.com" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <el-input v-model="form.phone" placeholder="+7(700)-567-78-89" size="large" clearable class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg" />
        <div class="mt-6 space-y-4">
          <el-select v-model="form.course" placeholder="Курс" size="large" clearable class="w-full bg-purple-50 rounded-xl text-lg" >
            <el-option label="Data Science" value="Data Science" />
            <el-option label="Generative AI" value="Generative AI" />
            <el-option label="Введение в программирование" value="Введение в программирование"/>
          </el-select>
          <div class="flex space-x-4">
            <el-select v-model="form.status" placeholder="Статус" size="large" clearable class="flex-1 bg-purple-50 rounded-xl text-lg shadow-none">
              <el-option label="Студент" value="student" />
              <el-option label="Выпускник" value="graduate" />
            </el-select>
            <div class="flex items-center bg-purple-50 rounded-xl px-4" style="height:3.5rem">
              <span class="text-lg text-gray-700 mr-2">Top Student</span>
              <el-checkbox v-model="form.topStudent" />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <el-select v-model="form.financing" placeholder="Финансирование" size="large" clearable class="flex-1 bg-purple-50 rounded-xl text-lg">
              <el-option label="Полная оплата" value="full" />
              <el-option label="Со скидкой 30%" value="discount30" />
              <el-option label="Со скидкой 70%" value="discount70" />
              <el-option label="Грант" value="grant" />
            </el-select>
            <el-button type="primary" icon="Plus" size="large" class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white" @click="addCourse">Добавить курс</el-button>
          </div>
        </div>
      </el-form>
      <div class="mt-6 rounded-xl border border-purple-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-purple-50">
            <tr><th class="py-3 px-6 text-left text-lg text-gray-800">Показатель</th><th class="py-3 px-6 text-right text-lg text-gray-800">Сумма</th></tr>
          </thead>
          <tbody>
            <tr class="border-t"><td class="py-4 px-6">Оплата за курс</td><td class="py-4 px-6 text-right">—</td></tr>
            <tr class="border-t"><td class="py-4 px-6">Сумма со скидкой</td><td class="py-4 px-6 text-right">—</td></tr>
            <tr class="border-t">
              <td class="py-4 px-6">Выбор период оплаты</td>
              <td class="py-4 px-6 text-right">
                <el-select v-model="form.paymentPeriod" placeholder="Выбрать" clearable class="w-40 bg-white rounded-lg text-lg">
                  <el-option label="Полная сумма" value="full" /><el-option label="2 месяца" value="2" /><el-option label="3 месяца" value="3" /><el-option label="6 месяцев" value="6" /><el-option label="12 месяцев" value="12" />
                </el-select>
              </td>
            </tr>
            <tr class="border-t"><td class="py-4 px-6">Сумма оплачено</td><td class="py-4 px-6 text-right">—</td></tr>
            <tr class="border-t"><td class="py-4 px-6">Сумма к оплате</td><td class="py-4 px-6 text-right">—</td></tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end mt-6">
        <el-button type="primary" size="large" class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white" @click="confirmSave">Сохранить профиль</el-button>
      </div>
    </div>

    <div class="md:hidden flex-1 p-4 pb-24"> <!-- Добавлен нижний паддинг для кнопки -->
      <h1 class="text-2xl font-bold mb-6">Добавить студента</h1>
      <el-form ref="formRef" :model="form" label-width="0" class="space-y-3">
        <el-input v-model="form.surname" placeholder="Фамилия" class="mobile-form-field" />
        <el-input v-model="form.firstName" placeholder="Имя" class="mobile-form-field" />
        <el-input v-model="form.patronymic" placeholder="Отчество" class="mobile-form-field" />
        <el-input v-model="form.iin" placeholder="ИИН" class="mobile-form-field" />
        <el-input v-model="form.email" placeholder="Email" class="mobile-form-field" />
        <el-input v-model="form.phone" placeholder="+7(xxx)-xxx-xx-xx" class="mobile-form-field" />
        <el-input v-model="form.telegram" placeholder="Telegram (никнейм)" class="mobile-form-field" />
        
        <!-- Выпадающие списки с вариантами выбора -->
        <el-select v-model="form.course" placeholder="Курс" class="mobile-form-field w-full">
            <el-option label="Data Science" value="Data Science" />
            <el-option label="Generative AI" value="Generative AI" />
            <el-option label="Введение в программирование" value="Введение в программирование"/>
        </el-select>
        <el-select v-model="form.status" placeholder="Статус" class="mobile-form-field w-full">
            <el-option label="Студент" value="student" />
            <el-option label="Выпускник" value="graduate" />
        </el-select>
        <div class="mobile-form-field as-checkbox">
          <span class="placeholder-text">Top Student</span>
          <el-checkbox v-model="form.topStudent" size="large" />
        </div>
        <el-select v-model="form.financing" placeholder="Финансирование" class="mobile-form-field w-full">
            <el-option label="Полная оплата" value="full" />
            <el-option label="Со скидкой 30%" value="discount30" />
            <el-option label="Со скидкой 70%" value="discount70" />
            <el-option label="Грант" value="grant" />
        </el-select>
      </el-form>
      <div class="mt-6 rounded-xl border-2 border-[#E0DEFB] overflow-hidden">
        <div class="p-3 flex justify-between items-center"><span class="font-bold text-gray-800">Оплата за курс</span><span class="text-gray-500">—</span></div>
        <div class="border-t border-[#E0DEFB] p-3 flex justify-between items-center"><span class="text-gray-600">Сумма со скидкой</span><span class="text-gray-500">—</span></div>
        <div class="border-t border-[#E0DEFB] p-3 flex justify-between items-center"><span class="text-gray-600">Выбор период оплаты</span><span class="text-gray-500">—</span></div>
        <div class="border-t border-[#E0DEFB] p-3 flex justify-between items-center"><span class="text-gray-600">Сумма оплачено</span><span class="text-gray-500">—</span></div>
        <div class="border-t border-[#E0DEFB] p-3 flex justify-between items-center"><span class="text-gray-600">Сумма к оплате</span><span class="text-gray-500">—</span></div>
      </div>
      <div class="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100">
        <el-button type="primary" size="large" class="w-full h-[48px] bg-[#6252FE] hover:bg-purple-700 rounded-xl text-white font-semibold" @click="confirmSave">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Сохранить профиль
        </el-button>
      </div>
    </div>
    
    <!-- Диалог успеха (общий) -->
    <el-dialog v-model="showSuccess" width="320px" show-close="false" center custom-class="success-dialog">
      <div class="text-center p-6">
        <el-icon class="text-green-500 text-4xl mb-2"><SuccessFilled /></el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-700 mb-6">Аккаунт студента успешно сохранён</p>
        <el-button type="primary" size="small" @click="onSuccessContinue">Далее</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, SuccessFilled } from '@element-plus/icons-vue'

interface StudentForm {
  surname: string; firstName: string; patronymic: string; iin: string; email: string; phone: string; telegram: string;
  course: string; status: string; topStudent: boolean; financing: string; paymentPeriod: string;
}

const router = useRouter()
const formRef = ref()
const form = ref<StudentForm>({
  surname: '', firstName: '', patronymic: '', iin: '', email: '', phone: '', telegram: '',
  course: '', status: '', topStudent: false, financing: '', paymentPeriod: ''
})
const showSuccess = ref(false)

function addCourse() { ElMessage.success('Курс добавлен') }
function confirmSave() { showSuccess.value = true; }
function onSuccessContinue() {
  showSuccess.value = false
  router.push({ name: 'Students' })
}
</script>

<style>
.md\:hidden .mobile-form-field .el-input__wrapper,
.md\:hidden .mobile-form-field.el-select .el-input__wrapper {
  background-color: #F1EFFF !important;
  box-shadow: none !important;
  border-radius: 10px !important;
  padding: 0 15px;
  height: 42px;
}
.md\:hidden .mobile-form-field .el-input__inner::placeholder {
  color: #a7a3ff;
}
.md\:hidden .mobile-form-field .el-select__placeholder {
  color: #a7a3ff;
}

.md\:hidden .mobile-form-field.as-checkbox {
  background-color: #F1EFFF;
  border-radius: 10px;
  padding: 0 15px;
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.md\:hidden .mobile-form-field.as-checkbox .placeholder-text {
  color: #a7a3ff;
}
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>