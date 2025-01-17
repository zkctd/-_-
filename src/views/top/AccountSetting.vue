<template>
  <div class="code-setting-box">
    <div class="settings-container">
      <!-- 顶部标题区域 -->
      <div class="settings-header glass-effect">
        <h1>账号设置</h1>
        <p class="subtitle">管理你的个人信息和账号安全</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="settings-content">
        <!-- 个人信息卡片 -->
        <div class="settings-card glass-effect">
          <div class="card-header">
            <div class="header-icon">
              <el-avatar
                :size="64"
                :src="userInfo.avatar || '/images/default-avatar.png'"
              />
            </div>
            <div class="header-info">
              <h2>{{ userInfo.name }}</h2>
              <p>{{ userInfo.username }}</p>
            </div>
          </div>

          <!-- 设置项列表 -->
          <div class="settings-list">
            <!-- 个人信息设置 -->
            <div class="setting-item" @click="editUserInfoDialog = true">
              <div class="item-left">
                <el-icon><User /></el-icon>
                <div class="item-info">
                  <h3>个人信息</h3>
                  <p>更新你的个人资料</p>
                </div>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>

            <!-- 密码设置 -->
            <div class="setting-item" @click="editUserPassDialog = true">
              <div class="item-left">
                <el-icon><Lock /></el-icon>
                <div class="item-info">
                  <h3>账号密码</h3>
                  <p>修改你的登录密码</p>
                </div>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>

            <!-- 邮箱设置 -->
            <div class="setting-item" @click="editEmailDialog = true">
              <div class="item-left">
                <el-icon><Message /></el-icon>
                <div class="item-info">
                  <h3>邮箱绑定</h3>
                  <p>{{ email || "未绑定邮箱" }}</p>
                </div>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 安全提示卡片 -->
        <div class="security-card glass-effect">
          <p>建议定期更新密码，确保账号安全</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 修改弹窗 -->
  <Transition name="dialog-fade">
    <div
      v-if="editUserInfoDialog || editUserPassDialog || editEmailDialog"
      class="ios-dialog-overlay"
      @click="handleOverlayClick"
    >
      <!-- 个人信息编辑弹窗 -->
      <div v-if="editUserInfoDialog" class="ios-dialog" @click.stop>
        <div class="ios-dialog-header">
          <button class="ios-btn" @click="cancel">取消</button>
          <h2>修改个人信息</h2>
          <button class="ios-btn primary" @click="submitUserInfoForm">
            完成
          </button>
        </div>
        <div class="ios-dialog-body">
          <el-form
            ref="userInfoEditRef"
            :model="userInfoEditForm"
            :rules="userInfoRules"
          >
            <div class="ios-form-group">
              <el-form-item prop="name">
                <el-input
                  v-model="userInfoEditForm.name"
                  placeholder="姓名"
                  class="ios-input"
                />
              </el-form-item>
              <el-form-item prop="username">
                <el-input
                  v-model="userInfoEditForm.username"
                  placeholder="用户名"
                  class="ios-input"
                />
              </el-form-item>
              <el-form-item prop="phone">
                <el-input
                  v-model="userInfoEditForm.phone"
                  placeholder="手机号"
                  class="ios-input"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 密码修改弹窗 -->
      <div v-if="editUserPassDialog" class="ios-dialog" @click.stop>
        <div class="ios-dialog-header">
          <button class="ios-btn" @click="cancel">取消</button>
          <h2>修改密码</h2>
          <button class="ios-btn primary" @click="submitUserPassForm">
            完成
          </button>
        </div>
        <div class="ios-dialog-body">
          <el-form
            ref="userPassEditRef"
            :model="userPassEditForm"
            :rules="userPassRules"
          >
            <div class="ios-form-group">
              <el-form-item prop="password">
                <el-input
                  v-model="userPassEditForm.password"
                  :type="oldPasswordType"
                  placeholder="当前密码"
                  class="ios-input"
                >
                  <template #suffix>
                    <el-icon
                      @click="
                        oldPasswordType =
                          oldPasswordType === 'password' ? 'text' : 'password'
                      "
                      class="password-toggle"
                    >
                      <Hide v-if="oldPasswordType === 'password'" />
                      <View v-else />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="new_password">
                <el-input
                  v-model="userPassEditForm.new_password"
                  :type="newPasswordType"
                  placeholder="新密码"
                  class="ios-input"
                >
                  <template #suffix>
                    <el-icon
                      @click="
                        newPasswordType =
                          newPasswordType === 'password' ? 'text' : 'password'
                      "
                      class="password-toggle"
                    >
                      <Hide v-if="newPasswordType === 'password'" />
                      <View v-else />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="confirm_password">
                <el-input
                  v-model="userPassEditForm.confirm_password"
                  :type="newPasswordConfirmType"
                  placeholder="确认新密码"
                  class="ios-input"
                >
                  <template #suffix>
                    <el-icon
                      @click="
                        newPasswordConfirmType =
                          newPasswordConfirmType === 'password'
                            ? 'text'
                            : 'password'
                      "
                      class="password-toggle"
                    >
                      <Hide v-if="newPasswordConfirmType === 'password'" />
                      <View v-else />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 邮箱修改弹窗 -->
      <div v-if="editEmailDialog" class="ios-dialog" @click.stop>
        <div class="ios-dialog-header">
          <button class="ios-btn" @click="cancelEmail">取消</button>
          <h2>更改邮箱</h2>
          <button class="ios-btn primary" @click="submitEmailForm">完成</button>
        </div>
        <div class="ios-dialog-body">
          <el-form
            ref="emailEditRef"
            :model="emailEditForm"
            :rules="emailEditRules"
          >
            <div class="ios-form-group">
              <el-form-item prop="oldEmail">
                <el-input
                  v-model="email"
                  placeholder="当前邮箱地址"
                  class="ios-input"
                  disabled
                />
              </el-form-item>
              <el-form-item prop="newEmail">
                <el-input
                  v-model="emailEditForm.newEmail"
                  placeholder="新邮箱地址"
                  class="ios-input"
                />
              </el-form-item>
              <el-form-item prop="code" class="verification-code">
                <el-input
                  v-model="emailEditForm.code"
                  placeholder="旧邮箱验证码"
                  class="ios-input"
                >
                  <template #suffix>
                    <button
                      class="ios-btn verification-btn"
                      @click.prevent="sendVerificationCode"
                      :disabled="countdown > 0"
                      type="button"
                    >
                      {{ countdown > 0 ? `${countdown}s` : "获取验证码" }}
                    </button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  userInfos,
  changeEmail,
  changeEmailCode,
  passUser,
  editorUser,
} from "@/api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { Hide, View } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { User, Lock, Message, ArrowRight } from "@element-plus/icons-vue";
const router = useRouter();
const oldPasswordType = ref("password");
const newPasswordType = ref("password");
const newPasswordConfirmType = ref("password");
const email = ref("");
const editUserInfoDialog = ref(false);
const editUserPassDialog = ref(false);
const userInfoEditRef = ref(null);
const userPassEditRef = ref(null);
const editEmailDialog = ref(false);
const emailEditRef = ref(null);
const emailEditForm = reactive({
  id: JSON.parse(localStorage.getItem("userInfo")).id,
  newEmail: "",
  code: "",
});
const countdown = ref(0);
const emailEditRules = {
  newEmail: [
    { required: true, message: "请输入新邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const userInfo = reactive({
  username: "",
  name: "",
  phone: "",
});
const userInfoEditForm = ref({
  name: "",
  username: "",
  phone: "",
  id: JSON.parse(localStorage.getItem("userInfo")).id,
});
const userPassEditForm = ref({
  password: "",
  new_password: "",
  confirm_password: "",
  id: JSON.parse(localStorage.getItem("userInfo")).id,
});
const updateDialogVisible = ref(false);

const userInfoRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
};

