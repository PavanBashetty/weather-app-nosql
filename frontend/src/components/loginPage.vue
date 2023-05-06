<template>
<div class="form-center">
    <input type="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter email" v-model="email" />
    <input type="password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter password" v-model="password" />
    <button type="submit" class="block w-1/2 p-2.5 text-black bg-blue-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" v-on:click="login()">Log In</button>
    <p class="block w-1/2 p-2.5 text-sm font-light text-gray-500 dark:text-gray-400">
        Don't have an account yet? <button class="font-medium text-primary-600 hover:underline dark:text-primary-500" v-on:click="toSignUpPage()">Create an account</button>
    </p>
</div>

<footer>
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" v-on:click="backToDefaultPage()">Back</button>
</footer>
</template>

<script>
import axios from 'axios'
export default {
    name: 'loginComp',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        backToDefaultPage() {
            return this.$router.push({
                name: 'defaultPage'
            })
        },
        toSignUpPage() {
            return this.$router.push({
                name: 'signUpPage'
            })
        },
        async login() {
            let email = this.email;
            let password = this.password;
            await axios.get("/api/login/" + email)
                .then((res) => {
                    let result = res.data;
                    if(result === null){
                        alert("Account doesn't exist. Please enter proper details");
                        this.email = '';
                        this.password = ''
                    }
                    if(Object.keys(result).length > 0) {
                        if ((result.password == password) && (res.status == 200)) {
                            localStorage.setItem("user-name", JSON.stringify(result.firstName));
                            localStorage.setItem("email", JSON.stringify(result.email));
                            // check if below two can be stored in REDIS
                            localStorage.setItem("currentCity", JSON.stringify(result.currentCity));
                            localStorage.setItem("measurementSystem", JSON.stringify(result.measurementSystem));
                            alert("Login successfull");
                            this.$router.push({
                                name: 'homePage'
                            })
                        }else {
                            alert("Incorret password, try again!");
                            this.password = '';
                        }
                    }
                })
                .catch(() => {
                    console.log("Server issue");
                })
        }
    }
}
</script>

<style scoped>
.form-center {
    text-align: center;
    font-size: large;
    padding-top: 40px;
    padding-left: 450px;
}
</style>
