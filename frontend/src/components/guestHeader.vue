<template>
    <header>
    <nav class="bg-sky-300 border-gray-200 px-4 lg:px-6 py-4.5 text-black p-5">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div class="flex items-center">
                <img src="../assets/weatherApp01.png" class="mr-1 h-6 sm:h-9 rounded-full" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-bold whitespace-nowrap dark:text-blue">Weather App</span>
            </div>

            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-2" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-4 lg:mt-0">
                    <li><button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-1 rounded" type="button" v-on:click="backToDefaultPage()">Home</button></li>

                </ul>
            </div>
        </div>
    </nav>
</header>
</template>

<script>
export default{
    name:'guestHeaderComp'
}
</script>

<style>
</style>