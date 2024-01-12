<template>
    <div class="layout-header">
        <div class="layout-header-left">
            <div class="ml-1 layout-header-trigger layout-header-trigger-min" @click="handleCollapsed">
                <n-icon size="20" v-if="store.collapsed">
                    <MenuUnfoldOutlined />
                </n-icon>
                <n-icon size="20" v-else>
                    <MenuFoldOutlined />
                </n-icon>
            </div>
            <!-- 刷新 -->
            <div class="mr-1 layout-header-trigger layout-header-trigger-min">
                <n-icon size="20" @click="reloadPage">
                    <Reload />
                </n-icon>
            </div>
        </div>
        <div class="layout-header-right">
            <div class="layout-header-trigger layout-header-trigger-min dark-switch">
                <n-tooltip placement="bottom">
                    <template #trigger>
                        <n-switch v-model:value="darkTheme" class="dark-theme-switch" @update:value="store.switchDarkTheme">
                            <template #checked>
                                <n-icon size="14" color="#ffd93b">
                                    <SunnySharp />
                                </n-icon>
                            </template>
                            <template #unchecked>
                                <n-icon size="14" color="#ffd93b">
                                    <Moon />
                                </n-icon>
                            </template>
                        </n-switch>
                    </template>
                    <span>{{ darkTheme ? '深' : '浅' }}色主题</span>
                </n-tooltip>
            </div>
            <!-- github -->
            <div class="layout-header-trigger layout-header-trigger-min">
                <n-tooltip placement="bottom">
                    <template #trigger>
                        <n-icon size="20">
                            <LogoGithub />
                        </n-icon>
                    </template>
                    <span>Github</span>
                </n-tooltip>
            </div>
            <!--切换全屏-->
            <div class="layout-header-trigger layout-header-trigger-min">
                <n-tooltip placement="bottom">
                    <template #trigger>
                        <n-icon size="20" @click="toggleFullScreen">
                            <component :is="fullscreenIcon" />
                        </n-icon>
                    </template>
                    <span>全屏</span>
                </n-tooltip>
            </div>
            <!-- 个人中心 -->
            <div class="layout-header-trigger layout-header-trigger-min">
                <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
                    <div class="avatar">
                        <n-avatar round :src="avatarUrl">
                            <!-- <template #icon>
                                <UserOutlined />
                            </template> -->
                        </n-avatar>
                    </div>
                </n-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs, unref,computed } from 'vue';
import { useAppStore, useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router';
import { MenuUnfoldOutlined, MenuFoldOutlined, FullscreenExitOutlined, FullscreenOutlined, UserOutlined } from '@vicons/antd'
export default {
    components: { MenuUnfoldOutlined, MenuFoldOutlined, FullscreenExitOutlined, FullscreenOutlined, UserOutlined },
    setup() {
        const store = useAppStore();
        const userStore = useUserStore();
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            fullscreenIcon: 'FullscreenOutlined',
            darkTheme: store.darkTheme
        });
        const handleCollapsed=()=>{
            store.initAppMove();
            store.switchCollapsed();
        }
        const avatarUrl=computed(()=>{
            return userStore.user?.avatar_path
        })
        
        // 头像设置
        const avatarOptions = [
            {
                label: '个人设置',
                key: 1,
            },
            {
                label: '退出登录',
                key: 2,
            },
        ];

        //头像下拉菜单
        const avatarSelect = (key) => {
            switch (key) {
                case 1:
                    router.push({name:'info'});
                    break;
                case 2:
                    $dialog.warning({
                        title: '提示',
                        content: '确认退出？',
                        positiveText: '确定',
                        negativeText: '不确定',
                        onPositiveClick: () => {
                            userStore.doLogout().then(() => {
                                $message.success('成功退出登录');
                                // 移除标签页
                                router.replace({
                                    name: 'login',
                                    query: {
                                        redirect: route.fullPath,
                                    },
                                }).finally();
                            });
                        }
                    });
                    break;
            }
        };

        // 切换全屏图标
        const toggleFullscreenIcon = () =>
        (state.fullscreenIcon =
            document.fullscreenElement !== null ? FullscreenExitOutlined : FullscreenOutlined);

        // 监听全屏切换事件
        document.addEventListener('fullscreenchange', toggleFullscreenIcon);

        // 全屏切换
        const toggleFullScreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        };
        // 刷新页面
        const reloadPage = () => {
            router.push({
                path: '/redirect' + unref(route).fullPath,
            });
        };
        return {
            ...toRefs(state),
            store,
            userStore,
            avatarOptions,
            avatarSelect,
            toggleFullScreen,
            reloadPage,
            avatarUrl,
            handleCollapsed
        }
    }
}
</script>
<style lang="scss" scoped>
.layout-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 64px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
        display: flex;
        align-items: center;
        justify-content: center;

        .ml-1 {
            margin-left: .25rem;
        }

        .mr-1 {
            margin-right: .25rem;
        }
    }

    &-right {
        display: flex;
        align-items: center;
        margin-right: 20px;

        .avatar {
            display: flex;
            align-items: center;
            height: 64px;
        }

        >* {
            cursor: pointer;
        }
    }

    &-trigger {
        display: inline-block;
        width: 64px;
        height: 64px;
        line-height: 64px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        .n-icon {
            display: flex;
            align-items: center;
            height: 64px;
            line-height: 64px;
        }

        &:hover {
            background: hsla(0, 0%, 100%, 0.08);
        }

        .anticon {
            font-size: 16px;
            color: #515a6e;
        }
    }

    &-trigger-min {
        width: auto;
        padding: 0 12px;
    }

    .dark-switch .n-switch {
        ::v-deep(.n-switch__rail) {
            background-color: #000e1c;
        }
    }
}
</style>