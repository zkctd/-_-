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
            <el-radio-button value="">全部</el-radio-button>
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
              <h3 class="exam-title">{{ exam.title }}</h3>
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
              <!-- <el-button
                v-if="exam.status === 0"
                :disabled="exam.status !== 1"
                type="primary"
                @click="handleStartExam(exam)"
                color="#2D67B2"
                >开始考试</el-button
              > -->
              <el-button
                v-if="exam.status === 1"
                type="primary"
                @click="handleStartExam(exam)"
                >开始考试</el-button
              >
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
      <div v-if="filteredExams.length === 0" class="no-exams">暂无数据</div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Clock,
  CircleCheck,
  RefreshRight,
  Document,
} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { myExamList, isTest } from "@/api/index";
import { useRouter } from "vue-router";

const router = useRouter();
const examList = ref([]);
const filterStatus = ref("");
const statusPriority = {
  1: 0, // 进行中 - 最高优先级
  0: 1, // 未开始 - 次高优先级
  2: 2, // 已结束 - 次低优先级
  3: 3, // 异常 - 最低优先级
};
// 根据状态过滤考试
const filteredExams = computed(() => {
  let result = [...examList.value];
  if (filterStatus.value !== "") {
    result = result.filter((exam) => exam.status === filterStatus.value);
  }
  result.sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });

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
        },
      });
    }
  } catch (error) {
    console.error("无法参加考试:", error);
  }
};

const handleContinueExam = (exam) => {
  console.log("继续考试", exam);
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

onMounted(async () => {
  try {
    const response = await myExamList({
      user_id: JSON.parse(localStorage.getItem("userInfo")).id,
    });
    examList.value = response.data.data;
  } catch (error) {
    console.error("获取我的考试列表失败:", error);
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
    min-height: calc(100vh - 120px);

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
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        padding: 24px;
        position: relative;
        transition: all 0.3s ease;
        border: 1px solid #ebeef5;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .exam-status {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;

          &.status-pending {
            background: #e6f4ff;
            color: #2d67b2;
          }

          &.status-ongoing {
            background: #fff3e6;
            color: #ff9900;
          }

          &.status-completed {
            background: #f0f9eb;
            color: #67c23a;
          }

          &.status-error {
            background: #fef0f0;
            color: #f56c6c;
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
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;

          .el-button {
            padding: 8px 24px;
            border-radius: 20px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.no-exams {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  color: #999;
  font-size: 16px;
}
</style>
