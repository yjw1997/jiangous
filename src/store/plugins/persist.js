import { getToken, getRefreshToken, getUserInfo, setUserInfo, setToken, setRefreshToken, removeToken, removeUserInfo, removeRefreshToken } from '@/utils/auth'
export default store => {
    // 初始化时从Cookies获取数据 
    try {
        const token = getToken()
        const refreshToken = getRefreshToken()
        const userInfo = JSON.parse(getUserInfo())
        if (token) {
            store.commit('SET_ACCESS_TOKEN', token)
            store.commit('SET_REFRESH_TOKEN', refreshToken)
            store.commit('SET_USER_INFO', userInfo)
        }
    } catch {
        removeToken()
        removeUserInfo()
        removeRefreshToken()
    }

    // 用户状态发生变化时缓存之 
    store.subscribe((mutation) => {
        if (mutation.type === ('SET_USER_INFO')) {
            setUserInfo(mutation.payload)
        } else if (mutation.type === ('SET_ACCESS_TOKEN')) {
            setToken(mutation.payload)
        } else if (mutation.type === ('SET_REFRESH_TOKEN')) {
            setRefreshToken(mutation.payload)
        }
    })
}