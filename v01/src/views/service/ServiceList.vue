<template>
  <h2>Service</h2>
  <!-- 서비스 -->
  <article>
    <table style="text-align: center">
      <thead>
        <tr>
          <th
            v-if="userStore.user.role === 'manager'"
          >
            선택
          </th>
          <th>서비스</th>
          <th>가격</th>
          <th>소요시간</th>
          <th
            v-if="userStore.user.role === 'manager'"
          >
            편집
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.service_id"
        >
          <td
            v-if="userStore.user.role === 'manager'"
          >
            <input type="checkbox" :key="item.service_id">
          </td>
          <td>{{ item.service_name }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.duration_min }}</td>
          <td
            v-if="userStore.user.role === 'manager'"
            colspan="2"
          >
            <button @click="goUpdate(item.service_id)">
              수정
            </button>
            <button
              @click="handleDelete(item.service_id)"
            >
              삭제
            </button>
          </td>
        </tr>
        <tr v-if="!items"><td colspan="5">등록된 서비스가 없습니다.</td></tr>
      </tbody>
    </table>
  </article>
  <!-- 등록 페이지 이동 -->
  <button
    v-if="userStore.user.role === 'manager'"
    @click="goCreate"
  >
    등록
  </button>

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
const items = ref({});           // 서비스 정보
const isLoading = ref(false);    // 로딩중
const errorServerMsg = ref('');  // 서버 오류 메시지
const deleting = ref(false);     // 삭제중

// 목록 불러오기
const fetchList = async () => {
    try {
      // 로딩 시작
      isLoading.value = true;

      // 서버 오류 메시지 초기화
      errorServerMsg.value = "";

      // service 정보 불러오기 -> items에 저장
      const res = await ServiceApi.list();
      const body = res.data;
      items.value = body?.data?.service;

      // response.status가 200이 아닐 경우
      if (res.status !== 200) {
        throw new Error(res.data?.error);
      }

      return items;
    } catch(e) {
      // 서버 에러 메시지
      errorServerMsg.value = e.response?.data?.error?.message;
    } finally {
      // 로딩 종료
      isLoading.value = false;
    }
}

onMounted(fetchList);

// 삭제 핸들러
const handleDelete = async (serviceId) => {
  try {
    // deleting => true
    deleting.value = true;

    // 서버 오류 초기화
    errorServerMsg.value = "";

    // 삭제 확인
    const ok = confirm("해당 서비스를 삭제하시겠습니까?");
    if (!ok) return;  // 취소 선택 시 삭제 로직 종료
  
    // 삭제 API 호출
    const res = await ServiceApi.delete(serviceId);
    const status = res.status;

    // response.status가 204이 아닌 경우
    // 오류 메시지 alert 표시
    if (status !== 204) {
      throw new Error("삭제 요청이 정상적으로 처리되지 않았습니다.");
    }

    // items.value에서 현재 서비스 삭제
    items.value = items.value.filter(item => item.service_id !== serviceId);

    // 삭제 성공 시
    alert("삭제 완료하였습니다.");
  } catch(e) {
    // 서버 오류 메시지 반환
    const msg = e.response?.error?.data?.error?.message;
    alert(msg);
  } finally {
    // deleting => false
    deleting.value =false;
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