<template>
  <div class="min-h-screen flex">
    <!--  Логотип  -->
    <div class="absolute top-6 left-6 hidden md:flex items-center gap-2 z-10">
      <img src="@/assets/logos/company-logo.svg" alt="logo" class="w-14 h-14" />
      <span class="text-[#2B3674] text-[22px] font-semibold font-['Inter']">
        Alpha<br /> Education
      </span>
    </div>

    <!-- Контейнер колонок -->
    <div class="flex flex-col md:flex-row w-full">
      <!-- Левая часть (иллюстрация) - всегда белая -->
      <div class="hidden md:flex w-1/2 bg-white items-center justify-center p-8 h-screen">
        <img src="@/assets/logos/Image 4.png" alt="illustration" class="max-w-full max-h-[40vh] object-contain" />
      </div>

      <!-- Правая часть -->
      <div class="w-full md:w-1/2 bg-[#F5F3FF] flex flex-col items-center justify-center p-4 h-screen">
        
        <!-- Логотип и название для мобильной версии -->
        <div class="flex flex-row items-center justify-center gap-3 mb-6 md:hidden">
          <img src="@/assets/logos/company-logo.svg" alt="logo" class="w-14 h-14" />
          <span class="text-[#2B3674] text-xl font-bold">Alpha<br />Education</span>
        </div>

        <div class="w-full max-w-[350px] bg-white rounded-3xl p-6 border border-[#E0E5F2] shadow-md
                    md:max-w-md md:p-8 md:rounded-2xl">
          
          <h2 class="text-2xl font-bold text-center text-[#2B3674] mb-6 md:text-left">
            Войти в личный кабинет
          </h2>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Логин -->
            <div>
              <label for="login" class="block text-sm font-medium text-[#2B3674] mb-2">Логин</label>
              <input
                v-model="login"
                id="login"
                type="text"
                placeholder="Логин"
                :class="[
                  'w-full px-4 py-3 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:border-transparent',
                  loginError 
                    ? 'border-red-500 bg-red-100 focus:ring-red-300' 
                    : 'border-[#E0E5F2] bg-white focus:ring-[#A78BFA]'
                ]"
              />
              <p v-if="loginError" class="text-red-500 text-xs mt-1">Неверный формат почты</p>
            </div>

            <!-- Пароль -->
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
                  placeholder="Пароль"
                  :class="[
                    'w-full px-4 py-3 pr-10 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:border-transparent',
                    passwordError 
                      ? 'border-red-500 bg-red-100 focus:ring-red-300' 
                      : 'border-[#E0E5F2] bg-white focus:ring-[#A78BFA]'
                  ]"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A3AED0] hover:text-[#A78BFA] transition-colors"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7S1 12 1 12z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
              <p v-if="passwordError" class="text-red-500 text-xs mt-1">Неверный пароль</p>
            </div>

            <!-- Кнопка "Войти" -->
            <button
              type="submit"
              class="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-xl font-semibold transition-colors shadow-md md:bg-[#A78BFA] md:hover:bg-[#8B5CF6]"
            >
              Войти
            </button>
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
const loginError = ref(false)
const passwordError = ref(false)
const showPassword = ref(false)
const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateEmail = (email: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

const handleLogin = () => {
  loginError.value = !validateEmail(login.value)
  passwordError.value = password.value !== 'admin123' // простой пример проверки

  if (loginError.value || passwordError.value) return

  // Успешный вход
  localStorage.setItem('token', 'example_token')
  router.push('/')
}

const handleForgotPassword = () => {
  router.push('/verification')
}
</script>