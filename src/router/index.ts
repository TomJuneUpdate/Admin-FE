import DashboardPage from "@/views/DashboardPage.vue";
import AdminLayOut from "@/views/layout/AdminLayOut.vue";
import LoginPage from "@/views/LoginPage.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
  {
    path: "/admin",
    component: AdminLayOut,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: DashboardPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
