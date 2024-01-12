import { request } from '@/utils'


export function mList(params) {
    return request({
        url: '/admin/system.menus/list',
        method: 'get',
        params: params
    })
}
export function mAdd(data) {
    return request({
        url: '/admin/system.menus/add',
        method: 'post',
        data: data
    })
}
export function mEdit(data) {
    return request({
        url: '/admin/system.menus/edit',
        method: 'PUT',
        data: data
    })
}
export function mDelete(params) {
    return request({
        url: '/admin/system.menus/del',
        method: 'delete',
        params: params
    })
}