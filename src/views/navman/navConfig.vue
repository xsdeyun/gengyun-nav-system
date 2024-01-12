<template>
    <div>
      <n-card :bordered="false" size="small" class="proCard">
        <n-tabs type="line" animated @on-update="switchType(item)">
          <n-tab-pane
            :name="item.key"
            :tab="item.name"
            v-for="item in typeTabList"
            :key="item.key"
          >
          </n-tab-pane>
        </n-tabs>
      </n-card>
      <n-card
        :bordered="false"
        size="small"
        class="proCard pl-5"
      >
        <BasicSetting v-if="state.type === 1" />
      </n-card>
    </div>
  </template>
  <script setup>
  import BasicSetting from "./component/BasicSetting.vue";
  import { reactive } from "vue";
  const typeTabList = [
    {
      name: "基本设置",
      desc: "系统常规设置",
      key: 1,
    }
  ];
  const state = reactive({
    type: 1,
    typeTitle: "基本设置",
  });
  const switchType = (e) => {
    state.type = e.key;
    state.typeTitle = e.name;
  };
  </script>
  <style lang="scss" scoped>
  .thing-cell {
    margin: 0 -16px 10px;
    padding: 5px 16px;
  
    &:hover {
      background: #f3f3f3;
      cursor: pointer;
    }
  }
  
  .thing-cell-on {
    background: #f0faff;
    color: #2d8cf0;
  
    ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
      color: #2d8cf0;
    }
  
    &:hover {
      background: #f0faff;
    }
  }
  </style>