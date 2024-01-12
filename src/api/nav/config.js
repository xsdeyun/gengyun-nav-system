import { request } from '@/utils'


export function cFind(params) {
    return request({
        url: '/admin/nav.config/find',
        method: 'get',
        params: params
    })
}
export function cAdd(data) {
    return request({
        url: '/admin/nav.config/add',
        method: 'post',
        data: data
    })
}