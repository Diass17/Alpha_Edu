<template>
  <!-- Если текущий путь — login или verification, показываем без Layout -->
  <router-view v-if="noLayoutRoutes.includes(route.path)" />

  <!-- Иначе оборачиваем в layout с хэдером и сайдбаром -->
  <Layout v-else>
    <router-view />
  </Layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'

const route = useRoute()

// Пути, на которых не нужно показывать Layout
const noLayoutRoutes = ['/login', '/verification']
</script>
