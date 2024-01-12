<template>
  <div>
    <div class="n-layout-page-header mb-3 b-round cursor-pointer">
      <n-card :bordered="false" title="工作台" hoverable>
        <n-grid cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
          <n-gi>
            <div class="flex items-center">
              <div>
                <n-avatar
                  circle
                  :size="64"
                  :src="userStore.user?.avatar_path"
                />
              </div>
              <div>
                <p class="px-4 text-xl">
                  早安，{{ userStore.user?.nick_name }}，开始您一天的工作吧！
                </p>
                <p class="px-4 text-gray-400">
                  今日多云转晴天，15℃ - 25℃，阳光这么好记得出去散散步。
                </p>
              </div>
            </div>
          </n-gi>
          <n-gi>
            <div class="flex justify-end w-full">
              <div class="flex flex-col justify-center flex-1 text-center">
                <span class="text-secondary">菜单 / 分类</span>
                <span class="text-2xl">{{ dashData.menus }}</span>
              </div>
              <div class="flex flex-col justify-center flex-1 text-center">
                <span class="text-secondary">网址 / 链接</span>
                <span class="text-2xl">{{ dashData.links }}</span>
              </div>
              <div class="flex flex-col justify-center flex-1 text-center">
                <span class="text-secondary">访问量</span>
                <span class="text-2xl">{{ dashData.views }}</span>
              </div>
            </div>
          </n-gi>
        </n-grid>
      </n-card>
    </div>
    <n-grid x-gap="24" :cols="2">
      <n-gi>
        <n-card class="cursor-pointer b-round" title="访问量" :bordered="false" hoverable>
          <VisitAmount />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="cursor-pointer b-round" :bordered="false" hoverable>
          <img style="width:100%;height:440px;" :src="Presentation" />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script setup>
import Presentation from "@/assets/image/presentation.svg"
import VisitAmount from "./components/VisitAmount.vue";
import { initDash } from "@/api/init";
import { useUserStore } from "@/store";
import { onMounted, ref } from "vue";
const userStore = useUserStore();
const dashData = ref({});
onMounted(() => {
  initDashData();
});

const initDashData = async () => {
  const resp = await initDash();
  dashData.value = resp.data;
};
</script>
<style lang="scss" scoped>
.project-card {
  margin-right: -6px;

  &-item {
    margin: -1px;
    width: 33.333333%;
  }
}
</style>
