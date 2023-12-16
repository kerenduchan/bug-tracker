import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'

export const authAxiosService = {
    login,
    logout,
    signup,
    getLoggedinUser,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = getBaseUrl() + 'auth/'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

async function login(user) {
    const { data: res } = await axios.post(BASE_URL + 'login', user)
    _saveLoggedinUser(res)
    return res
}

async function logout() {
    await axios.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

async function signup(user) {
    const { data: res } = await axios.post(BASE_URL + 'signup', user)
    _saveLoggedinUser(res)
    return res
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _saveLoggedinUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
}
