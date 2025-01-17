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
        <div class="forget-password-container">
          <el-form
            :model="forgetPasswordForm"
            ref="forgetPasswordRef"
            :rules="rules"
            label-width="auto"
            require-asterisk-position="right"
          >
            <h3 class="forget-password-title">找回密码</h3>
            <el-form-item
              prop="username"
              label="用户名"
              label-position="left"
              class="fp-form-item"
            >
              <el-input
                v-model="forgetPasswordForm.username"
                autocomplete="off"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱"
              label-position="left"
              class="fp-form-item"
            >
              <el-input
                v-model="forgetPasswordForm.email"
                autocomplete="off"
                placeholder="请输入邮箱"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              prop="verificationCode"
              label="验证码"
              label-position="left"
              class="fp-form-item"
            >
              <el-input
                v-model="forgetPasswordForm.code"
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
              label="设置新密码"
              label-position="left"
              class="fp-form-item"
            >
              <el-input
                :type="newPasswordType"
                v-model="forgetPasswordForm.password"
                autocomplete="off"
                placeholder="请输入6-16位字母数字混合密码"
                @keyup.enter="focusNext('repassword')"
              >
                <template #suffix>
                  <span
                    @click="
                      newPasswordType =
                        newPasswordType === 'password' ? 'text' : 'password'
                    "
                    class="view-password"
                  >
                    <el-icon
                      v-if="newPasswordType === 'password'"
                      class="el-input__icon"
                      ><Hide
                    /></el-icon>
                    <el-icon
                      v-else-if="newPasswordType === 'text'"
                      class="el-input__icon"
                      ><View
                    /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="repassword"
              label="确认新密码"
              label-position="left"
              class="fp-form-item"
            >
              <el-input
                v-model="forgetPasswordForm.repassword"
                id="repassword"
                :type="confirmNewPasswordType"
                autocomplete="off"
                placeholder="请确认新密码，两次密码必须一致"
                @keyup.enter="submitForm"
              >
                <template #suffix>
                  <span
                    @click="
                      confirmNewPasswordType =
                        confirmNewPasswordType === 'password'
                          ? 'text'
                          : 'password'
                    "
                    class="view-password"
                  >
                    <el-icon
                      v-if="confirmNewPasswordType === 'password'"
                      class="el-input__icon"
                      ><Hide
                    /></el-icon>
                    <el-icon
                      v-else-if="confirmNewPasswordType === 'text'"
                      class="el-input__icon"
                      ><View
                    /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <div class="forget-password-btn">
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
import { findPwd, emailFindPwd } from "@/api/index";
import { Hide, View } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { encryptPassword } from "@/utils/password";

const router = useRouter();
const forgetPasswordRef = ref();
const forgetPasswordForm = reactive({
  username: "",
  email: "",
  code: "",
  password: "",
  repassword: "",
});
const newPasswordType = ref("password");
const confirmNewPasswordType = ref("password");
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
  if (value !== forgetPasswordForm.password) {
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
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  repassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validateConfirmPass, trigger: "blur" },
  ],
};

// 监听邮箱输入框的变化
watch(
  () => forgetPasswordForm.email,
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
      await emailFindPwd({
        email: forgetPasswordForm.email,
        username: forgetPasswordForm.username,
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

// 提交表单
const submitForm = () => {
  forgetPasswordRef.value.validate(async (valid) => {
    if (valid) {
      if (forgetPasswordForm.code === "") {
        ElMessage.error("验证码不能为空！");
        return;
      }
      const jsonData = ref({
        username: forgetPasswordForm.username,
        email: forgetPasswordForm.email,
        code: forgetPasswordForm.code,
        password: forgetPasswordForm.password,
      });
      try {
        const res = await findPwd(jsonData.value);
        if (res.code === 200 && res.data) {
          ElMessage.success("密码重置成功！");
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
});
</script>

<style lang="less" scoped>
.el-container {
  background-color: #f5f7fa;
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
  padding-top: 92px; // 为fixed header留出空间
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}

.forget-password-container {
  max-width: 480px;
  width: 90%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 20px auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
  .forget-password-title {
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

  .fp-form-item {
    margin-bottom: 28px;

    ::v-deep(.el-form-item__label) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .el-input {
      --el-input-height: 48px;

      ::v-deep(.el-input__wrapper) {
        background-color: #f9fafb;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;

        &:hover,
        &.is-focus {
          border-color: #2d67b2;
          box-shadow: 0 0 0 3px rgba(45, 103, 178, 0.1);
        }
      }

      ::v-deep(.el-input__inner) {
        font-size: 16px;
        color: #1a1a1a;

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .view-password {
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      transition: color 0.3s ease;

      &:hover {
        color: #2d67b2;
      }
    }
  }

  .forget-password-btn {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 40px;

    .submit-size,
    .cancel-size {
      min-width: 120px;
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
.fp-form-item {
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
// 验证码按钮样式
::v-deep(.el-button) {
  &.is-disabled {
    background-color: #e5e7eb;
    border-color: #e5e7eb;
    color: #9ca3af;
  }
}

// 添加响应式设计
@media (max-width: 768px) {
  .forget-password-container {
    padding: 24px;

    .el-input {
      width: 100%;
    }

    .forget-password-btn {
      flex-direction: column;

      .submit-size,
      .cancel-size {
        width: 100%;
      }
    }
  }
}

// 添加输入框聚焦动画
@keyframes inputFocus {
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

.el-input:focus-within {
  animation: inputFocus 0.3s ease;
}
</style>
