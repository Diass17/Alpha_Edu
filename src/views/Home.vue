<template>
  <div class="space-y-6 p-4 md:space-y-8 md:p-16">
    <!-- HERO BANNER -->
    <div class="bg-[#E0DEFB] rounded-2xl p-6 text-center md:p-24">
      <h1 class="text-2xl font-semibold text-gray-800 mb-2 md:text-3xl">
        IT-Академия, которая готовит будущих лидеров цифровой эпохи.
      </h1>
      <p class="text-sm text-gray-600 md:text-base">
        Путь к успешной карьере в IT — от веб-разработки до дизайна и анализа данных.
      </p>
    </div>

    <!-- STATS GRID -->
    <!-- Сетка: 1 колонка на мобильных, 3 на десктопе -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-2xl p-6 text-center shadow">
        <!-- Адаптивный размер шрифта -->
        <p class="text-4xl font-bold text-indigo-500 md:text-5xl">73%</p>
        <p class="mt-3 text-sm text-gray-600 md:text-base">
          выпускников трудоустраиваются по специальности вскоре после окончания обучения.
        </p>
      </div>

      <!-- Card 2 (highlight) -->
      <div class="bg-[#E0DEFB] rounded-2xl p-6 text-center shadow">
        <p class="text-4xl font-bold text-indigo-600 md:text-5xl">6+ лет</p>
        <p class="mt-3 text-sm text-gray-700 md:text-base">
          преподаём в разных IT направлениях
        </p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-2xl p-6 text-center shadow">
        <p class="text-4xl font-bold text-indigo-500 md:text-5xl">3000+</p>
        <p class="mt-3 text-sm text-gray-600 md:text-base">
          студентов, прошедших наши курсы по B2B и B2C направлениям
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Scoped styles if needed */
</style>```