<template>

<div class="form-center">
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter first name" v-model="firstName" />
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter last name" v-model="lastName" />
    <input type="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter email" v-model="email" />
    <input type="password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter password" v-model="password" />
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter your city" v-model="currentCity" />
    <select class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="measurementSystem" required="" v-model="measurementSystem">
        <option value="" disabled selected>Preferred Measurement System</option>
        <option value="metric">Metric</option>
        <option value="imperial">Imperial</option>
    </select>
    <br />
    <button type="button" class="block w-1/2 p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" v-on:click="submitUserData()">Sign Up</button>
    <p class="block w-1/2 p-2.5 text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account? <button class="font-medium text-primary-600 hover:underline dark:text-primary-500" v-on:click="toLoginPage()"> Login here</button>
    </p>
</div>

<footer>
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" v-on:click="backToDefaultPage()">Back</button>
</footer>
</template>

<script>
import axios from 'axios';
export default {
    name: 'signUpComp',
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            currentCity: '',
            measurementSystem: ''
        }
    },
    methods: {
        backToDefaultPage() {
            return this.$router.push({
                name: 'defaultPage'
            })
        },
        async submitUserData() {
            await axios.post("/api/signup", {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password,
                    currentCity: this.currentCity,
                    measurementSystem: this.measurementSystem
                })
                .then((res) => {
                    if (res.data.acknowledged) {
                        alert("Registration successfull!");
                        return this.$router.push({
                            path: '/login'
                        })
                    } else {
                        alert("Registration did not happen, please try again!");
                        this.firstName = '',
                            this.lastName = '',
                            this.email = '',
                            this.password = '',
                            this.currentCity = '',
                            this.measurementSystem = ''
                    }
                })
                .catch(() => {
                    alert("Registration failed. Please try later!");
                    this.firstName = '',
                        this.lastName = '',
                        this.email = '',
                        this.password = '',
                        this.currentCity = '',
                        this.measurementSystem = ''
                })
        },
        toLoginPage() {
            return this.$router.push({
                name: 'loginPage'
            })
        }

    },
    mounted(){
        let userEmail = localStorage.getItem('email')
        if(userEmail != null){
            return this.$router.push({name:'homePage'})
        }
    }
}
</script>

<style scoped>
.form-center {
    text-align: center;
    font-size: large;
    padding-top: 30px;
    padding-left: 450px;
}

</style>
