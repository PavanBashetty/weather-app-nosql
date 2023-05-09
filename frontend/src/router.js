import { createRouter, createWebHistory } from "vue-router";
import defaultComp from './components/defaultPage.vue';
import homeComp from './components/homePage.vue';
import signUpComp from './components/signUpPage.vue'
import loginComp from './components/loginPage.vue'
import guestComp from './components/guestPage.vue'
import aboutUsComp from './components/aboutUsPage.vue'
import userDetailsComp from './components/userDetailsPage.vue'
import futureWeatherReportComp from './components/futureWeatherReportPage.vue'
import historicWeatherReportComp from './components/historicWeatherReportPage.vue'

const routes = [
    {
        name:'defaultPage',
        path:'/',
        component: defaultComp
    },
    {
        name:'homePage',
        path:'/homepage',
        component: homeComp
    },
    {
        name:'signUpPage',
        path:'/signup',
        component: signUpComp
    },
    {
        name:'loginPage',
        path:'/login',
        component: loginComp
    },
    {
        name:'guestPage',
        path:'/guest',
        component: guestComp
    },
    {
        name:'aboutUsPage',
        path:'/aboutus',
        component: aboutUsComp
    },
    {
        name:'userDetailsPage',
        path:'/userdetails',
        component: userDetailsComp
    },
    {
        name:'futureWeatherReportPage',
        path:'/futureweatherdata',
        component: futureWeatherReportComp
    },
    {
        name:'historicWeatherReportPage',
        path:'/historicweatherdata',
        component: historicWeatherReportComp
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;