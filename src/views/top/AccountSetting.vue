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
      <!-- 修改弹窗 -->
      <div class="user-dialog">
        <el-dialog
          v-model="editEmailDialog"
          :show-close="false"
          :before-close="cancelEmail"
          align-center
        >
          <template #header>
            <div class="title-box">
              <div class="title">
                <p class="common-text">解绑邮箱</p>
              </div>
              <div class="close-icon">
                <el-icon @click="cancelEmail()"
                  ><span class="iconfont close close-color"></span
                ></el-icon>
              </div>
            </div>
          </template>
          <el-divider />
          <el-form
            ref="emailEditRef"
            :model="emailEditForm"
            :rules="emailEditRules"
            class="editUserInfoForm"
          >
            <el-form-item label="新邮箱" prop="newEmail" class="head-portrait">
              <el-input
                v-model="emailEditForm.newEmail"
                placeholder="请输入新邮箱"
                size="large"
                class="account-input"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="head-portrait">
              <el-input
                v-model="emailEditForm.code"
                placeholder="请输入旧邮箱获取的验证码"
                size="large"
                class="account-input"
              >
                <template #suffix>
                  <el-button
                    type="primary"
                    @click="sendVerificationCode"
                    :disabled="countdown > 0"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重发` : "获取验证码" }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                @click="cancelEmail()"
                color="#2D67B2"
                class="common-text common-button-white button-h-w"
                plain
                >取消</el-button
              >
              <el-button
                color="#2D67B2"
                @click="submitEmailForm"
                class="common-text common-button-blue button-h-w"
                >确定</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <div class="user-dialog">
        <el-dialog
          v-model="editUserInfoDialog"
          :show-close="false"
          :before-close="cancel"
          align-center
        >
          <template #header>
            <div class="title-box">
              <div class="title">
                <p class="common-text">修改个人信息</p>
              </div>
              <div class="close-icon">
                <el-icon @click="cancel()"
                  ><span class="iconfont close close-color"></span
                ></el-icon>
              </div>
            </div>
          </template>
          <el-divider />
          <el-form
            ref="userInfoEditRef"
            :model="userInfoEditForm"
            :rules="userInfoRules"
            class="editUserInfoForm"
          >
            <el-form-item label="姓名" prop="name" class="head-portrait">
              <el-input
                v-model="userInfoEditForm.name"
                placeholder="请输入姓名"
                width="80%"
                size="large"
              />
            </el-form-item>
            <el-form-item label="用户名" prop="username" class="head-portrait">
              <el-input
                v-model="userInfoEditForm.username"
                placeholder="请输入用户名"
                width="80%"
                size="large"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="phone" class="head-portrait">
              <el-input
                v-model="userInfoEditForm.phone"
                placeholder="请输入手机号"
                width="80%"
                size="large"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                @click="cancel()"
                color="#2D67B2"
                class="common-text common-button-white button-h-w"
                plain
                >取消</el-button
              >
              <el-button
                color="#2D67B2"
                @click="submitUserInfoForm"
                class="common-text common-button-blue button-h-w"
                >确定</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <div class="account-dialog">
        <el-dialog
          v-model="editUserPassDialog"
          min-width="777px"
          :show-close="false"
          :before-close="cancel"
          align-center
        >
          <template #header>
            <div class="title-box">
              <div class="title">
                <p class="common-text">修改账号信息</p>
              </div>
              <div class="close-icon">
                <el-icon @click="cancel()"
                  ><span class="iconfont close close-color"></span
                ></el-icon>
              </div>
            </div>
          </template>
          <el-divider />
          <el-form
            ref="userPassEditRef"
            :model="userPassEditForm"
            :rules="userPassRules"
            class="editUserPassForm"
          >
            <el-form-item label="旧密码" prop="password" class="head-portrait">
              <el-input
                v-model="userPassEditForm.password"
                :type="oldPasswordType"
                placeholder="请输入"
                size="large"
                class="account-input"
              >
                <template #suffix>
                  <span
                    @click="
                      oldPasswordType =
                        oldPasswordType === 'password' ? 'text' : 'password'
                    "
                    class="view-password"
                  >
                    <el-icon
                      v-if="oldPasswordType === 'password'"
                      class="el-input__icon"
                      ><Hide
                    /></el-icon>
                    <el-icon
                      v-else-if="oldPasswordType === 'text'"
                      class="el-input__icon"
                      ><View
                    /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="new_password"
              class="head-portrait"
            >
              <el-input
                v-model="userPassEditForm.new_password"
                :type="newPasswordType"
                placeholder="请输入新密码（6-16位字母数字特殊字符混合密码）"
                class="account-input"
                size="large"
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
              label="确认密码"
              prop="confirm_password"
              class="head-portrait"
            >
              <el-input
                v-model="userPassEditForm.confirm_password"
                :type="newPasswordConfirmType"
                placeholder="请输入确认密码（两次密码必须一致）"
                class="account-input"
                size="large"
              >
                <template #suffix>
                  <span
                    @click="
                      newPasswordConfirmType =
                        newPasswordConfirmType === 'password'
                          ? 'text'
                          : 'password'
                    "
                    class="view-password"
                  >
                    <el-icon
                      v-if="newPasswordConfirmType === 'password'"
                      class="el-input__icon"
                      ><Hide
                    /></el-icon>
                    <el-icon
                      v-else-if="newPasswordConfirmType === 'text'"
                      class="el-input__icon"
                      ><View
                    /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                @click="cancel()"
                color="#2D67B2"
                class="common-text common-button-white button-h-w"
                plain
                >取消</el-button
              >
              <el-button
                color="#2D67B2"
                @click="submitUserPassForm"
                class="common-text common-button-blue button-h-w"
                >确定</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
    <!-- 成功确认弹框 -->
    <el-dialog
      v-model="updateDialogVisible"
      :show-close="false"
      width="291"
      align-center
    >
      <template #header>
        <div class="my-header">
          <div class="common-text title">修改成功</div>
          <div class="close-icon">
            <el-icon @click="commitDelete"
              ><span class="iconfont close close-color"></span
            ></el-icon>
          </div>
        </div>
      </template>
      <div class="com-content">
        <el-icon :size="16" color="#00CC33"> <SuccessFilled /></el-icon>
        <div class="common-text">修改密码成功，请重新登录！</div>
      </div>
      <template #footer>
        <div class="com-commit">
          <el-button
            @click="commitDelete"
            color="#2D67B2"
            class="common-text common-button-blue"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
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
  min-height: 100vh;
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
</style>
