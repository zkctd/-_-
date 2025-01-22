<template>
  <el-row class="score-up-row">
    <el-col :span="24">
      <div class="messages-title">
        <el-icon
          @click="router.back()"
          class="common-text iconfont fanhui"
        ></el-icon>
        <span
          class="common-text f-s-18"
          style="color: #333333; font-weight: 700"
          >参考详情</span
        >
      </div>
    </el-col>
  </el-row>
  <div class="exam-attendance">
    <!-- 顶部统计 -->
    <div class="stats-header">
      <div class="stat-item">
        <div class="stat-value">{{ totalStudents }}</div>
        <div class="stat-label">总人数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ attendedStudents }}</div>
        <div class="stat-label">已参加</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ absentStudents }}</div>
        <div class="stat-label">未参加</div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索考生姓名或用户名"
        prefix-icon="Search"
        clearable
      />
    </div>

    <!-- 考生卡片列表 -->
    <div class="students-grid">
      <div
        v-for="info in filteredStudents"
        :key="info.id"
        class="student-card"
        :class="{ attended: info.status === 'attended' }"
      >
        <div class="avatar">
          {{ info.name.charAt(0) }}
        </div>
        <div class="info">
          <div class="name">{{ info.name }}</div>
          <div class="student-id">{{ info.username }}</div>
          <div class="status-tag" :class="info.status">
            {{ info.status === "attended" ? "已参加" : "未参加" }}
          </div>
        </div>
        <div class="details">
          <div class="time-info" v-if="info.status === 'attended'">
            <div class="detail-item">
              <span class="label">开始时间:</span>
              <span class="value">{{ info.start_time }}</span>
            </div>
            <div class="detail-item">
              <span class="label">提交时间:</span>
              <span class="value">{{ info.created_time }}</span>
            </div>
          </div>
          <div class="progress-bar" v-if="info.status === 'attended'">
            <div
              class="progress"
              :style="{ width: info.response_rate + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { examingUser } from "@/api/index";
const router = useRouter();
const searchText = ref("");
const UserInfo = ref([]);
const route = useRoute();

const filteredStudents = computed(() => {
  return UserInfo.value
    .filter(
      (student) =>
        student.name.includes(searchText.value) ||
        student.username.includes(searchText.value)
    )
    .sort(sortByStatus); // 添加排序
});

const totalStudents = computed(() => UserInfo.value.length);
const attendedStudents = computed(
  () => UserInfo.value.filter((s) => s.status === "attended").length
);
const absentStudents = computed(
  () => UserInfo.value.filter((s) => s.status === "absent").length
);
const sortByStatus = (a, b) => {
  // 将未参加(absent)的排在前面
  if (a.status === "absent" && b.status === "attended") return -1;
  if (a.status === "attended" && b.status === "absent") return 1;
  return 0;
};
// 获取考生数据
onMounted(async () => {
  const res = await examingUser({ exam_id: route.query.id });
  UserInfo.value = res.data.sort(sortByStatus);
});
</script>

<style scoped>
.score-up-row {
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
  }
  .iconfont {
    font-size: 20px;
    color: #333333;
    cursor: pointer;
  }
}
.exam-attendance {
  padding: 24px;
  min-height: 100vh;
  background: #f5f7fa;
}

.stats-header {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  color: #666;
  margin-top: 4px;
}

.search-bar {
  margin-bottom: 24px;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
}

.student-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 50px;
  height: 50px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.student-id {
  color: #666;
  font-size: 14px;
}

.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  margin-top: 8px;
}

.status-tag.attended {
  background: #ecfdf5;
  color: #059669;
}

.status-tag.absent {
  background: #fef2f2;
  color: #dc2626;
}

.details {
  margin-top: 12px;
}

.time-info {
  font-size: 12px;
  color: #666;
}

.detail-item {
  margin-bottom: 4px;
}

.progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 8px;
}

.progress {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
  }
}
</style>
