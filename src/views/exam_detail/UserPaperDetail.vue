<template>
  <el-row class="details-up-row">
    <el-col :span="24">
      <div class="messages-title">
        <el-icon
          @click="router.back()"
          class="common-text iconfont fanhui"
        ></el-icon>
        <span
          class="common-text f-s-18"
          style="color: #333333; font-weight: 700"
          >答题详情</span
        >
      </div>
    </el-col>
  </el-row>
  <div class="answer-details">
    <el-row class="details-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 搜索表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="details-search-form"
          >
            <el-form-item prop="name" label="姓名：">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入姓名搜索"
                class="search"
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

          <!-- 详情表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />

            <el-table-column prop="score" label="成绩" width="120">
              <template #default="{ row }">
                <el-tag :type="row.score >= 60 ? 'success' : 'danger'"
                  >{{ row.score }}分</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column prop="errorRate" label="错误率" width="120">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.errorRate"
                  :color="getErrorRateColor(row.errorRate)"
                />
              </template>
            </el-table-column>

            <el-table-column prop="submitTime" label="提交时间" width="180" />

            <el-table-column prop="duration" label="答题用时" width="120">
              <template #default="{ row }"> {{ row.duration }}分钟 </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" link @click="viewDetail(row)"
                  >查看试卷详情</el-button
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
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const searchForm = ref({
  name: "",
  pageNo: 1,
  pageSize: 10,
});

const total = ref(0);

const tableData = ref([
  {
    name: "张三",
    score: 85,
    errorRate: 15,
    submitTime: "2024-01-21 14:30:00",
    duration: 45,
  },
  {
    name: "李四",
    score: 55,
    errorRate: 45,
    submitTime: "2024-01-21 15:20:00",
    duration: 60,
  },
]);

// 根据错误率返回不同颜色
const getErrorRateColor = (rate) => {
  if (rate < 20) return "#67c23a";
  if (rate < 50) return "#e6a23c";
  return "#f56c6c";
};

const searchEvtHandler = () => {
  // 调用搜索API
  fetchAnswerDetails();
};

const resetSearchForm = () => {
  searchForm.value.pageNo = 1;
  searchForm.value.name = "";
  fetchAnswerDetails();
};

const handleSizeChange = (val) => {
  searchForm.value.pageSize = val;
  fetchAnswerDetails();
};

const handleCurrentChange = (val) => {
  searchForm.value.pageNo = val;
  fetchAnswerDetails();
};

const fetchAnswerDetails = async () => {
  try {
    // 调用API获取答题详情列表
    // const response = await getAnswerDetails(searchForm.value)
    // tableData.value = response.data.records
    // total.value = response.data.total
  } catch (error) {
    console.error("获取答题详情失败:", error);
  }
};

const viewDetail = (row) => {
  router.push({
    path: "/UserPaperDetail",
    query: {
      userId: row.id,
    },
  });
};
</script>

<style lang="less" scoped>
.details-up-row {
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
.answer-details {
  background-color: #fff;

  .details-down-row {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;

    .container {
      margin: 0px 40px 0 40px;
      height: calc(100vh - 170px);
      min-height: 670px;
      display: flex;
      flex-direction: column;
      .details-search-form {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
        margin: 20px 0;

        .el-form-item {
          margin-bottom: 0;
          margin-right: 16px;
        }
        :deep(.el-pagination) {
          flex: 0 0 auto;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          height: 50px;
          padding-bottom: 15px;
        }
        :deep(.el-table) {
          flex: 1 1 auto;
          ::v-deep(thead th) {
            font-weight: 400;
            color: #333333;
          }
          ::v-deep(tr) {
            color: #333333;
          }
          ::v-deep(.el-popper) {
            max-width: 50%;
          }
        }
      }
    }
  }
}
</style>
