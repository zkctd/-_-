import Layout from "../views/MainPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    name: "LayoutPage",
    component: Layout,
    redirect: "/top",
    children: [
      {
        path: "/top",
        name: "top",
        component: () => import("../views/top/Top.vue"),
      },
      {
        path: "/accountSetting",
        name: "accountSetting",
        component: () => import("../views/top/AccountSetting.vue"),
      },
    ],
  },
  {
    path: "/Register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPassword",
    component: () => import("../views/ForgetPassword.vue"),
  },
  {
    path: "/exam",
    name: "exam",
    component: () => import("../views/exam/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/error/404.vue"),
  },
];

const router = createRouter({
  //   history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
});

export default router;
