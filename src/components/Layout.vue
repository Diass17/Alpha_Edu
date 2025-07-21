<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 1. САЙДБАР ДЛЯ ДЕСКТОПА (без изменений) -->
    <aside
      class="hidden md:flex w-[100px] bg-gray-900 text-white flex-col items-center py-12 space-y-6"
    >
      <button @click="navigate('/')"><img :src="logoCompany" alt="Company Logo" class="w-16 h-16" /></button>
      <button class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors" :class="isActive('/students') ? 'bg-[#6252FE]' : 'hover:bg-[#6252FE]'" @click="navigate('/students')"><img :src="logoPerson" alt="Students" class="w-8 h-8" /></button>
      <button class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors" :class="isActive('/flows') ? 'bg-[#6252FE]' : 'hover:bg-[#6252FE]'" @click="navigate('/flows')"><img :src="logoGroup" alt="Flows" class="w-8 h-8" /></button>
      <button class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors" :class="isActive('/finance') ? 'bg-[#6252FE]' : 'hover:bg-[#6252FE]'" @click="navigate('/finance')"><img :src="logoMonitor" alt="Finance" class="w-8 h-8" /></button>
    </aside>

    <!-- 2. ВЫДВИЖНОЙ САЙДБАР ДЛЯ МОБИЛЬНЫХ -->
    <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-blue-900 bg-opacity-20 z-20 md:hidden"></div>
    <aside :class="['fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white transform transition-transform duration-300 ease-in-out z-30 md:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
        <div class="p-4">
            <div class="flex items-center gap-3 p-2 mb-6"><img :src="logoCompany" alt="Company Logo" class="h-12 w-12" /><span class="font-bold text-lg text-gray-800">Alpha<br />Education</span></div>
            <nav class="flex flex-col text-gray-700 font-medium">
                <button @click="navigate('/students')" class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"><img :src="logoPerson" class="w-6 h-6" /><span>Управление студентами</span></button>
                <button @click="navigate('/flows')" class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"><img :src="logoGroup" class="w-6 h-6" /><span>Управление курсами</span></button>
                <div>
                    <button @click="navigate('/finance')" class="flex items-center gap-4 p-3 rounded-lg w-full text-left hover:bg-gray-100"><img :src="logoMonitor" class="w-6 h-6" /><span>Финансовый модуль</span></button>
                    <div class="pl-14 mt-2 space-y-3 text-sm text-gray-500">
                        <a href="#" @click.prevent="navigate('/finance/payments')" class="block hover:text-gray-900">Оплаты студентов</a>
                        <a href="#" @click.prevent="navigate('/finance/reports')" class="block hover:text-gray-900">Отчеты</a>
                    </div>
                </div>
                <hr class="my-4 border-gray-200" />
                <button class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>Настройки</span></button>
                <button class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg><span>Сменить пользователя</span></button>
                <button class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg><span>Выйти</span></button>
            </nav>
        </div>
    </aside>

    <!-- 3. ОСНОВНАЯ ЧАСТЬ -->
    <div class="flex flex-col flex-1">
      <!-- ДИНАМИЧЕСКИЙ HEADER -->
      <header class="bg-gray-900 text-white flex items-center h-16 px-4 justify-between relative">
        <!-- Левая иконка (только на мобильных) -->
        <div class="md:hidden">
            <button v-if="headerConfig.showBackArrow" @click="goBack" class="p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button v-else @click="toggleSidebar" class="p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>

        <!-- Центральный контент (только на мобильных) -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <h1 v-if="headerConfig.title" class="text-lg font-bold">{{ headerConfig.title }}</h1>
          <img v-else :src="logoCompany" alt="Company Logo" class="h-10" />
        </div>
        
        <!-- Правый контент (только на мобильных) -->
        <div class="relative md:hidden">
            <button v-if="headerConfig.showNotifications" class="p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span class="absolute top-1 right-1 block h-4 w-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">1</span>
            </button>
            <div v-else class="w-8 h-8"></div>
        </div>

        <div class="hidden md:block w-full"></div>
      </header>

      <!-- ОСНОВНОЙ КОНТЕНТ -->
      <main class="flex-1 p-4 md:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logoCompany from '@/assets/logos/company-logo.svg'
import logoPerson from '@/assets/logos/person.png'
import logoGroup from '@/assets/logos/group.png'
import logoMonitor from '@/assets/logos/monitor.png'

const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)

// Улучшенная логика для хедера
const headerConfig = computed(() => {
  const path = route.path;
  if (path === '/students') {
    return { title: 'Студенты', showBackArrow: false, showNotifications: false };
  }
  if (path.startsWith('/students/')) { 
    return { title: 'Профиль студента', showBackArrow: true, showNotifications: false };
  }
  return { title: '', showBackArrow: false, showNotifications: true };
});

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
const closeSidebar = () => { isSidebarOpen.value = false }
const goBack = () => { router.back() }

function navigate(path: string) {
  router.push(path)
  closeSidebar()
}

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>