<template>
  <el-row class="login-box" justify="center" align="middle">
    <el-col class="l-login" :span="8">
      <swiper
        class="login-swiper"
        :loop="true"
        :modules="modules"
        :slides-per-view="1"
        :autoplay="{ delay: 3000 }"
        :pagination="{ el: '.swiper-pagination', clickable: true }"
      >
        <swiper-slide v-for="slide in slides" :key="slide.id">
          <div class="swiper-slide-inner">
            <img :src="slide.img" alt="" />
            <div class="content-box">
              <div class="middle-content">WELCOME</div>
              <el-divider />
            </div>
          </div>
        </swiper-slide>
        <!-- Pagination -->
        <div class="swiper-pagination"></div>
      </swiper>
    </el-col>
    <el-col class="r-login" :span="10">
      <el-form
        ref="loginFromRef"
        :model="loginForm"
        :rules="rules"
        :inline="true"
        class="from-box"
      >
        <div class="logo-box">
          <img class="login-logo" src="/images/common/logo.png" alt="logo" />
          <p>翔东渝内部考试系统</p>
        </div>
        <h3 class="login-title">欢迎登录</h3>
        <el-form-item class="from-item" prop="username_or_email">
          <el-input
            v-model="loginForm.username_or_email"
            id="username_or_email"
            placeholder="请输入用户名或邮箱"
            type="text"
            autocomplete="off"
            class="login-input"
            @keyup.enter="focusNext('userPassword')"
          >
            <template #prefix>
              <span class="iconfont zhanghao1 icon-size"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="from-item" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            id="userPassword"
            :type="passwordType"
            autocomplete="off"
            class="login-input"
            @keyup.enter="
              captchaEnabled ? focusNext('captcha') : submitForm(loginForm)
            "
          >
            <template #prefix>
              <span class="iconfont ziyuanxhdpi1 icon-size"></span>
            </template>
            <template #suffix>
              <span
                @click="
                  passwordType =
                    passwordType === 'password' ? 'text' : 'password'
                "
              >
                <el-icon
                  v-if="passwordType === 'password'"
                  class="el-input__icon"
                  ><Hide
                /></el-icon>
                <el-icon
                  v-else-if="passwordType === 'text'"
                  class="el-input__icon"
                  ><View
                /></el-icon>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-password">
          <div class="forgot-password">
            <div
              class="common-text forgot-password-text"
              @click="router.push('/Register')"
            >
              注册账号📝
            </div>
          </div>
          <div class="forgot-password">
            <div
              class="common-text forgot-password-text"
              @click="router.push('/ForgetPassword')"
            >
              忘记密码❔
            </div>
          </div>
        </div>
        <el-form-item class="login-btn">
          <el-button @click="submitForm(loginForm)" :loading="loading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SwiperCore, { Autoplay, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { login } from "../api/index";
import "swiper/less";
import "swiper/less/pagination";
import "swiper/less/autoplay";
import { Hide, View, Warning } from "@element-plus/icons-vue";
import { getMenuListData } from "@/api/auth";
import { ElMessage } from "element-plus";
import { addDynamicRoutes } from "@/router/permission";
import { decryptPassword, encryptPassword } from "@/utils/password";
import store from "../store/store";

const passwordType = ref("password");
const loading = ref(false);

const loginForm = ref({
  username_or_email: "",
  password: "",
});

