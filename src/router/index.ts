import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "../store";
import HomeLayout from "@/views/layout/HomeLayout.vue";
import AdminLayout from "@/views/layout/AdminLayout.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import UserManagerPage from "@/views/UserManagerPage.vue";
import ProductManagerPage from "@/views/ProductManagerPage.vue";
import DashBoad from "@/views/DashBoad.vue";
import RegisterPage from "@/views/RegisterPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeLayout,
    children: [
      {
        path: "",
        component: HomePage,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        name: "dashboad",
        component: DashBoad,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "user-management",
        name: "user-management",
        component: UserManagerPage,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "product-management",
        name: "product-management",
        component: ProductManagerPage,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const isAdmin = store.getters["auth/isAdmin"];

  if (to.meta?.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta?.requiresAdmin && !isAdmin) {
    next("/");
  } else {
    next();
  }
});

export default router;
