<template>
  <n-menu ref="menu" class="side-menu" accordion :indent="24" :collapsed-icon-size="20" :collapsed-width="appStore.collapsedWidth"
    :options="menuOptions" :value="selectedKeys" :inverted="true" @update:value="clickMenuItem" />
</template>
<script >
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store'
import { renderIcon } from '@/utils'

export default defineComponent({
  setup() {
    // 当前路由
    const currentRoute = useRoute();
    const router = useRouter();
    const appStore = useAppStore();
    const selectedKeys = ref(currentRoute.name);
    const menuOptions = generateMenu(appStore.menus)
    // 生成菜单项
    function generateMenu(data) {
      const menus = [];
      data.forEach(item => {
        const menu = {
          label: item.name,
          key: item.path
        };
        if (item.icon) {
          menu.icon = renderIcon(item.icon)
        }
        if (item.children && item.children.length > 0) {
          menu.children = generateMenu(item.children);
        }
        if (!item.hidden) {
          menus.push(menu);
        }
      });
      return menus;
    }

    // 点击菜单
    function clickMenuItem(key) {
      if (/http(s)?:/.test(key)) {
        window.open(key);
      } else {
        router.push({ name: key });
      }
      selectedKeys.value = key;
    }

    return {
      selectedKeys,
      appStore,
      menuOptions,
      clickMenuItem
    }
  }
})
</script>

<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }

    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}
</style>