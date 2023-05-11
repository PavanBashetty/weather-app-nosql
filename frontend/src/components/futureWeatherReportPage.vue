<template>
    <userHeaderComp subHeaderName="Future Weather Report" />
    
    
    <div class="grid grid-cols-4 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
        <div class="border p-2">{{ currentCity }}</div>
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">Measurement System:</div>
        <div class="border p-2">{{ measurementSystem }}</div>
    </div>
    <br />
    <!--TABLE TO DISPLAY NEXT 14 DAYS DATA-->
    <div class="conatiner mx-auto h-64 overflow-y-auto">
        <table class="w-full divide-y divide-gray-200">
            <thead class="bg-gray-100 sticky top-0 z-10 text-left">
                <tr>
                    <th>Date</th>
                    <th>Temperature</th>
                    <th>Precipitation Chance</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 ">
                <tr v-for="(weatherReport, i) in futureReportList" :key="i">
                    <td>{{ weatherReport.datetime }}</td>
                    <td>
                        {{ weatherReport.temp }}
                        <span v-if="measurementSystem == 'Metric'"> °C</span><span v-else> °F</span>
                    </td>
                    <td>
                        {{ weatherReport.precip }}
                        <span v-if="measurementSystem == 'Metric'"> mm</span><span v-else> in</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <br />
    <div class="text-center">
        <button class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" v-on:click="goToSevereRiskPage()" >Check Severity</button>
    </div>
</template>

<script>
import axios from 'axios'
import userHeaderComp from '../components/userHeader.vue'
export default{
    name:'futureWeatherReportComp',
    data(){
        return{
            currentCity:'',
            measurementSystem:'',
            futureReportList:[]
        }
    },
    components:{
        userHeaderComp
    },
    created(){
        this.currentCity = this.$route.params.cCity
        this.measurementSystem = this.$route.params.mSystem
    },
    methods:{
        async getFutureWeatherData(){
            await axios.get("/api/getfeatureweatherdata/"+this.currentCity)
            .then((res)=>{
                let fetchedWeatherData = res.data;
                if(this.measurementSystem == 'Metric'){
                    this.futureReportList = fetchedWeatherData
                }else{
                    this.futureReportList = []
                    for(let i=0; i<fetchedWeatherData.length;i++){
                        this.futureReportList.push(
                            {
                                datetime:this.dateMetricToImp(fetchedWeatherData[i].datetime),
                                temp:this.celsiusToFahrenheit(fetchedWeatherData[i].temp),
                                precip:this.snowMiliMetersToInches(fetchedWeatherData[i].precip)
                            }
                        )
                    }
                }
            })
            .catch(()=>{
                console.log("Future weather data could not be retrived");
            })
        },
        dateMetricToImp(currDate){
            const metricDate = new Date(currDate);
            const year = metricDate.getFullYear();
            const month = metricDate.getMonth() + 1;
            const day = metricDate.getDate();
            const imperialDate = `${month}-${day}-${year}`
            return imperialDate
        },
        celsiusToFahrenheit(celsius){
            return ((celsius * 9/5) + 32).toFixed(1)
        },
        snowMiliMetersToInches(mm){
            return (mm*0.03937).toFixed(2)
        },
        goToSevereRiskPage(){
            return this.$router.push({
                name:'severityCheckPage',
                params:{cCity: this.currentCity}
            })
        }
    },
    mounted(){
        this.getFutureWeatherData()
    }
}
</script>

<style>
</style>