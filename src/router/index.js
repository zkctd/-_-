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
      {
        path: "/exam_detail",
        name: "exam_detail",
        component: () => import("../views/exam_detail/index.vue"),
      },
      {
        path: "/UserPaperDetail",
        name: "UserPaperDetail",
        component: () => import("../views/exam_detail/UserPaperDetail.vue"),
      },
      {
        path: "/DetailsInProgress",
        name: "DetailsInProgress",
        component: () => import("../views/exam_detail/DetailsInProgress.vue"),
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
    path: "/examResult",
    name: "examResult",
    component: () => import("../views/exam/result.vue"),
  },
  {
    path: "/exam",
    name: "exam",
    component: () => import("../views/exam/index.vue"),
  },
  {
    path: "/ErrorQuestionExam",
    name: "ErrorQuestionExam",
    component: () => import("../views/User/ErrorQuestionExam.vue"),
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
