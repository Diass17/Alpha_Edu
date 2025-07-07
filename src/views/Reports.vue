<template>
  <div class="reports-page">
    <h2>Отчёты</h2>
  <div class="report-tabs">
    <router-link
      to="/finance/reports/total-revenue"
      class="report-tab"
      :class="{ active: $route.path === '/finance/reports/total-revenue' }"
    >
      Общая выручка
    </router-link>
    <router-link
      to="/finance/reports/debts"
      class="report-tab"
      :class="{ active: $route.path === '/finance/reports/debts' }"
    >
      Задолженности
    </router-link>
    <router-link
      to="/finance/reports/student-funding"
      class="report-tab"
      :class="{ active: $route.path === '/finance/reports/student-funding' }"
    >
      Финансирование студента
    </router-link>
    </div>
    <router-view />
  </div>
</template>


<!-- Script -->
<script setup>
</script>


<!-- Styles -->
<style scoped>
.reports-page {
  padding: 40px;
  font-family: 'Inter', sans-serif;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}

.report-tabs {
  display: flex;
  gap: 12px;
  background-color: #ECE9FF;
  padding: 11px;
  border-radius: 10px;
  max-width: 1050px;
  margin-bottom: 100px;
}

.report-tab {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: white;
  color: #836eff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
  text-decoration: none;
}

.report-tab.active {
  background-color: #836eff;
  color: white;
}

.create-report-wrapper {
  display: flex;
  justify-content: flex-end;
}

.create-report-btn {
  padding: 10px 20px;
  background-color: #836eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
</style>