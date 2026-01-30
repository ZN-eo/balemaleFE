<template>
  <div class="admin-detail-container">
    <!-- 헤더 -->
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <button @click="goHome" class="close-btn">✕</button>
    </div>

    <!-- 카드 리스트 -->
    <div class="card-list">
      <div class="card" v-for="(item, index) in cardList" :key="index">
        <div class="card-image"></div>
        <div class="card-content">
          <div class="card-row">
            <span class="label">대상 :</span>
            <span class="value">{{ item.target }}</span>
          </div>
          <div class="card-row">
            <span class="label">시각 :</span>
            <span class="value">{{ item.time }}</span>
          </div>
          <div class="card-row">
            <span class="label">위치 :</span>
            <span class="value">{{ item.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDetailView',
  data() {
    return {
      cardList: [
        { target: '', time: '', location: '' },
        { target: '', time: '', location: '' }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-detail-container {
  min-height: 100vh;
  width: 100%;
  background-color: #1B4300;
  padding: 20px;
  padding-top: 80px;
  padding-left: 70px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.back-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
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

.close-btn {
  background: #ffffff;
  border: 1px solid #000;
  color: #000000;
  font-size: 18px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-image {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  flex-shrink: 0;
  background: #f5f5f5;
  box-sizing: border-box;
  border-radius: 4px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.card-row {
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.6;
}

.label {
  font-weight: 600;
  margin-right: 8px;
  min-width: 60px;
  color: #333;
}

.value {
  flex: 1;
  color: #666;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-detail-container {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
  }

  .header {
    margin-bottom: 20px;
    padding: 0 5px;
  }

  .back-btn {
    font-size: 20px;
    width: 36px;
    height: 36px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .card-list {
    gap: 16px;
    max-width: 100%;
  }

  .card {
    padding: 16px;
    gap: 16px;
    border-radius: 6px;
  }

  .card-image {
    width: 80px;
    height: 80px;
  }

  .card-content {
    gap: 10px;
  }

  .card-row {
    font-size: 14px;
    line-height: 1.5;
  }

  .label {
    min-width: 50px;
    font-size: 14px;
  }

  .value {
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-detail-container {
    padding: 16px;
    padding-top: 72px;
    padding-left: 16px;
  }

  .card-list {
    max-width: 600px;
  }

  .card {
    padding: 20px;
    gap: 18px;
  }

  .card-image {
    width: 90px;
    height: 90px;
  }

  .card-row {
    font-size: 15px;
  }

  .label {
    min-width: 55px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-detail-container {
    padding: 24px;
    padding-top: 96px;
    padding-left: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    padding: 0;
  }

  .card-list {
    max-width: 900px;
  }

  .card {
    padding: 28px;
    gap: 24px;
  }

  .card-image {
    width: 120px;
    height: 120px;
  }

  .card-content {
    gap: 16px;
  }

  .card-row {
    font-size: 17px;
    line-height: 1.7;
  }

  .label {
    min-width: 70px;
    font-size: 17px;
  }

  .value {
    font-size: 17px;
  }
}
</style>
