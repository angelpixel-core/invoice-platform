<script setup lang="ts">
  const stack = ['Vue 3', 'TypeScript', 'NestJS'];
</script>

<template>
  <main>
    <h1>Invoice Platform</h1>
    <p>Workspace bootstrap</p>
    <ul>
      <li v-for="item in stack" :key="item">{{ item }}</li>
    </ul>
  </main>
</template>
