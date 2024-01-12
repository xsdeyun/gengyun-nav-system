<template>
  <div class="layout-sider-container" :class="{ appMove: appStore.appMove }">
    <div
      class="sider-mark"
      v-if="appStore.appMove"
      @click="handleAppMove"
    ></div>
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="appStore.collapsedWidth"
      :width="systemConfig.width"
      :native-scrollbar="false"
      :collapsed="appStore.collapsed"
      class="layout-sider"
      :inverted="true"
      show-trigger="bar"
      @collapse="appStore.switchCollapsed"
      @expand="appStore.switchCollapsed"
    >
      <!-- Logo -->
      <Logo :collapsed="appStore.collapsed" />
      <!-- Logo -->

      <!-- 菜单 -->
      <SideMenu />
      <!-- 菜单 -->
    </n-layout-sider>
  </div>
</template>
<script setup>
import { systemConfig } from "@/config/system.config";
import SideMenu from "../component/SideMenu.vue";
import Logo from "../component/Logo.vue";
import { useWindowSize } from "@vueuse/core";
import { useAppStore } from "@/store";
import { onMounted, onUnmounted, watch } from "vue";
const appStore = useAppStore();
const windowSize = useWindowSize();

// 初始化
onMounted(() => {
  if (windowSize.width.value <= 800) {
    if (!appStore.collapsed) {
      appStore.initAppMove();
    }
    appStore.initCollapsedWidth(0);
  } else {
    appStore.initCollapsedWidth(48);
  }
  window.addEventListener("resize", windowSize.refresh);
});

// 销毁监听
onUnmounted(() => {
  window.removeEventListener("resize", windowSize.refresh);
});

// 监听宽度
watch(windowSize.width, (newWidth) => {
  if (newWidth <= 800) {
    appStore.initCollapsedWidth(0);
    if (!appStore.collapsed && !appStore.appMove) {
      appStore.initAppMove();
    }
  } else {
    appStore.initCollapsedWidth(48);
  }
});

const handleAppMove = () => {
  appStore.initAppMove();
  appStore.initCollapsedWidth(0);
  appStore.switchCollapsed();
};
</script>
<style scoped>
.layout-sider {
  min-height: 100vh;
  position: relative;
  z-index: 13;
  transition: all 0.2s ease-in-out;
}

.sider-mark {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
  transition: all 0.2s ease-in-out;
}
@media (max-width: 800px) {
  .layout-sider-container {
    height: 100%;
    position: fixed;
    transition: all 0.2s ease-in-out;
    z-index: 100;
  }
  .appMove {
    width: 100%;
  }
}
</style>