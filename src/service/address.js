import axios from '../utils/axios'

export function addAddress(params) {
  return axios.post('/user/address', params);
}

export function EditAddress(params) {
  return axios.put('/user/address', params);
}

export function DeleteAddress(id) {
  return axios.delete(`/user/address/${id}`);
}

//设置默认地址
export function setDefaultAddress(id) {
  return axios.delete(`/user/address/default/${id}`);
}

export function getAddressDetail(id) {
  return axios.get(`/user/address/${id}`)
}

export function getDefaultAddress() {
  return axios.get('/user/address/default');
}

export function getAddressList() {
  return axios.get('/user/address');
}



