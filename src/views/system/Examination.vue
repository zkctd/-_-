<template>
  <div class="exam-management">
    <el-row class="exam-up-row">
      <el-col :span="24">
        <div class="messages-title">
          <span
            class="common-text f-s-18"
            style="color: #333333; font-weight: 700"
            >考试管理</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row class="exam-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 考试筛选表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="exam-search-form"
          >
            <el-form-item prop="title" label="考试名称：">
              <el-input
                v-model="searchForm.title"
                placeholder="请输入考试名称搜索"
                class="search"
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
              @click="handleAddExam"
              color="#2D67B2"
              >新增考试</el-button
            >
          </div>
          <!-- 考试一览表格 -->
          <el-table
            :data="tableData"
            border
            size="large"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="title"
              label="考试名称"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="start_time"
              label="开始时间"
              width="180"
              sortable
              show-overflow-tooltip
            />
            <el-table-column
              prop="end_time"
              label="结束时间"
              width="180"
              sortable
              show-overflow-tooltip
            />
            <el-table-column prop="status" label="考试状态" width="100">
              <template #default="{ row }">
                <img
                  :src="
                    row.status === 0
                      ? '/images/common/normal.png'
                      : row.status === 1
                      ? '/images/common/reject.png'
                      : '/images/common/disable.png'
                  "
                  alt=""
                />
                {{ getExamStatusName(row.status) }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="考试次数" width="100" />
            <el-table-column label="操作" min-width="200px">
              <template #default="{ row }">
                <el-button type="primary" @click="handleEdit(row)" link
                  >修改</el-button
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
  <!-- 新增/编辑考试弹窗 -->
  <div class="exam-dialog">
    <el-dialog
      :show-close="false"
      v-model="editExamDialogVisible"
      @before-close="cancelEditExam"
    >
      <template #header>
        <div class="title-box">
          <el-text class="common-text f-s-16">{{ dialogTitle }}</el-text>
          <el-icon
            @click="cancelEditExam"
            class="common-text iconfont close"
          ></el-icon>
        </div>
      </template>
      <el-divider class="common-divider" />
      <el-form
        label-width="auto"
        class="exam-form"
        ref="examInfoRef"
        :model="examInfoForm"
        :rules="rules"
      >
        <el-form-item
          label="考试名称"
          prop="name"
          label-position="left"
          class="exam-form-item"
        >
          <el-input
            v-model="examInfoForm.name"
            placeholder="请输入考试名称"
            class="exam-dialog-input"
          />
        </el-form-item>
        <el-form-item
          label="考试试卷"
          prop="paper_id"
          label-position="left"
          class="exam-form-item"
        >
          <el-select
            v-model="examInfoForm.paper_id"
            style="width: 200px"
            placeholder="请选择考试试卷"
            @change="handlePaperChange"
          >
            <el-option
              v-for="item in paperOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="start_time"
          label-position="left"
          class="exam-form-item"
        >
          <el-date-picker
            v-model="examInfoForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            :disabled="!examInfoForm.paper_id"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="end_time"
          label-position="left"
          class="exam-form-item"
        >
          <el-date-picker
            v-model="examInfoForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            :disabled="!examInfoForm.paper_id"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="exam-dialog-footer">
          <el-button
            @click="cancelEditExam"
            color="#2D67B2"
            class="common-text common-button-color common-button-bg"
            plain
            size="large"
            >取消</el-button
          >
          <el-button @click="submitExamInfo" color="#2D67B2" size="large">{{
            examInfoForm.id ? "确定" : "立即创建"
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { examList, examsUpdate } from "@/api/index";

const tableData = ref([]);
const dialogTitle = ref("");
const searchRef = ref();
const searchForm = ref({
  title: "",
  pageNo: 1,
  pageSize: 10,
});
const paperOptions = [
  { value: 1, label: "试卷1" },
  { value: 2, label: "试卷2" },
  // 添加更多试卷选项
];
const examInfoRef = ref();
const examInfoForm = ref({
  id: null,
  title: "",
  paper_id: null,
  start_time: "",
  end_time: "",
  status: "pending",
  number: 0,
});
const total = ref(0);
const editExamDialogVisible = ref(false);
const selectedRows = ref([]);

const fetchExams = async () => {
  const searchParams = new URLSearchParams();
  for (const key in searchForm.value) {
    const value = searchForm.value[key];
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  }
  try {
    const response = await examList(searchParams);
    if (response.code === 200) {
      tableData.value = response.data.data;
      total.value = response.data.total;
    }
  } catch (error) {
    console.error("获取考试列表失败:", error);
  }
};

const searchEvtHandler = () => {
  fetchExams();
};

const resetSearchForm = () => {
  searchForm.value.pageNo = 1;
  searchRef.value.resetFields();
  fetchExams();
};

const handleAddExam = () => {
  dialogTitle.value = "新增考试";
  examInfoForm.value = {
    name: "",
    paper_id: null,
    start_time: "",
    end_time: "",
    status: "pending",
    times: 0,
  };
  editExamDialogVisible.value = true;
};

const submitExamInfo = () => {
  examInfoRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!examInfoForm.value.id) {
          const response = await createExam(examInfoForm.value);
          if (response.code === 200) {
            ElMessage.success("创建考试成功");
            editExamDialogVisible.value = false;
            await fetchExams();
          }
        } else {
          const response = await updateExam(examInfoForm.value);
          if (response.code === 200) {
            ElMessage.success("修改考试成功");
            editExamDialogVisible.value = false;
            await fetchExams();
          }
        }
      } catch (error) {
        console.error("操作考试失败:", error);
      }
    }
  });
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

