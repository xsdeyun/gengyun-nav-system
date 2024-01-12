<template>
  <div class="logo">
    <img :src="websiteConfig.logo" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2>
  </div>
</template>
<script setup>
import { websiteConfig } from '@/config/website.config';
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: auto;
    height: 42px;
  }

  .mr-2 {
    margin-right: 5px;
  }

  .title {
    margin: 0;
  }
}
</style>