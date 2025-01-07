<template>
  <el-sub-menu :index="subMenuList.route">
    <template #title>
      <el-icon><span :class="subMenuList.icon"></span></el-icon>
      <span class="text">{{ subMenuList.title }}</span>
    </template>
    <template v-for="(item, key) in subMenuList.children" :key="key">
      <el-menu-item-group v-if="!item.children || !item.children.length" >
        <el-menu-item :index="item.route" :route="item.route">
          <el-icon><span></span></el-icon>
          <span class="text">{{ item.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
      <SubMenuTree v-else :subMenuList="item"></SubMenuTree>
    </template>
  </el-sub-menu>
</template>
<script setup>

const props = defineProps(["subMenuList"])

</script>
<style>

</style>