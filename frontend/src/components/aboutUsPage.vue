<template>
    <h2>About Us</h2>
    <br />
    <button v-on:click="backToDefaultPage()" >Back</button>
</template>

<script>
export default{
    name:'aboutUsComp',
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