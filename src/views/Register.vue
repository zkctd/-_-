<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="left-content">
          <!-- logo显示区域 -->
          <img src="/images/common/logo.png" alt="" />
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  min-height: 100vh;
}

.el-header {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 0 40px;

  .left-content {
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    gap: 1rem;

    img {
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
      font-size: 20px;
      font-weight: 500;
      color: #1a1a1a;
      margin-left: 16px;
    }
  }
}

.el-main {
  padding-top: 92px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.register-container {
  max-width: 560px;
  width: 90%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin: 20px auto;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
  }

  .register-title {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    margin-bottom: 40px;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: #2d67b2;
      border-radius: 2px;
    }
  }

  .reg-form-item {
    margin-bottom: 24px;

    ::v-deep(.el-form-item__label) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
      height: 24px;
      line-height: 24px;
    }

    .el-input {
      width: 100%;
      --el-input-height: 48px;

      ::v-deep(.el-input__wrapper) {
        background-color: #f9fafb;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        padding: 0 16px;
        transition: all 0.3s ease;

        &:hover {
          border-color: #2d67b2;
          background-color: #fff;
        }

        &.is-focus {
          border-color: #2d67b2;
          box-shadow: 0 0 0 3px rgba(45, 103, 178, 0.1);
          background-color: #fff;
        }
      }

      ::v-deep(.el-input__inner) {
        font-size: 16px;
        color: #1a1a1a;
        height: 46px;

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .view-password {
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: #2d67b2;
      }
    }

    // 验证码按钮样式
    ::v-deep(.el-button) {
      height: 32px;
      padding: 0 16px;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;

      &:not(.is-disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(45, 103, 178, 0.2);
      }

      &.is-disabled {
        background-color: #e5e7eb;
        border-color: #e5e7eb;
        color: #9ca3af;
      }
    }
  }

  .register-btn {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 40px;

    .submit-size,
    .cancel-size {
      min-width: 140px;
      height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .submit-size {
      background: #2d67b2;

      &:hover {
        background: #1e4b8f;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(45, 103, 178, 0.2);
      }
    }

    .cancel-size {
      border: 2px solid #2d67b2;

      &:hover {
        background: rgba(45, 103, 178, 0.1);
        color: #2d67b2;
        transform: translateY(-2px);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .el-header {
    padding: 0 20px;
  }

  .register-container {
    padding: 30px 20px;
    margin: 10px;

    .register-title {
      font-size: 24px;
      margin-bottom: 30px;
    }

    .reg-form-item {
      margin-bottom: 20px;
    }

    .register-btn {
      flex-direction: column;

      .submit-size,
      .cancel-size {
        width: 100%;
        margin: 0;
      }
    }
  }
}

// 添加表单动画效果
.reg-form-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
  .generate-delays(7);
}

.generate-delays(@n, @i: 1) when (@i =< @n) {
  &:nth-child(@{i}) {
    animation-delay: (@i * 0.1s);
  }
  .generate-delays(@n, (@i + 1));
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 添加输入框聚焦特效
.el-input:focus-within {
  ::v-deep(.el-input__wrapper) {
    animation: inputPulse 0.3s ease;
  }
}

@keyframes inputPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
