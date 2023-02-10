<template>
  <header class="select-none bg-darkmode-500 border-b border-gray-600">
    <nav class="container mx-auto flex justify-start items-center py-2">
      <router-link
        class="tracking-wider font-bold capitalize text-2xl mr-4 min-w-fit"
        :class="[route.name === 'home' ? 'text-orange-400' : 'text-white']"
        :to="{ name: 'home' }"
        >Mojidoori <i class="fas fa-pen-to-square text-sky-400"></i
      ></router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-2 tracking-wide font-bold space-x-3">
          <li>
            <router-link
              class=""
              :class="[
                route.name === 'learn' ? 'text-orange-400' : 'text-white',
              ]"
              :to="{ name: 'learn' }"
              >Learn</router-link
            >
          </li>
          <li>
            <router-link
              class=""
              :class="[
                route.name === 'quiz' ? 'text-orange-400' : 'text-white',
              ]"
              :to="{ name: 'quiz' }"
              >Quiz</router-link
            >
          </li>
          <li>
            <router-link
              class=""
              :class="[
                route.name === 'kanji' ? 'text-orange-400' : 'text-white',
              ]"
              :to="{ name: 'kanji' }"
              >Kanji</router-link
            >
          </li>
          <li>
            <router-link
              class=""
              :class="[
                route.name === 'about' ? 'text-orange-400' : 'text-white',
              ]"
              :to="{ name: 'about' }"
              >About</router-link
            >
          </li>
          <li>
            <router-link
              class=""
              :class="[
                route.name === 'login' ? 'text-orange-400' : 'text-white',
              ]"
              :to="{ name: 'about' }"
              >Login</router-link
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
</script>

<style scoped></style>
