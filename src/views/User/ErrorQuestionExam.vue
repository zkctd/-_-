<template>
  <div class="exam-page">
    <!-- 答题卡侧边栏 -->
    <div class="answer-card-sidebar">
      <div class="card-header">答题卡</div>
      <div class="question-buttons">
        <el-button
          v-for="(q, index) in questions"
          :key="index"
          :class="{
            'is-answered': selectedAnswersMap[index]?.length > 0,
            'is-current': currentIndex === index,
          }"
          size="small"
          @click="jumpToQuestion(index)"
        >
          {{ index + 1 }}
        </el-button>
      </div>
      <el-button
        type="primary"
        class="submit-all-btn"
        @click="submitAllAnswers"
      >
        提交答卷
      </el-button>
    </div>

    <!-- 主考试容器 -->
    <div class="exam-container">
      <!-- 顶部进度条 -->
      <div class="progress-header">
        <div class="progress-wrapper">
          <div class="progress-text">
            {{ currentIndex + 1 }} / {{ questions.length }}
          </div>
          <!-- 修改进度条部分的代码 -->
          <el-progress
            :percentage="
              questions.length
                ? ((currentIndex + 1) / questions.length) * 100
                : 0
            "
            :stroke-width="4"
            :show-text="false"
          />
        </div>
        <el-button @click="router.back()" class="exit-btn" text>
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <!-- 题目类型指示器 -->
      <div class="type-indicator">
        <el-tag
          :type="getTypeTagType(currentQuestion?.questionsInfo.type)"
          effect="light"
          size="small"
        >
          {{ getTypeLabel(currentQuestion?.questionsInfo.type) }}
        </el-tag>
        <el-tag
          :type="
            getDifficultyTagType(currentQuestion?.questionsInfo.difficulty)
          "
          effect="light"
          size="small"
        >
          {{ getDifficultyLabel(currentQuestion?.questionsInfo.difficulty) }}
        </el-tag>
      </div>

      <!-- 题目内容 -->
      <div class="question-content" v-if="currentQuestion">
        <h2 class="question-title">
          {{ currentQuestion.questionsInfo.topic }}
        </h2>

        <!-- 选择题选项 -->
        <template
          v-if="
            ['single', 'multiple'].includes(currentQuestion.questionsInfo.type)
          "
        >
          <div class="options-list">
            <div
              v-for="(option, index) in parseOptions(
                currentQuestion.questionsInfo.options
              )"
              :key="index"
              class="option-item"
              :class="{
                selected: selectedAnswersMap[currentIndex]?.includes(
                  index.toString()
                ),
                correct: showResult && isCorrectAnswer(index.toString()),
                wrong:
                  showResult &&
                  !isCorrectAnswer(index.toString()) &&
                  selectedAnswersMap[currentIndex]?.includes(index.toString()),
              }"
              @click="toggleAnswer(index.toString())"
            >
              <div class="option-marker">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <div class="option-content">{{ option }}</div>
            </div>
          </div>
        </template>

        <!-- 判断题选项 -->
        <template v-if="currentQuestion.questionsInfo.type === 'judge'">
          <div class="judge-options">
            <el-button-group>
              <el-button
                :class="{
                  selected: selectedAnswersMap[currentIndex]?.includes('0'),
                }"
                @click="toggleAnswer('0')"
              >
                正确
              </el-button>
              <el-button
                :class="{
                  selected: selectedAnswersMap[currentIndex]?.includes('1'),
                }"
                @click="toggleAnswer('1')"
              >
                错误
              </el-button>
            </el-button-group>
          </div>
        </template>
      </div>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <el-button @click="prevQuestion" :disabled="currentIndex === 0">
          上一题
        </el-button>
        <el-button
          type="primary"
          @click="nextQuestion"
          :disabled="currentIndex === questions.length - 1"
        >
          下一题
        </el-button>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <!-- 修改结果弹窗部分 -->
    <el-dialog
      v-model="showResultDialog"
      title="答题结果"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
      align-center
      class="result-dialog"
    >
      <div class="result-content">
        <!-- 成绩等级 -->
        <div class="grade-section">
          <div class="grade-circle" :class="getGradeClass">
            <span class="percentage"
              >{{ ((correctCount / questions.length) * 100).toFixed(1) }}%</span
            >
            <span class="grade-label">{{ getGradeLabel }}</span>
          </div>
        </div>

        <!-- 详细统计 -->
        <div class="stats-section">
          <div class="result-item">
            <span class="label">总题数</span>
            <span class="value">{{ questions.length }}</span>
          </div>
          <div class="divider"></div>
          <div class="result-item">
            <span class="label">正确题数</span>
            <span class="value correct">{{ correctCount }}</span>
          </div>
          <div class="divider"></div>
          <div class="result-item">
            <span class="label">错误题数</span>
            <span class="value wrong">{{
              questions.length - correctCount
            }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button
          type="primary"
          class="return-btn"
          @click="returnToList"
          :style="{ background: getGradeColor }"
        >
          返回列表
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import { wrongQuestions, repeatWrongExam } from "@/api/index";

const router = useRouter();
const questions = ref([]);
const currentIndex = ref(0);
const selectedAnswers = ref([]);
const showResult = ref(false);
const selectedAnswersMap = ref({});
const showResultDialog = ref(false);
const correctCount = ref(0);
const currentQuestion = computed(() => questions.value[currentIndex.value]);
const getGradeClass = computed(() => {
  const percentage = (correctCount.value / questions.value.length) * 100;
  if (percentage >= 90) return "excellent";
  if (percentage >= 80) return "good";
  if (percentage >= 60) return "pass";
  return "fail";
});

const getGradeLabel = computed(() => {
  const percentage = (correctCount.value / questions.value.length) * 100;
  if (percentage >= 90) return "😄优秀";
  if (percentage >= 80) return "😃良好";
  if (percentage >= 60) return "🤔及格";
  return "😅需要努力";
});

const getGradeColor = computed(() => {
  const percentage = (correctCount.value / questions.value.length) * 100;
  if (percentage >= 90) return "#10a37f";
  if (percentage >= 80) return "#4CAF50";
  if (percentage >= 60) return "#FF9800";
  return "#f56c6c";
});
// 获取题目数据
const fetchQuestions = async () => {
  const res = await wrongQuestions({
    user_id: JSON.parse(localStorage.getItem("userInfo")).id,
  });
  questions.value = res.data
    .filter((q) => q.mastery < 100)
    .sort((a, b) => {
      const typeOrder = { single: 1, multiple: 2, judge: 3 };
      return typeOrder[a.questionsInfo.type] - typeOrder[b.questionsInfo.type];
    });
};

// 解析选项
const parseOptions = (options) => {
  return options.split(";").map((opt) => opt.substring(2) || opt);
};

// 获取题型标签类型
const getTypeTagType = (type) => {
  const types = {
    single: "primary",
    multiple: "success",
    judge: "warning",
  };
  return types[type] || "info";
};

// 获取题型标签文本
const getTypeLabel = (type) => {
  const labels = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
  };
  return labels[type] || "";
};

