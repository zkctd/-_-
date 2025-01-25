<template>
  <div class="menu-content">
    <el-menu class="el-menu-vertical-demo" :default-active="activeKey" :router="true" @open="handleOpen"
      @close="handleClose" @select="handleSelect">
      <MenuTree :menuList="menuList"></MenuTree>
    </el-menu>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import MenuTree from "../components/MenuTree.vue";
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps(["menuList"]);
const router = useRouter();
const route = useRoute();

const activeKey = ref(null);
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleSelect = (selectKey) => {
  activeKey.value = selectKey;
  localStorage.setItem("activeKey", selectKey);
};
const updateMenuActive = () => {
  const active = router.currentRoute.value.path;
  if (active) {
    if (active !== localStorage.getItem("activeKey")) {
      localStorage.setItem("activeKey", active);
      activeKey.value = active;
    }
  }
};

// 手动更改url时，左侧菜单选择状态跟随改变
watchEffect(updateMenuActive);

onMounted(() => {
  activeKey.value = localStorage.getItem("activeKey");
});
</script>
<style lang="less" scoped>
.menu-content {
  height: 100%;
  background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.98) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  .el-menu {
    border-right: none;
    padding: 12px;
    background: transparent;

    &:hover {
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
      }
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
  }
}

:deep(.el-menu-item) {
  height: 50px !important;
  line-height: 50px;
  margin: 4px 0;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(64, 158, 255, 0.08) !important;
    color: var(--el-color-primary);
    transform: translateX(4px);
  }

  &.is-active {
    background: var(--el-color-primary-light-9) !important;
    color: var(--el-color-primary) !important;
    font-weight: 500;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      background: var(--el-color-primary);
      border-radius: 0 4px 4px 0;
    }
  }
}

:deep(.el-sub-menu) {
  .el-sub-menu__title {
    height: 50px !important;
    line-height: 50px;
    margin: 4px 0;
    border-radius: 8px;

    &:hover {
      background: rgba(64, 158, 255, 0.08) !important;
    }
  }

  .el-menu {
    padding-left: 12px;
    background: transparent;
  }
}

// 折叠动画
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;

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
  .menu-content {
    background: linear-gradient(180deg,
        rgba(30, 30, 30, 0.95) 0%,
        rgba(30, 30, 30, 0.98) 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.05);

    :deep(.el-menu-item) {
      color: #a8b1c2;

      &:hover {
        background: rgba(64, 158, 255, 0.15) !important;
      }

      &.is-active {
        background: rgba(64, 158, 255, 0.15) !important;
      }
    }
  }
}
</style>
