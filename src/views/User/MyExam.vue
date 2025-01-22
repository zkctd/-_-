<template>
  <div class="my-exams">
    <el-row class="exam-header">
      <el-col :span="24">
        <div class="header-title">
          <span class="common-text f-s-18">我的考试</span>
        </div>
      </el-col>
    </el-row>

    <el-row class="exam-content">
      <el-col :span="24">
        <div class="exam-filter">
          <el-radio-group v-model="filterStatus" @change="handleFilterChange">
            <el-radio-button :value="-1">全部</el-radio-button>
            <el-radio-button :value="0">未开始</el-radio-button>
            <el-radio-button :value="1">进行中</el-radio-button>
            <el-radio-button :value="2">已结束</el-radio-button>
          </el-radio-group>
        </div>

        <div class="exam-list">
          <div v-for="exam in filteredExams" :key="exam.id" class="exam-card">
            <div class="exam-status" :class="getStatusClass(exam.status)">
              {{ getStatusText(exam.status) }}
            </div>
            <div class="exam-info">
              <h3 v-if="exam.order" class="exam-title">
                {{ exam.title }}(第{{ exam.order }}次重考)
              </h3>
              <h3 v-else class="exam-title">{{ exam.title }}</h3>
              <div class="exam-time">
                <el-icon><Clock /></el-icon>
                <span style="margin-top: 1px">{{
                  formatTimeRange(exam.start_time, exam.end_time)
                }}</span>
              </div>
              <div class="exam-details">
                <!-- <div class="detail-item">
                  <el-icon><CircleCheck /></el-icon>
                  <span>已考次数: {{ exam.number }}次</span>
                </div> -->
                <div class="detail-item">
                  <el-icon><RefreshRight /></el-icon>
                  <span>{{
                    exam.re_answer === 1 ? "允许多次作答" : "不允许多次作答"
                  }}</span>
                </div>
                <div class="detail-item">
                  <el-icon><Document /></el-icon>
                  <span>{{
                    exam.show_answer === 1
                      ? "提交后立即显示答案"
                      : "提交后不显示答案"
                  }}</span>
                </div>
              </div>
            </div>
            <div class="exam-actions">
              <template v-if="exam.status === 1">
                <el-button
                  v-if="hasUnfinishedExam(exam.id)"
                  type="warning"
                  @click="handleContinueExam(exam)"
                  >继续考试</el-button
                >
                <el-button v-else type="primary" @click="handleStartExam(exam)"
                  >开始考试</el-button
                >
              </template>
              <el-button
                v-if="exam.status === 2"
                type="info"
                @click="handleViewResult(exam)"
                >查看结果</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
      <div v-if="filteredExams.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Document /></el-icon>
        <h3 class="empty-title">暂无考试</h3>
        <p v-if="filterStatus === -1" class="empty-description">
          当前没有任何考试信息
        </p>
        <p v-if="filterStatus === 0" class="empty-description">
          当前没有任何未开始的考试信息
        </p>
        <p v-if="filterStatus === 1" class="empty-description">
          当前没有任何进行中的考试信息
        </p>
        <p v-if="filterStatus === 2" class="empty-description">
          当前没有任何已结束的考试信息
        </p>
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Clock, RefreshRight, Document } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { myExamList, isTest } from "@/api/index";
import { useRouter } from "vue-router";

const router = useRouter();
const examList = ref([]);
const filterStatus = ref(-1);
const timer = ref(null);
const statusPriority = {
  1: 0, // 进行中 - 最高优先级
  0: 1, // 未开始 - 次高优先级
  2: 2, // 已结束 - 次低优先级
  3: 3, // 异常 - 最低优先级
};
// 根据状态过滤考试
// 修改 filteredExams 计算属性
const filteredExams = computed(() => {
  let result = [];

  examList.value.forEach((exam) => {
    if (filterStatus.value === -1 || exam.status === filterStatus.value) {
      result.push(exam);
    }

    if (exam.children && exam.children.length) {
      exam.children.forEach((childExam) => {
        if (
          filterStatus.value === -1 ||
          childExam.status === filterStatus.value
        ) {
          result.push({
            ...childExam,
            isChild: true,
            title: exam.title,
          });
        }
      });
    }
  });

  result.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  return result;
});

// 获取状态样式类
const getStatusClass = (status) => {
  return {
    "status-pending": status === 0,
    "status-ongoing": status === 1,
    "status-completed": status === 2,
    "status-error": status === 3,
  };
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: "未开始",
    1: "进行中",
    2: "已结束",
    3: "异常",
  };
  return statusMap[status] || "未知";
};

// 格式化时间范围
const formatTimeRange = (startTime, endTime) => {
  return `${dayjs(startTime).format("YYYY/MM/DD HH:mm")} - ${dayjs(
    endTime
  ).format("HH:mm")}`;
};

const hasUnfinishedExam = (examId) => {
  return !!localStorage.getItem(`exam_answers_${examId}`);
};

