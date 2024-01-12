import { request } from '@/utils'


export function initMenus(params) {
    return request({
        url: '/admin/login/info',
        method: 'get',
        params: params
    })
}


export function initDash() {
    return request({
        url: '/admin/index/dash',
        method: 'get'
    })
}