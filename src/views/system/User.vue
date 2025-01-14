<template>
  <div class="user-box">
    <el-row class="user-up-row">
      <el-col :span="24">
        <div class="messages-title">
          <span
            class="common-text f-s-18"
            style="color: #333333; font-weight: 700"
            >用户管理</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row class="user-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 用户筛选表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="user-search-form"
          >
            <el-form-item prop="status" label="用户状态：">
              <el-select
                v-model="searchForm.status"
                style="width: 90px"
                :empty-values="[null, undefined]"
                :value-on-clear="null"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" label="用户类型：">
              <el-select
                v-model="searchForm.user_type"
                style="width: 150px"
                :empty-values="[null, undefined]"
                :value-on-clear="null"
                placeholder="请选择用户类型"
              >
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="depart" label="所在部门：">
              <el-select
                v-model="searchForm.depart"
                style="width: 150px"
                :empty-values="[null, undefined]"
                :value-on-clear="null"
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in dpartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="keywords">
              <el-input
                class="search"
                v-model="searchForm.keywords"
                placeholder="请输入用户名/姓名搜索"
              >
                <template #suffix>
                  <img
                    src="/images/common/search.png"
                    alt=""
                    @click="searchEvtHandler"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                color="#2D67B2"
                @click="searchEvtHandler"
                >查询</el-button
              >
              <el-button
                type="primary"
                color="#2D67B2"
                plain
                @click="resetSearchForm"
                class="common-button-bg common-button-color"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-divider style="margin: 0" />
          <div class="add-button">
            <el-button
              style="min-width: 103px"
              @click="handleAddMoreUser"
              color="#2D67B2"
              >批量新增</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleAddUser"
              color="#2D67B2"
              >新增用户</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleBatchResetPassword"
              color="#2D67B2"
              :disabled="selectedRows.length === 0"
              >批量重置密码</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleBatchDelete"
              color="#ff6666"
              :disabled="selectedRows.length === 0"
              >批量删除</el-button
            >
          </div>
          <!-- 用户一览表格 -->
          <el-table
            :data="tableData"
            border
            :default-sort="{ prop: 'user_type', order: 'descending' }"
            size="large"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="name"
              label="姓名"
              width="100px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              width="100px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="user_type"
              label="用户类型"
              width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                {{ row.user_type === 0 ? "用户" : "管理员" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="depart"
              label="部门"
              width="150px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="手机号"
              width="150"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-tag v-if="row.phone === ''" type="danger" size="small"
                  >未设置</el-tag
                >
                <el-tag v-else size="small">{{ row.phone }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="200"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-tag v-if="row.email === ''" type="danger" size="small"
                  >未设置</el-tag
                >
                <el-tag v-else type="warning" size="small">{{
                  row.email
                }}</el-tag>
              </template></el-table-column
            >
            <el-table-column
              prop="create_time"
              label="创建时间"
              width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="update_time"
              label="最后更新时间"
              width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="status" label="用户状态" width="90px">
              <template #default="{ row }">
                <img
                  :src="
                    row.status === true
                      ? '/images/common/normal.png'
                      : '/images/common/disable.png'
                  "
                  alt=""
                />
                {{ row.status === true ? "正常" : "禁用" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="320px">
              <template #default="{ row }">
                <el-button type="primary" @click="handleEdit(row)" link
                  >修改</el-button
                >
                <el-button
                  type="primary"
                  @click="handleDisable(row)"
                  v-if="row.status === true"
                  link
                  >禁用</el-button
                >
                <el-button
                  type="primary"
                  @click="handleDisable(row)"
                  v-if="row.status === false"
                  link
                  >启用</el-button
                >
                <el-button type="primary" @click="handleResetPassword(row)" link
                  >重置密码</el-button
                >
                <el-button type="danger" @click="handleDelete(row)" link
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            :page-size="searchForm.pageSize"
            :current-page="searchForm.pageNo"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </el-col>
    </el-row>
  </div>
  <!-- 新增/编辑用户弹窗 -->
  <div class="user-dialog">
    <el-dialog :show-close="false" v-model="editUserDialogVisible">
      <template #header>
        <div class="title-box">
          <el-text class="common-text f-s-16">{{ dialogTitle }}</el-text>
          <el-icon
            @click="cancelEditUser"
            class="common-text iconfont close"
          ></el-icon>
        </div>
      </template>
      <el-divider class="common-divider" />
      <el-form
        label-width="auto"
        class="user-form"
        ref="userInfoRef"
        :model="userInfoForm"
        :rules="rules"
      >
        <div>
          <el-form-item
            label="用户名"
            prop="username"
            label-position="left"
            class="user-form-item"
            :rules="[
              { required: true, trigger: 'blur', message: '请输入用户名' },
              {
                min: 6,
                max: 11,
                message: '用户名长度应在6-11位之间',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="userInfoForm.username"
              placeholder="请输入用户名"
              class="user-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="name"
            label-position="left"
            class="user-form-item"
            :rules="[
              { required: true, trigger: 'blur', message: '请输入姓名' },
            ]"
          >
            <el-input
              v-model="userInfoForm.name"
              placeholder="请输入姓名"
              autocomplete="off"
              class="user-dialog-input"
            />
          </el-form-item>
          <el-form-item
            v-if="showPassword"
            label="登录密码"
            prop="password"
            label-position="left"
            class="user-form-item"
            :rules="[
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^\s^\u4e00-\u9fff]{6,16}$/,
                message: '请输入6-16位字母数字特殊字符混合密码',
                trigger: 'blur',
              },
            ]"
          >
            <template #label>
              <span>登录密码</span>
              <span class="password-explain">（默认初始密码，密码可设置）</span>
            </template>
            <el-input
              v-model="userInfoForm.password"
              placeholder="请输入密码，6-16位字母数字混合密码"
              :type="passwordType"
              autocomplete="off"
              class="user-dialog-input"
            >
              <template #suffix>
                <span
                  @click="
                    passwordType =
                      passwordType === 'password' ? 'text' : 'password'
                  "
                  style="cursor: pointer"
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
            label="邮箱"
            prop="email"
            label-position="left"
            class="user-form-item"
            :rules="[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator: validateEmail, trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="userInfoForm.email"
              placeholder="请输入邮箱"
              autocomplete="off"
              class="user-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="phone"
            label-position="left"
            class="user-form-item"
            :rules="[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="userInfoForm.phone"
              placeholder="请输入手机号"
              autocomplete="off"
              class="user-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="所属部门"
            prop="depart"
            label-position="left"
            class="user-form-item"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择部门' },
            ]"
          >
            <el-select
              v-model="userInfoForm.depart"
              style="width: 30%"
              placeholder="请选择部门"
            >
              <el-option
                v-for="item in dpartOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="用户状态"
            prop="status"
            label-position="left"
            class="user-form-item"
          >
            <el-switch
              style="--el-switch-on-color: #2d67b2"
              v-model="userInfoForm.status"
              size="large"
              :active-value="0"
              :inactive-value="1"
            />
            <span class="switch-text">{{
              userInfoForm.status === 0 ? "启用" : "禁用"
            }}</span>
          </el-form-item>
          <el-form-item
            label="用户角色"
            prop="user_type"
            label-position="left"
            class="user-form-item"
          >
            <el-radio-group size="large" v-model="userInfoForm.user_type">
              <el-radio :label="0">用户</el-radio>
              <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="user-dialog-footer">
          <el-button
            @click="cancelEditUser"
            color="#2D67B2"
            class="common-text common-button-color common-button-bg"
            plain
            size="large"
            >取消</el-button
          >
          <el-button @click="submitUserInfo" color="#2D67B2" size="large">{{
            userInfoForm.id ? "确定" : "立即创建"
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="batch-add-dialog">
      <el-dialog :show-close="false" v-model="batchAddDialogVisible">
        <template #header>
          <div class="title-box">
            <el-text class="common-text f-s-16">批量新增用户</el-text>
            <el-icon
              @click="cancelBatchAdd"
              class="common-text iconfont close"
            ></el-icon>
          </div>
        </template>
        <div class="batch-add-content">
          <div class="step">
            <span class="title">第一步</span>
            <div class="first-step" @click="downloadfile">
              <span class="text1">点击下载空的&nbsp;</span>
              <span class="text2">用户导入模板</span>
            </div>
            <div class="second-step">
              <span class="title">第二步</span>
              <el-upload
                class="upload-demo"
                drag
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                multiple
                accept=".xls,.xlsx"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  <em>单击或拖动文件到此区域以上传</em>
                  <br />
                  <em>支持格式：xls、xlsx</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">请上传 Excel 文件</div>
                </template>
              </el-upload>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  userList,
  userInfos,
  deluser,
  resetPassword,
  addUser,
  editorAdmin,
  changeStatus,
  downloadFile,
  dpartList,
} from "@/api/index";
import ImportAPI from "@/api/upload";
import { ElMessage, ElMessageBox } from "element-plus";
import { Hide, View } from "@element-plus/icons-vue";
import { useStore } from "vuex";
const store = useStore();
const tableData = ref([]);
const searchRef = ref();
const dpartOptions = ref([]);
const searchForm = ref({
  keywords: "",
  pageNo: 1,
  pageSize: 10,
  status: "",
  user_type: null,
  depart: null,
});
const statusOptions = [
  { value: "", label: "全部" },
  { value: 1, label: "正常" },
  { value: 0, label: "禁用" },
];
const userTypeOptions = [
  { value: 0, label: "用户" },
  { value: 1, label: "管理员" },
];
const userInfoRef = ref();
const userInfoForm = ref({
  id: "",
  username: "",
  password: "",
  name: "",
  email: "",
  phone: "",
  status: 0,
  user_type: 0,
  depart: "",
});
const total = ref(0);
const editUserDialogVisible = ref(false);
const passwordType = ref("password");
const dialogTitle = ref("");
const showPassword = ref(false);
const selectedRows = ref([]);
const batchAddDialogVisible = ref(false);
const fetchUsers = async () => {
  const searchParams = new URLSearchParams();
  for (const key in searchForm.value) {
    const value = searchForm.value[key];
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  }
  try {
    const response = await userList(searchParams);
    if (response.code === 200) {
      tableData.value = response.data.data;
      total.value = response.data.total;
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
};
const validateEmail = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入正确的邮箱地址！"));
  } else {
    callback();
  }
};
const searchEvtHandler = () => {
  fetchUsers();
};

const getDpartList = async () => {
  try {
    const res = await dpartList();
    if (res.code === 200) {
      dpartOptions.value = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    }
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
};

const resetSearchForm = () => {
  searchForm.value.pageNo = 1;
  searchForm.value.user_type = null;
  searchRef.value.resetFields();
  fetchUsers();
};

const handleAddUser = async () => {
  dialogTitle.value = "新增用户";
  userInfoForm.value = {
    id: "",
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    status: 0,
    user_type: 0,
    depart: "",
  };
  editUserDialogVisible.value = true;
  showPassword.value = true;
};

const submitUserInfo = async () => {
  const userSaveInfo = ref({});
  for (const key in userInfoForm.value) {
    const value = userInfoForm.value[key];
    if (value !== null && value !== "") {
      userSaveInfo.value[key] = value;
    }
  }
  if (!userInfoForm.value.id) {
    userInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const response = await addUser(userSaveInfo.value);
          if (response.code === 200) {
            ElMessage.success("创建用户成功");
            editUserDialogVisible.value = false;
            await fetchUsers();
          }
        } catch (error) {
          console.error("添加用户失败:", error);
        }
      }
    });
  } else {
    userInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          userSaveInfo.value.status =
            userSaveInfo.value.status === 0 ? true : false;
          const response = await editorAdmin(userSaveInfo.value);
          if (response.code === 200) {
            ElMessage.success("修改用户成功");
            localStorage.setItem(
              "userInfo",
              JSON.stringify(userSaveInfo.value)
            );
            store.dispatch("updateUserInfo", userSaveInfo.value);
            editUserDialogVisible.value = false;
            await fetchUsers();
          }
        } catch (error) {
          console.error("修改用户失败:", error);
        }
      }
    });
  }
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

