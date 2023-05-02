<template>
    <h2>Welcome to weather app</h2>
    <br />
    <button v-on:click="signUpPage()" >Sign Up</button>
    <button v-on:click="loginPage()" >Log in</button>
    <button v-on:click="guestPage()">Guest</button>
    <hr />
    <button v-on:click="aboutUsPage()" >About Us</button>
</template>

<script>
export default{
    name:'defaultComp',
    methods:{
        signUpPage(){
            return this.$router.push({name:'signUpPage'})
        },
        loginPage(){
            return this.$router.push({name:'loginPage'})
        },
        guestPage(){
            return this.$router.push({name:'guestPage'})
        },
        aboutUsPage(){
            return this.$router.push({name:'aboutUsPage'})
        }
    }
}
</script>

<style>
</style>