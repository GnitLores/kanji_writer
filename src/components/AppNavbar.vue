<template>
  <header class="bg-slate-700 select-none">
    <nav class="container mx-auto flex justify-start items-center py-2">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4 min-w-fit"
        :to="{ name: 'home' }"
        >Mojidoori <i class="fas fa-pen-to-square text-sky-400"></i
      ></router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-2 font-bold space-x-3">
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
