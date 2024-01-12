import { request } from '@/utils'


export function mList(params) {
    return request({
        url: '/admin/nav.menus/list',
        method: 'get',
        params: params
    })
}
export function mAdd(data) {
    return request({
        url: '/admin/nav.menus/add',
        method: 'post',
        data: data
    })
}
export function mEdit(data) {
    return request({
        url: '/admin/nav.menus/edit',
        method: 'PUT',
        data: data
    })
}
export function mDelete(params) {
    return request({
        url: '/admin/nav.menus/del',
        method: 'delete',
        params: params
    })
}