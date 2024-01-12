import { request } from '@/utils'


export function userLogin(data) {
    return request({
        url: '/admin/login/login',
        method: 'post',
        data: data
    })
}