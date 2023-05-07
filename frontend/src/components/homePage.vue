<template>
<userHeaderComp subHeaderName="Home Page" />

<br />
<div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
    </div>
    <input type="search" id="city-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a different city name..." required />
    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
</div>
<div class="grid grid-cols-4 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
    <div class="border p-2">{{ currentCity }}</div>
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">Date:</div>
    <div class="border p-2">{{ todayDate }}</div>
</div>
<br />
<div class="grid grid-cols-3 gap-1">
    <div class="border p-2">
        <h3>Temp</h3>
    </div>
    <div class="border p-2">
        <h3>Air</h3>
    </div>
    <div class="border p-2">
        google maps
    </div>
</div>
<br />
<div class="border p-2">
    Sun
</div>
</template>

<script>
//import axios from 'axios';
import userHeaderComp from '../components/userHeader.vue'
export default {
    name: 'homeComp',
    data() {
        return {
            email:'',
            currentCity: '',
            todayWeather:{},

        }
    },
    components: {
        userHeaderComp
    },
    methods:{
        // async loadTodayWeatherData(){
        //     await axios.get("/api/gettodayweatherdata/"+this.email)
        //     .then((res)=>{

        //     })
        //     .catch(()=>{

        //     })
        // }
    },
    mounted(){
        let localStorageEmail = localStorage.getItem("email");
        localStorageEmail = localStorageEmail.substring(1, (localStorageEmail.length - 1));
        this.email = localStorageEmail;
    }
}
</script>

<style>
</style>
