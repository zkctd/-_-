<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="left-content">
          <!-- logo显示区域 -->
          <img style="max-width: 70px" src="/images/common/logo.png" alt="" />
          <!-- 面包屑导航区域 -->
          <span class="nav-text">翔东渝内部考试系统</span>
        </div>
      </el-header>
      <el-main>
        <div class="register-container">
          <el-form
            :model="registerForm"
            ref="registerRef"
            :rules="rules"
            label-width="auto"
            require-asterisk-position="right"
          >
            <h3 class="register-title">用户注册</h3>
            <el-form-item
              prop="username"
              label="用户名"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.username"
                autocomplete="off"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="name"
              label="姓名"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.name"
                autocomplete="off"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="phone"
              label="手机号"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.phone"
                autocomplete="off"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.email"
                autocomplete="off"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="verificationCode"
              label="验证码"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.code"
                autocomplete="off"
                placeholder="请输入验证码"
              >
                <template #suffix>
                  <el-button
                    :disabled="!isEmailValid || isCounting"
                    @click="sendVerificationCode"
                  >
                    {{ isCounting ? `${countdown}秒后重新发送` : "发送验证码" }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="password"
              label="设置密码"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                :type="passwordType"
                v-model="registerForm.password"
                autocomplete="off"
                placeholder="请输入6-16位字母数字混合密码"
                @keyup.enter="focusNext('confirmPassword')"
              >
                <template #suffix>
                  <span
                    @click="
                      passwordType =
                        passwordType === 'password' ? 'text' : 'password'
                    "
                    class="view-password"
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
            <el-form-item
              prop="confirmPassword"
              label="确认密码"
              label-position="left"
              class="reg-form-item"
            >
              <el-input
                v-model="registerForm.confirmPassword"
                id="confirmPassword"
                :type="confirmPasswordType"
                autocomplete="off"
                placeholder="请确认新密码，两次密码必须一致"
                @keyup.enter="submitForm"
              >
                <template #suffix>
                  <span
                    @click="
                      confirmPasswordType =
                        confirmPasswordType === 'password' ? 'text' : 'password'
                    "
                    class="view-password"
                  >
                    <el-icon
                      v-if="confirmPasswordType === 'password'"
                      class="el-input__icon"
                      ><Hide
                    /></el-icon>
                    <el-icon
                      v-else-if="confirmPasswordType === 'text'"
                      class="el-input__icon"
                      ><View
                    /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <div class="register-btn">
              <el-button color="#2D67B2" class="submit-size" @click="submitForm"
                >确认</el-button
              >
              <el-button
                color="#2D67B2"
                plain
                class="cancel-size"
                @click="cancel"
                >取消</el-button
              >
            </div>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { register, sendCode } from "@/api/index";
import { Hide, View } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { encryptPassword } from "@/utils/password";
import store from "../store/store";

const router = useRouter();
const userInfo = ref({
  account: null,
  password: null,
  name: null,
  avatar: null,
  loginTime: null,
});
const registerRef = ref();
const registerForm = reactive({
  username: "",
  name: "",
  phone: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
});
const passwordType = ref("password");
const confirmPasswordType = ref("password");
const isCounting = ref(false);
const countdown = ref(60);
const isEmailValid = ref(false);
const validateEmail = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入正确的邮箱地址！"));
  } else {
    callback();
  }
};

const validatePass = (rule, value, callback) => {
  const reg = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[^\s^\u4e00-\u9fff]{6,16}$/);
  if (!reg.test(value)) {
    callback(new Error("请输入6-16位字母数字混合密码！"));
  } else {
    callback();
  }
};

const validateConfirmPass = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致！"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 6, max: 11, message: "用户名长度应在6-11位之间", trigger: "blur" },
  ],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validateConfirmPass, trigger: "blur" },
  ],
};

// 监听邮箱输入框的变化
watch(
  () => registerForm.email,
  (newValue) => {
    if (newValue) {
      // 验证邮箱格式
      validateEmail(null, newValue, (error) => {
        if (error) {
          isEmailValid.value = false;
        } else {
          isEmailValid.value = true;
        }
      });
      isCounting.value = false;
      countdown.value = 60;
    } else {
      isEmailValid.value = false;
    }
  }
);

// 发送验证码
const sendVerificationCode = async () => {
  if (isEmailValid.value && !isCounting.value) {
    try {
      await sendCode({
        email: registerForm.email,
        username: registerForm.username,
      });
      ElMessage.success("验证码已发送，请注意查收！");
      startCountdown();
    } catch (error) {
      console.error("验证码发送失败，请稍后再试！");
    }
  }
};

// 开始倒计时
const startCountdown = () => {
  isCounting.value = true;
  let timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      countdown.value = 60;
      isCounting.value = false;
    }
  }, 1000);
};

// 注册用户
const submitForm = () => {
  registerRef.value.validate(async (valid) => {
    if (valid) {
      if (registerForm.code === "") {
        ElMessage.error("验证码不能为空！");
        return;
      }
      const jsonData = ref({
        username: registerForm.username,
        name: registerForm.name,
        phone: registerForm.phone,
        email: registerForm.email,
        code: registerForm.code,
        password: registerForm.password,
        confirm_password: registerForm.confirmPassword,
      });
      try {
        const res = await register(jsonData.value);
        if (res.code === 200 && res.data) {
          ElMessage.success("注册成功！");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          console.error(res.msg);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
};

const cancel = () => {
  window.history.back();
};

const focusNext = (id) => {
  const nextInput = document.getElementById(id);
  if (nextInput) {
    nextInput.focus();
  }
};

onMounted(() => {
  if (localStorage.getItem("TOKEN") != null) router.push("/top");
  const savedUserInfo = localStorage.getItem("userInfo");
  if (savedUserInfo) {
    Object.assign(userInfo.value, JSON.parse(savedUserInfo));
  }
});

watch(
  () => registerForm.email,
  (newValue) => {
    if (newValue) {
      isCounting.value = false;
      countdown.value = 60;
    }
  }
);
</script>

<style lang="less" scoped>
.el-container {
  background-color: #f0f1f6;
}

.el-header {
  min-height: 72px;
  width: 100vw;
  background: inherit;
  border: 0 none;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 1px 10px rgba(228, 228, 228, 1);
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 22px;
  .right-content {
    display: flex;
    align-items: center;
    .user-image {
      display: block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
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
}
.el-main {
  width: 100vw;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
}
.left-content {
  min-height: 72px;
  width: 100vw;
  display: flex;
  align-items: center;
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

.register-container {
  width: auto;
  height: auto;
  border: none;
  margin: 36px auto;
  .reg-form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    ::v-deep(.el-form-item__label) {
      font-family: "Arial", sans-serif;
      font-weight: 400;
      text-align: left;
      font-style: normal;
      letter-spacing: normal;
      color: #555555;
      font-size: 18px;
      line-height: 20px;
      height: 40px;
    }
    .view-password {
      cursor: pointer;
    }
  }
  .register-title {
    letter-spacing: 0;
    line-height: normal;
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    color: #333333;
    text-align: center;
    margin-bottom: 32px;
  }
  .el-input {
    width: 738px;
    height: 42px;
  }
  .register-btn {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    .cancel-size,
    .submit-size {
      width: 100px;
      height: 42px;
    }
  }
}
</style>
