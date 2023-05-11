<template>
    <userHeaderComp subHeaderName="Historic Weather Report" />
    <div class="grid grid-cols-6 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
        <div class="border p-2">{{ currentCity }}</div>
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">Year:</div>
        <div class="border p-2">
            <select class="block py-2 w-full border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm" v-model="year">
                <option value="" disabled selected>Select A Year:</option>
                <option>2022</option>
                <option>2023</option>
            </select>
        </div>
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">Month:</div>
        <div class="border p-2">
            <select class="block py-2 w-full border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm" v-model="month">
                <option value="" disabled selected>Select A Month:</option>
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option v-if="year<2023">06</option>
                <option v-if="year<2023">07</option>
                <option v-if="year<2023">08</option>
                <option v-if="year<2023">09</option>
                <option v-if="year<2023">10</option>
                <option v-if="year<2023">11</option>
                <option v-if="year<2023">12</option>
            </select>
        </div>
    </div>
    <br />
    <div class="text-center">
        <button class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" v-on:click="getHistoricData()" >Submit</button>
        <button class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" v-show="showComponent" v-on:click="resetData()">Reset</button>
    </div>

    <form v-show="showComponent">
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
                <tr v-for="(weatherReport, i) in histroicReportList" :key="i">
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
    </form>
</template>

<script>
import axios from 'axios'
import userHeaderComp from '../components/userHeader.vue'
export default{
    name:'historicWeatherReportComp',
    data(){
        return{
            currentCity:'',
            measurementSystem:'',
            year:'',
            month:'',
            showComponent: false,
            histroicReportList:[]
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
        async getHistoricData(){
            this.showComponent = true;
            await axios.get("/api/gethistoricweatherdata/"+this.currentCity+"/"+this.year+"/"+this.month)
            .then((res)=>{
                let result = res.data;
                console.log(result);
                let fetchedWeatherData = [];
                for(let i=0; i<result.length;i++){
                    fetchedWeatherData.push(
                        {
                            datetime: result[i].days[0].datetime,
                            temp:result[i].days[0].temp,
                            precip: result[i].days[0].precip
                        }
                    )
                }
                if(this.measurementSystem == 'Metric'){
                    this.histroicReportList = fetchedWeatherData
                }else{
                    this.histroicReportList = []
                    for(let i=0; i<fetchedWeatherData.length;i++){
                        this.histroicReportList.push(
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
                console.log("Historic weather data could not be retrived");
            })

        },
        resetData(){
            this.year = '',
            this.month = '',
            this.showComponent = false,
            this.histroicReportList = []
            
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
        }
    }
}
</script>

<style>
</style>