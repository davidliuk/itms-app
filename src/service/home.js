import axios from '../utils/axios'

// export function getHome() {
//   return axios.get('/index-infos');
// }

export function getHome() {
  return axios.get('/home/index');
}
