<template>
  <div class="admin-login-container">
    <button @click="goHome" class="back-btn">←</button>
    <div class="login-card">
      <h2>관리자 로그인</h2>
      <div class="login-form">
        <input 
          v-model="id" 
          type="text" 
          inputmode="text" 
          autocomplete="username"
          placeholder="admin ID" 
        />
        <input 
          v-model="password" 
          type="password" 
          inputmode="text" 
          autocomplete="current-password"
          placeholder="admin password" 
        />
        <button @click="login" class="login-btn">Sign In</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const id = ref('')
    const password = ref('')

    // 간단한 로그인 처리
    const login = () => {
      // 로그인 완료시 관리자 상세 페이지로 이동
      if (id.value && password.value) {
        router.push('/admin/detail')
      } else {
        alert('ID와 비밀번호를 입력하세요.')
      }
    }

    const goHome = () => {
      router.push('/')
    }

    return {
      id,
      password,
      login,
      goHome
    }
  }
})
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1B4300;
  padding: 20px;
  position: relative;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  z-index: 9999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.back-btn:hover {
  opacity: 0.7;
}

.login-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form input {
  padding: 15px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  border-radius: 4px;
  background: #fff;
  color: #333;
  transition: border-color 0.2s;
}

.login-form input:focus {
  outline: none;
  border-color: #1B4300;
}

.login-btn {
  padding: 15px;
  border: none;
  background: #1B4300;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s, transform 0.1s;
}

.login-btn:hover {
  background-color: #2D5A27;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-login-container {
    padding: 12px;
  }

  .back-btn {
    top: 12px;
    left: 12px;
    font-size: 20px;
    width: 36px;
    height: 36px;
  }

  .login-card {
    padding: 30px;
    max-width: 100%;
    border-radius: 6px;
  }

  .login-card h2 {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .login-form {
    gap: 16px;
  }

  .login-form input,
  .login-btn {
    padding: 12px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-login-container {
    padding: 16px;
  }

  .back-btn {
    top: 16px;
    left: 16px;
  }

  .login-card {
    padding: 35px;
    max-width: 450px;
  }

  .login-form {
    gap: 18px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-login-container {
    padding: 24px;
  }

  .back-btn {
    top: 24px;
    left: 24px;
  }

  .login-card {
    padding: 50px;
    max-width: 600px;
  }

  .login-card h2 {
    font-size: 28px;
    margin-bottom: 36px;
  }

  .login-form {
    gap: 24px;
  }

  .login-form input,
  .login-btn {
    padding: 18px;
    font-size: 18px;
  }
}
</style>
