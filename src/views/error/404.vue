<template>
  <el-result title="404" class="result-box" sub-title="抱歉，画面找不到">
    <template #icon>
      <el-image src="/images/common/404.png" />
    </template>
    <template #extra>
      <el-button type="primary" @click="goBack()" color="#2d67b2">返回首页</el-button>
    </template>
  </el-result>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goBack = () => {
  router.push('/top'); // 返回首页
};
</script>
<style lang="less" scoped>
.result-box {
  margin-top: 40px;
}
</style>
