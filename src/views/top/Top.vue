<template>
  <div class="dashboard-container">
    <!-- 顶部欢迎区域 -->
    <el-row class="welcome-section" align="middle" justify="start">
      <el-col :span="24">
        <div class="welcome-card">
          <div class="welcome-content">
            <div class="avatar-container">
              <el-avatar
                :size="64"
                :src="userInfo.avatar || '/images/default-avatar.png'"
                class="glass-effect"
              />
            </div>
            <div class="welcome-text">
              <h2>
                {{ userInfo.name
                }}<span class="greeting">，{{ getGreeting() }}</span>
              </h2>
              <p class="login-time">
                上次登录时间：{{ formatTime(logintime) }}
              </p>
            </div>
          </div>
          <div class="quick-stats">
            <div class="stat-item">
              <el-icon><Calendar /></el-icon>
              <span>今日日期</span>
              <strong>{{ getCurrentDate() }}</strong>
            </div>
            <div class="stat-item">
              <el-icon><Bell /></el-icon>
              <span>待办事项</span>
              <strong>{{ pendingTasks || 0 }}</strong>
            </div>
            <div v-if="userInfo.user_type === 0" class="stat-item">
              <el-icon><Document /></el-icon>
              <span>总考试数</span>
              <strong>{{ totalExams || 0 }}</strong>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 功能卡片区域 -->
    <el-row :gutter="20" class="feature-section">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        v-for="item in features"
        :key="item.id"
      >
        <div class="feature-card" @click="toRoute(item)">
          <div class="feature-icon" :class="item.color">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div class="feature-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="card-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 系统公告区域 -->
    <el-row class="announcement-section">
      <el-col :span="24">
        <div class="announcement-card">
          <div class="section-header">
            <h2>
              <el-icon><Notification /></el-icon> 系统公告
            </h2>
          </div>
          <div class="announcement-list">
            <div
              v-for="notice in announcements"
              :key="notice.id"
              class="notice-item"
            >
              <el-tag :type="notice.type" size="small">{{ notice.tag }}</el-tag>
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-date">{{ notice.date }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getMenuListData } from "@/api/auth.ts";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const usertype = Number(localStorage.getItem("usertype"));
const userInfo = ref({
  id: "",
  username: "",
  username_or_email: "",
  name: "",
  status: true,
  user_type: 1,
});
const userResourceData = ref([]);
const router = useRouter();
const logintime = ref("");
// 查询
const getUserResourceInfo = async () => {
  try {
    const response = await getMenuListData(userInfo.value.user_type);
    if (response.code === 200 && response.data) {
      console.log("response.data", response.data);
      response.data.forEach((item) => {
        if (item.name === "message") {
          userResourceData.value = userResourceData.value.concat(item);
        } else if (item.name === "netManage") {
          if (item.children && item.children.length > 0) {
            userResourceData.value = userResourceData.value.concat(item);
          }
        } else {
          if (item.children && item.children.length > 0) {
            userResourceData.value = userResourceData.value.concat(
              item.children
            );
          }
        }
      });
      userResourceData.value.forEach((item) => {
        if (item.icon === "#") {
          if (item.name === "user") {
            item.icon = "iconfont user-manage";
          } else if (item.name === "role") {
            item.icon = "iconfont role-manage";
          } else if (item.name === "approval") {
            item.icon = "iconfont approval-manage";
          } else if (item.name === "news") {
            item.icon = "iconfont news";
          }
        }
      });
      console.log("userResourceData.value", userResourceData.value);
    }
  } catch (error) {
    console.error("查询失败:", error);
  }
};
const pendingTasks = ref(0);
const totalExams = JSON.parse(localStorage.getItem("userInfo")).exams_number;
const features = computed(() => {
  return usertype === 1
    ? [
        {
          id: 1,
          title: "考试管理",
          description: "创建和管理考试内容",
          icon: "Document",
          color: "blue",
          route: "/Examination",
        },
        {
          id: 2,
          title: "题库管理",
          description: "管理试题和题库",
          icon: "Collection",
          color: "purple",
          route: "/Question",
        },
        {
          id: 3,
          title: "试卷管理",
          description: "管理和发布试卷",
          icon: "postcard",
          color: "black",
          route: "/TestPaper",
        },
        {
          id: 4,
          title: "用户管理",
          description: "管理用户和角色",
          icon: "User",
          color: "orange",
          route: "/User",
        },
        {
          id: 5,
          title: "个人中心",
          description: "管理个人信息和账号安全",
          icon: "setting",
          color: "green",
          route: "/accountSetting",
        },
      ]
    : [
        {
          id: 1,
          title: "我的考试",
          description: "参加考试和查看考试记录",
          icon: "Document",
          color: "green",
          route: "/MyExmam",
        },
        {
          id: 2,
          title: "错题集",
          description: "查看和练习错题",
          icon: "DocumentCopy",
          color: "red",
          route: "/ErrorQuestion",
        },
        {
          id: 3,
          title: "个人中心",
          description: "管理个人信息和账号安全",
          icon: "setting",
          color: "purple",
          route: "/accountSetting",
        },
      ];
});

