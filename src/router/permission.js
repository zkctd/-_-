// 添加动态路由
import router from "./index";
import { modules } from "./modules";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const whiteList = ["/login", "/updatePassword", "/Register", "/ForgetPassword"];
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start();
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
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("menuList");
      localStorage.removeItem("activeKey");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loginTime");
      next("/login");
    }
  }
});
// 路由跳转完成
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
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
