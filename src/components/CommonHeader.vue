<template>
  <div class="header-container">
    <div class="glass-effect">
      <div class="left-content">
        <img class="logo" src="/images/common/logo.png" alt="logo" />
        <span class="nav-text">翔东渝内部考试系统</span>
      </div>
      <div class="right-content">
        <el-dropdown trigger="click">
          <div class="user-profile">
            <span class="user-name">{{ userInfo.username }}</span>
            <div class="avatar-container">
              <!-- 添加默认头像 -->
              <img class="avatar" :src="userInfo.avatar || '/images/default-avatar.png'" alt="avatar" />
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="dropdown-menu">
              <el-dropdown-item @click="accountSetting">
                <i class="el-icon-setting"></i>账号设置
              </el-dropdown-item>
              <el-dropdown-item @click="logout1">
                <i class="el-icon-switch-button"></i>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
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
      localStorage.removeItem("userInfo");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loginTime");
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 2rem;
    transition: all 0.3s ease;
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logo {
      max-width: 40px;
      height: auto;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .nav-text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      background: linear-gradient(120deg, #2b2b2b, #444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .right-content {
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      background: rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      .user-name {
        font-size: 0.9rem;
        font-weight: 500;
        color: #333;
      }

      .avatar-container {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}

:deep(.dropdown-menu) {
  border-radius: 12px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .el-dropdown-item {
    border-radius: 8px;
    margin: 0.2rem 0;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    color: #333;
    transition: all 0.2s ease;

    i {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #000;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header-container {
    .glass-effect {
      padding: 0.6rem 1rem;
    }

    .nav-text {
      font-size: 1rem;
    }

    .user-profile {
      padding: 0.4rem 0.8rem;

      .user-name {
        display: none;
      }
    }
  }
}
</style>
