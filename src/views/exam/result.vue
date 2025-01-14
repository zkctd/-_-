<template>
  <div class="exam-preview">
    <!-- 顶部栏 -->
    <el-row class="exam-header">
      <el-col :span="24">
        <div class="header-content">
          <div class="exam-title">
            <span class="title">{{ examInfo.title }}</span>
            <div class="exam-meta">
              <span>考生：{{ examInfo.userName }}</span>
              <el-divider direction="vertical" />
              <span>部门：{{ examInfo.department }}</span>
              <el-divider direction="vertical" />
              <span class="score"
                >得分：{{ examInfo.userScore }}/{{
                  examInfo.paper_total_score
                }}分</span
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主体内容区 -->
    <el-row class="exam-content">
      <!-- 试题区域 -->
      <el-col :span="17" class="question-section">
        <div class="question-container">
          <!-- 单选题部分 -->
          <div
            v-if="singleChoiceQuestions.length"
            class="question-type-section"
          >
            <div class="type-header">
              <h3>一、单选题</h3>
            </div>
            <div
              v-for="question in singleChoiceQuestions"
              :key="question.id"
              :id="`question-${question.index}`"
              class="question-item"
              :class="{
                correct: isCorrect(question),
                wrong: isWrong(question),
              }"
            >
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">
                  （{{ question.score }}分）
                  <span class="question-result" v-if="isCorrect(question)"
                    >✓</span
                  >
                  <span class="question-result wrong" v-if="isWrong(question)"
                    >✗</span
                  >
                </div>
              </div>
              <div class="options-list">
                <div
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="option-item"
                  :class="{
                    'user-selected': isOptionSelected(question, option.value),
                    'correct-answer': isCorrectAnswer(question, option.value),
                    'wrong-answer': isWrongAnswer(question, option.value),
                  }"
                >
                  {{ String.fromCharCode(65 + optIndex) }}. {{ option.text }}
                </div>
              </div>
              <div class="answer-analysis" v-if="question.analysis">
                <div class="analysis-title">答案解析：</div>
                <div class="analysis-content">{{ question.analysis }}</div>
              </div>
            </div>
          </div>
          <!-- 多选题部分 -->
          <div
            v-if="multipleChoiceQuestions.length"
            class="question-type-section"
          >
            <div class="type-header">
              <h3>二、多选题</h3>
            </div>
            <div
              v-for="question in multipleChoiceQuestions"
              :key="question.id"
              :id="`question-${question.index}`"
              class="question-item"
              :class="{
                correct: isCorrect(question),
                wrong: isWrong(question),
              }"
            >
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">
                  （{{ question.score }}分）
                  <span class="question-result" v-if="isCorrect(question)"
                    >✓</span
                  >
                  <span class="question-result wrong" v-if="isWrong(question)"
                    >✗</span
                  >
                </div>
              </div>
              <div class="options-list">
                <div
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="option-item"
                  :class="{
                    'user-selected': isMultipleOptionSelected(
                      question,
                      option.value
                    ),
                    'correct-answer': isMultipleCorrectAnswer(
                      question,
                      option.value
                    ),
                    'wrong-answer': isMultipleWrongAnswer(
                      question,
                      option.value
                    ),
                  }"
                >
                  {{ String.fromCharCode(65 + optIndex) }}. {{ option.text }}
                </div>
              </div>
              <div class="answer-analysis" v-if="question.analysis">
                <div class="analysis-title">答案解析：</div>
                <div class="analysis-content">{{ question.analysis }}</div>
              </div>
            </div>
          </div>

          <!-- 判断题部分 -->
          <div v-if="judgmentQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>三、判断题</h3>
            </div>
            <div
              v-for="question in judgmentQuestions"
              :key="question.id"
              :id="`question-${question.index}`"
              class="question-item"
              :class="{
                correct: isCorrect(question),
                wrong: isWrong(question),
              }"
            >
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">
                  （{{ question.score }}分）
                  <span class="question-result" v-if="isCorrect(question)"
                    >✓</span
                  >
                  <span class="question-result wrong" v-if="isWrong(question)"
                    >✗</span
                  >
                </div>
              </div>
              <!-- 判断题部分的选项 -->
              <div class="options-list">
                <div
                  class="option-item"
                  :class="{
                    'user-selected': userAnswers[question.index] === '1',
                    'correct-answer': correctAnswers[question.index] === '1',
                    'wrong-answer':
                      userAnswers[question.index] === '1' &&
                      correctAnswers[question.index] !== '1',
                  }"
                >
                  正确
                </div>
                <div
                  class="option-item"
                  :class="{
                    'user-selected': userAnswers[question.index] === '0',
                    'correct-answer': correctAnswers[question.index] === '0',
                    'wrong-answer':
                      userAnswers[question.index] === '0' &&
                      correctAnswers[question.index] !== '0',
                  }"
                >
                  错误
                </div>
              </div>
              <div class="answer-analysis" v-if="question.analysis">
                <div class="analysis-title">答案解析：</div>
                <div class="analysis-content">{{ question.analysis }}</div>
              </div>
            </div>
          </div>

          <!-- 简答题部分 -->
          <div v-if="shortAnswerQuestions.length" class="question-type-section">
            <div class="type-header">
              <h3>四、简答题</h3>
            </div>
            <div
              v-for="question in shortAnswerQuestions"
              :key="question.id"
              :id="`question-${question.index}`"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-index">{{ question.index }}.</span>
                <div class="question-content">{{ question.topic }}</div>
                <div class="score-info">
                  （{{ question.score }}分）
                  <span
                    v-if="question.userScore !== undefined"
                    class="user-score"
                    >得分：{{ question.userScore }}分</span
                  >
                </div>
              </div>
              <div class="short-answer-content">
                <div class="answer-section">
                  <div class="section-title">我的答案：</div>
                  <div class="answer-text">
                    {{ userAnswers[question.index] || "未作答" }}
                  </div>
                </div>
                <div class="answer-section">
                  <div class="section-title">参考答案（关键词）：</div>
                  <div class="answer-text correct-answer">
                    {{ correctAnswers[question.index] }}
                  </div>
                </div>
              </div>
              <div class="answer-analysis" v-if="question.analysis">
                <div class="analysis-title">答案解析：</div>
                <div class="analysis-content">{{ question.analysis }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 答题情况统计 -->
      <el-col :span="6" class="result-overview-section">
        <div class="result-card">
          <h4>答题情况</h4>
          <el-divider />

          <div class="score-overview">
            <div class="total-score">
              <span class="label">总得分</span>
              <span class="value">{{ examInfo.userScore }}</span>
            </div>
            <el-progress
              type="circle"
              :percentage="
                Math.round(
                  (examInfo.userScore / examInfo.paper_total_score) * 100
                )
              "
              :color="getScoreColor"
            />
          </div>

          <div class="question-stats">
            <div class="stat-item">
              <span class="label">正确</span>
              <span class="value correct">{{ correctCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">错误</span>
              <span class="value wrong">{{ wrongCount }}</span>
            </div>
          </div>

          <el-button @click="handleReturn" class="return-btn" size="large">
            返回考试列表
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { examResult } from "@/api/index";

const route = useRoute();
const router = useRouter();

const examInfo = ref({
  title: "",
  userName: "",
  userScore: 0,
  paper_total_score: 0,
  start_time: "",
  end_time: "",
});

const questions = ref([]);
const userAnswers = ref({}); // 用户答案
const correctAnswers = ref({}); // 正确答案
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
// 判断答案是否正确
const isCorrect = (question) => {
  if (question.type === "short") {
    return question.userScore === question.score; // 简答题根据得分判断
  }
  return (
    userAnswers.value[question.index] === correctAnswers.value[question.index]
  );
};
const isWrong = (question) => {
  return (
    userAnswers.value[question.index] !== undefined &&
    userAnswers.value[question.index] !== correctAnswers.value[question.index]
  );
};

// 判断选项是否被选中
const isOptionSelected = (question, optionValue) => {
  return userAnswers.value[question.index] === optionValue.toString();
};

// 判断是否为正确答案
const isCorrectAnswer = (question, optionValue) => {
  return correctAnswers.value[question.index] === optionValue.toString();
};

// 多选题选项判断方法
const isMultipleOptionSelected = (question, optionValue) => {
  const userAnswer = userAnswers.value[question.index];
  return userAnswer?.split(";").includes(optionValue.toString());
};

const isMultipleCorrectAnswer = (question, optionValue) => {
  const correctAnswer = correctAnswers.value[question.index];
  return correctAnswer?.split(";").includes(optionValue.toString());
};

const isMultipleWrongAnswer = (question, optionValue) => {
  return (
    isMultipleOptionSelected(question, optionValue) &&
    !isMultipleCorrectAnswer(question, optionValue)
  );
};

const isWrongAnswer = (question, optionValue) => {
  return (
    isOptionSelected(question, optionValue) &&
    !isCorrectAnswer(question, optionValue)
  );
};
// 统计数据计算
const correctCount = computed(() => {
  return questions.value.filter((q) => q.type !== "short" && isCorrect(q))
    .length;
});
const wrongCount = computed(() => {
  return questions.value.filter((q) => q.type !== "short" && !isCorrect(q))
    .length;
});

const missedCount = computed(() => {
  return questions.value.length - Object.keys(userAnswers.value).length;
});

// 获取分数对应的颜色
const getScoreColor = (percentage) => {
  if (percentage > 85) return "#67c23a";
  if (percentage > 60) return "#e6a23c";
  return "#f56c6c";
};

const formatExamTime = (startTime, endTime) => {
  return `${startTime} - ${endTime}`;
};

const handleReturn = () => {
  router.back();
};

const processExamData = (data) => {
  // 处理考试基本信息
  examInfo.value = {
    title: data.exam_title,
    userName: data.user_name,
    department: data.department_name,
    userScore: data.card.reduce((total, item) => total + item.score, 0),
    paper_total_score: data.paper_total_score,
  };

  // 处理题目信息
  questions.value = data.card.map((item, index) => {
    const baseQuestion = {
      id: item.questionsInfo.id,
      index: index + 1,
      type: item.questionsInfo.type,
      topic: item.questionsInfo.topic,
      score: item.questionsInfo.score,
      userScore: item.score,
    };

    // 根据题型处理选项
    switch (item.questionsInfo.type) {
      case "single":
      case "multiple":
        return {
          ...baseQuestion,
          options: item.questionsInfo.options.split(";").map((opt, i) => ({
            text: opt,
            value: i.toString(),
          })),
        };
      case "judge":
        return {
          ...baseQuestion,
          options: [
            { text: "正确", value: "1" },
            { text: "错误", value: "0" },
          ],
        };
      case "short":
        return {
          ...baseQuestion,
          options: [], // 简答题没有选项
        };
      default:
        return baseQuestion;
    }
  });

  // 处理用户答案和正确答案
  data.card.forEach((item, index) => {
    userAnswers.value[index + 1] = item.solution;
    correctAnswers.value[index + 1] =
      item.questionsInfo.type === "short"
        ? item.questionsInfo.keywords
        : item.questionsInfo.answer;
  });
};

// 获取考试结果数据
onMounted(async () => {
  try {
    const response = await examResult({
      exam_id: route.query.examId,
      user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    });

    if (response.code === 200) {
      processExamData(response.data);
    }
  } catch (error) {
    console.error("获取考试结果失败:", error);
  }
});
</script>
<style lang="less" scoped>
.exam-preview {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;

  .exam-header {
    background: #fff;
    border-radius: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-content {
      padding: 20px;

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

          .score {
            color: #2d67b2;
            font-weight: 500;
          }

          .el-divider {
            margin: 0 15px;
          }
        }
      }
    }
  }

  .exam-content {
    display: flex;
    gap: 20px;

    .question-section {
      background: #fff;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

      .question-item {
        margin-bottom: 30px;
        padding: 20px;
        border-radius: 12px;
        border-left: 4px solid transparent;

        .question-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        &.correct {
          background: #f0f9eb;
          border-left-color: #67c23a;
        }

        &.wrong {
          background: #fef0f0;
          border-left-color: #f56c6c;
        }

        .question-result {
          margin-left: 8px;
          font-weight: bold;

          &:not(.wrong) {
            color: #67c23a;
          }

          &.wrong {
            color: #f56c6c;
          }
        }

        .option-item {
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          background: #f8fafc;
          transition: all 0.3s ease;

          &.user-selected {
            background: #fef0f0;

            &.correct-answer {
              background: #f0f9eb;
            }
          }

          &.correct-answer {
            background: #f0f9eb;
            color: #67c23a;
            border: 1px solid #67c23a;
          }

          &.wrong-answer {
            background: #fef0f0;
            color: #f56c6c;
            border: 1px solid #f56c6c;
          }
        }

        .answer-analysis {
          margin-top: 16px;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;

          .analysis-title {
            color: #666;
            font-weight: 500;
            margin-bottom: 8px;
          }

          .analysis-content {
            color: #333;
            line-height: 1.6;
          }
        }
      }
    }

    .result-overview-section {
      .result-card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        position: sticky;
        top: 20px;

        .score-overview {
          text-align: center;
          margin: 20px 0;

          .total-score {
            margin-bottom: 16px;

            .value {
              font-size: 32px;
              font-weight: 600;
              color: #2d67b2;
            }
          }
        }

        .question-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 24px 0;

          .stat-item {
            text-align: center;

            .label {
              display: block;
              color: #666;
              margin-bottom: 4px;
            }

            .value {
              font-size: 24px;
              font-weight: 500;

              &.correct {
                color: #67c23a;
              }
              &.wrong {
                color: #f56c6c;
              }
              &.pending {
                color: #909399;
              }
            }
          }
        }

        .return-btn {
          width: 100%;
          margin-top: 20px;
        }
      }
    }
  }
}
.short-answer-content {
  margin-top: 16px;

  .answer-section {
    margin-bottom: 16px;

    .section-title {
      color: #666;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .answer-text {
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      line-height: 1.6;

      &.correct-answer {
        background: #f0f9eb;
        color: #67c23a;
      }
    }
  }
}

.user-score {
  margin-left: 12px;
  color: #2d67b2;
  font-weight: 500;
}
</style>
