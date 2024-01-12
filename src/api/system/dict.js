import { request } from '@/utils'


export function dListp(params) {
    return request({
        url: '/admin/system.dict/listp',
        method: 'get',
        params: params
    })
}
export function dListz(params) {
    return request({
        url: '/admin/system.dict/listz',
        method: 'get',
        params: params
    })
}
export function dAdd(data) {
    return request({
        url: '/admin/system.dict/add',
        method: 'post',
        data: data
    })
}
export function dEdit(data) {
    return request({
        url: '/admin/system.dict/edit',
        method: 'put',
        data: data
    })
}
export function dDelete(params) {
    return request({
        url: '/admin/system.dict/del',
        method: 'delete',
        params: params
    })
}