// 获取难度标签类型
const getDifficultyTagType = (difficulty) => {
  const types = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };
  return types[difficulty] || "info";
};

// 获取难度标签文本
const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };
  return labels[difficulty] || "";
};

// 切换答案选择
const toggleAnswer = (answer) => {
  if (!selectedAnswersMap.value[currentIndex.value]) {
    selectedAnswersMap.value[currentIndex.value] = [];
  }

  if (currentQuestion.value.questionsInfo.type === "multiple") {
    const answers = selectedAnswersMap.value[currentIndex.value];
    const index = answers.indexOf(answer);
    if (index > -1) {
      answers.splice(index, 1);
    } else {
      answers.push(answer);
    }
  } else {
    selectedAnswersMap.value[currentIndex.value] = [answer];
  }
};
const jumpToQuestion = (index) => {
  currentIndex.value = index;
};
// 检查答案是否正确
const isCorrectAnswer = (answer) => {
  return currentQuestion.value.questionsInfo.answer.split(";").includes(answer);
};

// 提交答案
const submitAllAnswers = async () => {
  let correct = 0;
  questions.value.forEach((question, index) => {
    const userAnswers = selectedAnswersMap.value[index] || [];
    const correctAnswers = question.questionsInfo.answer.split(";");
    if (arraysEqual(userAnswers.sort(), correctAnswers.sort())) {
      correct++;
    }
  });
  correctCount.value = correct;
  showResultDialog.value = true;
  const submitData = {
    user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    questions_solutions: questions.value.map((q, index) => ({
      question: q.questionsInfo.id,
      solution: (selectedAnswersMap.value[index] || []).join(";"),
    })),
  };
  try {
    await repeatWrongExam(submitData);
  } catch (error) {
    console.error("提交答案失败:", error);
  }
};
const returnToList = () => {
  router.back();
};
const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
};
// 下一题
const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    selectedAnswers.value = [];
    showResult.value = false;
  }
};

// 上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedAnswers.value = [];
    showResult.value = false;
  }
};
onMounted(() => {
  fetchQuestions();
});
</script>