const handleBatchDelete = async () => {
  const ids = selectedRows.value.map((row) => row.id);
  if (ids.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  ElMessageBox.confirm("确定要删除选中的用户吗？", "删除用户", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await deluser({ ids: ids });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        await fetchUsers();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

const cancelEditUser = () => {
  editUserDialogVisible.value = false;
  userInfoRef.value.clearValidate();
};

const handleEdit = async (row) => {
  dialogTitle.value = "修改用户";
  showPassword.value = false;
  try {
    const response = await userInfos(row.id);
    if (response.code === 200 && response.data) {
      userInfoForm.value = {
        ...response.data,
        status: response.data.status ? 0 : 1,
      };
      editUserDialogVisible.value = true;
    } else {
      console.error("查询用户详情失败");
    }
  } catch (error) {
    console.error("获取用户详情失败:", error);
  }
};

const handleDisable = async (row) => {
  if (row.status === false) {
    ElMessageBox.confirm("确定要启用该用户吗？", "", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      try {
        const response = await changeStatus({ id: row.id });
        if (response.code === 200) {
          ElMessage.success("启用成功!");
          await fetchUsers();
        }
      } catch (error) {
        console.error("启用请求失败:", error);
      }
    });
  } else if (row.status === true) {
    ElMessageBox.confirm("确定要禁用该用户吗？", "", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      try {
        const response = await changeStatus({ id: row.id });
        if (response.code === 200) {
          ElMessage.success("禁用成功!");
          await fetchUsers();
        }
      } catch (error) {
        console.error("禁用请求失败:", error);
      }
    });
  }
};

const handleBatchResetPassword = async () => {
  const ids = selectedRows.value.map((row) => row.id);
  if (ids.length === 0) {
    ElMessage.warning("请选择要重置密码的用户");
    return;
  }

  ElMessageBox.confirm("确定要重置选中用户的密码吗？", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await resetPassword({ ids: ids });
      if (response.code === 200) {
        ElMessage.success("重置密码成功!");
        await fetchUsers();
      }
    } catch (error) {
      console.error("重置密码请求失败:", error);
    }
  });
};

