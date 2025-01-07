<template>
  <div class="menu-content">
    <el-menu
        class="el-menu-vertical-demo"
        :default-active="activeKey"
        :router="true"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
    >
      <MenuTree :menuList="menuList"></MenuTree>
    </el-menu>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import MenuTree from "../components/MenuTree.vue";
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps(["menuList"])
const router = useRouter();
const route = useRoute();

const activeKey = ref(null);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleSelect = (selectKey) => {
  activeKey.value = selectKey;
  localStorage.setItem("activeKey", selectKey);
}
const updateMenuActive = () => {
  const active = router.currentRoute.value.path;
  if (active) {
    if (active !== localStorage.getItem("activeKey")) {
      localStorage.setItem("activeKey", active);
      activeKey.value = active;
    }
  }
}

// 手动更改url时，左侧菜单选择状态跟随改变
watchEffect(updateMenuActive);

onMounted(() => {
  activeKey.value = localStorage.getItem("activeKey");
})
</script>
<style lang="less" scoped>
.menu-content {
  .text {
    font-size: 14px;
    color: #555555;
    text-align: left;
    font-family: "Arial", sans-serif;
    font-weight: 400;
  }
  .el-menu {
    border-right: none;
  }
}

::v-deep(.el-sub-menu .el-menu-item) {
  height: 40px;
}
</style>
