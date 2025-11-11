<template>
  <TestInput
    label="사용자 입력"
    placeholder="입력값을 기입해 주세요."
    v-model="inputValue"
  />

  <p>입력값 출력: {{ inputValue }}</p>
</template>

<script setup>
import TestInput from "@/components/TestInput.vue"
import { ref } from "vue"

const inputValue = ref('');
</script>