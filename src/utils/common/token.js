import { LocalStorage } from '@/utils'
import { systemConfig } from '@/config/system.config';

const TOKEN_CODE = systemConfig.TOKEN_CODE
const DURATION = systemConfig.DURATION

export function getToken() {
  return LocalStorage.get(TOKEN_CODE)
}

export function setToken(token) {
  LocalStorage.set(TOKEN_CODE, token, DURATION)
}

export function removeToken() {
  LocalStorage.remove(TOKEN_CODE)
}

export function getCollapsed() {
  return LocalStorage.get('Collapsed')
}

export function setCollapsed(val) {
  LocalStorage.set('Collapsed', val, DURATION)
}

export function getCollapsedWidth() {
  return LocalStorage.get('CollapsedWidth')
}

export function setCollapsedWidth(val) {
  LocalStorage.set('CollapsedWidth', val, DURATION)
}


export function setAppTheme(val) {
  LocalStorage.set('AppTheme', val, DURATION)
}

export function getAppTheme() {
  return LocalStorage.get('AppTheme')
}

export function getAppMove() {
  return LocalStorage.get('AppMove')
}

export function setAppMove(val) {
  LocalStorage.set('AppMove', val, DURATION)
}

