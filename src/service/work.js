import axios from '../utils/axios'



export function takeWorkOrder(orderId) {
  return axios.post(`/sys/take/${orderId}`);
}

export function takeReturnWorkOrder(orderId) {
  return axios.post(`/sys/returnTake/${orderId}`);
}

export function getWorkOrderDetail(id) {
  return axios.get(`/order/${id}`);
}

export function getOrderItemList(orderId) {
  return axios.get(`/order/auth/getOrderDetailById/${orderId}`);
}

export function getWorkOrderList(current, limit, params) {
  return axios.post(`/user/courier/inner/getTaskByCourierId/${current}/${limit}`,params);
}
// export function createOrder(params) {
//   return axios.post('/saveOrder', params);
// }

// export function getOrderDetail(id) {
//   return axios.get(`/order/${id}`);
// }

// export function cancelOrder(id) {
//   return axios.put(`/order/${id}/cancel`);
// }

// export function confirmOrder(id) {
//   return axios.put(`/order/${id}/finish`)
// }
//
// export function payOrder(params) {
//   return axios.get('/paySuccess', { params })
// }

