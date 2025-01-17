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
            <el-form-item prop="status" label="考试状态：">
              <el-select
                v-model="searchForm.status"
                style="width: 130px"
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
            <el-button
              style="min-width: 103px"
              @click="handleBatchDelete"
              color="#ff6666"
              :disabled="selectedRows.length === 0"
              >批量删除</el-button
            >
          </div>
          <!-- 考试一览表格 -->
          <el-table
            :data="tableData"
            border
            size="large"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            :select-on-indeterminate="true"
            :default-sort="{ prop: 'status', order: 'descending' }"
            row-key="id"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="(row) => row.status !== 1"
            />
            <el-table-column
              prop="title"
              label="考试名称"
              width="200"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span v-if="row.parent">
                  {{ `${row.title}(重考第${row.order}次)` }}
                </span>
                <span v-else>{{ row.title }}</span>
              </template>
            </el-table-column>
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
            <el-table-column
              prop="status"
              label="考试状态"
              width="140"
              sortable
            >
              <template #default="{ row }">
                <img
                  :src="
                    row.status === 0
                      ? '/images/common/disable.png'
                      : row.status === 1
                      ? '/images/common/reject.png'
                      : row.status === 2
                      ? '/images/common/normal.png'
                      : '/images/common/pending.png'
                  "
                  alt=""
                />
                {{ getExamStatusName(row.status) }}
              </template>
            </el-table-column>
            <el-table-column prop="departments" label="参考部门" width="250">
              <template #default="{ row }">
                <el-tag
                  v-for="dept in row.departments"
                  :key="dept.id"
                  type="info"
                  style="margin-right: 5px"
                  v-if="!row.parent"
                  >{{ dept.name }}</el-tag
                >
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="users" label="重考人员" width="180">
              <template #default="{ row }">
                <el-tag
                  v-for="user in row.users"
                  :key="user.id"
                  type="info"
                  style="margin-right: 5px"
                  v-if="row.parent"
                  >{{ user.name }}</el-tag
                >
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="re_answer"
              label="是否允许重复考试"
              width="150"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                {{ row.re_answer === 0 ? "否" : "是" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="show_answer"
              label="是否立即显示答案"
              width="150"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                {{ row.show_answer === 0 ? "否" : "是" }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="已考次数" width="100" />
            <el-table-column label="操作" min-width="250px" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 2 && !row.parent"
                  type="primary"
                  @click="handleExamDetail(row)"
                  link
                  >查看考试详情</el-button
                >
                <el-button
                  v-if="row.status === 2 && !row.parent"
                  type="primary"
                  @click="handleRestart(row)"
                  link
                  >重启考试</el-button
                >
                <el-button
                  v-if="row.status === 0"
                  type="primary"
                  @click="handleEdit(row)"
                  link
                  >修改</el-button
                >
                <el-button
                  v-if="row.status !== 1"
                  type="danger"
                  @click="handleDelete(row)"
                  link
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
          prop="title"
          label-position="left"
          class="exam-form-item"
        >
          <el-input
            v-model="examInfoForm.title"
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
          <el-popover
            v-if="examInfoForm.id"
            placement="right"
            :width="150"
            trigger="hover"
            content="暂不允许修改试卷"
          >
            <template #reference>
              <el-select
                v-model="examInfoForm.paper_id"
                style="width: 220px"
                placeholder="请选择考试试卷"
                @change="handlePaperChange"
                :disabled="!!examInfoForm.id"
              >
                <el-option
                  v-for="item in paperOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-popover>
          <el-select
            v-else
            v-model="examInfoForm.paper_id"
            style="width: 220px"
            placeholder="请选择考试试卷"
            @change="handlePaperChange"
            :disabled="examInfoForm.id"
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
          label="是否可重复考试"
          prop="title"
          label-position="left"
          class="exam-form-item"
        >
          <el-radio-group v-model="examInfoForm.re_answer">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否立即显示答案"
          prop="title"
          label-position="left"
          class="exam-form-item"
        >
          <el-radio-group v-model="examInfoForm.show_answer">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="考试部门"
          prop="title"
          label-position="left"
          class="exam-form-item"
          v-if="!examInfoForm.parent"
        >
          <el-checkbox-group v-model="examInfoForm.departments">
            <el-checkbox
              v-for="(item, index) in departmentOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="重考人员"
          prop="title"
          label-position="left"
          class="exam-form-item"
          v-if="examInfoForm.parent && examInfoForm.id"
        >
          <div class="add-retake-user">
            <el-button type="primary" @click="showRetakeUserDialog"
              >添加重考人员</el-button
            >
          </div>
          <el-table
            :data="examInfoForm.users"
            border
            size="small"
            max-height="400"
          >
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="depart" label="所属部门"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ $index }">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="removeRetakeUser($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
            :show-now="false"
          />
        </el-form-item>
        <el-form-item
          :label="`结束时间`"
          prop="end_time"
          label-position="left"
          class="exam-form-item"
        >
          <el-date-picker
            v-model="examInfoForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            disabled
            :show-now="false"
          />
          <el-popover
            v-if="examInfoForm.exam_duration"
            placement="right"
            :width="260"
            trigger="click"
            :content="`结束时间为开始时间加上试卷时长，当前选择试卷的时长为：${examInfoForm.exam_duration}分钟`"
          >
            <template #reference>
              <el-button link icon="QuestionFilled" circle size="large" />
            </template>
          </el-popover>
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
    <el-dialog
      v-model="restartDialogVisible"
      title="重启考试"
      width="500px"
      class="restart-dialog"
    >
      <el-form
        :model="restartForm"
        ref="restartFormRef"
        :rules="restartRules"
        label-width="100px"
      >
        <el-form-item
          label="开始时间"
          prop="start_time"
          label-position="left"
          class="exam-form-item"
        >
          <el-date-picker
            v-model="restartForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="calculateEndTime"
            :show-now="false"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          label-position="left"
          class="exam-form-item"
        >
          <el-input
            v-model="restartForm.end_time"
            disabled
            style="width: 220px"
          />
          <el-popover
            placement="right"
            :width="260"
            trigger="click"
            :content="`结束时间为开始时间加上试卷时长，当前选择试卷的时长为：${restartForm.duration}分钟`"
          >
            <template #reference>
              <el-button link icon="QuestionFilled" circle size="large" />
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item
          label="重考人员"
          prop="title"
          label-position="left"
          class="exam-form-item"
        >
          <div class="add-retake-user">
            <el-button type="primary" @click="showRetakeUserDialog"
              >添加重考人员</el-button
            >
          </div>
          <el-table
            :data="restartForm.users"
            border
            size="small"
            max-height="150"
          >
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="depart" label="所属部门"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ $index }">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="removeRetakeUser($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRestart" size="large">取消</el-button>
          <el-button @click="submitRestart" color="#2D67B2" size="large"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="retakeUserDialogVisible"
      title="选择重考人员"
      width="50%"
    >
      <el-table
        :data="filterRetakeUserData"
        border
        size="small"
        @selection-change="handleRetakeUserSelectionChange"
        max-height="500"
        :default-sort="{ prop: 'depart', order: 'descending' }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名">
          <template #header>
            <el-input
              v-model="retakeUserSearch"
              size="small"
              placeholder="输入姓名搜索"
              style="margin-bottom: unset"
            />
          </template>
        </el-table-column>
        <el-table-column prop="depart" label="所属部门" sortable />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRetakeUserSelect">取消</el-button>
          <el-button type="primary" @click="confirmRetakeUserSelect"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  examList,
  examsUpdate,
  createExam,
  examPaperList,
  delExam,
  examDetail,
  resetExam,
  dpartList,
  userList,
  allUserList,
} from "@/api/index";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter();
const tableData = ref([]);
const dialogTitle = ref("");
const searchRef = ref();
const searchForm = ref({
  title: "",
  status: null,
  pageNo: 1,
  pageSize: 10,
});
const paperOptions = ref([]);
const examInfoRef = ref();
const examInfoForm = ref({
  id: null,
  title: "",
  paper_id: null,
  start_time: "",
  end_time: "",
  status: null,
  number: 0,
  re_answer: 0,
  show_answer: 0,
  departments: [],
  users: [],
});
const restartDialogVisible = ref(false);
const restartFormRef = ref(null);
const departmentOptions = ref([]);
const restartForm = ref({
  id: "",
  start_time: "",
  end_time: "",
  users: [],
  duration: 0,
});
const retakeUserDialogVisible = ref(false);
const retakeUserTableData = ref([]);
const selectedRetakeUsers = ref([]);
const retakeUserSearch = ref("");
const userSearchForm = ref({});
const userTotal = ref(0);
const filterRetakeUserData = computed(() =>
  retakeUserTableData.value.filter(
    (data) =>
      !retakeUserSearch.value ||
      data.name.toLowerCase().includes(retakeUserSearch.value.toLowerCase())
  )
);

const ReDialogFlag = ref(false);
const showRetakeUserDialog = async () => {
  retakeUserDialogVisible.value = true;
  await fetchRetakeUsers(); // 获取可选用户列表
};
const fetchRetakeUsers = async () => {
  try {
    const searchParams = new URLSearchParams();
    for (const key in userSearchForm.value) {
      const value = userSearchForm.value[key];
      if (value != null && value !== "") {
        searchParams.append(key, value);
      }
    }

    const response = await allUserList(searchParams);
    if (response.code === 200) {
      retakeUserTableData.value = Array.isArray(response.data)
        ? response.data
        : [];
    } else {
      retakeUserTableData.value = [];
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    retakeUserTableData.value = [];
  }
};

// 选择用户变化处理
const handleRetakeUserSelectionChange = (rows) => {
  selectedRetakeUsers.value = rows;
};

// 删除重考人员
const removeRetakeUser = (index) => {
  if (examInfoForm.value.users) {
    examInfoForm.value.users.splice(index, 1);
  } else {
    restartForm.value.users.splice(index, 1);
  }
};

// 取消选择
const cancelRetakeUserSelect = () => {
  retakeUserSearch.value = "";
  retakeUserDialogVisible.value = false;
};

// 确认选择
const confirmRetakeUserSelect = () => {
  if (!examInfoForm.value.users) {
    examInfoForm.value.users = [];
  }
  if (!restartForm.value.users) {
    restartForm.value.users = [];
  }

  // 过滤掉已存在的用户
  const newUsers = selectedRetakeUsers.value.filter((user) =>
    ReDialogFlag.value
      ? !restartForm.value.users.some(
          (existingUser) => existingUser.id === user.id
        )
      : !examInfoForm.value.users.some(
          (existingUser) => existingUser.id === user.id
        )
  );

  // 添加新用户
  if (newUsers.length > 0) {
    ReDialogFlag.value
      ? restartForm.value.users.push(...newUsers)
      : examInfoForm.value.users.push(...newUsers);
  }

  // 清理并关闭对话框
  selectedRetakeUsers.value = [];
  retakeUserSearch.value = "";
  retakeUserDialogVisible.value = false;
};
const validateStartTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请选择开始时间"));
  } else if (dayjs(value).isBefore(dayjs())) {
    callback(new Error("开始时间必须大于当前时间"));
  } else {
    callback();
  }
};

const restartRules = {
  start_time: [
    { required: true, message: "请选择开始时间", trigger: "change" },
    { validator: validateStartTime, trigger: "change" },
  ],
};
const total = ref(0);
const editExamDialogVisible = ref(false);
const selectedRows = ref([]);
const statusOptions = [
  { value: 0, label: "未开始" },
  { value: 1, label: "进行中" },
  { value: 2, label: "已结束" },
  { value: 3, label: "考试异常" },
];
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

const cancelRestart = () => {
  restartDialogVisible.value = false;
  restartFormRef.value?.resetFields();
  restartForm.value = {
    id: "",
    start_time: "",
    end_time: "",
    users: [],
    duration: 0,
  };
  ReDialogFlag.value = false;
};
const handleAddExam = async () => {
  dialogTitle.value = "新增考试";
  examInfoForm.value = {
    title: "",
    paper_id: null,
    start_time: "",
    end_time: "",
    re_answer: 0,
    show_answer: 0,
    departments: [],
    users: [],
    number: 0,
    parent: "",
  };
  // 获取下拉框试卷列表
  try {
    const response = await examPaperList();
    if (response.code === 200) {
      paperOptions.value = response.data.map((item) => ({
        value: item.id,
        label: item.exam_name,
        exam_duration: item.exam_duration,
      }));
    }
  } catch (error) {
    console.error("获取试卷列表失败:", error);
  }
  try {
    const response = await dpartList();
    if (response.code === 200) {
      departmentOptions.value = response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    }
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
  editExamDialogVisible.value = true;
};

const submitExamInfo = () => {
  examInfoRef.value.validate(async (valid) => {
    if (valid) {
      let examInfo = {
        id: examInfoForm.value.id,
        start_time: dayjs(examInfoForm.value.start_time).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        end_time: dayjs(examInfoForm.value.end_time).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        paper_id: examInfoForm.value.id ? null : examInfoForm.value.paper_id,
        title: examInfoForm.value.title,
        re_answer: examInfoForm.value.re_answer,
        show_answer: examInfoForm.value.show_answer,
        departments: examInfoForm.value.departments,
        users: examInfoForm.value.users,
      };
      try {
        if (!examInfoForm.value.id) {
          const response = await createExam(examInfo);
          if (response.code === 200) {
            ElMessage.success("创建考试成功");
            editExamDialogVisible.value = false;
            await fetchExams();
          }
        } else {
          const response = await examsUpdate(examInfo);
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
      const response = await delExam({ ids: [row.id] });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        await fetchExams();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
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
      const response = await delExam({ ids: ids });
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
    const response = await dpartList();
    if (response.code === 200) {
      departmentOptions.value = response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    }
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
  try {
    const response = await examDetail({ id: row.id });
    if (response.code === 200 && response.data) {
      // 获取试卷列表以获取试卷时长
      const paperResponse = await examPaperList();
      if (paperResponse.code === 200) {
        paperOptions.value = paperResponse.data.map((item) => ({
          value: item.id,
          label: item.exam_name,
          exam_duration: item.exam_duration,
        }));
      }
      const paper = paperResponse.data.find(
        (item) => item.id === response.data.paper
      );
      examInfoForm.value = {
        id: response.data.id,
        title: response.data.title,
        start_time: response.data.start_time,
        end_time: response.data.end_time,
        paper_id: response.data.paper,
        exam_duration: paper ? paper.exam_duration : 0,
        re_answer: response.data.re_answer,
        show_answer: response.data.show_answer,
        departments: response.data.departments.map((dept) => dept.id),
        users: response.data.users || [],
        number: response.data.number,
        parent: response.data.parent,
      };
      editExamDialogVisible.value = true;
    } else {
      console.error("查询考试详情失败");
    }
  } catch (error) {
    console.error("获取考试详情失败:", error);
  }
};
const handleRestart = async (row) => {
  try {
    const response = await examDetail({ id: row.id });
    if (response.code === 200 && response.data) {
      examInfoForm.value = {
        id: response.data.id,
        title: response.data.title,
        start_time: response.data.start_time,
        end_time: response.data.end_time,
        paper_id: response.data.paper,
        re_answer: response.data.re_answer,
        show_answer: response.data.show_answer,
        departments: response.data.departments.map((dept) => dept.id),
        users: response.data.users.map((user) => user.id),
      };
      const paperResponse = await examPaperList();
      const paper = paperResponse.data.find(
        (item) => item.id === response.data.paper
      );
      restartForm.value = {
        id: row.id,
        start_time: "",
        end_time: "",
        users: [],
        duration: paper ? paper.exam_duration : 0, // 从试卷中获取时长
      };
      restartDialogVisible.value = true;
      ReDialogFlag.value = true;
    } else {
      console.error("查询考试详情失败");
    }
  } catch (error) {
    console.error("获取考试详情失败:", error);
  }
};

watch(
  () => restartForm.value.start_time,
  (newVal) => {
    if (newVal && restartForm.value.duration) {
      restartForm.value.end_time = dayjs(newVal)
        .add(restartForm.value.duration, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }
);

const calculateEndTime = () => {
  if (restartForm.value.start_time && restartForm.value.duration) {
    restartForm.value.end_time = dayjs(restartForm.value.start_time)
      .add(restartForm.value.duration, "minute")
      .format("YYYY-MM-DD HH:mm:ss");
  }
};

const submitRestart = async () => {
  await restartFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await resetExam({
          id: restartForm.value.id,
          start_time: restartForm.value.start_time,
          end_time: restartForm.value.end_time,
          users: restartForm.value.users.map((user) => user.id),
        });
        if (response.code === 200) {
          ElMessage.success("重启成功!");
          restartDialogVisible.value = false;
          ReDialogFlag.value = false;
          await fetchExams();
        }
      } catch (error) {
        console.error("重启请求失败:", error);
      }
    }
  });
};

const handlePaperChange = () => {
  const selectedPaper = paperOptions.value.find(
    (paper) => paper.value === examInfoForm.value.paper_id
  );
  if (selectedPaper) {
    examInfoForm.value.exam_duration = selectedPaper.exam_duration;
  }
};

const tableRowClassName = ({ row }) => {
  if (row.status === 1) {
    return "disabled-row";
  }
  return "";
};

const handleExamDetail = (row) => {
  router.push({
    name: "exam_detail",
    query: { id: row.id },
  });
};

watch(
  () => examInfoForm.value.start_time,
  (newStartTime) => {
    if (newStartTime && examInfoForm.value.exam_duration) {
      const start = dayjs(newStartTime);
      examInfoForm.value.end_time = start
        .add(examInfoForm.value.exam_duration, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }
);

const getExamStatusName = (status) => {
  const statusMap = {
    0: "未开始",
    1: "进行中",
    2: "已结束",
    3: "考试异常",
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
  title: [{ required: true, trigger: "blur", message: "请输入考试名称" }],
  paper_id: [{ required: true, trigger: "change", message: "请选择考试试卷" }],
  start_time: [
    { required: true, message: "请选择开始时间", trigger: "change" },
    { validator: validateStartTime, trigger: "change" },
  ],
  re_answer: [
    { required: true, trigger: "change", message: "请选择是否允许重考" },
  ],
  show_answer: [
    { required: true, trigger: "change", message: "请选择是否立即显示答案" },
  ],
  end_time: [{ required: true, trigger: "change", message: "请选择结束时间" }],
};

onMounted(() => {
  fetchExams();
});
</script>

<style lang="less" scoped>
.exam-management {
  .disabled-row {
    background-color: #f5f7fa;
    color: #c0c4cc;
  }
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
        border-radius: 12px;
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05);
        border: none;
        overflow: hidden;

        // 表头样式
        ::v-deep(thead th) {
          font-weight: 500;
          color: #1c1c1e;
          background-color: #ffffff;
          border-bottom: 1px solid rgba(60, 60, 67, 0.1);
          transition: background-color 0.2s;
        }

        // 表格行样式
        ::v-deep(tr) {
          color: #1c1c1e;
          transition: background-color 0.2s;

          &:hover {
            background-color: rgba(0, 122, 255, 0.05);
          }
        }
        // 单元格样式
        ::v-deep(td) {
          border-bottom: 1px solid rgba(60, 60, 67, 0.1);
        }

        // 去除表格边框
        ::v-deep(.el-table__inner-wrapper::before),
        ::v-deep(.el-table__inner-wrapper::after) {
          display: none;
        }

        // 标签样式优化
        ::v-deep(.el-tag) {
          border-radius: 6px;
          padding: 4px 8px;
          font-weight: 500;

          &.el-tag--success {
            background-color: rgba(52, 199, 89, 0.1);
            color: #34c759;
            border: none;
          }

          &.el-tag--warning {
            background-color: rgba(255, 149, 0, 0.1);
            color: #ff9500;
            border: none;
          }

          &.el-tag--danger {
            background-color: rgba(255, 59, 48, 0.1);
            color: #ff3b30;
            border: none;
          }
        }
        // 操作按钮样式
        ::v-deep(.el-button.is-link) {
          font-weight: 500;
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
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.add-retake-user {
  margin-bottom: 20px;
}

.retake-user-table {
  margin-top: 10px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-dialog__footer) {
  padding: 20px 0 30px;
  border-top: 1px solid #e4e7ed;
}

::v-deep(.restart-dialog .el-dialog) {
  height: 220px; /* 设置固定高度 */
  margin-top: 15vh !important; /* 调整弹窗垂直位置 */
}

:deep(.restart-dialog .el-dialog__body) {
  padding: 30px 40px;
  height: calc(100% - 120px); /* 减去头部和底部的高度 */
  overflow-y: auto; /* 内容过多时可滚动 */
}

:deep(.restart-dialog .el-dialog__footer) {
  padding: 20px 0 30px;
  border-top: 1px solid #e4e7ed;
}

:deep(.restart-dialog .el-form-item) {
  margin-bottom: 25px; /* 调整表单项间距 */
}
</style>
