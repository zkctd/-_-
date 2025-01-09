<template>
  <div class="exam-management">
    <el-row class="exam-up-row">
      <el-col :span="24">
        <div class="messages-title">
          <span
            class="common-text f-s-18"
            style="color: #333333; font-weight: 700"
            >试卷管理</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row class="exam-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 试卷筛选表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="exam-search-form"
          >
            <el-form-item prop="exam_name" label="试卷名称：">
              <el-input
                v-model="searchForm.exam_name"
                placeholder="请输入试卷名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchEvtHandler"
                >查询</el-button
              >
              <el-button
                type="primary"
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
              >新增试卷</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleBatchDelete"
              color="#ff6666"
              :disabled="selectedRows.length === 0"
              >批量删除</el-button
            >
          </div>
          <!-- 试卷一览表格 -->
          <el-table
            :data="tableData"
            border
            size="large"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="exam_name"
              label="试卷名称"
              width="300"
              show-overflow-tooltip
              class-name="el-table-column--description"
            ></el-table-column>
            <el-table-column
              prop="exam_description"
              label="试卷描述"
              width="300"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="exam_duration" label="试卷时长" width="100">
              <template #default="{ row }">
                <el-tag
                  v-if="row.exam_duration === ''"
                  type="danger"
                  size="small"
                  >未设置</el-tag
                >
                <el-tag v-else size="small">{{ row.exam_duration }}分钟</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="total_score" label="总分" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.total_score === ''" type="danger" size="small"
                  >未设置</el-tag
                >
                <el-tag v-else type="warning" size="small"
                  >{{ row.total_score }}分</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="status" label="发布状态" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.status === true" type="success" size="small"
                  >已发布</el-tag
                >
                <el-tag v-else type="info" size="small">未发布</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_random" label="是否随机" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.is_random === 1" size="small">是</el-tag>
                <el-tag v-else size="small">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="180"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="created_user"
              label="创建人"
              width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" min-width="270px">
              <template #default="{ row }">
                <el-button type="primary" @click="handeleChangeStatus(row)" link
                  >发布试卷</el-button
                >
                <el-button type="primary" @click="handlePreview(row)" link
                  >预览试卷</el-button
                >
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
  <!-- 新增/编辑试卷弹窗 -->
  <div class="exam-dialog">
    <el-dialog
      :show-close="false"
      v-model="editExamDialogVisible"
      @before-close="cancelEditExam()"
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
        <el-form-item label="试卷名称" prop="exam_name" class="exam-form-item">
          <el-input
            v-model="examInfoForm.exam_name"
            placeholder="请输入试卷名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="试卷描述"
          prop="exam_description"
          class="exam-form-item"
        >
          <el-input
            v-model="examInfoForm.exam_description"
            placeholder="请输入试卷描述"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否随机" prop="is_random" class="exam-form-item">
          <el-radio-group v-model="examInfoForm.is_random">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="试卷时长"
          prop="exam_duration"
          class="exam-form-item"
        >
          <el-input-number
            v-model="examInfoForm.exam_duration"
            placeholder="单位为分钟, 最大值为4小时"
            style="width: 40%"
            :min="0"
            :max="240"
            controls-position="right"
          />
          <el-popover
            placement="top"
            :width="200"
            trigger="click"
            content="试卷时长即为考试时长"
          >
            <template #reference>
              <el-button link icon="QuestionFilled" circle size="large" />
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item label="试卷题目" class="exam-form-item">
          <div class="add-question-buttons">
            <el-button @click="showQuestionDialog('single')" type="primary"
              >添加选择题</el-button
            >
            <el-button @click="showQuestionDialog('multiple')" type="primary"
              >添加多选题</el-button
            >
            <el-button @click="showQuestionDialog('judge')" type="primary"
              >添加判断题</el-button
            >
            <el-button @click="showQuestionDialog('short')" type="primary"
              >添加简答题</el-button
            >
          </div>
          <el-table :data="examInfoForm.questions" border size="small">
            <el-table-column
              prop="topic"
              label="题目标题"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="type" label="题型" sortable>
              <template #default="{ row }">{{
                getQuestionTypeName(row.type)
              }}</template>
            </el-table-column>
            <el-table-column
              prop="difficulty"
              sortable
              label="难度"
              width="100"
            >
              <template #default="{ row }">
                {{ getDifficultyName(row.difficulty) }}
              </template>
            </el-table-column>
            <el-table-column prop="score" label="分值" sortable>
              <template #default="{ row }">
                <el-input
                  v-model="row.score"
                  @input="updateTotalScore"
                  @blur="updateTotalScore"
                  size="small"
                  type="number"
                  min="0"
                  max="100"
                  style="margin-bottom: unset"
                />
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-popover
                  v-if="isTotalScoreExceeded"
                  placement="top"
                  :width="200"
                  trigger="hover"
                  content="总分目前大于100，请注意各题目分值合理性"
                >
                  <template #reference>
                    <el-icon
                      ><span
                        class="iconfont gantanhao"
                        style="font-size: 13px; margin-right: 4px"
                      ></span
                    ></el-icon>
                  </template>
                </el-popover>
                <span>试卷总分: {{ totalScore }}</span>
              </template>
              <template #default="{ row, $index }">
                <el-button
                  type="danger"
                  link
                  size="small"
                  style="padding: unset"
                  @click="removeQuestion($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
    <el-dialog v-model="selectQuestionDialogVisible" width="50%">
      <el-table
        :data="filterTableData"
        border
        size="small"
        @selection-change="handleQuestionSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="topic" label="题目" show-overflow-tooltip>
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="输入标题可搜索"
              style="margin-bottom: unset"
            /> </template
        ></el-table-column>
        <el-table-column prop="type" label="题型" width="100">
          <template #default="{ row }">
            {{ getQuestionTypeName2(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="分类标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="(classify, index) in row.classify"
              :key="index"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ classify }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" sortable label="难度" width="100">
          <template #default="{ row }">
            {{ getDifficultyName(row.difficulty) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="questionSearchForm.pageSize"
        :current-page="questionSearchForm.pageNo"
        :total="questionTotal"
        @size-change="handleQuestionSizeChange"
        @current-change="handleQuestionCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        style="justify-content: center; margin-top: 2%"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSelectQuestion">取消</el-button>
          <el-button type="primary" @click="confirmSelectQuestion"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  questionsList,
  createPapers,
  paperList,
  papersDetail,
  delPapers,
  papersUpdate,
  papersChange,
} from "@/api/index";
import { useRouter } from "vue-router";
const router = useRouter();
const tableData = ref([]);
const dialogTitle = ref("");
const searchRef = ref();
const searchForm = ref({
  exam_name: "",
  pageNo: 1,
  pageSize: 10,
});
const examInfoRef = ref();
const examInfoForm = ref({
  user_id: JSON.parse(localStorage.getItem("userInfo")).id,
  exam_name: "",
  exam_description: "",
  exam_duration: 0,
  is_random: 0,
  questions: [
    {
      question: "",
      score: "",
    },
  ],
});
const typeOptions = [
  { value: "single", label: "单选" },
  { value: "multiple", label: "多选" },
  { value: "judge", label: "判断" },
  { value: "short", label: "简答题" },
];
const difficultyOptions = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];
const total = ref(0);
const editExamDialogVisible = ref(false);
const selectedRows = ref([]);
const totalScore = ref(0);
const selectQuestionDialogVisible = ref(false);
const questionTableData = ref([]);
const filterTableData = computed(() =>
  questionTableData.value.filter(
    (data) =>
      !search.value ||
      data.topic.toLowerCase().includes(search.value.toLowerCase())
  )
);
const questionSearchForm = ref({
  type: "",
  pageNo: 1,
  pageSize: 10,
});
const search = ref("");
const questionTotal = ref(0);
const selectedQuestions = ref([]);
const isTotalScoreExceeded = computed(() => {
  return totalScore.value > 100;
});
const fetchExams = async () => {
  const searchParams = new URLSearchParams();
  for (const key in searchForm.value) {
    const value = searchForm.value[key];
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  }
  try {
    const response = await paperList(searchParams);
    if (response.code === 200) {
      tableData.value = response.data.data;
      total.value = response.data.total;
    }
  } catch (error) {
    console.error("获取试卷列表失败:", error);
  }
};
const getQuestionTypeName2 = (type) => {
  const typeOption = typeOptions.find((option) => option.value === type);
  return typeOption ? typeOption.label : "";
};

const getDifficultyName = (difficulty) => {
  const difficultyOption = difficultyOptions.find(
    (option) => option.value === difficulty
  );
  return difficultyOption ? difficultyOption.label : "";
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
  dialogTitle.value = "新增试卷";
  examInfoForm.value = {
    user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    exam_name: "",
    exam_description: "",
    exam_duration: 0,
    is_random: 0,
    questions: [],
  };
  editExamDialogVisible.value = true;
};

const submitExamInfo = () => {
  if (!examInfoForm.value.id) {
    examInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const formattedQuestions = examInfoForm.value.questions.map(
            (question) => ({
              question: question.id,
              score: question.score,
            })
          );

          // 构建请求参数
          const payload = {
            user_id: examInfoForm.value.user_id,
            exam_name: examInfoForm.value.exam_name,
            exam_description: examInfoForm.value.exam_description,
            exam_duration: examInfoForm.value.exam_duration,
            is_random: examInfoForm.value.is_random,
            questions: formattedQuestions,
          };

          const response = await createPapers(payload);
          if (response.code === 200) {
            ElMessage.success("创建试卷成功");
            editExamDialogVisible.value = false;
            await fetchExams();
          }
        } catch (error) {
          console.error("添加试卷失败:", error);
        }
      }
    });
  } else {
    examInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // 处理 questions 数组，只保留 question 和 score
          const formattedQuestions = examInfoForm.value.questions.map(
            (question) => ({
              question: question.id,
              score: question.score,
            })
          );

          // 构建请求参数
          const payload = {
            paper_id: examInfoForm.value.id,
            user_id: JSON.parse(localStorage.getItem("userInfo")).id,
            exam_name: examInfoForm.value.exam_name,
            exam_description: examInfoForm.value.exam_description,
            exam_duration: examInfoForm.value.exam_duration,
            status: examInfoForm.value.status,
            is_random: examInfoForm.value.is_random,
            questions: formattedQuestions,
          };

          const response = await papersUpdate(payload);
          if (response.code === 200) {
            ElMessage.success("修改试卷成功");
            editExamDialogVisible.value = false;
            await fetchExams();
          }
        } catch (error) {
          console.error("修改试卷失败:", error);
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
    ElMessage.warning("请选择要删除的试卷");
    return;
  }

  ElMessageBox.confirm("确定要删除选中的试卷吗？", "删除试卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await delPapers({ ids: ids });
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
  examInfoRef.value.clearValidate();
  totalScore.value = 0;
  editExamDialogVisible.value = false;
};

