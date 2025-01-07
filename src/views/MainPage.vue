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
          <router-view></router-view>
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
})
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
</style>