const modules = [Pagination, A11y, Autoplay];
SwiperCore.use([Pagination, A11y, Autoplay]);
const rules = {
  username_or_email: [
    { required: true, message: "请输入用户名或邮箱", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码位数只能在6~16之间", trigger: "blur" },
  ],
  // code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const loginFromRef = ref(null);
const router = useRouter();
const rememberValue = ref(false);
const userInfo = ref({
  username: null,
  password: null,
});
const captchaEnabled = ref(true);

const slides = ref([
  { id: 1, img: "/images/login/login-left-one.svg" },
  { id: 2, img: "/images/login/login-left-two.svg" },
]);

const focusNext = (id) => {
  const nextInput = document.getElementById(id);
  if (nextInput) {
    nextInput.focus();
  }
};

const setAccount = () => {
  const userInfoJsonStr = localStorage.getItem("userInfo");
  if (userInfoJsonStr != null && userInfoJsonStr !== "") {
    userInfo.value = JSON.parse(userInfoJsonStr);
    loginForm.value = { ...userInfo.value };
    if (userInfo.value.password) {
      loginForm.value.password = decryptPassword(userInfo.value.password);
      rememberValue.value = true;
    }
  }
};
// 按下登录按钮
const submitForm = async (loginForm) => {
  try {
    await loginFromRef.value.validate();
    loading.value = true;
    const response = await login(loginForm);
    if (response.code === 200) {
      if (rememberValue.value) {
        userInfo.value.password = encryptPassword(loginForm.password);
      } else {
        userInfo.value.password = null;
      }
      localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));
      localStorage.setItem(
        "usertype",
        JSON.stringify(response.data.userInfo.user_type)
      );
      localStorage.setItem("TOKEN", response.data.token.access);
      localStorage.setItem("refreshToken", response.data.token.refresh);
      // 获取菜单数据
      try {
        let res = await getMenuListData(response.data.userInfo.user_type);
        if (res.code === 200) {
          localStorage.setItem("menuList", JSON.stringify(res.data));
          addDynamicRoutes(res.data);
          await router.push("/top");
          const currentTime = ref(new Date().toLocaleString());
          localStorage.setItem("loginTime", JSON.stringify(currentTime));
        } else {
          console.error(res.msg);
        }
      } catch (e) {
        ElMessage.error("获取菜单数据失败");
      }
    }
  } catch (error) {
    console.error("登录失败: ", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  setAccount();
});
</script>

<style lang="less" scoped>
body {
  display: block;
}

.icon-size {
  font-size: 18px;
}

.login-box {
  min-width: 1366px;
  position: absolute;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  background-image: url("/images/login/bg.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.swiper-slide-One {
  background: url("/images/login/login-left-one.svg") center center / cover
    no-repeat;
}

.swiper-slide-Two {
  background: url("/images/login/login-left-two.svg") center center / cover
    no-repeat;
}

.l-login {
  position: relative;
  max-width: 640px;
  min-width: 640px;
  white-space: nowrap;
  height: auto;
  left: 6vw;
  .login-swiper {
    width: 100%;
    min-width: 640px;
    height: auto;
    z-index: 3000;
    white-space: nowrap;
  }
  .swiper-slide-inner {
    width: 100%;
    height: auto; /* 设置为你的轮播项高度 */
    img {
      width: 100%;
      height: auto;
      min-height: 600px;
    }
    .content-box {
      position: absolute;
      top: 12%;
      left: 12%;
      width: max-content;
      z-index: 2;
      .middle-content {
        font-size: 40px;
        color: #fff;
        font-weight: 700;
        font-family: "Arial", sans-serif;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
      .el-divider--horizontal {
        width: 128px;
        height: 2px;
        margin: 0 0;
      }
    }
  }
}

.swiper-pagination {
  right: 0;
  margin: 0 auto;
  bottom: 10%;
  width: 80px;
  height: 30px;
  border-radius: 30px;
  background-color: rgba(51, 51, 51, 0.4);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

::v-deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: var(--swiper-pagination-bullet-inactive-color, #ffffff);
  opacity: 1;
}

::v-deep(.swiper-pagination-bullet-active) {
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
  opacity: 1;
}

.r-login {
  position: relative;
  max-width: 811px;
  min-width: 600px;
  width: 811px;
  height: auto;
  border: 1px solid #eaeaea;
  border-radius: 20px;
  text-align: center;
  background: rgb(255, 255, 255);
  right: 6vw;
  .from-box {
    max-width: 285px;
    padding: 10% 19% 10% 45%;
  }
  .logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-logo {
      max-width: 60px;
      margin-right: 10px;
    }
    p {
      font-size: 20px;
      color: rgba(51, 51, 51, 0.996078431372549);
      margin: 0;
    }
  }
  .login-title {
    margin-bottom: 6px;
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.996078431372549);
    font-style: normal;
    letter-spacing: 0;
  }
  .divider {
    border: none;
    border-top: 1px solid #dbdbdb;
    margin: 24px 0;
  }
  .from-item {
    margin-bottom: 20px;
  }
  .login-input {
    height: 42px;
    width: 285px;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color))
        inset;
      cursor: default;
      padding: 0;
      .el-input__inner {
        cursor: default !important;
      }
    }
    align-content: center;
    border-bottom: 1px solid #dcdfe6;
    .captcha {
      width: 85px;
      ::v-deep(.el-image) {
        display: flex;
        align-items: center;
      }
    }
  }
  .login-btn {
    text-align: center;
    margin-top: 30px;
    .el-button {
      width: 285px;
      height: 42px;
      background-color: #2e68b2;
      font-family: "Arial", sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      border: 1px solid #2e68b2;
      box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
    }
  }
  .login-password {
    width: 285px;
    height: 42px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .forgot-password {
      position: relative;
      .forgot-password-text {
        cursor: pointer;
      }
      .forgot-password-text:hover {
        color: #1367ce;
      }
      .forgot-password-tip-text {
        position: absolute;
        display: flex;
        top: 0;
        color: #f59a23;
        padding-top: 10px;
        white-space: nowrap;
      }
    }
  }
}
</style>
