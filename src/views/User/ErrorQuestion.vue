<template>
  <div class="errroList">
    <el-row class="errroList-header">
      <el-col :span="24">
        <div class="errroList-title">
          <span class="common-text f-s-18">错题集</span>
        </div>
      </el-col>
    </el-row>
    <div class="wrong-questions">
      <!-- 顶部统计概览 -->
      <el-row class="stats-overview" :gutter="24">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
          :lg="8"
          v-for="stat in statistics"
          :key="stat.title"
        >
          <div class="stat-card">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 筛选区 -->
      <div class="filter-section">
        <el-radio-group v-model="masteryLevel" class="filter-item">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="mastered">已掌握</el-radio-button>
          <el-radio-button label="learning">待复习</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 错题卡片列表 -->
      <div class="question-list">
        <div
          v-for="question in filteredQuestions"
          :key="question.id"
          class="question-card"
          @click="showQuestionDetail(question)"
        >
          <div
            class="question-tag"
            :class="getDifficultyClass(question.difficulty)"
          >
            {{ getDifficultyLabel(question.difficulty) }}
          </div>
          <div class="question-content">
            <h3 class="question-title">{{ question.title }}</h3>
            <div class="question-meta">
              <span class="subject-tag">{{ question.subject }}</span>
              <span class="wrong-count">
                <el-icon><Warning /></el-icon>
                错误次数: {{ question.wrongCount }}
              </span>
            </div>
            <div class="mastery-progress">
              <div class="progress-text">掌握度</div>
              <el-progress
                :percentage="question.mastery"
                :color="getMasteryColor(question.mastery)"
                :show-text="false"
                :stroke-width="4"
              />
            </div>
          </div>
          <div class="last-wrong-time">
            上次错误: {{ formatDate(question.lastWrongTime) }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredQuestions.length === 0" class="empty-state">
        <el-icon class="empty-icon"><DocumentDelete /></el-icon>
        <h3 class="empty-title">暂无错题记录</h3>
        <p class="empty-description">继续努力学习吧!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Warning, DocumentDelete } from "@element-plus/icons-vue";
import dayjs from "dayjs";
const filteredQuestions = ref([
  {
    id: 1,
    title: "如何使用 Vue 3 的 Composition API?",
    subject: "Vue.js",
    difficulty: "easy",
    wrongCount: 3,
    mastery: 60,
    lastWrongTime: "2021-09-01",
  },
  {
    id: 2,
    title: "Vue 3 的响应式原理是什么?",
    subject: "Vue.js",
    difficulty: "medium",
    wrongCount: 2,
    mastery: 80,
    lastWrongTime: "2021-08-28",
  },
  {
    id: 3,
    title: "Vue 3 的新特性有哪些?",
    subject: "Vue.js",
    difficulty: "hard",
    wrongCount: 5,
    mastery: 40,
    lastWrongTime: "2021-08-25",
  },
]);

const getDifficultyClass = (difficulty) => {
  return `difficulty-${difficulty}`;
};
const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
    default:
      return "";
  }
};

const getMasteryColor = (mastery) => {
  if (mastery >= 80) {
    return "#67c23a";
  } else if (mastery >= 60) {
    return "#409eff";
  } else {
    return "#f56c6c";
  }
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

// 科目列表
const subjects = ref([
  { label: "Vue.js", value: "vue" },
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
]);

// 难度等级
const difficultyLevels = ref([
  { label: "简单", value: "easy" },
  { label: "中等", value: "medium" },
  { label: "困难", value: "hard" },
]);

const showQuestionDetail = (question) => {
  console.log("查看问题详情:", question);
};

// 统计数据
const statistics = ref([
  { title: "累计错题", value: 126 },
  { title: "已掌握", value: 78 },
  { title: "待复习", value: 48 },
]);

// 筛选相关
const selectedSubject = ref("");
const selectedDifficulty = ref("");
const masteryLevel = ref("all");

// 其他数据和方法实现...
</script>

<style lang="less" scoped>
.errroList {
  .errroList-header {
    background-color: #fff;
    min-height: 58px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .errroList-title {
      margin-left: 40px;
      font-weight: 600;
    }
  }
}
.wrong-questions {
  background-color: #fff;
  padding: 30px 40px;
  min-height: calc(100vh - 140px);

  .stats-overview {
    margin-bottom: 20px;
    display: flex;

    .el-col {
      margin-bottom: 16px; // 在小屏幕上堆叠时添加间距
    }

    .stat-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .stat-value {
        font-size: 36px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .stat-title {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .filter-section {
    margin-bottom: 24px;
    display: grid;
    gap: 16px;

    .filter-item {
      display: flex;
      gap: 8px;
    }
  }

  .question-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;

    .question-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      position: relative;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      border: 1px solid #ebeef5;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .question-tag {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;

        &.difficulty-easy {
          background: #f0f9eb;
          color: #67c23a;
        }

        &.difficulty-medium {
          background: #fff3e6;
          color: #ff9900;
        }

        &.difficulty-hard {
          background: #fef0f0;
          color: #f56c6c;
        }
      }

      .question-title {
        font-size: 16px;
        margin-bottom: 16px;
        line-height: 1.4;
        color: #333;
      }

      .question-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;

        .subject-tag {
          background: #f4f4f5;
          color: #909399;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .wrong-count {
          color: #666;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .mastery-progress {
        margin-bottom: 12px;

        .progress-text {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
      }

      .last-wrong-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
:deep(.el-select) {
  .el-input__wrapper {
    border-radius: 12px;
    box-shadow: none !important;
    border: 1px solid rgba(234, 234, 234, 0.8);
  }
}

:deep(.el-radio-button__inner) {
  border-radius: 12px !important;
  padding: 8px 20px;
}

// 添加页面过渡动画
.question-card {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 32px;

  .empty-icon {
    font-size: 64px;
    color: #e5e5ea;
    margin-bottom: 16px;

    // 添加微妙的动画效果
    animation: float 3s ease-in-out infinite;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 600;
    color: #1c1c1e;
    margin-bottom: 8px;

    // iOS 系统字体
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  }
  .empty-description {
    font-size: 16px;
    color: #8e8e93;
    margin: 0;

    // iOS 系统字体
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  }
}

// 添加浮动动画
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
// 确保空状态在小屏幕上也能正确显示
@media (max-width: 768px) {
  .empty-state {
    padding: 24px;

    .empty-icon {
      font-size: 48px;
    }

    .empty-title {
      font-size: 20px;
    }

    .empty-description {
      font-size: 14px;
    }
  }
}
</style>
