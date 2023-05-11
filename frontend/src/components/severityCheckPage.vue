<template>
    <userHeaderComp subHeaderName="Severity Check" />
    <div class="grid grid-cols-6 gap-0" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">City:</div>
        <div class="border p-2">{{ currentCity }}</div>
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">Date:</div>
        <div class="border p-2">
            <input type="date" min="2023-05-01" max="2023-05-31" v-model="selectedDate" />
        </div>
        <div class="font-bold border p-2 bg-gray-300 text-gray-700">Severe Risk:</div>
        <div class="border p-2">{{ severeRisk }}</div>
    </div>
    <br />
    <div class="text-center">
        <button
            class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            v-on:click="checkSevereRisk()">Submit</button>
    </div>
    <br />
    <!--disabled for now-->
    <!-- <div>
        <ul v-for="(record, i) in neo4Jdata" :key="i">
            <li>{{ record }}</li>
        </ul>
    </div> -->
</template>

<script>
import axios from 'axios'
import userHeaderComp from '../components/userHeader.vue'
export default {
    name: 'severityCheckComp',
    data() {
        return {
            currentCity: '',
            severeRiskData: [],
            severeRisk: '',
            selectedDate: '',
            neo4Jdata: []
        }
    },
    components: {
        userHeaderComp
    },
    created() {
        this.currentCity = this.$route.params.cCity

    },
    mounted() {
        console.log("Severe risk data");
        this.getFutureWeatherData()

    },
    methods: {
        async getFutureWeatherData() {
            await axios.get("/api/getfeatureweatherdata/" + this.currentCity)
                .then((res) => {
                    let fetchedWeatherData = res.data;
                    for (let i = 0; i < fetchedWeatherData.length; i++) {
                        this.severeRiskData.push(
                            {
                                datetime: fetchedWeatherData[i].datetime,
                                severerisk: fetchedWeatherData[i].severerisk
                            }
                        )
                    }
                })
                .catch(() => {
                    console.log("Future weather data could not be retrived");
                })
        },
        async checkSevereRisk() {
            for (let i = 0; i < this.severeRiskData.length; i++) {
                if (this.severeRiskData[i].datetime == this.selectedDate) {
                    this.severeRisk = this.severeRiskData[i].severerisk
                }
            }
            await axios.get("/api/getseveritydata/" + this.currentCity + "/" + this.severeRisk + "/" + this.selectedDate)
                .then((res) => {
                    let result = res.data;
                    console.log(result);
                    this.neo4Jdata = result;
                })
                .catch(() => {
                    console.log("Severe weather risk data could not be retrived");
                })
        }
    }

}
</script>

<style></style>