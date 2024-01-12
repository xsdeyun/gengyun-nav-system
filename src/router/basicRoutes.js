import LoginView from '@/views/login/index.vue';
import BasicLayout from '@/layout/BasicLayout.vue';


/**
 * 基础路由
 * @type { *[] }
 */
const basicRoutes = [
    {
        path: '/page',
        name: "page",
        component: BasicLayout,
        hidden: true  
    },
    // 用户登录页
    {
        path: '/login',
        name: "login",
        component: LoginView,
        hidden: true
    },
    {
        path: '/userInfo',
        name: "userInfo",
        component: BasicLayout,
        hidden: true,
        children: [
            {
                path: '/info',
                name: 'info',
                component: () => import('@/views/login/userInfo.vue'),
                meta: {
                    title: 'info'
                }
            }
        ]
    },
    {
        path: '/:path(.*)*',
        name: 'ErrorPage',
        component: () => import('@/views/pages/404.vue'),
        meta: {
            title: 'ErrorPage',
            hideBreadcrumb: true,
        }
    },
    {
        path: '/redirect',
        name: 'redirect',
        component: BasicLayout,
        meta: {
            title: 'redirect'
        },
        children: [
            {
                path: '/redirect/:path(.*)',
                name: 'redirect',
                component: () => import('@/views/redirect/index.vue'),
                meta: {
                    title: 'redirect'
                },
            }
        ]
    }
]
export default basicRoutes;