<template>
  <div class="code-setting-box">
    <el-row class="setting-up-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <span class="common-text code-setting-title">账号设置</span>
        </el-card>
      </el-col>
    </el-row>
    <el-form :model="userInfo" label-width="auto" class="infoForm">
      <el-row class="setting-down-row" :gutter="52">
        <el-col :span="24" class="code-setting-content">
          <el-form-item label="" label-position="left">
            <span class="titlevalue">
              <span class="title1">个人信息</span>
              <el-button class="title2" @click="editUserInfoDialog = true"
                >修改</el-button
              >
            </span>
          </el-form-item>
          <el-divider class="form-divider" />
          <el-form-item label="" label-position="left">
            <span class="titlevalue">
              <span class="title1">账号密码</span>
              <el-button class="title2" @click="editUserPassDialog = true"
                >修改</el-button
              >
            </span>
          </el-form-item>
          <el-divider class="form-divider" />
          <el-form-item label="" label-position="left">
            <span class="titlevalue">
              <span class="title1">账号绑定邮箱 <{{ email }}></span>
              <el-button class="title2" @click="editEmailDialog = true"
                >解绑</el-button
              >
            </span>
          </el-form-item>
          <el-divider class="form-divider" />
        </el-col>
      </el-row>
    </el-form>
    <!-- 修改弹窗 -->
    <div class="user-dialog">
      <el-dialog
        v-model="editEmailDialog"
        :show-close="false"
        :before-close="cancelEmail"
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
.code-setting-box {
  overflow: hidden;
  .setting-up-row {
    background-color: #fff;
    margin-bottom: 10px;
    .code-setting-title {
      font-size: 18px;
      margin-left: 20px;
    }
  }
  .infoForm {
    background-color: #fff;
    min-height: 80vh;
  }
  .user-dialog,
  .account-dialog,
  .email-dialog {
    ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
      width: 777px;
      height: 475px;
    }
    ::v-deep(.el-dialog__body .el-divider--horizontal) {
      margin: 0;
      border-top: 1px solid #f2f2f2;
    }
    ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
      padding-left: 0;
      padding-right: 0;
    }
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 18px;
      padding: 0 20px;
      .title {
        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }
    .close-color {
      color: #999999;
    }
    .close-icon:hover {
      .close-color {
        color: #2d67b2;
      }
    }
  }
  .account-dialog {
    ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
      width: 777px;
      height: 642px;
    }
  }
  .editUserInfoForm {
    padding: 20px 20px 0 20px;
    .head-portrait {
      position: relative;
      display: grid;
      gap: 20px;
      ::v-deep(.el-form-item__label) {
        font-family: Arial, sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        letter-spacing: normal;
        color: #555555;
        justify-content: unset;
      }

      ::v-deep(.el-input) {
        width: 90%;
      }
      .random-img {
        width: 26px;
        height: 26px;
        background-color: #2e68b2;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 72px;
        left: 72px;
      }
      .random-img:hover {
        cursor: pointer;
      }
    }
  }
  .editUserPassForm {
    padding: 20px 20px 0 20px;
    .account-input {
      width: 100% !important;
    }
    .head-portrait {
      position: relative;
      display: grid;
      row-gap: 10px;
      margin-bottom: 30px;
      ::v-deep(.el-form-item__label) {
        font-family: Arial, sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        letter-spacing: normal;
        color: #555555;
        justify-content: unset;
      }
      .view-password {
        cursor: pointer;
      }
    }
  }
  .setting-down-row {
    overflow: hidden;
    .code-setting-content {
      max-width: calc(100% - 60px);
      height: auto;
      border: none;
      margin-left: 40px;
      margin-top: 40px;

      .titlevalue {
        display: flex;
        gap: 25px;
        padding-bottom: 10px;
      }

      .title1 {
        font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: #333333;
      }

      .title2 {
        font-family: Arial, sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        letter-spacing: normal;
        color: #2d67b2;
        border: none;
      }

      .title2:hover {
        background-color: white;
      }
      .setting-form-item {
        width: 100%;
        display: flex;
        ::v-deep(.el-form-item__label) {
          font-family: "Arial", sans-serif;
          font-weight: 400;
          text-align: left;
          font-style: normal;
          letter-spacing: normal;
          color: #7f7f7f;
          font-size: 16px;
        }
        span {
          font-family: "Arial", sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
      }
      .setting-btn {
        display: flex;
        justify-content: center;
        padding-top: 126px;
        padding-bottom: 20px;
        .cancel-size,
        .submit-size {
          width: 100px;
          height: 42px;
        }
      }
    }
    .head-content {
      margin-top: 32px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.form-divider {
  margin: 30px auto;
  border-top: 1px solid #f2f2f2;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  .close-color {
    color: #999999;
  }
  .close-icon:hover {
    .close-color {
      color: #2d67b2;
    }
  }
  .title {
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-style: normal;
    text-align: left;
    line-height: normal;
  }
}
.com-content {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
