import { createRouter, createWebHashHistory } from "vue-router";
// import { useStoreAuth } from "@/stores/storeAuth";
import HomeView from "@/views/HomeView.vue";
import LearnView from "@/views/LearnView.vue";
import QuizView from "@/views/QuizView.vue";
import KanjiView from "@/views/KanjiView.vue";
import AboutView from "@/views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/learn",
    name: "learn",
    component: LearnView,
  },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizView,
  },
  {
    path: "/kanji",
    name: "kanji",
    component: KanjiView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  // const storeAuth = useStoreAuth();
  // if (!storeAuth.user.id && to.name !== 'auth') {
  //   return { name: 'auth' };
  // }
  // if (storeAuth.user.id && to.name === 'auth') {
  //   return false;
  // }
});

export default router;
