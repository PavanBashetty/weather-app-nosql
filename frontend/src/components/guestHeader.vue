<template>
    <header>
    <nav class="bg-sky-300 border-gray-200 px-4 lg:px-6 py-4.5 text-black p-5">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div class="flex items-center">
                <img src="../assets/weatherApp01.png" class="mr-1 h-6 sm:h-9 rounded-full" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-bold whitespace-nowrap dark:text-blue">Weather App</span>
            </div>
            
            <!--This div is written to make sure 'sub header name' aligns in center-->
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-2">
                <p class="text-sky-300">qqqqqqqqqqqqqqaaaaaaaa</p>
            </div>

            <div class="align-center lg:order-1">
                <h1 class="font-serif text-xl font-extralight text-black-600">{{ subHeaderName }}</h1>
            </div>


        </div>
    </nav>
</header>
</template>

<script>
export default{
    name:'guestHeaderComp',
    props:{
        subHeaderName: String
    }
}
</script>

<style>
</style>