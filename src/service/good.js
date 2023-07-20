import axios from '../utils/axios'

// export function getDetail(id) {
//   return axios.get(`/goods/detail/${id}`);
// }
export function getDetail(id) {
  return axios.get(`/product/skuInfo/${id}`);
}

// export function getCategory() {
//   return axios.get('/categories');
// }
export function getCategory() {
  return axios.get('/product/findAllList');
}

// export function search(params) {
//   return axios.get('/search', { params });
// }

export function search(page, limit, params) {
  return axios.post(`/search/sku/${page}/${limit}`, params);
}
