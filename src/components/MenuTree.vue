<template>
  <el-menu-item
    v-if="!menuList.find((item) => item.route === '/top')"
    index="/top"
    key="/top"
    class="menu-item"
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
      class="menu-item"
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
  // console.log("menuTree", props.menuList);
});
</script>

<style lang="less" scoped>
:deep(.el-menu) {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 8px 0;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:not(.is-active) {
    background: transparent !important;
  }

  &:hover {
    background: rgba(64, 158, 255, 0.1) !important;
    transform: translateX(4px);
  }

  &.is-active {
    background: linear-gradient(90deg, #409eff 0%, #79bbff 100%);
    color: white !important;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

    .el-icon {
      color: white !important;
    }

    &:hover {
      transform: translateX(4px);
      background: linear-gradient(90deg, #409eff 0%, #79bbff 100%) !important;
    }
  }

  .el-icon {
    font-size: 18px;
    margin-right: 12px;
    transition: all 0.3s ease;
  }

  .text {
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .iconfont {
    font-size: 16px;
  }
}

:deep(.el-sub-menu) {
  .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
    margin: 8px 0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(64, 158, 255, 0.1) !important;
      transform: translateX(4px);
    }
  }

  .el-menu {
    padding-left: 8px;
    background: transparent;
  }
}

// 添加折叠动画
.el-menu-vertical:not(.el-menu--collapse) {
  .el-menu-item,
  .el-sub-menu__title {
    animation: slideIn 0.3s ease-out;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  :deep(.el-menu-item) {
    color: #a8b1c2;

    &:hover {
      background: rgba(64, 158, 255, 0.15) !important;
    }

    &.is-active {
      background: linear-gradient(90deg, #409eff 0%, #79bbff 100%);
      color: white !important;
    }
  }
}
</style>