const handleDelete = async (row) => {
  ElMessageBox.confirm("确定删除该考试？", "删除考试", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await delExam({ id: row.id });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        await fetchExams();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

const cancelEditExam = () => {
  editExamDialogVisible.value = false;
  examInfoRef.value.clearValidate();
};

const handleEdit = async (row) => {
  dialogTitle.value = "修改考试";
  try {
    const response = await examsUpdate({ id: row.id });
    if (response.code === 200 && response.data) {
      examInfoForm.value = { ...response.data };
      editExamDialogVisible.value = true;
    } else {
      console.error("查询考试详情失败");
    }
  } catch (error) {
    console.error("获取考试详情失败:", error);
  }
};

const handlePaperChange = () => {
  // 可以在这里添加试卷选择后的逻辑
};

const getExamStatusName = (status) => {
  const statusMap = {
    0: "未开始",
    1: "进行中",
    2: "已结束",
  };
  return statusMap[status] || "未知";
};

// 当前页码切换
const handleCurrentChange = (newPage) => {
  searchForm.value.pageNo = newPage;
  fetchExams();
};

// 分页数量切换
const handleSizeChange = (newSize) => {
  searchForm.value.pageSize = newSize;
  fetchExams();
};

const rules = {
  name: [{ required: true, trigger: "blur", message: "请输入考试名称" }],
  paper_id: [{ required: true, trigger: "change", message: "请选择考试试卷" }],
  start_time: [
    { required: true, trigger: "change", message: "请选择开始时间" },
  ],
  end_time: [{ required: true, trigger: "change", message: "请选择结束时间" }],
};

onMounted(() => {
  fetchExams();
});
</script>

<style lang="less" scoped>
.exam-management {
  overflow: hidden;
  .exam-up-row {
    background-color: #fff;
    min-height: 58px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .messages-title {
      margin-left: 40px;
    }
  }
  .exam-down-row {
    background-color: #fff;
    .container {
      margin: 30px 40px 0 40px;
      height: calc(100vh - 170px);
      min-height: 670px;
      display: flex;
      flex-direction: column;
      .exam-search-form {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
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

.exam-dialog {
  ::v-deep(.el-overlay .el-overlay-dialog .el-dialog) {
    width: 777px;
    min-height: 80vh;
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
  .exam-form-item {
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
  .exam-dialog-input {
    width: 100%;
    border-radius: 10px;
    &:focus {
      border-color: #2d67b2;
      box-shadow: 0 0 5px rgba(45, 103, 178, 0.3);
    }
  }
  .exam-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .exam-form {
    width: 100%;
    height: 490px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
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
</style>
