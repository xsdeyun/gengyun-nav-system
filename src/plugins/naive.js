import { computed } from 'vue';
import * as NaiveUI from 'naive-ui'
import { lighten } from '../utils'
import { systemConfig } from '@/config/system.config';
// NaiveUI 全局方法注册
const configProviderPropsRef = computed(() => {
    const appTheme = systemConfig.appTheme;
    return {
        themeOverrides: {
            common: {
                primaryColor: appTheme,
                primaryColorHover: lighten(appTheme, 6),
                primaryColorPressed: lighten(appTheme, 6),
            },
            LoadingBar: {
                colorLoading: appTheme,
            },
        }
    }

});

const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
        configProviderProps: configProviderPropsRef,
    }
);
window['$message'] = message;
window['$dialog'] = dialog;
window['$notification'] = notification;
window['$loading'] = loadingBar;


const Naive = NaiveUI.create({
    components: [
        NaiveUI.NMessageProvider,
        NaiveUI.NDialogProvider,
        NaiveUI.NLoadingBarProvider,
        NaiveUI.NNotificationProvider,
        NaiveUI.NIcon,
        NaiveUI.NInput,
        NaiveUI.NButton,
        NaiveUI.NForm,
        NaiveUI.NFormItem,
        NaiveUI.NInputNumber,
        NaiveUI.NCheckboxGroup,
        NaiveUI.NCheckbox,
        NaiveUI.NLayout,
        NaiveUI.NLayoutSider,
        NaiveUI.NLayoutHeader,
        NaiveUI.NLayoutContent,
        NaiveUI.NLayoutFooter,
        NaiveUI.NMenu,
        NaiveUI.NConfigProvider,
        NaiveUI.NSwitch,
        NaiveUI.NDropdown,
        NaiveUI.NAvatar,
        NaiveUI.NTooltip,
        NaiveUI.NTabs,
        NaiveUI.NTabPane,
        NaiveUI.NDivider,
        NaiveUI.NSpace,
        NaiveUI.NDialog,
        NaiveUI.NDataTable,
        NaiveUI.NCard,
        NaiveUI.NPagination,
        NaiveUI.NPopover,
        NaiveUI.NModal,
        NaiveUI.NRadio,
        NaiveUI.NRadioGroup,
        NaiveUI.NRadioButton,
        NaiveUI.NSelect,
        NaiveUI.NTreeSelect,
        NaiveUI.NGi,
        NaiveUI.NGrid,
        NaiveUI.NGridItem,
        NaiveUI.NTree,
        NaiveUI.NUpload,
        NaiveUI.NDivider,
        NaiveUI.NList,
        NaiveUI.NListItem,
        NaiveUI.NThing,
        NaiveUI.NFormItemGi
    ]
})
export function setupNaive(app) {
    app.use(Naive);
}