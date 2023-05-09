<template>
<userHeaderComp subHeaderName="Home Page" />

<br />
<div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
    </div>
    <input type="search" id="city-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a different city name..." required  v-model="searchCity"/>
    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" v-on:click="searchWeatherData()">Search</button>
</div>
<div class="grid grid-cols-6 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
    <div class="border p-2">{{ currentCity }}</div>
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">Date:</div>
    <div class="border p-2">{{completeMetricWeatherData.datetime}}</div>
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">Measurement System:</div>
    <div class="border p-2">{{ measurementSystem }}</div>
</div>
<br />
<div class="grid grid-cols-3 gap-0 bg-orange-100 text-gray-700 border-4">
    <div class="p-0 grid grid-cols-2 gap-0 border-4">
        <div class="font-bold  bg-orange-100 text-gray-700">Min Temp:</div>
        <div>{{ completeMetricWeatherData.tempmin }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Max Temp:</div>
        <div>{{ completeMetricWeatherData.tempmax }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Temp:</div>
        <div>{{ completeMetricWeatherData.temp }}</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="border-4 p-0 grid grid-cols-2 gap-1">
        <div class="font-bold bg-orange-100 text-gray-700">Humidity:</div>
        <div>{{ completeMetricWeatherData.humidity }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Snow:</div>
        <div>{{ completeMetricWeatherData.snow }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Windspeed:</div>
        <div>{{ completeMetricWeatherData.windspeed }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Cloud cover:</div>
        <div>{{ completeMetricWeatherData.cloudcover }}</div>
        <div class="font-bold bg-orange-100 text-gray-700">Visibility:</div>
        <div>{{ completeMetricWeatherData.visibility }}</div>
    </div>
    <div class="border-4 p-0">
        google maps
    </div>
</div>
<br />
<div class="border-4 p-0 grid grid-cols-2 gap-0">
    <div class="border-4 p-2 grid grid-cols-2 gap-1">
        <div class="font-bold">Sunrise:</div>
        <div>{{ completeMetricWeatherData.sunrise }}</div>
        <div class="font-bold">Sunset:</div>
        <div>{{ completeMetricWeatherData.sunset }}</div>
        <div class="font-bold">Solar radiation:</div>
        <div>{{ completeMetricWeatherData.solarradiation }}</div>
    </div>
    <div class="border-4 p-2 grid grid-cols-1 gap-1">
        <div class="font-bold text-center">Verdict:</div>
        <div class="text-center">{{ completeMetricWeatherData.description }}</div>
    </div>
</div>
<br />
<div class="p-0 grid grid-cols-2 gap-1">
    <button type="button" class="block w-1/2 p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" v-on:click="toHistoricWeatherReportPage()">See historic weather data</button>
    <button type="button" class="block w-1/2 p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ml-auto" v-on:click="toFutureWeatherReportPage()">See Future weather data </button>
</div>
</template>

<script>
import axios from 'axios';
import userHeaderComp from '../components/userHeader.vue'
export default {
    name: 'homeComp',
    data() {
        return {
            email:'',
            currentCity: '',
            searchCity:'',
            measurementSystem:'',
            completeMetricWeatherData:{},
            completeImperialWeatherData:{}

        }
    },
    components: {
        userHeaderComp
    },
    methods:{
        async loadPersonalizedWeatherData(){
            await axios.get("/api/getpersonalizedweatherdata/"+this.email)
            .then((res)=>{
                let result = res.data;
                this.measurementSystem = result.mSystem;
                this.currentCity = result.personalizedWeatherDoc.address;
                this.completeMetricWeatherData = result.personalizedWeatherDoc.days[0];
            })
            .catch(()=>{
                console.log("Data could not be retreived.");
            })
        },
        async searchWeatherData(){
            await axios.get("/api/getsearchedcityweatherdata/"+this.email+"/"+this.searchCity)
            .then((res)=>{
                let result = res.data;
                this.measurementSystem = result.mSystem;
                this.currentCity = result.searchedCityWeatherDoc.address;
                this.completeMetricWeatherData = result.searchedCityWeatherDoc.days[0];

            })
            .catch(()=>{
                console.log("Data for searched city could not be retreived");
            })
        },
        toHistoricWeatherReportPage(){
            return this.$router.push({name:'historicWeatherReportPage'})
        },
        toFutureWeatherReportPage(){
            this.$emit('currentCity', this.currentCity)
            return this.$router.push({
                name:'futureWeatherReportPage',
                params:{cCity: this.currentCity}
            })
        }
    },
    mounted(){
        let localStorageEmail = localStorage.getItem("email");
        localStorageEmail = localStorageEmail.substring(1, (localStorageEmail.length - 1));
        this.email = localStorageEmail;
        this.loadPersonalizedWeatherData();
    }
}
</script>

<style>

</style>
