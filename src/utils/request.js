import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 全局设置
axios.defaults.headers.post["Content-Type"] = "application/json";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    if (
      (response.config.params &&
        response.config.params.responseType === "blob") ||
      (response.config.params &&
        response.config.params.responseType === "arraybuffer")
    ) {
      return response;
    }
    const data = response.data;
    if (data.code === 401) {
      localStorage.removeItem("TOKEN");
      ElMessage.error("您的会话已过期，请重新登录");
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("menuList");
      localStorage.removeItem("activeKey");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loginTime");
      router.push("/login");
    } else if (data.code !== 200) {
      ElMessage.error(response.data.msg ? response.data.msg : "请求失败！");
      return data;
    } else {
      return data;
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("请求错误");
          break;
        case 401:
          localStorage.removeItem("TOKEN");
          ElMessage.error("您的会话已过期，请重新登录");
          router.push("/login");
          break;
        case 403:
          console.error("拒终访问");
          break;
        case 404:
          console.error("请求地址出错");
          break;
        case 408:
          console.error("请求超时");
          break;
        case 500:
          console.log("message", error.response.msg);
          break;
        default:
          console.error("响应错误", error.response.status);
          break;
      }
    } else {
      console.error("连接到服务器失败");
    }
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

export default http;
