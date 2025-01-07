// 在组件中使用store
import store from "../store/store";
import { ref } from "vue";

export default {
  async mounted(el, bindling) {
    //bindling.value为指令的绑定值
    const perVal = bindling.value;
    if (bindling.value) {
      //假设某用户对某模块只有添加和删除的权限
      //权限信息应该是不同用户登录时从后台拿到的对应的信息
      //   const permissions = ['news_add'];
      // 访问权限数据
      // await store.dispatch("fetchPermissions");
      let hasPer = false;
      const userInfo = ref({
        account: "",
      });
      const savedUserInfo = localStorage.getItem("userInfo");
      if (savedUserInfo) {
        Object.assign(userInfo.value, JSON.parse(savedUserInfo));
      }
      if (userInfo.value.user_type === 1) {
        hasPer = true;
      } else {
        const permissions =
          store.state.permissions.length > 0
            ? store.state.permissions
            : localStorage.getItem("permissions").split(",");
        //hasPer为true为有权限
        //hasPer为false为无权限
        hasPer = permissions.some((item) => {
          return item == perVal;
        });
      }
      //没有权限隐藏
      if (!hasPer) {
        el.style.display = "none";
      }
    }
  },
};
