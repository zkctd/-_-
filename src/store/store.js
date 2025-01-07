// store.js
import { createStore } from "vuex";
import { getUserResourceForOperate, getResourceForData } from "@/api/auth.ts";

const store = createStore({
  state: {
    permissions: [],
    resourceData: [],
    userInfo: {
      id: "",
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      status: 0,
      user_type: 0,
    },
  },
  mutations: {
    setPermissions(state, permissions) {
      state.permissions = permissions;
    },
    setResourceData(state, resourceData) {
      state.resourceData = resourceData;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  getters: {
    getUserPermissions(state) {
      return () => state.permissions;
    },
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    async fetchPermissions({ commit }) {
      try {
        const res = await getUserResourceForOperate();
        if (res.code === 200 && res.data) {
          commit("setPermissions", res.data);
        } else {
          ElMessage.error(res.msg);
        }
      } catch (e) {
        ElMessage.error("获取操作权限失败");
      }
    },
    async fetchData({ commit }) {
      try {
        const res = await getResourceForData();
        if (res.code === 200 && res.data) {
          commit("setResourceData", res.data);
        } else {
          ElMessage.error(res.msg);
        }
      } catch (e) {
        ElMessage.error("获取数据权限失败");
      }
    },
    updateUserInfo({ commit }, userInfo) {
      commit("setUserInfo", userInfo);
    },
  },
});

export default store;
