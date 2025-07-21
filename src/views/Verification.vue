<template>
  <div class="min-h-screen bg-[#F5F3FF] flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Картинка -->
    <img
      src="@/assets/logos/image 6.png"
      alt="decor"
      class="absolute z-0 w-[230px] h-[230px]"
      style="left: 285px; top: 140px;"
    />

    <!-- Форма -->
    <div class="relative z-10 bg-white rounded-xl shadow-md w-[804px] h-[301px] px-8 py-8 flex flex-col justify-center">
      <h2 class="text-[25px] font-semibold text-[#201F1F] font-['Inter'] mb-2">Забыли свой пароль?</h2>
      <p class="text-[20px] font-semibold text-[#333] font-['Inter'] mb-6">
        Введите адрес своей электронной почты для восстановления доступа
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
          <!-- Иконка -->
          <div class="flex items-center pl-4 pr-3 h-full">
            <img src="@/assets/logos/image 7.png" alt="icon" class="w-5 h-5 object-contain" />
          </div>

          <!-- Вертикальная линия -->
          <div class="w-px h-6 bg-gray-300 mr-3"></div>

          <!-- Поле ввода -->
          <input
            v-model="email"
            type="email"
            placeholder="Адрес электронной почты"
            class="w-full py-3 pr-4 text-sm focus:outline-none bg-transparent placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#A78BFA] hover:bg-[#8B70EF] text-white py-2 rounded-md transition font-medium"
        >
          Восстановить доступ
        </button>
      </form>

      <p class="text-center mt-4 text-sm">
        <router-link to="/login" class="text-[#5B76F2] hover:underline">
          Вернуться на страницу авторизации
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const handleSubmit = () => {
  if (!email.value) return

  // Пример уведомления (в будущем можно заменить на toast)
  alert(`Письмо отправлено на: ${email.value}`)

  // Здесь останется на той же странице
}
</script>