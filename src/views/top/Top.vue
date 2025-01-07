<template>
  <el-row class="top-row" align="middle" justify="start">
    <el-col :span="24">
      <div class="top-user">
        <div class="icon-welcome">
          <img class="icon-welcome" src="/images/top/welcome.png" alt="" />
        </div>
        <div>
          <div class="userInfo">
            <p class="userRole">{{ userInfo.name }}</p>
            <p class="userName">&nbsp;您好 祝您开心每一天</p>
          </div>
          <div class="logInfo">
            <p>
              登录于<span>{{ logintime }}</span>
            </p>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row class="top-down-row">
    <el-col :span="24">
      <div class="common-text f-s-18 nav-text">暂未开发</div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMenuListData } from "@/api/auth.ts";
import { useRouter } from "vue-router";

const userInfo = ref({
  id: "",
  username: "",
  username_or_email: "",
  name: "",
  status: true,
  user_type: 1,
});
const userResourceData = ref([]);
const router = useRouter();
const logintime = ref("");
// 查询
const getUserResourceInfo = async () => {
  try {
    const response = await getMenuListData(userInfo.value.user_type);
    if (response.code === 200 && response.data) {
      console.log("response.data", response.data);
      response.data.forEach((item) => {
        if (item.name === "message") {
          userResourceData.value = userResourceData.value.concat(item);
        } else if (item.name === "netManage") {
          if (item.children && item.children.length > 0) {
            userResourceData.value = userResourceData.value.concat(item);
          }
        } else {
          if (item.children && item.children.length > 0) {
            userResourceData.value = userResourceData.value.concat(
              item.children
            );
          }
        }
      });
      userResourceData.value.forEach((item) => {
        if (item.icon === "#") {
          if (item.name === "user") {
            item.icon = "iconfont user-manage";
          } else if (item.name === "role") {
            item.icon = "iconfont role-manage";
          } else if (item.name === "approval") {
            item.icon = "iconfont approval-manage";
          } else if (item.name === "news") {
            item.icon = "iconfont news";
          }
        }
      });
      console.log("userResourceData.value", userResourceData.value);
    }
  } catch (error) {
    console.error("查询失败:", error);
  }
};

onMounted(() => {
  const savedUserInfo = localStorage.getItem("userInfo");
  if (savedUserInfo) {
    Object.assign(userInfo.value, JSON.parse(savedUserInfo));
  }
  const savedLoginTime = localStorage.getItem("loginTime");
  if (savedLoginTime) {
    const loginTimeObj = JSON.parse(savedLoginTime);
    logintime.value = loginTimeObj._value;
  }
  getUserResourceInfo();
});

const toRoute = (item) => {
  if (item.name === "netManage") {
    if (item.children && item.children.length > 0) {
      router.push(item.children[0].route);
    }
  } else {
    router.push(item.route);
  }
};
</script>

<style lang="less" scoped>
.top-row {
  background-color: #fff;
  min-height: 100px;
  min-width: 546px;
  margin-left: 10px;
}
.top-user {
  display: flex;
  min-width: 546px;
  padding-left: 40px;
  .icon-welcome {
    padding-right: 20px;
  }
}
.userInfo {
  display: flex;
  align-items: center;
  .userRole,
  .userName {
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #555555;
    margin: 0;
    word-wrap: break-word;
  }
  .userName {
    font-family: "Arial Normal", "Arial", sans-serif;
    font-weight: 400;
    font-size: 14px;
    word-wrap: break-word;
  }
}
.logInfo {
  font-size: 12px;
  color: #555555;
  font-family: "Arial", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  p {
    margin: 0;
    margin-top: 15px;
  }
}
.icon-welcome {
  width: 3rem;
  height: 3rem;
}
.top-down-row {
  min-height: calc(100vh - 240px);
  background-color: #ffffff;
  margin-top: 10px;
  min-width: 546px;
  margin-left: 10px;
  .nav-text {
    padding: 50px 0 50px 40px;
  }
  .nav-content {
    ul {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 60px;
    }
    a {
      text-decoration: none;
    }
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
    }
    li .nav-item:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    }
    .nav-item {
      height: 60px;
      width: 60px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.1s, box-shadow 0.1s;
      span {
        color: #fff;
        font-size: 26px;
      }
    }
    .nav-title {
      color: #555555;
    }
  }
}
</style>
