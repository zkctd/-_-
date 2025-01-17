<template>
  <el-row class="examdetail-up-row">
    <el-col :span="24">
      <div class="messages-title">
        <el-icon
          @click="router.back()"
          class="common-text iconfont fanhui"
        ></el-icon>
        <span
          class="common-text f-s-18"
          style="color: #333333; font-weight: 700"
          >考试详情</span
        >
      </div>
    </el-col>
  </el-row>

  <div class="exam-details">
    <!-- <div class="export-section">
      <el-button type="primary" @click="exportToExcel">导出成绩报表</el-button>
    </div> -->

    <!-- 总体统计卡片 -->
    <div class="stats-cards">
      <div
        v-for="(exam, index) in examList"
        :key="index"
        class="exam-group"
        @click="
          router.push({ name: 'UserPaperDetail', query: { examId: exam.id } })
        "
      >
        <div class="exam-title">{{ getExamTitle(exam) }}</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ exam.average_score }}</div>
            <div class="stat-label">平均分</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.pass_rate }}%</div>
            <div class="stat-label">通过率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.should_num }}</div>
            <div class="stat-label">应参考人数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.actual_num }}</div>
            <div class="stat-label">实际参考人数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container" v-if="examList.length > 1">
      <div class="chart" ref="averageScoreChart"></div>
      <div class="chart" ref="passRateChart"></div>
      <div class="chart" ref="errorRateChart"></div>
    </div>
    <div
      class="charts-container"
      v-else
      style="height: calc(100vh - 530px)"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gradesCreate } from "@/api/index";
const router = useRouter();
const route = useRoute();
const averageScoreChart = ref(null);
const passRateChart = ref(null);
const errorRateChart = ref(null);
const examList = ref([]);
let averageScoreInstance = null;
let passRateInstance = null;

// 添加resize监听
const handleResize = () => {
  averageScoreInstance?.resize();
  passRateInstance?.resize();
};
const gradesCreates = async () => {
  try {
    const res = await gradesCreate({ exam_id: route.query.id });
    if (res.code === 200) {
      examList.value = res.data;
    }
  } catch (error) {
    console.error("获取考试数据失败:", error);
  }
};

const getExamTitle = (exam) => {
  if (exam.order === 1) {
    return exam.exam_title;
  }
  return `${exam.exam_title}（重考第${exam.order - 1}次）`;
};

const initCharts = () => {
  if (!examList.value || examList.value.length === 1) {
    return;
  }
  const questionCount = examList.value[0].errorRates.length;
  const questionLabels = Array.from(
    { length: questionCount },
    (_, i) => `题目${i + 1}`
  );

  // 平均分趋势图
  const averageScoreInstance = echarts.init(averageScoreChart.value);
  averageScoreInstance.setOption({
    title: { text: "考试平均分趋势" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: examList.value.map((exam) => getExamTitle(exam)),
      axisLabel: {
        interval: 0, // 强制显示所有标签
        rotate: 15, // 旋转标签
        textStyle: {
          overflow: "truncate", // 超出显示省略号
          width: 100, // 限制标签宽度
        },
        formatter: function (value) {
          if (value.length > 15) {
            return value.slice(0, 15) + "...";
          }
          return value;
        },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
    },
    series: [
      {
        data: examList.value.map((exam) => exam.average_score),
        type: "line",
        smooth: true,
        label: {
          show: true,
          position: "top",
        },
      },
    ],
  });

  // 通过率对比图
  const passRateInstance = echarts.init(passRateChart.value);
  passRateInstance.setOption({
    title: { text: "考试通过率对比" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: examList.value.map((exam) => getExamTitle(exam)),
      axisLabel: {
        interval: 0, // 强制显示所有标签
        rotate: 15, // 旋转标签
        textStyle: {
          overflow: "truncate", // 超出显示省略号
          width: 100, // 限制标签宽度
        },
        formatter: function (value) {
          if (value.length > 15) {
            return value.slice(0, 15) + "...";
          }
          return value;
        },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: [
      {
        data: examList.value.map((exam) => exam.pass_rate),
        type: "bar",
        barWidth: "40%",
        label: {
          show: true,
          position: "top",
          formatter: "{c}%",
        },
      },
    ],
  });

  // 错误率对比图
  const errorRateInstance = echarts.init(errorRateChart.value);
  errorRateInstance.setOption({
    title: { text: "各题错误率对比" },
    tooltip: { trigger: "axis" },
    legend: {
      data: examList.value.map((exam) => getExamTitle(exam)),
    },
    xAxis: {
      type: "category",
      data: questionLabels,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: examList.value.map((exam) => ({
      name: getExamTitle(exam),
      type: "line",
      data: exam.errorRates.map((rate) => 100 - rate),
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      label: {
        show: true,
        position: "top",
        formatter: "{c}%",
        fontSize: 12,
      },
    })),
  });
};
onMounted(async () => {
  await gradesCreates();
  initCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  averageScoreInstance?.dispose();
  passRateInstance?.dispose();
});
const exportToExcel = () => {
  // 导出逻辑
};
</script>

<style scoped>
.examdetail-up-row {
  background-color: #fff;
  min-height: 58px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .messages-title {
    display: flex;
    margin-left: 20px;
    gap: 20px;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #333333;
      cursor: pointer;
    }
  }
}
.exam-details {
  padding: 24px;
  background: #f8f9fa;
  overflow: hidden;
}

.stats-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 12px;
}

.exam-group {
  flex: 0 0 auto;
  width: 300px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.exam-group:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
  z-index: 1;
}

.exam-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.chart {
  height: 400px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart:last-child {
  grid-column: span 2;
}

.export-section {
  text-align: right;
}

@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart:last-child {
    grid-column: auto;
  }
}
</style>
