import { request } from '@/utils'


export function rList(params) {
    return request({
        url: '/admin/system.roles/list',
        method: 'get',
        params: params
    })
}
export function rAdd(data) {
    return request({
        url: '/admin/system.roles/add',
        method: 'post',
        data: data
    })
}
export function rEdit(data) {
    return request({
        url: '/admin/system.roles/edit',
        method: 'PUT',
        data: data
    })
}
export function rState(params) {
    return request({
        url: '/admin/system.roles/state',
        method: 'get',
        params: params
    })
}
export function rDelete(params) {
    return request({
        url: '/admin/system.roles/del',
        method: 'delete',
        params: params
    })
}
export function getIdRoles(params){
    return request({
        url: '/admin/system.roles/getIdRoles',
        method: 'get',
        params: params
    })
}
export function updateIdRoles(params){
    return request({
        url: '/admin/system.roles/updateIdRoles',
        method: 'get',
        params: params
    })
}