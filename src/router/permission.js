// 添加动态路由
import router from "./index";
import Layout from "../views/MainPage.vue";

import { modules } from "./modules";

const whiteList = ["/login", "/updatePassword", "/Register", "/ForgetPassword"];

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("TOKEN");
  if (token) {
    if (to.matched.length === 0) {
      next({ path: "/404" });
    } else {
      // 已登录，跳转到首页
      if (to.path === "/login") {
        next({ path: "/" });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) != -1) {
      next();
    } else {
      // 未登录，跳转到登录页面
      next("/login");
    }
  }
});

export const addDynamicRoutes = (menus) => {
  const routes = menusToRoutes(menus);
  console.log("roters", router.getRoutes());
  routes.map((route) => {
    router.addRoute("LayoutPage", route);
  });
};

const menusToRoutes = (data) => {
  const routes = [];
  if (data && data.length) {
    data.forEach((item) => {
      routes.push({
        path: item.route,
        name: item.name,
        component: item.app_url ? modules[item.app_url] : null,
        meta: {
          icon: item.icon,
          title: item.title,
        },
        redirect: item.redirect || null,
        children: childrenToRoute(item.children) || [],
      });
    });
  }
  return routes;
};

const childrenToRoute = (children) => {
  let childrenRoutes = [];
  if (children && children.length) {
    children.forEach((child) => {
      childrenRoutes.push({
        path: child.route,
        name: child.name,
        component: child.app_url ? modules[child.app_url] : null,
        meta: {
          icon: child.icon,
          title: child.title,
        },
        redirect: child.redirect || null,
        children: childrenToRoute(child.children) || [],
      });
    });
  }
  return childrenRoutes;
};
