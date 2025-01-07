<template>
  <el-menu-item
    v-if="!menuList.find((item) => item.route === '/top')"
    index="/top"
    key="/top"
  >
    <el-icon><span class="iconfont top"></span></el-icon>
    <span class="text">首页</span>
  </el-menu-item>
  <template v-for="(item, i) in menuList">
    <el-menu-item
      v-if="!item.children || !item.children.length"
      :index="item.route"
      :key="item.route"
      :route="item.route"
    >
      <el-icon><span :class="item.icon"></span></el-icon>
      <span class="text">{{ item.title }}</span>
    </el-menu-item>
    <SubMenuTree v-else :subMenuList="item"></SubMenuTree>
  </template>
</template>

<script setup>
import SubMenuTree from "../components/SubMenuTree.vue";
import { onMounted } from "vue";

const props = defineProps(["menuList"]);
onMounted(() => {
  console.log("menuTree", props.menuList);
});
</script>

<style></style>
