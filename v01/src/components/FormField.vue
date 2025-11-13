<template>
    <!-- 전체 입력 필드를 감싸는 레벨 -->
    <!-- label 요소는 클릭 시 자동으로 내부 input과 연결됨 -->
    <label class="form-field">

      <!-- 필드 이름 표시 -->
      <!-- label prop를 받아서 렌더링 -->
      

      <!-- 실제 입력창 -->
      <!-- type, placeholder, value 등을 props로 받아 설정 -->
      <!-- 사용자가 입력할 때마다 'update:modelValue' 이벤트를 emit하여 부모에게 새 값 전달 -->
      <!-- autocomplete 속성은 브라우저 자동완성 기능을 제어 -->
      <template v-if="type !== 'radio'">
        <span class="form-label">{{ label }}</span>
        <input class="form-input"
          :name="name"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :autocomplete="autocomplete"
        />
      </template>

      <template v-else>
        <input class="form-input"
          :name="name"
          :type="type"
          :value="value"
          :checked="modelValue === value"
          @change="$emit('update:modelValue', value)"
          :autocomplete="autocomplete"
        />
        <span class="form-label">{{ label }}</span>
      </template>
      

      <!-- 에러 메시지 영역 -->
      <!-- error prop이 비어있지 않으면 메시지를 표시 -->
      <p v-if="error" class="form-error">{{ error }}</p>

    </label>
</template>

<script setup>
// 부모 컴포넌트로부터 전달받을 데이터를 정의하는 부분
// Vue의 <script setup> 문법에서는 import 없이 바로 사용 가능
defineProps({
  // 입력 필드 이름
  label: { type: String, required: true },
  // v-model과 연결되는 실제 연결 값
  modelValue: { type: [String, Number], default: "" },
  // input 타입 (text, password, email 등)
  type: { type: String, default: "text" },
  // name 속성
  name: { type: String, default: "" },
  // 입력칸 안의 힌트 텍스트
  placeholder: { type: String, default: "" },
  // 에러 메시지 (유효성 검사 실패 시 표시)
  error: { type: String, default: "" },
  // 브라우저 자동완성 설정
  autocomplete: { type: String, default: "off" },
  // 입력 radio에 필요한 값
  value: { type: [String, Number, Boolean], default: "" }
});

// 자식이 부모에게 이벤트를 전달할 수 있도록 정의
// 사용자가 입력을 바꾸면 $emit('update:modelValue', 새값)을 호출해서 부모의 데이터 갱신
defineEmits(["update:modelValue"]);
</script>