const handleEdit = async (row) => {
  dialogTitle.value = "修改试卷";
  try {
    const response = await papersDetail({ id: row.id });
    if (response.code === 200 && response.data) {
      const formattedQuestions = response.data.questions.map((question) => ({
        id: question.question.id,
        topic: question.question.topic,
        type: question.question.type,
        difficulty: question.question.difficulty,
        score: question.score,
      }));

      examInfoForm.value = {
        ...response.data,
        user_id: JSON.parse(localStorage.getItem("userInfo")).id,
        questions: formattedQuestions,
      };
      totalScore.value = examInfoForm.value.questions.reduce(
        (total, question) => total + question.score,
        0
      );
      await nextTick();
      editExamDialogVisible.value = true;
    } else {
      console.error("查询试卷详情失败");
    }
  } catch (error) {
    console.error("获取试卷详情失败:", error);
  }
};

const handleDelete = async (row) => {
  ElMessageBox.confirm("确定删除该试卷？", "删除试卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await delPapers({ ids: [row.id] });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        await fetchExams();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

const handeleChangeStatus = async (row) => {
  ElMessageBox.confirm("确定发布该试卷？", "发布试卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await papersChange({ paper_id: row.id });
      if (response.code === 200) {
        ElMessage.success("发布成功,可请前往考试管理选择试卷并设置考试时间！");
        await fetchExams();
      }
    } catch (error) {
      console.error("发布请求失败:", error);
    }
  });
};

