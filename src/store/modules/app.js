import { defineStore } from 'pinia'
import BasicLayout from '@/layout/BasicLayout.vue';
import { setAppTheme,getAppTheme,getCollapsed,setCollapsed,getCollapsedWidth,setCollapsedWidth,getAppMove,setAppMove  } from '@/utils'
export const useAppStore = defineStore('app', {
  state() {
    return {
      hashRouter: false,
      menus: [],
      routers: [],
      collapsed: getCollapsed()||false,
      darkTheme: getAppTheme()||false,
      appMove:getAppMove()||false,
      collapsedWidth:getCollapsedWidth()||0,
    }
  },
  actions: {
    initAppMove() {
      this.appMove= !this.appMove
      setAppMove(this.appMove)
    },
    initCollapsedWidth(w){
      this.collapsedWidth = w
      setCollapsedWidth(w)
    },
    switchCollapsed() {
      this.collapsed = !this.collapsed
      setCollapsed(this.collapsed)
    },
    switchDarkTheme() {
      this.darkTheme = !this.darkTheme
      setAppTheme(this.darkTheme)
    },
    USER_ROUTE({ menus, router}) {
      try {
        const modules = import.meta.glob('../../views/**/*.vue')
        const loader = (name) => modules[`../../views/${name}.vue`]
        generateDynamicRoutes('', menus, loader, router);
        // 设置首页
        const dashBoard = router.getRoutes().find(v => !v.meta.hidden && v.meta.component != '');
        if (dashBoard) {
          router.addRoute({ path: '/', name: "dashBoard", redirect: dashBoard.path })
        }
        this.hashRouter = true;
        this.menus = menus;
        return Promise.resolve('succ')
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})

// 根据菜单项生成动态路由
function generateDynamicRoutes(p, m, l, r) {
  m.forEach(menu => {
    // 模板字段
    const route = {
      name: menu.component_name || menu.name,
      path: menu.path,
      meta: {
        pid: menu.pid,
        id: menu.id,
        hidden: menu.hidden,
        iframe: menu.iframe,
        title: menu.name,
        type: menu.type,
        icon: menu.icon || '',
        layout: menu.layout,
        component: menu.component
      }
    }
    // 组件判断
    if (menu.component == "" && menu.type != 0) {
      route.component = l('pages/Building')
    } else if (menu.layout == "defautl" && menu.type == 0) {
      route.component = BasicLayout;
    } else {
      route.component = l(menu.component)?l(menu.component):l('pages/Building');
    }
    // 类型判断
    if (menu.type == 0 && menu.iframe == 0) {
      r.addRoute(route)
    }else if(menu.pid == 0 &&menu.type == 1 && menu.iframe == 0){
      r.addRoute('page',route)
    } else if (menu.type == 1 && menu.iframe == 0) {
      r.addRoute(p, route)
    }

    // 子级加载
    if (menu.children && menu.children.length > 0) {
      generateDynamicRoutes(menu.name, menu.children, l, r);
    }
  });
}
