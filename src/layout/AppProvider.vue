<template>
    <n-config-provider :theme="store.darkTheme ? darkTheme : undefined" :theme-overrides="getThemeOverrides">
        <slot></slot>
    </n-config-provider>
</template>
<script>
import { systemConfig } from '@/config/system.config';
import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store'
import { lighten } from '@/utils'
import { darkTheme } from 'naive-ui'
export default defineComponent({
    setup() {
        const store = useAppStore();
        const getThemeOverrides = computed(() => {
            const appTheme = systemConfig.appTheme;
            const lightenStr = lighten(appTheme, 6);
            return {
                common: {
                    primaryColor: appTheme,
                    primaryColorHover: lightenStr,
                    primaryColorPressed: lightenStr,
                    primaryColorSuppl: appTheme
                },
                LoadingBar: {
                    colorLoading: appTheme
                }
            };
        });
        return {
            store,
            getThemeOverrides,
            darkTheme
        }
    }
})
</script>