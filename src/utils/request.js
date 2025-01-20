import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";

// 全局设置
axios.defaults.headers.post["Content-Type"] = "application/json";

const http = axios.create({
  baseURL: "http://10.1.13.139:8080/api/", // 通用请求地址前缀
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      config.headers.Authorization = "Bearer " + token; // 根据后端要求的格式设置
    }
    return config; // 在发送请求之前做什么
  },
  (error) => {
    return Promise.reject(error); // 对请求返回的错误做什么
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
      return data; // 可以直接返回data，简化每次调用API时的数据结构
    }
  },
  (error) => {
    // 根据不同的HTTP错误码给出不同的提示
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
