<template>
  <div class="question-management">
    <el-row class="question-up-row">
      <el-col :span="24">
        <div class="messages-title">
          <span
            class="common-text f-s-18"
            style="color: #333333; font-weight: 700"
            >试题管理</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row class="question-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 试题筛选表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="question-search-form"
          >
            <el-form-item prop="type" label="题型：">
              <el-select
                v-model="searchForm.type"
                style="width: 120px"
                placeholder="请选择题型"
                :empty-values="[null, undefined]"
                :value-on-clear="null"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="difficulty" label="难度：">
              <el-select
                v-model="searchForm.difficulty"
                placeholder="请选择难度"
                style="width: 120px"
                :empty-values="[null, undefined]"
                :value-on-clear="null"
              >
                <el-option
                  v-for="item in difficultyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="topic">
              <el-input
                class="search"
                v-model="searchForm.topic"
                placeholder="请输入题目标题搜索"
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
              @click="handleAddQuestion"
              color="#2D67B2"
              >新增题目</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleImportQuestions"
              color="#2D67B2"
              >导入题目</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleExportQuestions"
              color="#2D67B2"
              >导出题库</el-button
            >
            <el-button
              style="min-width: 103px"
              @click="handleBatchDelete"
              color="#ff6666"
              :disabled="selectedRows.length === 0"
              >批量删除</el-button
            >
          </div>
          <!-- 试题一览表格 -->
          <el-table
            :data="tableData"
            border
            size="large"
            @selection-change="handleSelectionChange"
            :default-sort="{ prop: 'type', order: 'descending' }"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="topic"
              label="题目标题"
              width="300"
              show-overflow-tooltip
              class-name="el-table-column--description"
            ></el-table-column>
            <el-table-column prop="type" sortable label="题型" width="100">
              <template #default="{ row }">
                {{ getQuestionTypeName(row.type) }}
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
            <el-table-column prop="answer" label="正确答案" width="200">
              <template #default="{ row }">
                <template v-if="row.type === 'short'">
                  关键词：
                  <el-tag
                    v-for="(keyword, index) in row.keywords.split(';')"
                    :key="index"
                    type="warning"
                    style="margin-right: 5px; margin-bottom: 5px"
                  >
                    {{ keyword }}
                  </el-tag>
                </template>
                <template v-else>
                  {{ getDifficultyAnswer(row) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="180"
              sortable
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="created_user"
              label="创建人"
              width="100"
              sortable
              show-overflow-tooltip
            ></el-table-column>
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
  <!-- 新增/编辑试题弹窗 -->
  <div class="question-dialog">
    <el-dialog
      :show-close="false"
      v-model="editQuestionDialogVisible"
      @before-close="cancelEditQuestion()"
    >
      <template #header>
        <div class="title-box">
          <el-text class="common-text f-s-16">{{ dialogTitle }}</el-text>
          <el-icon
            @click="cancelEditQuestion"
            class="common-text iconfont close"
          ></el-icon>
        </div>
      </template>
      <el-divider class="common-divider" />
      <el-form
        label-width="auto"
        class="question-form"
        ref="questionInfoRef"
        :model="questionInfoForm"
        :rules="rules"
      >
        <el-form-item
          label="题型"
          prop="type"
          label-position="left"
          class="question-form-item"
          :rules="[
            { required: true, trigger: 'change', message: '请选择题型' },
          ]"
        >
          <el-popover
            v-if="questionInfoForm.id"
            placement="right"
            :width="150"
            trigger="hover"
            content="暂不允许修改题型"
          >
            <template #reference>
              <el-select
                v-model="questionInfoForm.type"
                style="width: 120px"
                :disabled="!!questionInfoForm.id"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @change="handleTypeChange"
                />
              </el-select>
            </template>
          </el-popover>
          <el-select
            v-else
            v-model="questionInfoForm.type"
            style="width: 120px"
            :disabled="!!questionInfoForm.id"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @change="handleTypeChange"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="题目标题"
          prop="topic"
          label-position="left"
          class="question-form-item"
          :rules="[
            { required: true, trigger: 'blur', message: '请输入题目标题' },
          ]"
        >
          <el-input
            v-model="questionInfoForm.topic"
            placeholder="请输入题目标题"
            class="question-dialog-input"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item
          v-if="
            questionInfoForm.type === 'single' ||
            questionInfoForm.type === 'multiple'
          "
          label="选项"
          label-position="left"
          class="question-form-item"
          :rules="[{ required: true, trigger: 'blur', message: '请输入选项' }]"
        >
          <div
            v-for="(option, index) in questionInfoForm.options"
            :key="index"
            class="option-item"
          >
            <span class="option-label"
              >{{ String.fromCharCode(65 + index) }}.</span
            >
            <el-input
              v-model="option.text"
              placeholder="请输入选项"
              class="question-dialog-input"
              style="margin-bottom: 10px"
            />
            <el-button type="danger" @click="removeOption(index)"
              >删除</el-button
            >
          </div>
          <el-button
            style="margin-bottom: 20px"
            type="primary"
            @click="addOption"
            >添加选项</el-button
          >
        </el-form-item>
        <el-form-item
          v-if="
            questionInfoForm.type === 'single' ||
            questionInfoForm.type === 'multiple'
          "
          label="正确答案"
          prop="answer"
          label-position="left"
          class="question-form-item"
          :rules="[
            { required: true, trigger: 'change', message: '请选择正确答案' },
          ]"
        >
          <el-checkbox-group
            v-if="questionInfoForm.type === 'multiple'"
            v-model="questionInfoForm.answer"
          >
            <el-checkbox
              v-for="(option, index) in questionInfoForm.options"
              :key="index"
              :value="index"
              >{{ String.fromCharCode(65 + index) }}.
              {{ option.text }}</el-checkbox
            >
          </el-checkbox-group>
          <el-radio-group v-else v-model="questionInfoForm.answer">
            <el-radio
              v-for="(option, index) in questionInfoForm.options"
              :value="index"
              :label="String.fromCharCode(65 + index)"
              >{{ String.fromCharCode(65 + index) }}.
              {{ option.text }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="questionInfoForm.type === 'judge'"
          label="正确答案"
          prop="answer"
          label-position="left"
          class="question-form-item"
          :rules="[
            { required: true, trigger: 'change', message: '请选择正确答案' },
          ]"
        >
          <el-radio-group v-model="questionInfoForm.answer">
            <el-radio :value="true">正确</el-radio>
            <el-radio :value="false">错误</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="questionInfoForm.type === 'short'"
          label="关键词"
          prop="keywords"
          label-position="left"
          class="question-form-item"
        >
          <div
            v-for="(keyword, index) in questionInfoForm.keywords"
            :key="index"
            class="keyword-item"
          >
            <span class="keyword-label">{{ keyword }}</span>
            <el-button
              type="danger"
              size="small"
              style="margin-bottom: 10px; margin-right: 10px"
              @click="removeKeyword(index)"
              >删除</el-button
            >
          </div>
          <el-input
            v-model="newKeyword"
            placeholder="添加关键词"
            class="question-dialog-input"
            style="margin-bottom: 10px"
            @keyup.enter="addKeyword"
          />
          <el-button type="primary" @click="addKeyword">添加关键词</el-button>
        </el-form-item>
        <el-form-item
          label="分类"
          prop="classify"
          label-position="left"
          class="question-form-item"
        >
          <div class="category-tags">
            <el-tag
              v-for="(classify, index) in questionInfoForm.classify"
              :key="index"
              closable
              @close="removeCategory(index)"
              style="margin-right: 10px; margin-bottom: 10px"
            >
              {{ classify }}
            </el-tag>
            <el-input
              v-if="newCategoryVisible"
              v-model="newCategory"
              ref="newCategoryInput"
              size="small"
              style="width: 100px; margin-right: 10px; margin-bottom: 10px"
              @keyup.enter="addCategory"
              @blur="addCategory"
            />
            <el-button
              v-else
              type="primary"
              size="small"
              @click="showCategoryInput"
              style="margin-bottom: 10px"
              >+ 添加分类</el-button
            >
          </div>
        </el-form-item>
        <el-form-item
          label="难度"
          prop="difficulty"
          label-position="left"
          class="question-form-item"
          :rules="[
            { required: true, trigger: 'change', message: '请选择难度' },
          ]"
        >
          <el-select v-model="questionInfoForm.difficulty" style="width: 120px">
            <el-option
              v-for="item in difficultyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="question-dialog-footer">
          <el-button
            @click="cancelEditQuestion"
            color="#2D67B2"
            class="common-text common-button-color common-button-bg"
            plain
            size="large"
            >取消</el-button
          >
          <el-button @click="submitQuestionInfo" color="#2D67B2" size="large">{{
            questionInfoForm.id ? "确定" : "立即创建"
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div class="batch-add-dialog">
    <el-dialog :show-close="false" v-model="batchAddDialogVisible">
      <template #header>
        <div class="title-box">
          <el-text class="common-text f-s-16">批量添加试题</el-text>
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
            <span class="text2">试题导入模板</span>
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
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  questionsList,
  createQuestions,
  delQuestion,
  updateQuestion,
  questionsDetail,
  questionsExport,
  downloadFile,
  allQuestionList,
} from "@/api/index";
import ImportAPI from "@/api/upload";
import * as XLSX from "xlsx";
const tableData = ref([]);
const dialogTitle = ref("");
const searchRef = ref();
const searchForm = ref({
  type: null,
  category: "",
  difficulty: null,
  topic: "",
  pageNo: 1,
  pageSize: 10,
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
const questionInfoRef = ref();
const questionInfoForm = ref({
  user_id: JSON.parse(localStorage.getItem("userInfo")).id,
  topic: "",
  type: "",
  classify: [],
  options: [],
  keywords: [],
  answer: "",
  difficulty: "",
  created_at: "",
  created_user: "",
  updated_at: "",
  updated_user: "",
});
const total = ref(0);
const editQuestionDialogVisible = ref(false);
const selectedRows = ref([]);
const newKeyword = ref("");
const newCategory = ref("");
const newCategoryVisible = ref(false);
const newCategoryInput = ref(null);
const batchAddDialogVisible = ref(false);
const fetchQuestions = async () => {
  const searchParams = new URLSearchParams();
  for (const key in searchForm.value) {
    const value = searchForm.value[key];
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  }
  try {
    const response = await questionsList(searchParams);
    if (response.code === 200) {
      tableData.value = response.data.data.map((item) => ({
        ...item,
        classify: Array.isArray(item.classify)
          ? item.classify
          : item.classify
              .split(";")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0),
      }));
      total.value = response.data.total;
    }
  } catch (error) {
    tableData.value = [];
    console.error("获取试题列表失败:", error);
  }
};

const searchEvtHandler = () => {
  fetchQuestions();
};

const resetSearchForm = () => {
  searchForm.value.pageNo = 1;
  searchRef.value.resetFields();
  fetchQuestions();
};

const handleAddQuestion = () => {
  dialogTitle.value = "新增题目";
  questionInfoForm.value = {
    user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    type: "",
    topic: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    answer: [],
    classify: [],
    difficulty: "",
    keywords: [],
  };
  editQuestionDialogVisible.value = true;
};

const submitQuestionInfo = () => {
  if (!questionInfoForm.value.id) {
    questionInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const classifyArray = Array.isArray(questionInfoForm.value.classify)
            ? questionInfoForm.value.classify
            : [questionInfoForm.value.classify];
          const optionsArray = questionInfoForm.value.options.map(
            (option) => option.text
          );
          const keywordsArray = Array.isArray(questionInfoForm.value.keywords)
            ? questionInfoForm.value.keywords
            : [questionInfoForm.value.keywords];
          let answerArray = Array.isArray(questionInfoForm.value.answer)
            ? questionInfoForm.value.answer
            : [questionInfoForm.value.answer];

          if (questionInfoForm.value.type === "judge") {
            answerArray = answerArray.map((answer) => {
              if (answer === true) {
                return 0;
              } else if (answer === false) {
                return 1;
              } else {
                return answer;
              }
            });
            // 清空optionsArray元素
            optionsArray.length = 0;
            optionsArray.push("true", "false");
          }

          const questionData = {
            ...questionInfoForm.value,
            classify: classifyArray,
            options:
              questionInfoForm.value.type === "short" ? [] : optionsArray,
            keywords: keywordsArray,
            answer: answerArray,
          };

          const response = await createQuestions(questionData);
          if (response.code === 200) {
            ElMessage.success("创建题目成功");
            editQuestionDialogVisible.value = false;
            await fetchQuestions();
          }
        } catch (error) {
          console.error("添加题目失败:", error);
        }
      }
    });
  } else {
    questionInfoRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const classifyArray = Array.isArray(questionInfoForm.value.classify)
            ? questionInfoForm.value.classify
            : [questionInfoForm.value.classify];
          let optionsArray =
            questionInfoForm.value.type === "short" ||
            questionInfoForm.value.type === "judge"
              ? []
              : questionInfoForm.value.options.map((option) => option.text);
          const keywordsArray = Array.isArray(questionInfoForm.value.keywords)
            ? questionInfoForm.value.keywords
            : [questionInfoForm.value.keywords];
          let answerArray = Array.isArray(questionInfoForm.value.answer)
            ? questionInfoForm.value.answer
            : [questionInfoForm.value.answer];

          // 将布尔值转换为字符串
          if (questionInfoForm.value.type === "judge") {
            answerArray = answerArray.map((answer) => {
              if (answer === true) {
                return 0;
              } else if (answer === false) {
                return 1;
              } else {
                return answer;
              }
            });
            optionsArray = ["true", "false"];
          }

          const questionData = {
            ...questionInfoForm.value,
            classify: classifyArray,
            options:
              questionInfoForm.value.type === "short" ? [] : optionsArray,
            keywords: keywordsArray,
            answer: answerArray,
          };

          const response = await updateQuestion(questionData);
          if (response.code === 200) {
            ElMessage.success("修改题目成功");
            editQuestionDialogVisible.value = false;
            await fetchQuestions();
          }
        } catch (error) {
          console.error("修改题目失败:", error);
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
    ElMessage.warning("请选择要删除的题目");
    return;
  }

  ElMessageBox.confirm("确定要删除选中的题目吗？", "删除题目", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await delQuestion({ ids: ids });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        // 计算删除后的总数据量
        const newTotal = total.value - ids.length;
        // 计算删除后的最大页码
        const maxPage = Math.ceil(newTotal / searchForm.value.pageSize);

        // 如果当前页码大于最大页码,则将页码设置为最大页码
        if (searchForm.value.pageNo > maxPage) {
          searchForm.value.pageNo = Math.max(1, maxPage);
        }
        await fetchQuestions();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

const cancelEditQuestion = () => {
  editQuestionDialogVisible.value = false;
  questionInfoRef.value.clearValidate();
};

const handleEdit = async (row) => {
  dialogTitle.value = "修改题目";
  try {
    const response = await questionsDetail({ id: row.id });
    if (response.code === 200 && response.data) {
      let questionData = { ...response.data };

      // 根据题型处理数据
      if (questionData.type === "short") {
        questionData.keywords = questionData.keywords
          .split(";")
          .filter((keyword) => keyword.trim() !== "");
      }
      if (questionData.type === "judge") {
        questionData.answer = questionData.answer === "0" ? true : false;
      }
      if (questionData.type === "single" || questionData.type === "multiple") {
        questionData.options = questionData.options
          .split(";")
          .map((option) => ({ text: option }));
        if (questionData.type === "single") {
          questionData.answer = parseInt(questionData.answer, 10);
        } else if (questionData.type === "multiple") {
          questionData.answer = questionData.answer
            .split(";")
            .map((index) => parseInt(index, 10));
        }
      }

      // 处理分类标签
      questionData.classify = questionData.classify
        .split(";")
        .filter((classify) => classify.trim() !== "");

      // 确保 questionInfoForm 正确初始化
      questionInfoForm.value = {
        ...questionData,
        user_id: JSON.parse(localStorage.getItem("userInfo")).id,
      };

      // 等待 Vue 完成响应式数据的更新
      await nextTick();

      // 显示弹窗
      editQuestionDialogVisible.value = true;
    } else {
      console.error("查询题目详情失败");
    }
  } catch (error) {
    console.error("获取题目详情失败:", error);
  }
};

const handleDelete = async (row) => {
  ElMessageBox.confirm("确定删除该题目？", "删除题目", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(async () => {
    try {
      const response = await delQuestion({ ids: [row.id] });
      if (response.code === 200) {
        ElMessage.success("删除成功!");
        // 计算删除后的总数据量
        const newTotal = total.value - 1;
        // 计算删除后的最大页码
        const maxPage = Math.ceil(newTotal / searchForm.value.pageSize);

        // 如果当前页码大于最大页码,则将页码设置为最大页码
        if (searchForm.value.pageNo > maxPage) {
          searchForm.value.pageNo = Math.max(1, maxPage);
        }
        await fetchQuestions();
      }
    } catch (error) {
      console.error("删除请求失败:", error);
    }
  });
};

const handleImportQuestions = () => {
  batchAddDialogVisible.value = true;
};

const handleExportQuestions = async () => {
  try {
    // 获取所有题目数据
    const response = await allQuestionList();
    if (response.code === 200) {
      // 格式化数据
      const exportData = response.data.map((item) => {
        // 格式化选项
        let options = "";
        if (item.type !== "short") {
          options = Array.isArray(item.options)
            ? item.options.join(";")
            : item.options.split(";").join(";");
        }

        // 格式化答案
        let answer = "";
        if (item.type === "single") {
          answer = String.fromCharCode(65 + parseInt(item.answer));
        } else if (item.type === "multiple") {
          answer = item.answer
            .split(";")
            .map((index) => String.fromCharCode(65 + parseInt(index)))
            .join(";");
        } else if (item.type === "judge") {
          answer = item.answer === "0" ? "正确" : "错误";
        } else if (item.type === "short") {
          answer = "";
        }

        // 格式化分类
        const classify = Array.isArray(item.classify)
          ? item.classify.join(";")
          : item.classify;

        // 格式化关键字
        const keywords =
          item.type === "short"
            ? Array.isArray(item.keywords)
              ? item.keywords.join(";")
              : item.keywords
            : "";

        return {
          试题标题: item.topic,
          试题选项: options,
          试题参考答案: answer,
          试题类型: item.type,
          试题难度: item.difficulty,
          考试类别: classify,
          关键字: keywords,
        };
      });

      // 创建工作簿和工作表
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // 设置列宽

      const colWidths = [
        { wch: 40 }, // 试题标题
        { wch: 30 }, // 试题选项
        { wch: 20 }, // 试题参考答案
        { wch: 15 }, // 试题类型
        { wch: 15 }, // 试题难度
        { wch: 20 }, // 考试类别
        { wch: 20 }, // 关键字
      ];
      ws["!cols"] = colWidths;

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "试题列表");

      // 生成并下载文件
      XLSX.writeFile(wb, "试题集.xlsx");

      ElMessage.success("导出成功！");
    }
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};
const addOption = () => {
  questionInfoForm.value.options.push({ text: "" });
};

const removeOption = (index) => {
  if (questionInfoForm.value.options.length <= 4) {
    ElMessage.error("题目选项不能少于4个");
    return;
  }
  questionInfoForm.value.options.splice(index, 1);
};

const getQuestionTypeName = (type) => {
  const typeOption = typeOptions.find((option) => option.value === type);
  return typeOption ? typeOption.label : "";
};

const getDifficultyName = (difficulty) => {
  const difficultyOption = difficultyOptions.find(
    (option) => option.value === difficulty
  );
  return difficultyOption ? difficultyOption.label : "";
};

const getDifficultyAnswer = (row) => {
  if (row.type === "single") {
    return String.fromCharCode(65 + parseInt(row.answer, 10));
  } else if (row.type === "multiple") {
    const answers = row.answer.split(";").map((index) => parseInt(index, 10));
    return answers.map((index) => String.fromCharCode(65 + index)).join(", ");
  } else if (row.type === "judge") {
    return row.answer === "0" ? "正确" : "错误";
  }
  return "";
};

const addKeyword = () => {
  if (newKeyword.value.trim()) {
    questionInfoForm.value.keywords.push(newKeyword.value.trim());
    newKeyword.value = "";
  }
};

const removeKeyword = (index) => {
  questionInfoForm.value.keywords.splice(index, 1);
};

const showCategoryInput = () => {
  newCategoryVisible.value = true;
  nextTick(() => {
    newCategoryInput.value.focus();
  });
};

const addCategory = () => {
  if (newCategory.value.trim()) {
    questionInfoForm.value.classify.push(newCategory.value.trim());
    newCategory.value = "";
    newCategoryVisible.value = false;
  }
};

const removeCategory = (index) => {
  questionInfoForm.value.classify.splice(index, 1);
};

// 当前页码切换
const handleCurrentChange = (newPage) => {
  searchForm.value.pageNo = newPage;
  fetchQuestions();
};

// 分页数量切换
const handleSizeChange = (newSize) => {
  searchForm.value.pageSize = newSize;
  fetchQuestions();
};

const validateOptions = (rule, value, callback) => {
  if (value.length < 4) {
    callback(new Error("选项必须至少四个"));
  } else {
    callback();
  }
};

const rules = {
  type: [{ required: true, trigger: "change", message: "请选择题型" }],
  topic: [{ required: true, trigger: "blur", message: "请输入题目标题" }],
  options: [{ validator: validateOptions, trigger: "change" }],
  classify: [{ required: true, trigger: "change", message: "请选择分类" }],
  difficulty: [{ required: true, trigger: "change", message: "请选择难度" }],
  keywords: [{ required: true, trigger: "blur", message: "请输入关键字" }],
};

const handleTypeChange = (value) => {
  questionInfoForm.value.answer = [];
};

async function downloadfile() {
  try {
    const response = await downloadFile("2");
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
    const response = await ImportAPI.importQuestions(file);
    if (response.code === 200) {
      ElMessage.success("导入成功");
      batchAddDialogVisible.value = false;
      fetchQuestions();
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
  fetchQuestions();
});
</script>

<style lang="less" scoped>
.question-management {
  overflow: hidden;
  .question-up-row {
    background-color: #fff;
    min-height: 58px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .messages-title {
      margin-left: 40px;
    }
  }
  .question-down-row {
    background-color: #fff;
    .container {
      margin: 30px 40px 0 40px;
      height: calc(100vh - 170px);
      min-height: 670px;
      display: flex;
      flex-direction: column;
      .question-search-form {
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

.question-dialog {
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
  .question-form-item {
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
  .question-dialog-input {
    width: 100%;
    border-radius: 10px;
    &:focus {
      border-color: #2d67b2;
      box-shadow: 0 0 5px rgba(45, 103, 178, 0.3);
    }
  }
  .question-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .question-form {
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
    .question-dialog-input {
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
