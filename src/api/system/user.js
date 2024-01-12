import { request } from '@/utils'


export function uList(params) {
    return request({
        url: '/admin/system.user/list',
        method: 'get',
        params: params
    })
}
export function uAdd(data) {
    return request({
        url: '/admin/system.user/add',
        method: 'post',
        data: data
    })
}
export function uEdit(data) {
    return request({
        url: '/admin/system.user/edit',
        method: 'PUT',
        data: data
    })
}
export function uState(params) {
    return request({
        url: '/admin/system.user/state',
        method: 'get',
        params: params
    })
}
export function updatePass(data) {
    return request({
        url: '/admin/system.user/updatePass',
        method: 'put',
        data: data
    })
}
export function uDelete(params) {
    return request({
        url: '/admin/system.user/del',
        method: 'delete',
        params: params
    })
}