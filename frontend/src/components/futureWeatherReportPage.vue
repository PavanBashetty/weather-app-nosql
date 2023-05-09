<template>
    <userHeaderComp subHeaderName="Future Weather Report" />
    
</template>

<script>
import userHeaderComp from '../components/userHeader.vue'
export default{
    name:'futureWeatherReportComp',
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