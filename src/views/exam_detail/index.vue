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
        <div class="exam-title">第{{ index + 1 }}次考试</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ exam.averageScore }}</div>
            <div class="stat-label">平均分</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.passRate }}%</div>
            <div class="stat-label">通过率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.expectedStudents }}</div>
            <div class="stat-label">应参考人数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ exam.actualStudents }}</div>
            <div class="stat-label">实际参考人数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <div class="chart" ref="averageScoreChart"></div>
      <div class="chart" ref="passRateChart"></div>
      <div class="chart" ref="errorRateChart"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const averageScoreChart = ref(null);
const passRateChart = ref(null);
const errorRateChart = ref(null);
const examList = ref([
  {
    id: 1,
    averageScore: 85.5,
    passRate: 92,
    expectedStudents: 100,
    actualStudents: 98,
    errorRates: [30, 45, 25, 60, 35],
  },
  {
    id: 2,
    averageScore: 82.3,
    passRate: 88,
    expectedStudents: 100,
    actualStudents: 95,
    errorRates: [25, 40, 30, 55, 40],
  },
  {
    id: 3,
    averageScore: 87.8,
    passRate: 94,
    expectedStudents: 100,
    actualStudents: 97,
    errorRates: [20, 35, 28, 50, 30],
  },
]);

const initCharts = () => {
  // 平均分趋势图
  const averageScoreInstance = echarts.init(averageScoreChart.value);
  averageScoreInstance.setOption({
    title: { text: "考试平均分趋势" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: examList.value.map((_, index) => `第${index + 1}次`),
    },
    yAxis: {
      type: "value",
      min: 0,
    },
    series: [
      {
        data: examList.value.map((exam) => exam.averageScore),
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
      data: examList.value.map((_, index) => `第${index + 1}次`),
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
        data: examList.value.map((exam) => exam.passRate),
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
      data: examList.value.map((_, index) => `第${index + 1}次`),
    },
    xAxis: {
      type: "category",
      data: ["题目1", "题目2", "题目3", "题目4", "题目5"],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: examList.value.map((exam, index) => ({
      name: `第${index + 1}次`,
      type: "line",
      data: exam.errorRates,
    })),
  });
};

onMounted(() => {
  initCharts();
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
