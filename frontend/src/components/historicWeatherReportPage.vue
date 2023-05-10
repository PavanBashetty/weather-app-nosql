<template>
    <userHeaderComp subHeaderName="Historic Weather Report" />
    <div>Your city: {{ currentCity }}</div>
</template>

<script>
import userHeaderComp from '../components/userHeader.vue'
export default{
    name:'historicWeatherReportComp',
    data(){
        return{
            currentCity:''
        }
    },
    components:{
        userHeaderComp
    },
    created(){
        this.currentCity = this.$route.params.cCity
    }
}
</script>

<style>
</style>