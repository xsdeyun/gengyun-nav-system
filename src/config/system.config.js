export const systemConfig = Object.freeze({
    // 侧边栏宽度
    width: 200,
    // 侧边栏伸缩宽度
    collapsedWidth: 64,
    // 主题颜色
    appTheme: '#2d8cf0',
    // 存储key名
    prefixKey: 'Vue_GengYunPlan_Admin_',
    // token 名称
    TOKEN_CODE: 'access_token',
    // token存储时间
    DURATION: 6 * 60 * 60,
    // 请求超时时间，毫秒（默认2分钟）
    timeout: 2 * 6000,
    user_upload_avatar:`${import.meta.env.VITE_BASE_URL}/admin/system.user/avatar`,
    apply_upload_image:`${import.meta.env.VITE_BASE_URL}/admin/system.upload/image`
});
