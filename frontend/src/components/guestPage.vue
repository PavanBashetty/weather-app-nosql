<template>
    <h2>Guest</h2>
    <br />
    <button v-on:click="backToDefaultPage()" >Back</button>
</template>

<script>
export default{
    name:'guestComp',
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