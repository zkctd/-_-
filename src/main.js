import { createApp } from "vue";
import "./style.css";
import './assets/iconfont/iconfont.css';
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import router from "./router";
import App from "./App.vue";
import './assets/css/index.less'
import { addDynamicRoutes } from "@/router/permission.js";
// 按钮权限
import directive from './directives/index'
// import permission from './directives/permission'
import store from './store/store';
const app = createApp(App);
// 使用Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 修改分页器默认文字
zhCn.el.pagination.goto ='跳至';

// 使用Element Plus
app.use(ElementPlus, {
  locale: zhCn,
});
// 解决动态路由页面刷新时无路由匹配
const menuList = JSON.parse(localStorage.getItem("menuList")) || [];
addDynamicRoutes(menuList);
app.use(router);
app.use(store);
app.use(directive);
app.mount("#app");
