<template>
<div class="text-center" style="background-color:skyblue; padding: 30px">
    <h1 class="self-center text-2xl font-bold whitespace-nowrap dark:text-blue">Welcome to Weather App</h1>
</div>

<br /><br>

<div class="flex items-center justify-center">
    <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" v-on:click="signUpPage()"><b>Sign Up</b></button>
    <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" v-on:click="loginPage()"><b>Log In</b></button>
    <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" v-on:click="guestPage()"><b>Guest</b></button>
    <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" v-on:click="loginAsPavan()"><b>Log in as Pavan</b></button>
    <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" v-on:click="loginAsSrujana()"><b>Log in as Srujana</b></button>
</div>

<hr />
<footer>
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" v-on:click="aboutUsPage()">About Us</button>
</footer>
</template>

<script>
export default {
    name: 'defaultComp',
    methods: {
        signUpPage() {
            return this.$router.push({
                name: 'signUpPage'
            })
        },
        loginPage() {
            return this.$router.push({
                name: 'loginPage'
            })
        },
        guestPage() {
            return this.$router.push({
                name: 'guestPage'
            })
        },
        aboutUsPage() {
            return this.$router.push({
                name: 'aboutUsPage'
            })
        },
        loginAsPavan(){
            localStorage.setItem("user-name", '"pavan"');
            localStorage.setItem("email", '"pavankumar.rb25@gmail.com"');
            this.$router.push({name: 'homePage'})
        },
        loginAsSrujana(){
            localStorage.setItem("user-name", '"Srujana"');
            localStorage.setItem("email", '"sru@gmail.com"');
            this.$router.push({name: 'homePage'})
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

<style>
footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 2px;
    background-color: Salmon;
    color: white;
}
</style>