// 处理考试操作
const handleStartExam = async (exam) => {
  try {
    const response = await isTest({
      user_id: JSON.parse(localStorage.getItem("userInfo")).id,
      exam_id: exam.id,
    });
    if (response.code === 200) {
      router.push({
        name: "exam",
        query: {
          paperId: exam.paper_id,
          examId: exam.id,
          showAnswer: exam.show_answer,
          re_answer: exam.re_answer,
          countdown: response.data.countdown,
        },
      });
    }
  } catch (error) {
    console.error("无法参加考试:", error);
  }
};

const handleContinueExam = async (exam) => {
  try {
    const response = await isTest({
      user_id: JSON.parse(localStorage.getItem("userInfo")).id,
      exam_id: exam.id,
    });
    if (response.code === 200) {
      router.push({
        name: "exam",
        query: {
          paperId: exam.paper_id,
          examId: exam.id,
          showAnswer: exam.show_answer,
          re_answer: exam.re_answer,
          countdown: response.data.countdown,
        },
      });
    }
  } catch (error) {
    console.error("无法继续考试:", error);
  }
};

const handleViewResult = (exam) => {
  router.push({
    name: "examResult",
    query: {
      examId: exam.id,
    },
  });
};

const handleFilterChange = (value) => {
  filterStatus.value = value;
};

const fetchExamList = async () => {
  try {
    const response = await myExamList({
      user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    });
    examList.value = response.data || [];
  } catch (error) {
    console.error("获取我的考试列表失败:", error);
    examList.value = [];
  }
};

onMounted(async () => {
  await fetchExamList();
  timer.value = setInterval(async () => {
    await fetchExamList();
  }, 10000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<style lang="less" scoped>
.my-exams {
  .exam-header {
    background-color: #fff;
    min-height: 58px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .header-title {
      margin-left: 40px;
      font-weight: 600;
    }
  }

  .exam-content {
    background-color: #fff;
    padding: 30px 40px;
    min-height: calc(100vh - 140px);

    .exam-filter {
      margin-bottom: 24px;
      .el-radio-group {
        .el-radio-button__inner {
          border-radius: 20px;
          padding: 8px 24px;
        }
      }
    }

    .exam-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;

      .exam-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 24px;
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        // 未开始状态
        &:has(.status-pending) {
          border: 1px solid rgba(45, 103, 178, 0.2);
          background: linear-gradient(145deg, #ffffff, #f8faff);
          box-shadow: 0 2px 12px rgba(45, 103, 178, 0.08);

          &:hover {
            border-color: rgba(45, 103, 178, 0.4);
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 8px 24px rgba(45, 103, 178, 0.12);
          }
        }

        // 进行中状态
        &:has(.status-ongoing) {
          border: 1px solid rgba(255, 153, 0, 0.2);
          background: linear-gradient(145deg, #ffffff, #fff9f0);
          box-shadow: 0 2px 12px rgba(255, 153, 0, 0.08);

          &:hover {
            border-color: rgba(255, 153, 0, 0.4);
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 8px 24px rgba(255, 153, 0, 0.12);
          }
        }

        // 已结束状态
        &:has(.status-completed) {
          border: 1px solid rgba(103, 194, 58, 0.2);
          background: linear-gradient(145deg, #ffffff, #f6fbf3);
          box-shadow: 0 2px 12px rgba(103, 194, 58, 0.08);

          &:hover {
            border-color: rgba(103, 194, 58, 0.4);
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 8px 24px rgba(103, 194, 58, 0.12);
          }
        }

        .exam-status {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          backdrop-filter: blur(4px);

          &.status-pending {
            background: rgba(45, 103, 178, 0.1);
            color: #2d67b2;
            border: 1px solid rgba(45, 103, 178, 0.2);
          }

          &.status-ongoing {
            background: rgba(255, 153, 0, 0.1);
            color: #ff9900;
            border: 1px solid rgba(255, 153, 0, 0.2);
          }

          &.status-completed {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
            border: 1px solid rgba(103, 194, 58, 0.2);
          }
        }

        .exam-info {
          margin-top: 8px;

          .exam-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
            line-height: 1.4;
          }

          .exam-time {
            display: flex;
            align-items: center;
            text-align: center;
            color: #666;
            margin-bottom: 10px;
            font-size: 14px;

            .el-icon {
              margin-right: 8px;
              font-size: 16px;
            }
          }

          .exam-details {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .detail-item {
              display: flex;
              align-items: center;
              color: #666;
              font-size: 14px;

              .el-icon {
                margin-right: 8px;
                font-size: 16px;
              }
            }
          }
        }

        .exam-actions {
          margin-top: 20px;

          .el-button {
            border-radius: 24px;
            padding: 10px 28px;
            font-weight: 500;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
            }
          }
        }
      }
    }
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
    animation: float 3s ease-in-out infinite;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 600;
    color: #1c1c1e;
    margin-bottom: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  }

  .empty-description {
    font-size: 16px;
    color: #8e8e93;
    max-width: 300px;
    line-height: 1.5;
  }
}

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
