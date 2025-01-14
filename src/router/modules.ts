import MyExam from "~/views/User/MyExam.vue";

export const modules = {
  top: () => import("../views/top/Top.vue"),
  user: () => import("../views/system/User.vue"),
  question: () => import("../views/system/Question.vue"),
  testpaper: () => import("../views/system/TestPaper.vue"),
  examination: () => import("../views/system/Examination.vue"),
  myexmam: () => import("../views/User/MyExam.vue"),
};
