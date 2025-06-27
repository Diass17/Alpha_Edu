<template>
  <div class="min-h-screen bg-white flex">
    <!-- Логотип и надпись -->
    <div class="absolute top-6 left-6 flex items-center gap-2 z-10">
      <img src="@/assets/logos/company-logo.svg" alt="logo" class="w-14 h-14" />
      <span class="text-[#2B3674] text-[22px] font-semibold font-['Inter']">
        Alpha<br /> Education
      </span>
    </div>

    <!-- Основной контейнер -->
    <div class="flex flex-col md:flex-row w-full h-screen">
      <!-- Левая часть (белый фон) -->
      <div class="hidden md:flex w-1/2 bg-white items-center justify-center p-8">
        <!-- Уменьшенная картинка (добавлен класс max-h-[70vh] для контроля размера) -->
        <img src="@/assets/logos/Image 4.png" alt="illustration" class="max-w-full max-h-[40vh] object-contain" />
      </div>

      <!-- Правая часть (голубой фон) -->
      <div class="w-full md:w-1/2 bg-[#E9E7FF] flex items-center justify-center p-4 md:p-8">
        <!-- Белая форма с рамкой и тенью снизу -->
        <div class="w-full max-w-md bg-white rounded-2xl p-8 border border-[#E0E5F2] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
          <h2 class="text-2xl font-bold text-[#2B3674] mb-6">Войти в личный кабинет</h2>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Поле логина -->
            <div>
              <label for="login" class="block text-sm font-medium text-[#2B3674] mb-2">Логин</label>
              <input
                v-model="login"
                id="login"
                type="text"
                placeholder="Введите логин"
                class="w-full px-4 py-3 rounded-xl border border-[#E0E5F2] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent placeholder-[#A3AED0] transition-colors"
                required
              />
            </div>

            <!-- Поле пароля -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="password" class="block text-sm font-medium text-[#2B3674]">Пароль</label>
                <button
                  type="button"
                  @click="handleForgotPassword"
                  class="text-sm text-[#4318FF] font-medium hover:text-[#A78BFA] transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Введите пароль"
                  class="w-full px-4 py-3 pr-10 rounded-xl border border-[#E0E5F2] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent placeholder-[#A3AED0] transition-colors"
                  required
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A3AED0] hover:text-[#A78BFA] transition-colors"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7S1 12 1 12z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Кнопка входа -->
            <button
              type="submit"
              class="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white py-3 rounded-xl font-semibold transition-colors shadow-md"
            >
              Войти
            </button>

            <p v-if="error" class="text-red-500 text-sm text-center mt-3">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const login = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  if (!login.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  localStorage.setItem('token', 'example_token')
  router.push('/')
}

const handleForgotPassword = () => {
  router.push('/verification')
}
</script>