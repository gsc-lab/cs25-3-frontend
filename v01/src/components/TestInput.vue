<template>
  <div class="input-wrap">
    <!-- 입력 레이블 -->
    <label>{{ label }}: </label>

    <!-- 사용자 입력창 -->
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>


<script setup>
// 부모 컴포넌트로부터 받을 수 있는 입력값의 속성 정의
defineProps({
    label: { type: String, required: true },  // 입력 레이블
    modelValue: { type: [ String, Number ], default: "" },   // 특정 이벤트 발생 시 저장되는 값
    placeholder: { type: String, default: "" },  // 입력 전 뜨는 문구
    type: { type: String, default: "type" },  // input type 설정
    error: { type: String, default: "" },  // 에러 메시지 설정 (기본 null)
    autocomplete: { type: String, default: "false" },  // 자동 완성 기능 (기본 false)
});

defineEmits(['update:modelValue']);
</script>