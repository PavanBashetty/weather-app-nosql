<template>
<guestHeaderComp  subHeaderName="Guest"/>

<br />
<div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
    </div>
    <input type="search" id="city-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a city name..." required v-model="searchCity" />
    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" v-on:click="searchWeatherData()">Search</button>
</div>

<div class="grid grid-cols-4 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
    <div class="border p-2">{{ mentionedCity }}</div>
    <div class="font-bold border p-2 bg-gray-300 text-gray-700">Date:</div>
    <div class="border p-2">{{compeletWeatherData.datetime}}</div>
</div>

<br />

<div class="grid grid-cols-3 gap-0 bg-orange-100 text-gray-700 border-4">
    <div class="p-0 grid grid-cols-2 gap-0 border-4">
        <div class="font-bold  bg-orange-100 text-gray-700">Min Temp:</div>
        <div>
            {{compeletWeatherData.tempmin }}
            <span>°C</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Max Temp:</div>
        <div>
            {{compeletWeatherData.tempmax }}
            <span>°C</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Temp:</div>
        <div>
            {{compeletWeatherData.temp }}
            <span>°C</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>

    <div class="border-4 p-0 grid grid-cols-2 gap-1">
        <div class="font-bold bg-orange-100 text-gray-700">Humidity:</div>
        <div>
            {{compeletWeatherData.humidity }}
            <span>g/m³</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Snow:</div>
        <div>
            {{ compeletWeatherData.snow}}
            <span>mm</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Windspeed:</div>
        <div>
            {{compeletWeatherData.windspeed }}
            <span>kmph</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Cloud cover:</div>
        <div>
            {{compeletWeatherData.cloudcover }}
            <span>Octas</span>
        </div>
        <div class="font-bold bg-orange-100 text-gray-700">Visibility:</div>
        <div>
            {{compeletWeatherData.visibility}}
            <span>km</span>
        </div>
    </div>

    <!-- <div></div> -->
</div>
<br />
<div class="border-4 p-0 grid grid-cols-2 gap-0">
    <div class="border-4 p-2 grid grid-cols-2 gap-1">
        <div class="font-bold">Sunrise:</div>
        <div>{{ compeletWeatherData.sunrise }}</div>
        <div class="font-bold">Sunset:</div>
        <div>{{ compeletWeatherData.sunset }}</div>
        <div class="font-bold">Solar radiation:</div>
        <div>
           {{ compeletWeatherData.solarradiation }} 
        </div>
    </div>
    <div class="border-4 p-2 grid grid-cols-1 gap-1">
        <div class="font-bold text-center">Verdict:</div>
        <div class="text-center">{{ compeletWeatherData.description }}</div>
    </div>
</div>

<footer>
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" v-on:click="backToDefaultPage()">Back</button>
</footer>
</template>

<script>
import axios from 'axios'
import guestHeaderComp from '../components/guestHeader.vue'
export default {
    name: 'guestComp',
    data() {
        return {
            searchCity: '',
            compeletWeatherData:{},
            mentionedCity: ''
        }
    },
    components: {
        guestHeaderComp
    },
    methods: {
        backToDefaultPage() {
            return this.$router.push({
                name: 'defaultPage'
            })
        },
       async searchWeatherData(){
         await axios.get("/api/getsearchedcitydataforguest/"+this.searchCity)
         .then((res)=>{
            let result = res.data;
            this.mentionedCity = result.address;
            this.compeletWeatherData = result.days[0]
            this.searchCity = ''
         })
         .catch(()=>{
            this.compeletWeatherData = {}
            console.log("Data for searched city could not be retreived");
            this.searchCity = ''
         })
        }
    }
    // mounted(){
    //     let userEmail = localStorage.getItem('email')
    //     if(userEmail != null){
    //         return this.$router.push({name:'homePage'})
    //     }
    // }
}
</script>

<style>
</style>