<style lang="less" scoped>
.answer-card-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 280px; // 稍微加宽
  height: calc(100vh - 60px);
  background: rgba(255, 255, 255, 0.95); // 半透明效果
  backdrop-filter: blur(10px); // iOS 风格模糊
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.08);
  padding: 28px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.06);

  .card-header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
    color: #1a1a1a;
    letter-spacing: 0.5px;
  }

  .question-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 改为4列
    gap: 10px;
    margin-bottom: 28px;

    .el-button {
      margin: 0;
      height: 40px;
      border-radius: 12px; // 更圆润的按钮
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.08);

      &.is-answered {
        background: #10a37f; // ChatGPT 绿色
        color: #fff;
        border: none;
      }

      &.is-current {
        border-color: #10a37f;
        color: #10a37f;
        background: rgba(16, 163, 127, 0.1);
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .submit-all-btn {
    margin-top: auto;
    height: 44px;
    border-radius: 12px;
    font-weight: 500;
    background: #10a37f;
    border: none;

    &:hover {
      background: #0e906f;
    }
  }
}
.exam-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  min-height: 80vh;
  background: #fff;

  .progress-header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    background: #fff;
    z-index: 10;

    .progress-wrapper {
      flex: 1;
      margin-right: 24px;

      .progress-text {
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .type-indicator {
    margin: 24px 0;
    display: flex;
    gap: 8px;
  }

  .question-content {
    margin: 32px 0;

    .question-title {
      font-size: 24px;
      font-weight: 600;
      color: #1c1c1e;
      margin-bottom: 32px;
      line-height: 1.4;
    }
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .option-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      background: #f5f7fa;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #e8f3ff;
      }

      &.selected {
        background: #e8f3ff;
        border: 1px solid #409eff;
      }

      &.correct {
        background: #f0f9eb;
        border: 1px solid #67c23a;
      }

      &.wrong {
        background: #fef0f0;
        border: 1px solid #f56c6c;
      }

      .option-marker {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 50%;
        margin-right: 16px;
        font-weight: 500;
      }

      .option-content {
        flex: 1;
        font-size: 16px;
      }
    }
  }

  .judge-options {
    display: flex;
    justify-content: center;
    margin: 32px 0;
    gap: 16px; // 增加按钮间距

    .el-button-group {
      .el-button {
        height: 48px;
        padding: 0 36px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 14px !important; // 强制覆盖
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin: 0 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        &.selected {
          background: #10a37f;
          color: white;
          border: none;
        }

        // 正确按钮
        &:first-child {
          &.selected {
            background: #10a37f;
          }
        }

        // 错误按钮
        &:last-child {
          &.selected {
            background: #dc2626;
          }
        }
      }
    }
  }

  .action-bar {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 24px 0;
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }
}

@media (max-width: 768px) {
  .exam-container {
    padding: 16px;

    .question-title {
      font-size: 20px;
    }

    .option-item {
      padding: 12px;

      .option-marker {
        width: 28px;
        height: 28px;
      }

      .option-content {
        font-size: 14px;
      }
    }
  }
}
.result-content {
  padding: 20px 0;

  .result-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .answer-card-sidebar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: auto;
    padding: 16px;
    transform: translateY(100%);
    transition: transform 0.3s ease;

    &.show {
      transform: translateY(0);
    }
  }

  .exam-container.with-sidebar {
    margin-right: 0;
    padding-bottom: 60px;
  }
}
@media (max-width: 768px) {
  .answer-card-sidebar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: auto;
    padding: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    border-left: none;
    border-radius: 20px 20px 0 0; // iOS 风格圆角
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.show {
      transform: translateY(0);
    }

    .question-buttons {
      grid-template-columns: repeat(6, 1fr); // 移动端显示6列
      gap: 8px;

      .el-button {
        height: 36px;
        font-size: 14px;
      }
    }
  }
}
.result-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(to bottom, #ffffff, #f8f9fa);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

    .el-dialog__header {
      padding: 20px;
      margin: 0;
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      .el-dialog__title {
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .el-dialog__body {
      padding: 32px;
    }
  }
}

.result-content {
  .grade-section {
    text-align: center;
    margin-bottom: 32px;

    .grade-circle {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.4)
      );
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;

      &.excellent {
        border-color: #10a37f;
      }
      &.good {
        border-color: #4caf50;
      }
      &.pass {
        border-color: #ff9800;
      }
      &.fail {
        border-color: #f56c6c;
      }

      .percentage {
        font-size: 36px;
        font-weight: 700;
        background: linear-gradient(45deg, #2c3e50, #3498db);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
      }

      .grade-label {
        font-size: 16px;
        color: #666;
      }
    }
  }

  .stats-section {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      padding: 12px 0;

      .label {
        color: #666;
      }

      .value {
        font-weight: 600;
        font-size: 20px;

        &.correct {
          color: #10a37f;
        }
        &.wrong {
          color: #f56c6c;
        }
      }
    }

    .divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.05);
      margin: 8px 0;
    }
  }
}

.return-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-weight: 500;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 768px) {
  .result-dialog {
    :deep(.el-dialog) {
      width: 90% !important;
      margin: 20px auto;
    }
  }

  .grade-circle {
    width: 140px !important;
    height: 140px !important;

    .percentage {
      font-size: 32px !important;
    }
  }
}
</style>