const announcements = ref([
  {
    id: 1,
    title: "test1",
    tag: "更新",
    type: "success",
    date: "2025-01-13",
  },
  {
    id: 2,
    title: "test2",
    tag: "考试",
    type: "warning",
    date: "2025-01-15",
  },
]);

// 获取问候语
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return "";
  return new Date(time).toLocaleString();
};

// 获取当前日期
const getCurrentDate = () => {
  return new Date().toLocaleDateString();
};
onMounted(() => {
  const savedUserInfo = localStorage.getItem("userInfo");
  if (savedUserInfo) {
    Object.assign(userInfo.value, JSON.parse(savedUserInfo));
  }
  const savedLoginTime = localStorage.getItem("loginTime");
  if (savedLoginTime) {
    const loginTimeObj = JSON.parse(savedLoginTime);
    logintime.value = loginTimeObj._value;
  }
  getUserResourceInfo();
});

const toRoute = (item) => {
  if (item.name === "netManage") {
    if (item.children && item.children.length > 0) {
      router.push(item.children[0].route);
    }
  } else {
    router.push(item.route);
  }
};
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 112px);

  .welcome-section {
    margin-bottom: 24px;

    .welcome-card {
      background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

      .welcome-content {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .avatar-container {
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      }

      .welcome-text {
        h2 {
          margin: 0;
          font-size: 24px;
          color: #333;

          .greeting {
            font-size: 18px;
            color: #666;
            margin-left: 8px;
          }
        }

        .login-time {
          margin: 8px 0 0;
          color: #999;
          font-size: 14px;
        }
      }
    }

    .quick-stats {
      display: flex;
      gap: 24px;
      margin-top: 24px;

      .stat-item {
        flex: 1;
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .el-icon {
          font-size: 24px;
          color: #409eff;
          margin-bottom: 8px;
        }

        span {
          color: #666;
          font-size: 14px;
        }

        strong {
          font-size: 20px;
          color: #333;
          margin-top: 4px;
        }
      }
    }
  }

  .feature-section {
    margin-bottom: 24px;

    .feature-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      height: 140px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .card-arrow {
          right: 20px;
          opacity: 1;
        }
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        .el-icon {
          font-size: 24px;
          color: #fff;
        }

        &.blue {
          background: #409eff;
        }
        &.green {
          background: #67c23a;
        }
        &.purple {
          background: #8e44ad;
        }
        &.orange {
          background: #e6a23c;
        }
        &.black {
          background: #333;
        }
        &.red {
          background: #f56c6c;
        }
        &.yellow {
          background: #e6a23c;
        }
      }

      .feature-info {
        h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        p {
          margin: 8px 0 0;
          color: #999;
          font-size: 14px;
        }
      }

      .card-arrow {
        position: absolute;
        right: -20px;
        opacity: 0;
        transition: all 0.3s ease;
        color: #409eff;
      }
    }
  }

  .announcement-section {
    .announcement-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;

      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .notice-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .el-tag {
          margin-right: 12px;
        }

        .notice-title {
          flex: 1;
          color: #333;
        }

        .notice-date {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
}
.top-row {
  background-color: #fff;
  min-height: 100px;
  min-width: 546px;
  margin-left: 10px;
}
.top-user {
  display: flex;
  min-width: 546px;
  padding-left: 40px;
  .icon-welcome {
    padding-right: 20px;
  }
}
.userInfo {
  display: flex;
  align-items: center;
  .userRole,
  .userName {
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #555555;
    margin: 0;
    word-wrap: break-word;
  }
  .userName {
    font-family: "Arial Normal", "Arial", sans-serif;
    font-weight: 400;
    font-size: 14px;
    word-wrap: break-word;
  }
}
.logInfo {
  font-size: 12px;
  color: #555555;
  font-family: "Arial", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  p {
    margin: 0;
    margin-top: 15px;
  }
}
.icon-welcome {
  width: 3rem;
  height: 3rem;
}
.top-down-row {
  min-height: calc(100vh - 240px);
  background-color: #ffffff;
  margin-top: 10px;
  min-width: 546px;
  margin-left: 10px;
  .nav-text {
    padding: 50px 0 50px 40px;
  }
  .nav-content {
    ul {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 60px;
    }
    a {
      text-decoration: none;
    }
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
    }
    li .nav-item:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    }
    .nav-item {
      height: 60px;
      width: 60px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.1s, box-shadow 0.1s;
      span {
        color: #fff;
        font-size: 26px;
      }
    }
    .nav-title {
      color: #555555;
    }
  }
}
</style>
