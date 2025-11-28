<template>
  <section>
    <h2>Salon 정보 수정</h2>

    <!-- 로딩 -->
    <p v-if="isLoading">불러오는 중...</p>

    <!-- 서버 오류 -->
    <p v-if="errorServerMsg">
      {{ errorServerMsg }}
    </p>

    <!-- 폼 -->
    <form v-else @submit.prevent="handleUpdate">
      <div class="form">
        <!-- 소개 -->
        <FormField
          label="소개:"
          name="introduction"
          placeholder="살롱 소개를 입력하세요."
          v-model="introduction"
        />
        <br>

        <!-- 정보 영역 -->
        <p><strong>정보</strong></p>
        <FormField
          label="전화번호:"
          name="phone"
          placeholder="전화번호를 입력하세요."
          v-model="phone"
        />
        <br>
        <FormField
          label="주소:"
          name="address"
          placeholder="주소를 입력하세요."
          v-model="address"
        />
        <br>
        <FormField
          label="영업시간:"
          name="opening_hour"
          placeholder="예) 10:00 - 19:00"
          v-model="opening_hour"
        />
        <br>
        <FormField
          label="휴무일:"
          name="holiday"
          placeholder="예) 일요일"
          v-model="holiday"
        />
        <br>

        <!-- 지도 이미지 URL -->
        <FormField
          label="지도 이미지 URL:"
          name="map"
          placeholder="지도 이미지 URL을 입력하세요."
          v-model="map"
        />
        <br>

        <!-- 오시는 길 영역 -->
        <p><strong>오시는 길</strong></p>
        <FormField
          label="버스:"
          name="bus"
          placeholder="예) 706, 719, 730, 북구2"
          v-model="bus"
        />
        <br>
        <FormField
          label="주차:"
          name="parking"
          placeholder="주차 안내를 입력하세요."
          v-model="parking"
        />
        <br>
        <FormField
          label="길 안내:"
          name="directions"
          placeholder="도보/길 안내를 입력하세요."
          v-model="directions"
        />
        <br>

        <!-- 이미지 업로드 (선택) -->
        <p><strong>대표 이미지 변경 (선택)</strong></p>
        <input type="file" @change="onFileChange" />
        <br><br>

        <!-- 제출 버튼 -->
        <SubmitButton
          :loading="isSubmitting"
        >
          수정하기
        </SubmitButton>

        <!-- 뒤로가기 -->
        <button
          type="button"
          @click="goDetail"
        >
          뒤로가기
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SalonApi } from '@/api/salon';
import { useUserStore } from '@/stores/user';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우터 생성
const router = useRouter();

// 사용자 정보 변수에 저장하기
const userStore = useUserStore();

// 입력창 변수
const introduction = ref('');
const phone = ref('');
const address = ref('');
const opening_hour = ref('');
const holiday = ref('');
const map = ref('');
const bus = ref('');
const parking = ref('');
const directions = ref('');
const imageFile = ref(null);

// 상태
const isSubmitting = ref(false);
const isLoading = ref(false);
const errorServerMsg = ref('');
const successMsg = ref('');

// 기존 데이터 로딩
const fetchDetail = async () => {
  isLoading.value = true;
  errorServerMsg.value = '';

  try {
    const res = await SalonApi.list();
    const rawSalon = res?.data?.salon ?? null;

    if (!rawSalon) {
      return;
    }

    // 소개
    introduction.value = rawSalon.introduction || '';

    // information(JSON) 파싱
    if (rawSalon.information) {
      try {
        const info =
          typeof rawSalon.information === 'string'
            ? JSON.parse(rawSalon.information)
            : rawSalon.information;

        phone.value         = info.phone || '';
        address.value       = info.address || '';
        opening_hour.value  = info.opening_hour || '';
        holiday.value       = info.holiday || '';
      } catch {
        // 파싱 실패 시 초기화
        phone.value = '';
        address.value = '';
        opening_hour.value = '';
        holiday.value = '';
      }
    }

    // map
    map.value = rawSalon.map || '';

    // traffic(JSON) 파싱
    if (rawSalon.traffic) {
      try {
        const tf =
          typeof rawSalon.traffic === 'string'
            ? JSON.parse(rawSalon.traffic)
            : rawSalon.traffic;

        bus.value        = tf.bus || '';
        parking.value    = tf.parking || '';
        directions.value = tf.directions || '';
      } catch {
        bus.value = '';
        parking.value = '';
        directions.value = '';
      }
    }
  } catch (e) {
    errorServerMsg.value =
      e.response?.data?.error?.message || '서버 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// 초기 로딩
onMounted(fetchDetail);

// 파일 선택
const onFileChange = (e) => {
  imageFile.value = e.target.files[0] || null;
};

// 수정 요청
const handleUpdate = async () => {
  errorServerMsg.value = '';
  successMsg.value = '';
  isSubmitting.value = true;

  try {
    // information JSON 생성
    const infoObj = {
      phone: phone.value,
      address: address.value,
      opening_hour: opening_hour.value,
      holiday: holiday.value,
    };

    // traffic JSON 생성
    const trafficObj = {
      bus: bus.value,
      parking: parking.value,
      directions: directions.value,
    };

    // FormData 구성
    const formData = new FormData();
    formData.append('introduction', introduction.value);
    formData.append('information', JSON.stringify(infoObj));
    formData.append('map', map.value);
    formData.append('traffic', JSON.stringify(trafficObj));

    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    await SalonApi.update(formData);

    successMsg.value = '수정이 완료되었습니다.';
    alert(successMsg.value);
  } catch (e) {
    errorServerMsg.value =
      e.response?.data?.error?.message || '수정 중 오류가 발생했습니다.';
    alert(errorServerMsg.value);
  } finally {
    isSubmitting.value = false;
  }
};

// 상세 페이지 이동
const goDetail = () => {
  router.push('/salon');
};
</script>
