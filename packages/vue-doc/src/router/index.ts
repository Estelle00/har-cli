import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("./README.md"),
  },
] as RouteRecordRaw[];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
