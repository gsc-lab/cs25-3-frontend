<template>
  <div class="page">
    <h2 style="text-align: center;">MYPAGE</h2>
    
    <!-- 직원 휴무 목록 -->
    <h3>직원 휴무 목록</h3>
    
    <p v-if="isLoading">불러오는 중...</p>

    <div class="timeoff-list">
      <table class="timeoff-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>시작</th>
            <th>종료</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="timeoffs.length === 0">
            <td colspan="5">등록된 휴무 정보가 없습니다.</td>
          </tr>
          <tr
            v-for="(to, index) in timeoffs"
            :key="to.to_id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ to.designer_name }}</td>
            <td>{{ to.start_at }}</td>
            <td>{{ to.end_at }}</td>
            <td>
              <button
                type="button"
                @click="handleDelete(to.to_id)"
              >
                삭제
              </button>
            </td>
          </tr>
          
        </tbody>
      </table>

      <!-- 직원 휴무 등록 -->
      <h3>직원 휴무 등록</h3>

      <!-- form -->
      <form @submit.prevent="handleCreate" class="timeoffCreate">
        <fieldset>
          <!-- 디자이너 선택 -->
          <p>디자이너 선택</p>
          <FormField
            type="radio"
            name="user_id"
            v-for="ds in designer"
            :key="ds.user_id"
            v-model="user_id"
            :value="ds.user_id"
            :label="ds.user_name "
          /> <br>
          
          <!-- 시작일 -->
          <p>시작일</p>
          <FormField
            label=""
            type="date"
            name="start_at"
            v-model="start_at"
          /> <br>
          
          <!-- 종료일 -->
           <p>종료일</p>
          <FormField
            label=""
            type="date"
            name="end_at"
            v-model="end_at"
          />
        </fieldset>
        <SubmitButton
          :loading="isSubmitting"
        >
          등록하기
        </SubmitButton>
        <button
          type="button"
          @click="router.push('/mypage')"
        >
          뒤로가기
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TimeoffApi } from '@/api/timeoff';
import { DesignerApi } from '@/api/designer';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우터 생성
const router = useRouter();

// 목록 및 입력 변수
const timeoffs = ref([]);
const designer = ref('');
const user_id = ref('');
const start_at = ref('');
const end_at = ref('');

// 상태 관리 변수
const isLoading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const errorServerMsg = ref('');

// 휴무 목록 불러오기
const fetchList = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // TimeoffApi.list()
    const body = await TimeoffApi.list();
    
    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // timeoffs 변수에 불러온 정보 저장
    const list = body?.data?.timeoff;
    timeoffs.value = list ?? [];
  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

// 디자이너 user_id 불러오기
const designerUserId = async () => {
  try {
    // DesignerApi.list()
    const res = await DesignerApi.list();
    const body = res.data;
    
    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // user_id 변수에 불러온 정보 저장
    designer.value = body?.data?.designer;
  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  }
}

onMounted(fetchList);
onMounted(designerUserId);

// 휴무 입력
const handleCreate = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isSubmitting 활성화
  isSubmitting.value = true;

  try {
    // payload
    const payload = {
        user_id : user_id.value,
        start_at : start_at.value,
        end_at : end_at.value
    }

    // TimeoffApi.create(payload)
    const body = await TimeoffApi.create(payload);

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // 성공했을 경우
    // 성공 메시지 출력
    alert("디자이너 휴무 작성에 성공했습니다!");

    // 현재 페이지 새로고침
    router.go(0);
  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}

// 휴무 삭제
const handleDelete = async (toId) => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isDeleting 활성화
  isDeleting.value = true;

  try {
    // 삭제 여부 묻기
    const ok = confirm("해당 휴무 정보를 삭제하시겠습니까?");
    if (!ok) return;

    // TimeoffApi.delete(toId)
    const status = await TimeoffApi.delete(toId);

    // response.status가 204가 아닌 경우
    // 에러 메시지 던지기
    if (status !== 204) {
      throw new Error("삭제에 실패했습니다.");
    }

    // timeoffs에서 해당 휴무 정보 빼기
    timeoffs.value = timeoffs.value.filter(to => to.to_id !== toId)

    // 삭제 성공 시
    // 성공 메시지 출력
    alert("삭제 성공!");
  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isDeleting 비활성화
    isDeleting.value = false;
  }
}
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 40px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans KR", sans-serif;
  font-size: 14px;
  color: #333;
}

.page > h2 {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}

.page h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
}

p[v-if="isLoading"] {
  margin: 10px 0;
}

.timeoff-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 20px;
}

.timeoff-table th,
.timeoff-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  font-size: 14px;
  vertical-align: middle;
}

.timeoff-table thead {
  background-color: #f7f7f7;
}

.timeoff-table th {
  font-weight: 600;
  text-align: center;
}

.timeoff-table td:nth-child(1),
.timeoff-table td:nth-child(2),
.timeoff-table td:nth-child(3),
.timeoff-table td:nth-child(4) {
  text-align: center;
}

.timeoffCreate {
  margin-top: 10px;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fafafa;
}

.timeoffCreate fieldset {
  border: none;
  padding: 0;
  margin: 0 0 20px;
}

.timeoffCreate p {
  margin-bottom: 8px;
  font-weight: 600;
}

.timeoffCreate button,
button,
.submit-btn {
  display: inline-block;
  min-width: 100px;
  padding: 8px 16px;
  margin-right: 5px;

  background: #a8a6a4;
  color: #fff;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}
button,
.button-btn {
  display: inline-block;
  min-width: 50px;
  padding: 8px 16px;
  margin-right: 5px;

  background: #a8a6a4;
  color: #fff;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}

.timeoffCreate button:hover,
button:hover {
  background: #cfbdaa;
}

@media (max-width: 768px) {
  .page {
    margin: 20px auto;
    padding: 0 10px;
  }

  .timeoff-table th,
  .timeoff-table td {
    padding: 8px 6px;
    font-size: 13px;
  }

  .timeoffCreate {
    padding: 16px;
  }
}
</style>
