import { defineStore } from 'pinia'
import { removeToken, setToken, LocalStorage } from '@/utils'
import { userLogin } from '@/api/login'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: LocalStorage.get('userInfo'),
        permissions: []
    }),
    getters: {
        userId: state => state.user?.id,
        name: state => state.user?.username,
        avatar: state => state.user?.avatarPath,
        getPermissions: state => state?.permissions
    },
    actions: {
        setPermissions(val) {
            this.permissions = val;
        },
        // 登录
        async login(params) {
            try {
                if (params.autoLogin) {
                    LocalStorage.set('LoginInfo', params);
                } else {
                    LocalStorage.remove('LoginInfo');
                }
                const response = await userLogin(params);
                if (response.code == 200) setToken(response.data.token), LocalStorage.set('userInfo', response.data.user), this.user = response.data.user;
                return Promise.resolve(response);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        // 退出
        async doLogout() {
            removeToken();
            LocalStorage.remove('userInfo');
        }
    }
})