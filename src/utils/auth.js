import Cookies from 'js-cookie'

const TokenKey = 'token'
const RefreshToken = 'refreshToken'
const UserInfoKey = 'userInfo'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}




export function getRefreshToken () {
  return Cookies.get(RefreshToken)
}

export function setRefreshToken (token) {
  return Cookies.set(RefreshToken, token)
}

export function removeRefreshToken () {
  return Cookies.remove(RefreshToken)
}

export function getUserInfo () {
  return Cookies.get(UserInfoKey)
}

export function setUserInfo (userInfo) {
  return Cookies.set(UserInfoKey, userInfo)
}

export function removeUserInfo () {
  return Cookies.remove(UserInfoKey)
}


