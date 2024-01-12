import { request } from '@/utils'

export function lFavicon(params) {
    return request({
        url: '/admin/nav.links/Favicon',
        method: 'get',
        params: params
    })
}
export function lList(params) {
    return request({
        url: '/admin/nav.links/list',
        method: 'get',
        params: params
    })
}
export function lAdd(data) {
    return request({
        url: '/admin/nav.links/add',
        method: 'post',
        data: data
    })
}
export function lEdit(data) {
    return request({
        url: '/admin/nav.links/edit',
        method: 'PUT',
        data: data
    })
}
export function lDelete(params) {
    return request({
        url: '/admin/nav.links/del',
        method: 'delete',
        params: params
    })
}