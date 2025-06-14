<template>
  <div class="auth-body">
    <div class="auth-container">
      <div class="auth-box">
        <h1 class="auth-title">Вход в систему</h1>

        <div v-if="error" class="auth-error">{{ error }}</div>

        <form @submit.prevent="submitForm" class="auth-form">
          <input v-model="email" type="email" placeholder="Email" required class="auth-input" />
          <input v-model="password" type="password" placeholder="Пароль" required class="auth-input" />
          <button type="submit" class="auth-button">Войти</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')

const submitForm = async () => {
  try {
    error.value = ''
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    }, {
      withCredentials: true
    })
    window.location.href = '/home'
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка входа'
  }
}
</script>

<style scoped>
@import "/styles.css";
</style>
