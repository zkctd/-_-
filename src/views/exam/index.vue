<template>
  <div class="exam-preview">
    <!-- 顶部栏 -->
    <el-row class="exam-header">
      <el-col :span="24">
        <div class="header-content">
          <div class="exam-title">
            <span class="title">{{ examInfo.title }}</span>
            <div class="exam-meta">
              <span>总分：{{ examInfo.totalScore }}分</span>
              <el-divider direction="vertical" />
              <span>时长：{{ examInfo.duration }}分钟</span>
            </div>
          </div>
          <div class="timer" v-if="showTimer">
            <el-icon>
              <Timer />
            </el-icon>
            <span>{{ formatTime(remainingTime) }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主体内容区 -->
    <el-row class="exam-content">
      <!-- 试题区域 -->
      <el-col :span="18" class="question-section">
        <div class="question-container">
          <!-- 单选题部分 -->
          <div v-if="singleChoiceQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>{{ getQuestionTypeTitle("single") }}</h3>
            </div>
            <div v-for="(question, index) in singleChoiceQuestions" :key="question.id"
              :id="`question-${question.index}`" class="question-item">
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">（{{ question.score }}分）</div>
              </div>
              <el-radio-group v-model="answers[question.index]" class="options-list">
                <el-radio v-for="(option, optIndex) in question.options" :key="optIndex" :value="option.value"
                  class="option-item">
                  {{ String.fromCharCode(65 + optIndex) }}. {{ option.text }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>

          <!-- 多选题部分 -->
          <div v-if="multipleChoiceQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>{{ getQuestionTypeTitle("multiple") }}</h3>
            </div>
            <div v-for="(question, index) in multipleChoiceQuestions" :key="question.id"
              :id="`question-${question.index}`" class="question-item">
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">（{{ question.score }}分）</div>
              </div>
              <el-checkbox-group v-model="answers[question.index]" class="options-list">
                <el-checkbox v-for="(option, optIndex) in question.options" :key="optIndex" :value="option.value"
                  class="option-item">
                  {{ String.fromCharCode(65 + optIndex) }}. {{ option.text }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <!-- 判断题部分 -->
          <div v-if="judgmentQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>{{ getQuestionTypeTitle("judge") }}</h3>
            </div>
            <div v-for="(question, index) in judgmentQuestions" :key="question.id" :id="`question-${question.index}`"
              class="question-item">
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">（{{ question.score }}分）</div>
              </div>
              <el-radio-group v-model="answers[question.index]" class="options-list">
                <el-radio :value="true">正确</el-radio>
                <el-radio :value="false">错误</el-radio>
              </el-radio-group>
            </div>
          </div>

          <!-- 简答题部分 -->
          <div v-if="shortAnswerQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>{{ getQuestionTypeTitle("short") }}</h3>
            </div>
            <div v-for="(question, index) in shortAnswerQuestions" :key="question.id" :id="`question-${question.index}`"
              class="question-item">
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">（{{ question.score }}分）</div>
              </div>
              <el-input v-model="answers[question.index]" type="textarea" :rows="4" placeholder="请输入答案"
                class="short-answer-input" />
            </div>
          </div>
        </div>
      </el-col>

      <!-- 答题卡区域 -->
      <el-col :span="6" class="answer-card-section">
        <div class="answer-card">
          <h4>答题卡</h4>
          <el-divider />

          <!-- 单选题答题卡 -->
          <div v-if="singleChoiceQuestions.length" class="card-section">
            <div class="card-title">单选题</div>
            <div class="number-grid">
              <div v-for="question in singleChoiceQuestions" :key="question.index" class="number-item" :class="{
                answered: answers[question.index] !== undefined,
                current: currentQuestionIndex === question.index,
              }" @click="scrollToQuestion(question.index)">
                {{ question.index }}
              </div>
            </div>
          </div>

          <!-- 多选题答题卡 -->
          <div v-if="multipleChoiceQuestions.length" class="card-section">
            <div class="card-title">多选题</div>
            <div class="number-grid">
              <div v-for="question in multipleChoiceQuestions" :key="question.index" class="number-item" :class="{
                answered: answers[question.index]?.length > 0,
                current: currentQuestionIndex === question.index,
              }" @click="scrollToQuestion(question.index)">
                {{ question.index }}
              </div>
            </div>
          </div>

          <!-- 判断题答题卡 -->
          <div v-if="judgmentQuestions.length" class="card-section">
            <div class="card-title">判断题</div>
            <div class="number-grid">
              <div v-for="question in judgmentQuestions" :key="question.index" class="number-item" :class="{
                answered: answers[question.index] !== undefined,
                current: currentQuestionIndex === question.index,
              }" @click="scrollToQuestion(question.index)">
                {{ question.index }}
              </div>
            </div>
          </div>

          <!-- 简答题答题卡 -->
          <div v-if="shortAnswerQuestions.length" class="card-section">
            <div class="card-title">简答题</div>
            <div class="number-grid">
              <div v-for="question in shortAnswerQuestions" :key="question.index" class="number-item" :class="{
                answered: answers[question.index]?.length > 0,
                current: currentQuestionIndex === question.index,
              }" @click="scrollToQuestion(question.index)">
                {{ question.index }}
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button v-if="usertype === 0" type="primary" size="large" @click="handleSubmit"
              class="submit-btn">提交试卷</el-button>
            <el-button size="large" @click="handleReturn" class="return-btn">退出考试</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Timer } from "@element-plus/icons-vue";
