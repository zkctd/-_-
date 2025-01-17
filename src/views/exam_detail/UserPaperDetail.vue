<template>
  <div class="score-box">
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
            >成绩详情</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row class="score-down-row">
      <el-col :span="24">
        <div class="container">
          <!-- 成绩筛选表单 -->
          <el-form
            label-width="auto"
            ref="searchRef"
            :model="searchForm"
            class="score-search-form"
          >
            <el-form-item prop="keywords">
              <el-input
                class="search"
                v-model="searchForm.keywords"
                placeholder="请输入姓名搜索"
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
          <el-divider style="margin: 0; margin-bottom: 20px" />

          <!-- 成绩一览表格 -->
          <el-table
            :data="tableData"
            border
            :default-sort="{ prop: 'score', order: 'descending' }"
            size="large"
          >
            <el-table-column
              prop="name"
              label="姓名"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="score"
              label="成绩"
              width="100"
              sortable
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-tag
                  :type="getScoreTagType(row.score)"
                  effect="plain"
                  size="small"
                >
                  {{ row.score }}分
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="error_rate"
              label="错误率"
              width="100"
              sortable
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-tag type="danger" effect="plain" size="small">
                  {{ row.error_rate }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="submit_time"
              label="提交时间"
              width="180"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              prop="duration"
              label="答题用时"
              width="120"
              show-overflow-tooltip
              sortable
            />
            <el-table-column label="操作" min-width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" @click="viewDetail(row)" link
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
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { gradesDetail } from "@/api/index";
const router = useRouter();
const searchRef = ref();
const tableData = ref([]);
const total = ref(0);

const searchForm = ref({
  exam_id: useRoute().query.id,
  pageNo: 1,
  pageSize: 10,
});

// 获取成绩标签类型
const getScoreTagType = (score) => {
  if (score >= 90) return "success";
  if (score >= 60) return "warning";
  return "danger";
};

// 模拟获取成绩数据
const fetchScores = async () => {
  try {
    const { data } = await gradesDetail(searchForm.value);
    tableData.value = data.list;
    total.value = data.total;
  } catch (error) {
    console.error("获取成绩数据失败");
  }
  total.value = tableData.value.length;
};

// 查看试卷详情
const viewDetail = (row) => {
  // 实现查看详情逻辑
  ElMessage.info(`查看${row.name}的试卷详情`);
};

const searchEvtHandler = () => {
  fetchScores();
};

const resetSearchForm = () => {
  searchForm.value.pageNo = 1;
  searchRef.value?.resetFields();
  fetchScores();
};

const handleSizeChange = (val) => {
  searchForm.value.pageSize = val;
  fetchScores();
};

const handleCurrentChange = (val) => {
  searchForm.value.pageNo = val;
  fetchScores();
};

onMounted(() => {
  fetchScores();
});
</script>

<style lang="less" scoped>
.score-box {
  overflow: hidden;
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

  .score-down-row {
    background-color: #fff;
    .container {
      margin: 30px 40px 0 40px;
      height: calc(100vh - 170px);
      min-height: 670px;
      display: flex;
      flex-direction: column;

      .score-search-form {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;

        .search {
          width: 260px;
          img:hover {
            cursor: pointer;
          }
        }
      }

      .el-pagination {
        flex: 0 0 auto;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        height: 50px;
        padding-bottom: 15px;
      }

      .el-table {
        flex: 1 1 auto;
        border-radius: 12px;
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05);
        border: none;
        overflow: hidden;

        // 表头样式
        ::v-deep(thead th) {
          font-weight: 500;
          color: #1c1c1e;
          background-color: #ffffff;
          border-bottom: 1px solid rgba(60, 60, 67, 0.1);
          transition: background-color 0.2s;
        }

        // 表格行样式
        ::v-deep(tr) {
          color: #1c1c1e;
          transition: background-color 0.2s;

          &:hover {
            background-color: rgba(0, 122, 255, 0.05);
          }
        }
        // 单元格样式
        ::v-deep(td) {
          border-bottom: 1px solid rgba(60, 60, 67, 0.1);
        }

        // 去除表格边框
        ::v-deep(.el-table__inner-wrapper::before),
        ::v-deep(.el-table__inner-wrapper::after) {
          display: none;
        }

        // 标签样式优化
        ::v-deep(.el-tag) {
          border-radius: 6px;
          padding: 4px 8px;
          font-weight: 500;

          &.el-tag--success {
            background-color: rgba(52, 199, 89, 0.1);
            color: #34c759;
            border: none;
          }

          &.el-tag--warning {
            background-color: rgba(255, 149, 0, 0.1);
            color: #ff9500;
            border: none;
          }

          &.el-tag--danger {
            background-color: rgba(255, 59, 48, 0.1);
            color: #ff3b30;
            border: none;
          }
        }
        // 操作按钮样式
        ::v-deep(.el-button.is-link) {
          color: #007aff;
          font-weight: 500;

          &:hover {
            color: #0056b3;
          }
        }
      }
    }
  }
}

::v-deep(.el-button.is-link) {
  color: #2d67b2;
}

::v-deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: rgba(45, 103, 178, 1);
}

.el-button:focus {
  outline: none;
}
</style>