const validateNewPassword = (rule, value, callback) => {
  if (value !== userPassEditForm.value.new_password) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};

const userPassRules = {
  password: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  new_password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^\s^\u4e00-\u9fff]{6,16}$/,
      message: "请输入6-16位字母数字特殊字符混合密码",
      trigger: "blur",
    },
  ],
  confirm_password: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^\s^\u4e00-\u9fff]{6,16}$/,
      message: "请输入6-16位字母数字特殊字符混合密码",
      trigger: "blur",
    },
    { validator: validateNewPassword, trigger: "blur" },
  ],
};

const cancel = () => {
  editUserInfoDialog.value = false;
  editUserPassDialog.value = false;
  if (userInfoEditRef.value) {
    userInfoEditRef.value.clearValidate();
  }
  if (userPassEditRef.value) {
    userPassEditRef.value.clearValidate();
  }
  resetForm();
};

const resetForm = () => {
  userInfoEditForm.value.username = userInfo.username;
  userInfoEditForm.value.name = userInfo.name;
  userInfoEditForm.value.phone = userInfo.phone;
  email.value = userInfo.email;
  userPassEditForm.value.password = "";
  userPassEditForm.value.new_password = "";
  userPassEditForm.value.confirm_password = "";
};

const submitUserInfoForm = async () => {
  userInfoEditRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await editorUser(userInfoEditForm.value);
        if (response.code === 200) {
          editUserInfoDialog.value = false;
          userInfo.username = userInfoEditForm.value.username;
          userInfo.name = userInfoEditForm.value.name;
          userInfo.phone = userInfoEditForm.value.phone;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          window.location.reload();
          ElMessage.success("修改个人信息成功");
        }
      } catch (error) {
        console.error("修改个人信息失败:", error);
      }
    }
  });
};