const handlePreview = (row) => {
  router.push({
    name: "exam",
    query: { id: row.id },
  });
};

const showQuestionDialog = async (type) => {
  questionSearchForm.value.type = type;
  await fetchQuestions();
  selectQuestionDialogVisible.value = true;
};

const fetchQuestions = async () => {
  const searchParams = new URLSearchParams();
  for (const key in questionSearchForm.value) {
    const value = questionSearchForm.value[key];
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  }
  try {
    const response = await questionsList(searchParams);
    if (response.code === 200 && response.data.data) {
      questionTableData.value = response.data.data.map((item) => ({
        ...item,
        classify: Array.isArray(item.classify)
          ? item.classify
          : item.classify
              .split(";")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0),
      }));
      questionTotal.value = response.data.total;
    } else {
      questionTableData.value = [];
    }
  } catch (error) {
    console.error("获取试题列表失败:", error);
  }
};

const handleQuestionSelectionChange = (rows) => {
  selectedQuestions.value = rows;
};

const handleQuestionCurrentChange = (newPage) => {
  questionSearchForm.value.pageNo = newPage;
  fetchQuestions();
};

const handleQuestionSizeChange = (newSize) => {
  questionSearchForm.value.pageSize = newSize;
  fetchQuestions();
};

const cancelSelectQuestion = () => {
  search.value = "";
  selectQuestionDialogVisible.value = false;
};

