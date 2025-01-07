<template>
  <div class="header-container">
    <div class="left-content">
      <!-- logo显示区域 -->
      <img
        style="max-width: 65px; font-size: 18px"
        src="/images/common/logo.png"
        alt=""
      />
      <!-- 面包屑导航区域 -->
      <span class="nav-text">翔东渝内部考试系统</span>
    </div>
    <div class="right-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <span class="user-name">{{ userInfo.username }}</span>
          <el-icon class="el-icon--right">
            <img src="/images/common/arrow.png" alt="" />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="accountSetting"
              >账号设置</el-dropdown-item
            >
            <el-dropdown-item @click="logout1">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { logout } from "@/api/index";
import { ElMessageBox } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const userInfo = computed(() => store.getters.getUserInfo);

const accountSetting = () => {
  router.push("/accountSetting");
};

function logout1() {
  const refreshToken = localStorage.getItem("refreshToken");
  // 弹出确认框
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    // 发送登出请求
    logout({ refresh: refreshToken }).finally(() => {
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("menuList");
      localStorage.removeItem("activeKey");
      // 跳转到登录页面
      router.push("/login");
    });
  });
}

onMounted(() => {
  const savedUserInfo = localStorage.getItem("userInfo");
  if (savedUserInfo) {
    Object.assign(userInfo.value, JSON.parse(savedUserInfo));
  }
});
</script>

<style lang="less" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-content {
    min-height: 72px;
    display: flex;
    align-items: center;
    margin-left: 22px;
    img {
      margin-right: 14px;
    }
    .nav-text {
      font-family: "微软雅黑", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: rgba(51, 51, 51, 0.996);
    }
  }
  .right-content {
    display: flex;
    margin-right: 22px;
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      outline: none;
      .user-name {
        font-family: "Arial", sans-serif;
        font-weight: 400;
        font-style: normal;
        letter-spacing: normal;
        color: #333333;
        line-height: normal;
        white-space: nowrap;
        text-transform: none;
        font-size: 14px;
        text-align: left;
      }
    }
    .user-image {
      display: block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .user-image {
      margin: auto 10px auto 22px;
    }
  }
}
</style>
