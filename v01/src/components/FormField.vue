<template>
  <!-- 전체 입력 필드를 감싸는 레벨 -->
  <label class="form-field">
    <!-- radio 타입 -->
    <template v-if="type === 'radio'">
      <input
        class="form-input"
        :name="name"
        :type="type"
        :value="value"
        :checked="modelValue === value"
        @change="emit('update:modelValue', value)"
        :autocomplete="autocomplete"
      />
      <span class="form-label">{{ label }}</span>
    </template>

    <!-- file 타입 -->
    <template v-else-if="type === 'file'">
      <span class="form-label">{{ label }}</span>
      <input
        class="form-input"
        :name="name"
        type="file"
        :accept="accept"
        @change="onFileChange"
      />
    </template>

    <!-- 나머지 일반 input(text, password, email 등) -->
    <template v-else>
      <span class="form-label">{{ label }}</span>
      <input
        class="form-input"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :autocomplete="autocomplete"
        :accept="accept"
      />
    </template>

    <!-- 에러 메시지 -->
    <p v-if="error" class="form-error">{{ error }}</p>
  </label>
</template>

<script setup>
const props = defineProps({
  // 라벨 텍스트
  label: { type: String, required: true },
  // v-model 값 (파일까지 고려해서 타입 확장)
  modelValue: {
    type: [ String, Number, Object, File ],
    default: '',
  },
  // input 타입
  type: { type: String, default: 'text' },
  // name 속성
  name: { type: String, default: '' },
  // placeholder
  placeholder: { type: String, default: '' },
  // 에러 메시지
  error: { type: String, default: '' },
  // 자동완성
  autocomplete: { type: String, default: 'off' },
  // 라디오 값
  value: { type: [String, Number, Boolean], default: '' },
  // 파일 허용 확장자
  accept: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

// 파일 변경 핸들러
const onFileChange = (event) => {
  const file = event.target.files?.[0] ?? null;
  emit('update:modelValue', file);
};
</script>
