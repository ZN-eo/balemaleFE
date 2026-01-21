<template>
  <div>
    <h2>관리자 로그인</h2>
    <div class="login-form">
      <input v-model="id" type="text" placeholder="ID" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login" class="login-btn">Sign in</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const id = ref('')
    const password = ref('')

    const login = () => {
      // 간단한 로그인 처리
      if (id.value && password.value) {
        router.push('/admin/screen')
      } else {
        alert('ID와 비밀번호를 입력하세요.')
      }
    }

    return {
      id,
      password,
      login
    }
  }
}
</script>

<style scoped></style>
