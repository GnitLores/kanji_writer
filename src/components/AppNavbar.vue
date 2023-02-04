<template>
  <header class="select-none bg-darkmode-500 border-b border-gray-600">
    <nav class="container mx-auto flex justify-start items-center py-2">
      <router-link
        class="text-white tracking-wider font-bold capitalize text-2xl mr-4 min-w-fit"
        :to="{ name: 'home' }"
        >Mojidoori <i class="fas fa-pen-to-square text-sky-400"></i
      ></router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-2 tracking-wide font-bold space-x-3">
          <li>
            <router-link class="text-white" :to="{ name: 'learn' }"
              >Learn</router-link
            >
          </li>
          <li>
            <router-link class="text-white" :to="{ name: 'quiz' }"
              >Quiz</router-link
            >
          </li>
          <li>
            <router-link class="text-white" :to="{ name: 'kanji' }"
              >Kanji</router-link
            >
          </li>
          <li>
            <router-link class="text-white" :to="{ name: 'about' }"
              >About</router-link
            >
          </li>
          <li>
            <router-link class="text-white" :to="{ name: 'about' }"
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
