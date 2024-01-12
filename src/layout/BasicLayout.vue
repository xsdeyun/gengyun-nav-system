<template>
  <n-layout class="layout" has-sider position="absolute">
    <!-- 侧边栏 -->
    <AppSilder/>
    <!-- #f5f7f9 -->
    <n-layout>
      <!-- header -->
      <n-layout-header class="layout-header">
        <PageHeader />
      </n-layout-header>
      <!-- header -->
      <!-- content -->
      <n-layout-content
        :class="{ 'layout-default-background': appStore.darkTheme === false }"
        content-style="padding: 10px;"
      >
        <router-view>
          <template #default="{ Component }">
            <transition name="zoom-fade" mode="out-in" appear>
              <component :is="Component" />
            </transition>
          </template>
        </router-view>
      </n-layout-content>
      <!-- content -->
    </n-layout>
  </n-layout>
</template>
<script setup>
import AppSilder from "./component/AppSilder.vue";
import PageHeader from "./component/PageHeader.vue";
import { useAppStore } from "@/store";
const appStore = useAppStore();

</script>
<style lang="scss"  scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  &-header {
    position: sticky;
    //z-index: 999;
    top: 0px;
  }

  &-default-background {
    height: calc(100% - 64px);
    background: #f5f7f9;
  }
}

// zoom-fade
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: transform 0.2s, opacity 0.3s ease-out;
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.01);
}
</style>
