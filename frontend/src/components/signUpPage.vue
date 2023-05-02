<template>
    <h2>Sign Up</h2>
    <br />
    <button v-on:click="backToDefaultPage()" >Back</button>
</template>

<script>
export default{
    name:'signUpComp',
    data(){
        return{

        }
    },
    methods:{
        backToDefaultPage(){
            return this.$router.push({name:'defaultPage'})
        }
    }
}
</script>

<style>
</style>