<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <common-header />
      </el-header>
      <el-container>
        <el-aside width="240px">
          <common-aside :menuList="menuList" />
        </el-aside>
        <el-main width="calc(100vw - 240px)">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in" appear>
              <div :key="$route.path">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
import { onMounted, ref } from "vue";

const menuList = ref([]);

onMounted(() => {
  menuList.value = JSON.parse(localStorage.getItem("menuList"));
});
</script>

<style scoped>
.el-container {
  background-color: #f0f1f6;
}
.el-header {
  padding: 0;
  width: 100%;
  /* height: auto; */
  min-height: 72px;
  background: inherit;
  border: 0 none;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 1px 10px rgba(228, 228, 228, 1);
  z-index: 99;
}
.el-aside {
  min-height: calc(100vh - 72px);
  background-color: #ffffff;
  box-shadow: 1px 0 10px rgba(228, 228, 228, 1);
  z-index: 98;
}
.el-main {
  padding: 0;
  min-height: calc(100vh - 72px);
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 优化动画性能 */
.page-enter-active,
.page-leave-active {
  will-change: transform, opacity;
  /* perspective: 1000px; */
  backface-visibility: hidden;
}

/* 可选：添加模糊效果增强过渡感 */
.page-enter-from,
.page-leave-to {
  filter: blur(2px);
}

.page-enter-active {
  transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
}

.page-leave-active {
  transition-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
}
</style>
