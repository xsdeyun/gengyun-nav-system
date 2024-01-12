import { createRouter, createWebHashHistory } from 'vue-router'
import basicRoutes from './basicRoutes'
import { initMenus } from '@/api/init'
import { useAppStore, useUserStore } from '@/store'
import { getToken } from '@/utils'
const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes
})

async function handleRouteNavigation(to, from, next) {
  window.$loading?.start();
  const token = getToken();
  if (token) {
    if (to.path === '/login') {
      next("/");
    } else if (to.path === '/ErrorPage') {
      next();
    } else {
      const appStore = useAppStore();
      const appUserStore = useUserStore();
      if (appStore.hashRouter) {
        next();
      } else {
        try {
          const res = await initMenus({});
          const menus = res.data.menus;
          const permissions = res.data.permissions;
          appUserStore.setPermissions(permissions);
          appStore.USER_ROUTE({ menus, router });
          next(to.fullPath);
        } catch (error) {
          // 处理错误情况
          next('/ErrorPage');
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
    }
  }
}

router.beforeEach(handleRouteNavigation);

router.afterEach(() => {
  window.$loading?.finish();
})

router.onError(() => {
  window.$loading?.error()
})

export default router