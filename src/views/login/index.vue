<template>
    <div class="login-view-content">
        <div class="view-account-container">
            <div class="view-account-top">
                <div class="user-account">
                    登录你的账户
                </div>
                <div class="user-register">
                    <span>没有账户？</span>
                    <n-button icon-placement="right" strong type="info" text>
                        <template #icon>
                            <n-icon>
                                <ArrowForwardCircle />
                            </n-icon>
                        </template>
                        免费注册
                    </n-button>
                </div>
            </div>
            <div class="account-tabs">
                <n-tabs type="segment" tab-style="border-radius: 5px;" :default-value="formData.tabs"
                    @before-leave="handleBeforeLeave">
                    <n-tab-pane name="accountLogin" tab="账号密码登录">
                    </n-tab-pane>
                    <n-tab-pane name="phoneLogin" tab="手机验证码登录">
                    </n-tab-pane>
                </n-tabs>
            </div>
            <div class="view-account-form">
                <n-form ref="formRef" label-placement="left" size="large" :model="formData" :rules="rules">
                    <n-form-item path="username">
                        <n-input v-model:value="formData.username" placeholder="请输入用户名" style="border-radius: 8px;">
                            <template #prefix>
                                <n-icon size="18" color="#808695">
                                    <PersonOutline />
                                </n-icon>
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item path="password">
                        <n-input v-model:value="formData.password" type="password" showPasswordOn="click"
                            placeholder="请输入密码" style="border-radius: 8px;" :input-props="{ autocomplete: 'off' }">
                            <template #prefix>
                                <n-icon size="18" color="#808695">
                                    <LockClosedOutline />
                                </n-icon>
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item class="default-color">
                        <div class="auto-login">
                            <div class="flex-initial">
                                <n-checkbox v-model:checked="formData.autoLogin">自动登录</n-checkbox>
                            </div>
                            <div class="flex-initial order-last">
                                <n-button strong text>
                                    忘记密码？
                                </n-button>
                            </div>
                        </div>
                    </n-form-item>
                    <n-form-item>
                        <n-button round type="primary" @click="handleSubmit" size="large" :loading="loading" block
                            @keydown.enter="keyDown()">
                            登录
                        </n-button>
                    </n-form-item>
                </n-form>
            </div>
            <div class="other-login">
                <n-divider title-placement="center">
                    其它登录方式
                </n-divider>
                <div class="login-btns">
                    <n-space justify="space-around">
                        <n-button strong circle>
                            <template #icon>
                                <n-icon>
                                    <LogoGithub />
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button strong circle>
                            <template #icon>
                                <n-icon>
                                    <LogoApple />
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button strong circle>
                            <template #icon>
                                <n-icon>
                                    <LogoFacebook />
                                </n-icon>
                            </template>
                        </n-button>
                    </n-space>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { LocalStorage } from '@/utils'
const userStore = useUserStore();
const router = useRouter();
const {query} = useRoute();
const loading = ref(false);
const formRef = ref();
const formData = reactive({
    tabs: 'accountLogin',
    username: '',
    password: '',
    autoLogin: false
});
// 表单检验规则
const rules = {
    username: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
};
// 检查是否记住用户 start
initLoginInfo()
function initLoginInfo() {
    const localLoginInfo = LocalStorage.get('loginInfo')
    if (localLoginInfo?.autoLogin) {
        formData.username = localLoginInfo?.username
        formData.password = localLoginInfo?.password
        formData.autoLogin = localLoginInfo?.autoLogin
    }
}
// 检查是否记住用户 end

const handleBeforeLeave = (tabName) => {
    switch (tabName) {
        case "phoneLogin":
            $message.warning("暂时停止使用！");
            return false;
        default:
            return true;
    }
}

//点击回车键登录
const keyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 100) {
        handleSubmit()
    }
}
// 提交数据
const handleSubmit = () => {
    formRef.value.validate(async (errors) => {
        if (!errors) {
            const { username, password, autoLogin } = formData;
            $message.loading('登录中...');
            loading.value = true;
            const params = {
                username,
                password,
                autoLogin
            };
            try {
                await userStore.login(params);
                $message.success('登录成功')
                if (query.redirect) {
                    const path =query.redirect;
                    Reflect.deleteProperty(query, 'redirect');
                    router.push({ path, query })
                } else {
                    router.push('/')
                }
            } finally {
                loading.value = false;
            }
        } else {
            $message.error('请填写完整信息，并且进行验证码校验');
        }
    });
}
// 初始事件
onMounted(() => {
    //绑定监听事件
    window.addEventListener('keydown', keyDown)
});
onUnmounted(() => {
    //销毁事件
    window.removeEventListener('keydown', keyDown, false)
});
</script>
  
<style>
.login-view-content .n-tabs-rail {
    background-color: #f3f7fb;
    border-radius: 10px;
    padding: 4px;
}
</style>
<style lang="scss" scoped>
.login-view-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: auto;
    background: url('@/assets/image/login_bg.png') no-repeat center;
    background-size: cover;

    .view-account-container {
        box-sizing: border-box;
        padding: 32px 50px;
        min-width: 480px;
        margin: 0 auto;
        background: #fff;
        border-radius: 20px;
    }

    .view-account-top {
        text-align: left;
        margin: 20px 0;

        .user-account {
            font-family: SourceHanSansCN_Bold;
            color: #333;
            font-size: 1.5rem;
            line-height: 30px;
            margin-bottom: 5px;
        }

        .user-register {
            span {
                opacity: .7;
                margin-right: 10px;
            }
        }
    }

    .account-tabs {
        width: 80%;
        margin-bottom: 26px;
        margin-top: 30px;
    }

    .view-account-form {
        .auto-login {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .order-last {
                button {
                    color: #999;
                }

                button:hover {
                    color: #3c9bff;
                }
            }
        }
    }
}

@media only screen and (max-width: 500px) {
    .login-view-content .view-account-container {
        min-width: 100%;
        padding: 32px 20px;
    }
}
</style>
  