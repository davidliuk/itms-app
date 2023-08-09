import axios from '../utils/axios'

export function getUserInfo() {
  return axios.get('/user/info');
}

export function EditUserInfo(params) {
  return axios.put('/user/info', params);
}

export function login(params) {
  return axios.post('/user/login/password', params);
}

export function loginEmail(params) {
  return axios.post('/user/login/email', params);
}

export function logout() {
  return axios.post('/user/logout')
}

export function register(params) {
  return axios.post('/user/register', params);
}

export function sendCode(params) {
  return axios.post('/user/email/send', params);
}