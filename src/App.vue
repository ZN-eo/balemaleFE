<script setup lang="ts">
import { onMounted } from 'vue'
import { usePublicStore } from './stores/publicStore'
import { useAdminStore } from './stores/adminStore'

const publicStore = usePublicStore()
const adminStore = useAdminStore()

onMounted(() => {
  publicStore.initSocketConnection()
})
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <router-view />
</template>

<style scoped></style>
