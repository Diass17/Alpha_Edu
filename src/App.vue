<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.path === '/login' ? 'div' : Layout
})
</script>