const submitUserPassForm = async () => {
  userPassEditRef.value.validate(async (valid) => {
    if (valid) {
      if (
        userPassEditForm.value.password === userPassEditForm.value.new_password
      ) {
        ElMessage.error("新密码和原密码一致");
        return null;
      }
      try {
        const response = await passUser(userPassEditForm.value);
        if (response.code === 200) {
          editUserPassDialog.value = false;
          userInfo.password = null;
          localStorage.setItem("TOKEN", "");
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          updateDialogVisible.value = true;
          ElMessageBox.alert("密码已修改成功，请重新登录", "提示", {
            confirmButtonText: "确定",
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            callback: () => {
              router.push("/login");
            },
          });
        }
      } catch (error) {
        console.error("修改密码失败:", error);
      }
    }
  });
};

const getUserInfo = async () => {
  const savedUserInfo = localStorage.getItem("userInfo");
  try {
    const response = await userInfos(JSON.parse(savedUserInfo).id);
    if (response.code === 200 && response.data) {
      Object.assign(userInfo, response.data);
    } else {
      console.error("查询用户详情失败");
    }
  } catch (error) {
    console.error("获取用户详情失败:", error);
  }
  resetForm();
};

const sendVerificationCode = async () => {
  try {
    const response = await changeEmailCode({ email: email.value });
    if (response.code === 200) {
      ElMessage.success("验证码已发送，请查收");
      startCountdown();
    }
  } catch (error) {
    console.error("发送验证码失败:", error);
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const cancelEmail = () => {
  editEmailDialog.value = false;
  if (emailEditRef.value) {
    emailEditRef.value.clearValidate();
  }
  resetEmailForm();
};

const resetEmailForm = () => {
  emailEditForm.newEmail = "";
  emailEditForm.code = "";
};

const submitEmailForm = async () => {
  emailEditRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await changeEmail({
          id: emailEditForm.id,
          new_email: emailEditForm.newEmail,
          code: emailEditForm.code,
        });
        if (response.code === 200) {
          editEmailDialog.value = false;
          ElMessage.success("解绑邮箱成功");
          getUserInfo();
        }
      } catch (error) {
        console.error("解绑邮箱失败:", error);
      }
    }
  });
};
const handleOverlayClick = () => {
  cancel();
  cancelEmail();
};
onMounted(() => {
  getUserInfo();
});

