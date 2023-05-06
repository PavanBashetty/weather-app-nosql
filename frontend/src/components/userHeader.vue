<template>
<header>
    <nav class="bg-sky-300 border-gray-200 px-4 lg:px-6 py-4.5 text-black p-5">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div class="flex items-center">
                <img src="../assets/weatherApp01.png" class="mr-1 h-6 sm:h-9 rounded-full" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-bold whitespace-nowrap dark:text-blue">Weather App</span>
            </div>
            <div class="flex items-center lg:order-1">
                <h1 class="font-serif text-xl font-extralight text-black-600">{{ subHeaderName }}</h1>
                <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false"><span class="sr-only">Open main menu</span> <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-2" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-4 lg:mt-0">
                    <li><button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-1 rounded" type="button" v-on:click="backToMainPage()">Home</button></li>
                    <li><button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-1 rounded" type="button" v-on:click="NeoFourJ()">Neo4j</button></li>
                    <li><button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-1 rounded" type="button" v-on:click="getUserDetails()">{{userName}}</button></li>
                    <li><button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-1 rounded" type="button" v-on:click="logout()">Log out</button></li>
                </ul>
            </div>
        </div>
    </nav>
</header>
</template>

<script>
export default {
    name: 'userHeaderComp',
    data(){
        return{
            userName:''
        }
    },
    props:{
        subHeaderName: String
    },
    methods:{
        backToMainPage(){
            return this.$router.push({name:'homePage'})
        },
        NeoFourJ(){

        },
        getUserDetails(){
            return this.$router.push({name:'userDetailsPage'})
        },
        logout(){
            localStorage.clear();
            this.$router.push({name:'loginPage'})
        }
    },
    mounted(){
        let userInfo = localStorage.getItem("user-name");
        if(userInfo != null){
            userInfo = userInfo.substring(1, (userInfo.length - 1))
            this.userName = userInfo;
        }
    }
}
</script>

<style>
</style>
