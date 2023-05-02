<template>
    <h2>Log In</h2>
    <br />
    <button v-on:click="backToDefaultPage()" >Back</button>
</template>

<script>
export default{
    name:'loginComp',
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