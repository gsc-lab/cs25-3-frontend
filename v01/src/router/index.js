// vue-router에서 createApp, createWebHistory 함수 불러오기
import { createRouter, createWebHistory } from 'vue-router'

// 라우터 URL과 연결할 view 컴포넌트 가져오기
// main
import Main from "@/views/main/Main.vue";

// users
import UsersRegister from "@/views/users/UsersRegister.vue";
import UsersLogin from "@/views/users/UsersLogin.vue";

// salon
import SalonDetail from "@/views/salon/SalonDetail.vue";
import SalonUpdate from "@/views/salon/SalonUpdate.vue";

// service
import ServiceCreate from "@/views/service/ServiceCreate.vue";
import ServiceList from "@/views/service/ServiceList.vue";
import ServiceUpdate from "@/views/service/ServiceUpdate.vue";

// hairstyle
import HairstyleCreate from "@/views/hairstyle/HairstyleCreate.vue";
import HairstyleList from "@/views/hairstyle/HairstyleList.vue";
import HairstyleUpdate from "@/views/hairstyle/HairstyleUpdate.vue";

// designer
import DesignerCreate from "@/views/designer/DesignerCreate.vue";
import DesignerList from "@/views/designer/DesignerList.vue";
import DesignerUpdate from "@/views/designer/DesignerUpdate.vue";

// reservation
import ReservationCreate from "@/views/reservation/ReservationCreate.vue";

// news
import NewsCreate from "@/views/news/NewsCreate.vue";
import NewsDetail from "@/views/news/NewsDetail.vue";
import NewsList from "@/views/news/NewsList.vue";
import NewsUpdate from "@/views/news/NewsUpdate.vue";

// mypage
import Mypage from "@/views/mypage/Mypage.vue";

// 라우터 설정
export default createRouter({
    history: createWebHistory(),
    routes: [
        // main
        { path: '/', component: Main},

        // users
        { path: '/users/create', component: UsersRegister},
        { path: '/users/login', component: UsersLogin},

        // salon
        { path: '/salon', component: SalonDetail },
        { path: '/salon/update', component: SalonUpdate },

        // service
        { path: '/service/create', component: ServiceCreate },
        { path: '/service', component: ServiceList },
        { path: '/service/update/:service_id', component: ServiceUpdate },
        
        // hairstyle
        { path: '/hairstyle', component: HairstyleList },
        { path: '/hairstyle/create', component: HairstyleCreate },
        { path: '/hairstyle/update/:hair_id', component: HairstyleUpdate, props: true },

        // designer
        { path: '/designer/create', component: DesignerCreate },
        { path: '/designer', component: DesignerList },
        { path: '/designer/update/:designer_id', component: DesignerUpdate, props: true },

        // reservation
        { path: "/reservation", component: ReservationCreate },

        // news
        { path: '/news/create', component: NewsCreate },
        { path: '/news/:news_id', component: NewsDetail, props: true },
        { path: '/news', component: NewsList },
        { path: '/news/update/:news_id', component: NewsUpdate, props: true },

        // mypage
        { path: '/mypage', component: Mypage },
    ]
});