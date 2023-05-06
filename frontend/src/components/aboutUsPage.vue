<template>
<h2>About Us</h2>
<br />
<footer>
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" v-on:click="backToDefaultPage()">Back</button>
</footer>
</template>

<script>
export default {
    name: 'aboutUsComp',
    data() {
        return {

        }
    },
    methods: {
        backToDefaultPage() {
            return this.$router.push({
                name: 'defaultPage'
            })
        }
    }
}
</script>

<style>
</style>
