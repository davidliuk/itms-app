import axios from '../utils/axios'

export function addAddress(params) {
  return axios.post('/api/user/address', params);
}

export function EditAddress(params) {
  return axios.put('/api/user/address', params);
}

export function DeleteAddress(id) {
  return axios.delete(`/api/user/address/${id}`);
}

//设置默认地址
export function setDefaultAddress(id) {
  return axios.delete(`/api/user/address/default/${id}`);
}

export function getAddressDetail(id) {
  return axios.get(`/api/user/address/${id}`)
}

export function getDefaultAddress() {
  return axios.get('/api/user/address/default');
}

export function getAddressList() {
  return axios.get('/api/user/address');
}