const handleResetPassword = async (row) => {
  ElMessageBox.confirm("确定对该用户重置密码？", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await resetPassword({ ids: [row.id] });
      if (response.code === 200) {
        ElMessage.success("重置密码成功!");
      }
    } catch (error) {
      console.error("重置密码请求失败:", error);
    }
  });
};

const handleDelete = async (row) => {
  ElMessageBox.confirm("确定删除该用户？", "删除用户", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await deluser({ ids: [row.id] });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        await fetchUsers();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

// 当前页码切换
const handleCurrentChange = (newPage) => {
  searchForm.value.pageNo = newPage;
  fetchUsers();
};

// 分页数量切换
const handleSizeChange = (newSize) => {
  searchForm.value.pageSize = newSize;
  fetchUsers();
};

const handleAddMoreUser = () => {
  batchAddDialogVisible.value = true;
};

async function downloadfile() {
  try {
    const response = await downloadFile("1");
    const fileUrl = response.data.file_url;
    const fileName = response.data.file_name;

    const fileResponse = await fetch(fileUrl);
    const blob = await fileResponse.blob();

    const url = window.URL.createObjectURL(blob);

    // 创建下载链接
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // 清理 URL 对象
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    console.error("下载失败:", error);
  }
}

async function beforeUpload(file) {
  try {
    const response = await ImportAPI.importUsers(file);
    if (response.code === 200) {
      ElMessage.success("导入成功");
      batchAddDialogVisible.value = false;
      fetchUsers();
    } else {
      console.error("导入失败");
    }
  } catch (error) {
    console.error("导入失败:", error);
  }
}

// 上传成功的处理
async function handleUploadSuccess(file) {
  return true;
}

// 上传失败的处理
function handleUploadError(error, file) {
  console.error("上传失败:", error);
}

const cancelBatchAdd = () => {
  batchAddDialogVisible.value = false;
};

onMounted(() => {
  fetchUsers();
  getDpartList();
});
</script>

<style lang="less" scoped>
.user-box {
  overflow: hidden;
  .user-up-row {
    background-color: #fff;
    min-height: 58px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .user-title {
      margin-left: 40px;
      font-size: 18px;
    }
    .messages-title {
      margin-left: 40px;
    }
  }
  .user-down-row {
    background-color: #fff;
    .container {
      margin: 30px 40px 0 40px;
      height: calc(100vh - 170px);
      min-height: 670px;
      display: flex;
      flex-direction: column;
      .user-search-form {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
        .search {
          width: 260px;
          img:hover {
            cursor: pointer;
          }
        }
      }
      .add-button {
        margin: 20px 0;
      }
      .el-pagination {
        flex: 0 0 auto;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        height: 50px;
        padding-bottom: 15px;
      }
      .el-table {
        flex: 1 1 auto;
        ::v-deep(thead th) {
          font-weight: 400;
          color: #333333;
        }
        ::v-deep(tr) {
          color: #333333;
        }
        ::v-deep(.el-popper) {
          max-width: 50%;
        }
      }
    }
  }
}
.list-image {
  width: 30px;
  height: 30px;
}
::v-deep(.el-table th) {
  background-color: #f3f6f8;
}
::v-deep(.el-button.is-link) {
  color: #2d67b2;
}
::v-deep(.el-button.el-button--danger.is-link) {
  color: #ff6666;
}
::v-deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: rgba(45, 103, 178, 1);
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: normal;
  .close:hover {
    cursor: pointer;
    color: #2d67b2;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.user-dialog {
  ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
    width: 777px;
    min-height: 60vh;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
  }
  ::v-deep(.el-dialog__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep(.el-dialog__body) {
    padding: 20px;
  }
  ::v-deep(.el-dialog__footer) {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
  .user-form-item {
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
      font-size: 16px;
      line-height: 20px;
      height: 40px;
    }
  }
  .user-dialog-input {
    width: 100%;
    border-radius: 10px;
    &:focus {
      border-color: #2d67b2;
      box-shadow: 0 0 5px rgba(45, 103, 178, 0.3);
    }
  }
  .user-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .user-form {
    width: 100%;
    height: 490px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .el-button {
    border-radius: 10px;
    padding: 10px 20px;
    &:focus {
      outline: none;
    }
  }
  .el-button--primary {
    background-color: #2d67b2;
    border-color: #2d67b2;
    &:hover {
      background-color: #275a9a;
      border-color: #275a9a;
    }
  }
  .el-button--plain {
    background-color: transparent;
    border-color: #2d67b2;
    color: #2d67b2;
    &:hover {
      background-color: rgba(45, 103, 178, 0.1);
    }
  }
}
.el-button:focus {
  outline: none;
}
.batch-add-dialog {
  ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
    width: 800px;
    min-height: 30vh;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
  }
  ::v-deep(.el-dialog__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep(.el-dialog__body) {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  ::v-deep(.el-dialog__footer) {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
  .batch-add-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }
  .batch-add-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .step {
    padding-top: 20px;
    border-top: 1px solid #e6e6e6;
    width: 100%;
  }
  .title {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
  }

  .first-step {
    border: 1px dashed #999999;
    background-color: rgb(247, 246, 246);
    padding: 10px;
    cursor: pointer;
  }

  .first-step:hover {
    border-color: #275a9a;
  }

  .text1 {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #999999;
  }

  .text2 {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #e64959;
  }
  .second-step {
    margin-top: 40px;
  }
  .title {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
  }
}
.switch-text {
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  color: rgb(153, 153, 153);
  letter-spacing: normal;
  padding-left: 10px;
}

.title1 {
  font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;
  font-weight: 700;
  font-style: normal;
  text-align: left;
  line-height: normal;
  font-size: 13px;
  letter-spacing: normal;
  color: #333333;
}
.batch-add-dialog {
  ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
    width: 800px;
    min-height: 30vh;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
  }
  ::v-deep(.el-dialog__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep(.el-dialog__body) {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  ::v-deep(.el-dialog__footer) {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
  .batch-add-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }
  .batch-add-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .step {
    padding-top: 20px;
    border-top: 1px solid #e6e6e6;
    width: 100%;
  }
  .title {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
  }

  .first-step {
    border: 1px dashed #999999;
    background-color: rgb(247, 246, 246);
    padding: 10px;
    cursor: pointer;
  }

  .first-step:hover {
    border-color: #275a9a;
  }

  .text1 {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #999999;
  }

  .text2 {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #e64959;
  }
  .second-step {
    margin-top: 40px;
  }
  .title {
    font-family: "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
  }
}
</style>
