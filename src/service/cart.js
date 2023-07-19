import axios from '../utils/axios'

export function addCart(skuId, skuNum) {
  return axios.get(`/cart/addToCart/${skuId}/${skuNum}`);
}

export function checkCart(skuId, isChecked) {
  return axios.get(`/cart/checkCart/${skuId}/${isChecked}`);
}

export function modifyCart(params) {
  return axios.put('/shop-cart', params);
}

// export function getCart(params) {
//   return axios.get('/shop-cart', { params });
// }

// 传参去掉了
export function getCart() {
  return axios.get('/cart/cartList/');
}

export function deleteCartItem(id) {
  return axios.delete(`/shop-cart/${id}`);
}

export function getByCartItemIds(userId) {
  return axios.get(`/cart/inner/getCartCheckedList/${userId}`);
}