const commitDelete = async () => {
  updateDialogVisible.value = false;
  router.push("/login");
};
</script>

<style lang="less" scoped>
.settings-container {
  min-height: calc(100vh - 140px);
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);

  .glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  }

  .settings-header {
    padding: 2rem;
    margin-bottom: 2rem;

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #1a1a1a;
      font-weight: 600;
    }

    .subtitle {
      margin-top: 0.5rem;
      color: #666;
      font-size: 1rem;
    }
  }

  .settings-content {
    display: grid;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    .settings-card {
      padding: 2rem;

      .card-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .header-info {
          h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #1a1a1a;
          }

          p {
            margin: 0.5rem 0 0;
            color: #666;
          }
        }
      }

      .settings-list {
        display: grid;
        gap: 1rem;

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;

          &:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: translateY(-2px);
          }

          .item-left {
            display: flex;
            align-items: center;
            gap: 1rem;

            .el-icon {
              font-size: 1.5rem;
              color: #409eff;
            }

            .item-info {
              h3 {
                margin: 0;
                font-size: 1rem;
                color: #1a1a1a;
              }

              p {
                margin: 0.25rem 0 0;
                font-size: 0.875rem;
                color: #666;
              }
            }
          }

          .arrow {
            color: #999;
            font-size: 1.25rem;
            transition: transform 0.3s ease;
          }

          &:hover .arrow {
            transform: translateX(4px);
            color: #409eff;
          }
        }
      }
    }

    .security-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #e6f7ff 0%, #e6fffa 100%);

      .el-icon {
        font-size: 1.5rem;
        color: #52c41a;
      }

      p {
        margin: 0;
        color: #666;
      }
    }
  }
}

// 对话框样式更新
::v-deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;

  .el-dialog__header {
    // background: #f8f9fa;
    padding: 1.5rem;
    margin: 0;

    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        margin: 0;
        font-size: 1.5rem;
        color: #1a1a1a;
      }

      .close-icon {
        cursor: pointer;

        .iconfont {
          font-size: 1.25rem;
          color: #666;
        }
      }
      .close-icon:hover .iconfont {
        color: #409eff;
      }
    }
  }

  // .el-dialog__body {
  //   padding: 2rem;
  // }

  .el-form-item {
    margin-bottom: 1.5rem;
  }

  .el-input {
    .el-input__wrapper {
      border-radius: 8px;
    }
  }

  .dialog-footer {
    padding: 1.5rem;
    // background: #f8f9fa;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}
.ios-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ios-dialog {
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 13px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.ios-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 17px;
    font-weight: 600;
    margin: 0;
    color: #000;
  }
}

.ios-dialog-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.ios-btn {
  border: none;
  background: none;
  font-size: 17px;
  padding: 8px 12px;
  color: #007aff;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 122, 255, 0.1);
  }

  &.primary {
    font-weight: 600;
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
}

.ios-form-group {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //添加元素间的距离
  padding: 0 16px;

  .el-form-item {
    margin: 0;

    &:not(:last-child) {
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.ios-input {
  :deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: none;
    padding: 12px 16px;
  }

  :deep(.el-input__inner) {
    font-size: 17px;
    color: #000;

    &::placeholder {
      color: #8e8e93;
    }
  }
}

.verification-code {
  .verification-btn {
    font-size: 14px;
    padding: 4px 8px;
    min-width: 90px;
  }
}

.password-toggle {
  color: #8e8e93;
  cursor: pointer;
  padding: 4px;
}

/* 动画效果 */
.dialog-fade-enter-active {
  animation: slideUp 0.3s ease-out;
}

.dialog-fade-leave-active {
  animation: slideDown 0.2s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
