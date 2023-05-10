<template>
    <userHeaderComp subHeaderName="User Details"/>
    <!--USER INFO-->
    <div class="w-1/2 grid grid-cols-2 gap-1" style="grid-auto-rows: minmax(10px, auto); grid-auto-columns: max-content;">
        <div class="userDetailsHeader">Full Name:</div>
        <div class="block w-full border p-2">{{ fullName }}</div>
        <div class="userDetailsHeader">Email:</div>
        <div class="border p-2">{{ email }}</div>
        <div class="userDetailsHeader">Current City:</div>
        <div class="border p-2">
            <input type="text" class="border p-2 w-full" v-model="currentCity" :disabled="showDisabledElements"/>
        </div>
        <div class="userDetailsHeader">Measurement System</div>
        <div class="border p-2">
            <select class="border p-2 w-full" v-model="newMeasurementSystem" :disabled="showDisabledElements">
                <option value="" disabled selected>{{ currentMeasurementSystem }}</option>
                <option value="Metric">Metric</option>
                <option value="Imperial">Imperial</option>
            </select>
        </div>
        <div><button class="block w-full p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" v-on:click="editUserDetails()" >Edit Details</button></div>
        <div><button class="block w-full p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" v-show="!showDisabledElements" v-on:click="saveUserChanges()">Save Changes</button></div>
    </div>
</template>

<script>
import userHeaderComp from '../components/userHeader.vue'
import axios from 'axios';
export default{
    name:'userDetailsComp',
    data(){
        return{
            fullName:'',
            email:'',
            currentCity:'',
            newMeasurementSystem:'',
            currentMeasurementSystem:'',
            showDisabledElements: true,
        }
    },
    components:{
        userHeaderComp
    },
    mounted(){
        let localStorageEmail = localStorage.getItem("email");
        if(!localStorageEmail){
            return this.$router.push({name:'loginPage'})
        }
        localStorageEmail = localStorageEmail.substring(1, (localStorageEmail.length - 1));
        this.email = localStorageEmail;
        this.loadUserDetails();
    },
    methods:{
       async loadUserDetails(){
            await axios.get("/api/userdetails/"+this.email)
            .then((res)=>{
                let userData = res.data;
                this.fullName = (userData.firstName).concat(" ", userData.lastName);
                this.currentCity = userData.currentCity;
                this.currentMeasurementSystem = userData.measurementSystem
            })
            .catch(()=>{
                console.log("Data could not be retreived");
            })
        },
        editUserDetails(){
            this.showDisabledElements = false;
        },
       async saveUserChanges(){
            this.showDisabledElements = true;
            await axios.post("/api/saveuserchanges/"+this.email,{
                currentCity: this.currentCity,
                measurementSystem: this.newMeasurementSystem
            })
            .then((res)=>{
                let result = res.data;
                if(result.acknowledged){
                    alert("Data updated successfully!");
                }else{
                    alert("Data did not update. Please try later");
                }
            })
            .catch(()=>{
                console.log("Data could not be updated.");
            })
            this.loadUserDetails();
        }
    }
}
</script>

<style>
.userDetailsHeader {
    @apply block w-full font-bold border p-2 bg-gray-300 text-gray-700
}
</style>