import { papersDetail, resultCreat } from "@/api/index";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
const router = useRouter();
const usertype = Number(localStorage.getItem("usertype"));
const route = useRoute();
const examInfo = ref({
  title: "",
  duration: 0, // 分钟
  totalScore: 0,
  singleScore: 0,
  multipleScore: 0,
  judgeScore: 0,
  shortScore: 0,
});
const submit_examaId = ref("");
const IsshowAnswer = ref();
const questions = ref([]);
const answers = ref({});
const re_answer = ref();
const currentQuestionIndex = ref(1);
const showTimer = ref(true);
const remainingTime = ref(0); // 转换为秒
const singleChoiceQuestions = computed(() =>
  questions.value.filter((q) => q.type === "single")
);

const multipleChoiceQuestions = computed(() =>
  questions.value.filter((q) => q.type === "multiple")
);

const judgmentQuestions = computed(() =>
  questions.value.filter((q) => q.type === "judge")
);

const shortAnswerQuestions = computed(() =>
  questions.value.filter((q) => q.type === "short")
);
const formatTime = (seconds) => {
  if (!seconds) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const scrollToQuestion = (index) => {
  const element = document.getElementById(`question-${index}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    currentQuestionIndex.value = index;
  }
};

const handleSubmit = (isAutoSubmit = false) => {
  // 如果是自动提交，直接提交答案
  if (isAutoSubmit) {
    submitAnswers();
    return;
  }

  // 手动提交时的检查逻辑
  const unfinishedQuestions = questions.value.filter((question) => {
    const answer = answers.value[question.index];
    switch (question.type) {
      case "single":
      case "judge":
        return answer === undefined;
      case "multiple":
        return !answer || answer.length === 0;
      case "short":
        return !answer || answer.trim() === "";
    }
  });

  let warningMessage = "确认提交试卷？提交后将无法修改。";
  if (unfinishedQuestions.length > 0) {
    const unfinishedIndexes = unfinishedQuestions
      .map((q) => q.index)
      .join(", ");
    warningMessage = `还有第 ${unfinishedIndexes} 题未完成，确定要提交吗？提交后将无法修改。`;
  }

  ElMessageBox.confirm(warningMessage, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      submitAnswers();
    })
    .catch(() => {
      // 取消提交
    });
};

const submitAnswers = () => {
  // 格式化答案
  const answersList = Object.keys(answers.value).map((index) => {
    const question = questions.value[index - 1];
    let formattedAnswer = "";

    // 根据题型格式化答案
    switch (question.type) {
      case "single":
        formattedAnswer = answers.value[index]?.toString() || "";
        break;
      case "multiple":
        formattedAnswer = Array.isArray(answers.value[index])
          ? answers.value[index].sort().join(";")
          : "";
        break;
      case "judge":
        formattedAnswer =
          answers.value[index] === true
            ? "1"
            : answers.value[index] === false
              ? "0"
              : "";
        break;
      case "short":
        formattedAnswer = answers.value[index]?.toString() || "";
        break;
    }

    return {
      question: question.id,
      solution: formattedAnswer,
    };
  });

  // 提交答案
  resultCreat({
    exam_id: submit_examaId.value,
    user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    questions_solutions: answersList,
  })
    .then((response) => {
      if (response.code === 200) {
        clearAnswers();
        if (IsshowAnswer.value === 1) {
          router.push({
            name: "examResult",
            query: {
              examId: route.query.id,
            },
          });
        } else {
          ElMessage.success("试卷提交成功！");
          setTimeout(() => {
            router.push("/MyExmam");
          }, 2000);
        }
      }
    })
    .catch((error) => {
      console.error("提交试卷失败:", error);
    });
};

const handleReturn = () => {
  if (usertype === 1) {
    router.back();
    return;
  }

  ElMessageBox.confirm(
    re_answer.value === 1
      ? "确认退出考试？当前考试可以多次作答，退出后将保留答题卡记录。"
      : "确认退出考试？当前考试无法多次作答，退出后答题记录将丢失并记录 0 分且无法再次进入考试！",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      if (re_answer.value === 1) {
        saveAnswers(); // 保存答题记录
      }
      router.back();
    })
    .catch(() => {
      // 取消返回
    });
};
// 获取答题记录的 localStorage key
const getAnswerStorageKey = (examId) => `exam_answers_${examId}`;

// 保存答题记录到 localStorage
const saveAnswers = () => {
  if (!submit_examaId.value) return;

  const storageKey = getAnswerStorageKey(submit_examaId.value);
  const answerData = {
    timestamp: new Date().getTime(),
    answers: answers.value,
    remainingTime: remainingTime.value,
  };
  localStorage.setItem(storageKey, JSON.stringify(answerData));
};

// 恢复答题记录
const restoreAnswers = () => {
  if (!submit_examaId.value) return;

  const storageKey = getAnswerStorageKey(submit_examaId.value);
  const savedData = localStorage.getItem(storageKey);

  if (savedData) {
    const { answers: savedAnswers, remainingTime: savedTime } =
      JSON.parse(savedData);
    answers.value = savedAnswers;
    remainingTime.value = savedTime;
    return true;
  }
  return false;
};

// 清除答题记录
const clearAnswers = () => {
  if (!submit_examaId.value) return;
  localStorage.removeItem(getAnswerStorageKey(submit_examaId.value));
};

const getQuestionTypeTitle = (type) => {
  const chineseNumbers = ["一", "二", "三", "四", "五"];

  // 获取所有存在题目的题型按顺序排列
  const existingTypes = [];
  if (singleChoiceQuestions.value.length) existingTypes.push("single");
  if (multipleChoiceQuestions.value.length) existingTypes.push("multiple");
  if (judgmentQuestions.value.length) existingTypes.push("judge");
  if (shortAnswerQuestions.value.length) existingTypes.push("short");

  // 获取当前题型在序列中的索引
  const typeIndex = existingTypes.indexOf(type);

  // 获取题型显示名称
  const typeNames = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
    short: "简答题",
  };

  // 如果题型存在，返回带序号的标题
  if (typeIndex !== -1) {
    return `${chineseNumbers[typeIndex]}、${typeNames[type]}`;
  }

  return "";
};

const processQuestions = (questions, isRandom) => {
  // 按题型分组
  const groupedQuestions = {
    single: questions.filter((q) => q.type === "single"),
    multiple: questions.filter((q) => q.type === "multiple"),
    judge: questions.filter((q) => q.type === "judge"),
    short: questions.filter((q) => q.type === "short"),
  };
  if (isRandom) {
    Object.keys(groupedQuestions).forEach((type) => {
      if (groupedQuestions[type].length) {
        groupedQuestions[type] = shuffleArray([...groupedQuestions[type]]);
      }
    });
  }
  const processedQuestions = [
    ...groupedQuestions.single,
    ...groupedQuestions.multiple,
    ...groupedQuestions.judge,
    ...groupedQuestions.short,
  ].map((q, index) => ({
    ...q,
    index: index + 1,
  }));

  return processedQuestions;
};
// 随机辅助函数
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const parseTimeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

let timer;
onMounted(async () => {
  let examId;
  if (usertype === 1) {
    examId = route.query.id;
  } else if (usertype === 0) {
    examId = route.query.paperId;
    submit_examaId.value = route.query.examId;
    IsshowAnswer.value = route.query.showAnswer;
    re_answer.value = Number(route.query.re_answer);
  }
  try {
    const response = await papersDetail({ id: examId });
    if (response.code === 200) {
      const data = response.data;
      examInfo.value = {
        title: data.exam_name,
        duration: data.exam_duration,
        totalScore: data.total_score,
        singleScore: 0,
        multipleScore: 0,
        judgeScore: 0,
        shortScore: 0,
      };

      remainingTime.value =
        usertype === 1
          ? data.exam_duration * 60
          : parseTimeToSeconds(route.query.countdown); // 转换为秒

      questions.value = data.questions.map((q, index) => {
        const baseQuestion = {
          id: q.question.id,
          index: index + 1,
          type: q.question.type,
          topic: q.question.topic,
          answer: q.question.answer,
          score: q.score,
          difficulty: q.question.difficulty,
          classify: q.question.classify.split(";"),
        };

        // 根据题型处理选项
        if (q.question.type === 'short') {
          // 简答题不需要选项
          baseQuestion.options = [];
        } else {
          // 其他题型处理选项
          baseQuestion.options = (q.question.options || "").split(";").map((opt, i) => ({
            text: opt,
            value: i,
          }));
        }

        return baseQuestion;
      });
      questions.value = processQuestions(questions.value, data.is_random === 1);

      // 初始化答案
      questions.value.forEach((q) => {
        if (q.type === "single") {
          answers.value[q.index] = undefined;
        } else if (q.type === "multiple") {
          answers.value[q.index] = [];
        } else if (q.type === "judge") {
          answers.value[q.index] = undefined;
        } else if (q.type === "short") {
          answers.value[q.index] = "";
        }
      });
      if (re_answer.value === 1) {
        restoreAnswers();
      }
    }
  } catch (error) {
    console.error("获取试卷详情失败:", error);
  }

  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
      // 在最后2分钟给出提醒
      if (remainingTime.value === 120) {
        ElMessage({
          type: "warning",
          message: "距离考试结束还有2分钟!",
          duration: 3000,
        });
      }
    } else {
      clearInterval(timer);
      // 考试时间到,自动提交
      if (usertype === 0) {
        ElMessage({
          type: "warning",
          message: "考试时间已到,系统将自动提交试卷!",
          duration: 3000,
        });
        setTimeout(() => {
          handleSubmit(true);
        }, 2000);
      }
    }
  }, 1000);
});
// 组件卸载时清除计时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="less" scoped>
.exam-preview {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;

  // 顶部栏样式
  .exam-header {
    background: #fff;
    border-radius: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-content {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .exam-title {
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-right: 20px;
        }

        .exam-meta {
          display: inline-flex;
          align-items: center;
          color: #666;
          font-size: 14px;

          .el-divider {
            margin: 0 15px;
          }
        }
      }

      .timer {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        color: #2d67b2;
        font-weight: 500;

        .el-icon {
          font-size: 24px;
        }
      }
    }
  }

  // 主体内容区
  .exam-content {
    display: flex;
    gap: 20px;

    // 试题区域
    .question-section {
      background: #fff;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

      .question-container {
        .question-type-section {
          margin-bottom: 40px;

          .type-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            h3 {
              font-size: 18px;
              font-weight: 500;
              color: #333;
              margin: 0;
              margin-right: 10px;
            }

            .score-info {
              color: #666;
              font-size: 14px;
            }
          }

          .question-item {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            transition: all 0.3s ease;

            &:hover {
              background: #f0f5ff;
              box-shadow: 0 4px 12px rgba(45, 103, 178, 0.08);
            }

            .question-header {
              display: flex;
              margin-bottom: 20px;

              .question-index {
                color: #2d67b2;
                font-weight: 500;
                margin-right: 8px;
              }

              .question-content {
                color: #333;
                line-height: 1.6;
              }
            }

            .options-list {

              .el-radio,
              .el-checkbox {
                margin-bottom: 12px;
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                transition: all 0.2s ease;

                &:hover {
                  background: rgba(45, 103, 178, 0.05);
                }

                &.is-checked {
                  color: #2d67b2;
                }
              }
            }

            .short-answer-input {
              .el-textarea__inner {
                border-radius: 8px;
                padding: 12px;
                min-height: 120px;

                &:focus {
                  border-color: #2d67b2;
                  box-shadow: 0 0 0 2px rgba(45, 103, 178, 0.1);
                }
              }
            }
          }
        }
      }
    }

    // 答题卡区域
    .answer-card-section {
      flex: 0 0 23.7%;

      .answer-card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        position: sticky;
        top: 20px;

        .action-buttons {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          gap: 12px;

          .el-button {
            width: 100%;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;

            // 提交按钮样式
            &.submit-btn {
              background-color: #2d67b2;
              border-color: #2d67b2;

              &:hover {
                background-color: #245a9e;
                border-color: #245a9e;
              }
            }

            // 返回按钮样式
            &.return-btn {
              border-color: #dcdfe6;
              margin-left: unset;

              &:hover {
                color: #2d67b2;
                border-color: #2d67b2;
                background-color: #fff;
              }
            }
          }
        }

        h4 {
          font-size: 18px;
          font-weight: 500;
          color: #333;
          margin: 0 0 15px 0;
        }

        .card-section {
          margin-bottom: 24px;

          .card-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
          }

          .number-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .number-item {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              background: #f5f7fa;
              color: #666;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                background: #e6f0ff;
                color: #2d67b2;
              }

              &.answered {
                background: #2d67b2;
                color: #fff;
              }

              &.current {
                background: #fff;
                color: #2d67b2;
                border: 2px solid #2d67b2;
              }
            }
          }
        }
      }
    }
  }
}

// Element Plus 组件样式覆盖
:deep(.el-radio__inner:hover) {
  border-color: #2d67b2;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #2d67b2;
}

:deep(.el-radio.is-checked .el-radio__inner) {
  background: #2d67b2;
  border-color: #2d67b2;
}

:deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background: #2d67b2;
  border-color: #2d67b2;
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .exam-preview {
    .exam-content {
      flex-direction: column;

      .answer-card-section {
        margin-top: 20px;

        .answer-card {
          position: static;
        }
      }
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .exam-preview {
    background-color: #1a1a1a;

    .exam-header,
    .question-section,
    .answer-card {
      background: #262626;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    }

    .title,
    .question-content {
      color: #fff !important;
    }

    .exam-meta,
    .score-info,
    .card-title {
      color: #999 !important;
    }

    .question-item {
      background: #2d2d2d;

      &:hover {
        background: #333;
      }
    }

    .number-item {
      background: #333;
      color: #ccc;

      &.answered {
        background: #2d67b2;
        color: #fff;
      }
    }
  }
}
</style>
