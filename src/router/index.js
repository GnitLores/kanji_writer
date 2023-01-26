import { createRouter, createWebHashHistory } from "vue-router";
// import { useStoreAuth } from "@/stores/storeAuth";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
