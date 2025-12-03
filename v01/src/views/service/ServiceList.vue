<template>
  <article class="page">
    <h2>SERVICE</h2>
    
    <!-- 로딩 -->
    <p v-if="isLoading" class="msg">불러오는 중...</p>

    <!-- 서버 오류 메시지 -->
    <p v-else-if="errorServerMsg" class="msg error">{{ errorServerMsg }}</p>

    <!-- 서비스 테이블 -->
    <table v-else>
      <thead>
        <tr>
          <th>번호</th>
          <th>서비스</th>
          <th>가격</th>
          <th>소요시간</th>
          <th
            v-if="userStore.user.role === 'manager'"
            style="width: 150px;"
          >
            편집
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.service_id"
        >
          <!-- 번호 -->
          <td>{{ index + 1 }}</td>
          <!-- 서비스 이름 -->
          <td>
            {{ item.service_name }}
          </td>
          <!-- 가격 -->
          <td>{{ Number(item.price).toLocaleString() }}원</td>
          <!-- 소요시간 -->
          <td>{{ item.duration_min }}분</td>
          <td
            v-if="userStore.user.role === 'manager'"
          >
            <!-- 수정 버튼 -->
            <button class="btn-sm" @click="goUpdate(item.service_id)">
              수정
            </button>

            <!-- 삭제 버튼 -->
            <button class="btn-sm" @click="handleDelete(item.service_id)">
              삭제
            </button>
          </td>
        </tr>
        
        <tr v-if="!items || items.length === 0">
            <td :colspan="userStore.user.role === 'manager' ? 5 : 3" class="no-data">
                등록된 서비스가 없습니다.
            </td>
        </tr>
      </tbody>
    </table>

    <div class="action-row" v-if="userStore.user.role === 'manager'">
      <!-- 등록 버튼 -->
      <button class="btn-primary" @click="goCreate">
        등록
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ServiceApi } from '@/api/service';

// 라우터 생성
const router = useRouter();

// 사용자 정보 가져오기
const userStore = useUserStore();

// 상태 관리 변수
const items = ref([]); // 초기값을 배열로 설정하는 것이 안전합니다.
const isLoading = ref(false);
const errorServerMsg = ref('');
const deleting = ref(false);

// 목록 불러오기
const fetchList = async () => {
  try {
    // isLoading 활성화
    isLoading.value = true;

    // 서버 오류 메시지 초기화
    errorServerMsg.value = "";

    // ServiceApi.list()
    const res = await ServiceApi.list();
    const body = res.data;
    
    // items에 배열 저장 (데이터 구조에 따라 body.data.service가 배열인지 확인 필요)
    items.value = body?.data?.service || []; 

  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || "목록을 불러오지 못했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

onMounted(fetchList);

// 삭제 핸들러
const handleDelete = async (serviceId) => {
  try {
    // deleting 활성화
    deleting.value = true;

    // 서버 오류 메시지 초기화
    errorServerMsg.value = "";

    // 삭제 여부
    const ok = confirm("해당 서비스를 삭제하시겠습니까?");
    if (!ok) return;

    // ServiceApi.delete(serviceId)
    const res = await ServiceApi.delete(serviceId);
    const status = res.status;

    // response.status가 204가 아닌 경우
    // 에러 메시지 던지기
    if (status !== 204) {
      throw new Error("삭제 요청이 정상적으로 처리되지 않았습니다.");
    }

    // items에서 삭제된 서비스만 filtering
    items.value = items.value.filter(item => item.service_id !== serviceId);

    // 삭제 성공 메시지 출력
    alert("삭제 완료하였습니다.");
  } catch(e) {
    // 서버 오류 메시지 출력
    const msg = e.response?.data?.error?.message || e.message;
    alert(msg);
  } finally {
    // deleting 비활성화
    deleting.value = false;
  }
}

// 서비스 등록 페이지 이동 함수
const goCreate = () => {
    router.push('/service/create');
}

// 서비스 수정 페이지 이동 함수
const goUpdate = (serviceId) => {
    router.push(`/service/update/${serviceId}`);
}
</script>

<style scoped>
.page {
  max-width: 1200px;
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

.msg {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
}
.msg.error {
    color: #d9534f;
    font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #555;
  margin-bottom: 30px;
}

table th {
  background-color: #f8f9fa;
  color: #555;
  font-weight: 600;
  text-align: center;
  padding: 15px 10px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

table td {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
  vertical-align: middle;
  line-height: 1.5;
}

.no-data {
    padding: 40px 0;
    color: #888;
}

.btn-sm {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  color: #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin: 0 4px;
  transition: all 0.2s ease;
}

.btn-sm:hover {
  background-color: #e0e0e0;
  border-color: #999;
  color: #333;
}

.action-row {
    display: flex;
    margin-top: 30px;
}

.btn-primary {
  display: inline-block;
  min-width: 70px;
  padding: 8px 16px;
  margin-right: 5px;

  background: #a8a6a4;
  color: #fff;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #cfbdaa;
}
</style>