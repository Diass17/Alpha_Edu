<template>
  <div class="finance-container finance-reset">
    <!-- Левая панель -->
    <div class="sidebar" v-if="showSidebar">
      <div class="header">
        <h2>Финансовый модуль</h2>
        <button class="close-btn" @click="closeSidebar">✕</button>
      </div>
      <hr class="sidebar-divider"/>
      <div class="button-group">
        <router-link to="/finance/payments" class="finance-btn">
          Оплаты студентов
        </router-link>
        <router-link to="/finance/reports" class="finance-btn">
          Отчёты
        </router-link>
      </div>
    </div>

    <!-- Основное содержимое: здесь будут дети -->
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<!-- Script -->
<script setup>
import { ref } from 'vue'

const showSidebar = ref(true)

function closeSidebar() {
  showSidebar.value = false
}
</script>

<!-- Styles -->
<style scoped>
.finance-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', sans-serif;
}

.finance-reset {
  margin-top: -22px;
  margin-left: -22px;
  margin-bottom: -22px;
}

.sidebar {
  width: 280px;
  background-color: white;
  padding: 24px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

.header {
  position: relative;
  padding-top: 16px;
  padding-bottom: 8px;
}

.header h2 { margin: 0; font-size: 18px; font-weight: 600; }

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: #f4f0ff;
  border: none;
  border-radius: 8px;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  color: #836eff; cursor: pointer;
}

.sidebar-divider {
  border: none;
  border-bottom: 1px solid #E6E3F1;
  margin: 0 0 16px 0;
}

.button-group {
  display: flex; flex-direction: column; gap: 12px;
}

.finance-btn {
  background: white;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px; font-weight: 500;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  text-decoration: none; color: inherit;
  transition: background 0.2s;
}
.finance-btn:hover { background: #f0f0f0 }

.main-content {
  flex-grow: 1;
  padding: 40px;
  background-color: #f8f9fa;
}
</style>