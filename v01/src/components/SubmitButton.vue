<template>
  <button
    class="button"
    :disabled="disabled || loading"
  >
    <span v-if="!loading"><slot /></span>
    <span v-else>처리 중...</span>
  </button>
</template>

<script setup>
// 부모 -> 자식으로 데이터 전달
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>