const confirmSelectQuestion = () => {
  selectedQuestions.value.forEach((question) => {
    question.score = 0;
  });
  examInfoForm.value.questions.push(...selectedQuestions.value);
  updateTotalScore();
  selectQuestionDialogVisible.value = false;
};

const removeQuestion = (index) => {
  examInfoForm.value.questions.splice(index, 1);
  updateTotalScore();
};

const updateTotalScore = () => {
  examInfoForm.value.questions.forEach((question) => {
    question.score =
      question.score === ""
        ? 0
        : Math.min(Math.max(parseInt(question.score), 0), 100);
  });
  totalScore.value = examInfoForm.value.questions.reduce(
    (total, question) => total + question.score,
    0
  );
};

const getQuestionTypeName = (type) => {
  const typeOptions = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
    short: "简答题",
  };
  return typeOptions[type] || "";
};

const handleCurrentChange = (newPage) => {
  searchForm.value.pageNo = newPage;
  fetchExams();
};

const handleSizeChange = (newSize) => {
  searchForm.value.pageSize = newSize;
  fetchExams();
};

const rules = {
  exam_name: [{ required: true, trigger: "blur", message: "请输入试卷名称" }],
  exam_description: [
    { required: true, trigger: "blur", message: "请输入试卷描述" },
  ],
  exam_duration: [
    { required: true, trigger: "blur", message: "请输入试卷时长" },
    { type: "integer", message: "请输入整数", trigger: "blur" },
  ],
  is_random: [{ required: true, trigger: "change", message: "请选择是否随机" }],
  questions: [{ required: true, trigger: "change", message: "请添加试卷题目" }],
};
onMounted(async () => {
  await fetchExams();
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
      .el-table-column--description {
        .cell {
          white-space: normal;
          word-break: break-all;
          padding: 10px;
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
    .add-question-buttons {
      display: flex;
      margin-bottom: 20px;
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
  .option-item {
    display: flex;
    margin-bottom: 10px;
    padding-right: 10px;
    .option-label {
      margin-right: 10px;
      font-weight: bold;
    }
    .exam-dialog-input {
      margin-right: 10px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .keyword-item,
  .category-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .keyword-label,
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .el-input--small {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.el-button:focus {
  outline: none;
}
</style>
