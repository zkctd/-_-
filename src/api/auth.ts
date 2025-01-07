import http from "../utils/request";

/**
 * 发送GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回一个Promise对象
 */
const get = (url, params) => {
  return http.get(url, { params });
};

//获取菜单数据
export const getMenuListData = (user_type) => {
  return get(`/routes/routeList/?user_type=${user_type}`);
};

// 获取操作权限
export const getUserResourceForOperate = (params) => {
  return get("/base/resource/getResourceForOperate", params);
};

// 获取数据权限
export const getResourceForData = () => {
  return get("/base/resource/getResourceForData", null);
};
