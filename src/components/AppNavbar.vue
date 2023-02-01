<template>
  <header class="bg-gray-700">
    <nav class="container flex justify-start items-center py-2 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        >Mojidoori <i class="fas fa-pen-to-square text-sky-400"></i
      ></router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-2 font-bold">
          <li>
            <router-link class="text-white px-3" :to="{ name: 'learn' }"
              >Learn</router-link
            >
          </li>
          <li>
            <router-link class="text-white px-3" :to="{ name: 'quiz' }"
              >Quiz</router-link
            >
          </li>
          <li>
            <router-link class="text-white px-3" :to="{ name: 'kanji' }"
              >Kanji</router-link
            >
          </li>
          <li>
            <router-link class="text-white px-3" :to="{ name: 'about' }"
              >About</router-link
            >
          </li>
          <li>
            <router-link class="text-white px-3" :to="{ name: 'about' }"
              >Login</router-link
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup></script>

<style scoped></style>
