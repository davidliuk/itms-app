import axios from "axios";
import { showToast, showFailToast } from "vant";
import { setLocal } from "@/common/js/utils";
import router from "../router";

console.log("import.meta.env", import.meta.env);

// axios.defaults.baseURL =
//   import.meta.env.MODE == "development"
//     ? "//backend-api-01.newbee.ltd/api/v1"
//     : "//backend-api-01.newbee.ltd/api/v1";
axios.defaults.baseURL =
  import.meta.env.MODE == "development"
    ? "http://localhost:8201/api"
    : "//backend-api-01.newbee.ltd/api/v1";
axios.defaults.withCredentials = true;
//  axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers["token"] = localStorage.getItem("token") || "";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    showFailToast("服务端异常！");
    return Promise.reject(res);
  }
  console.log('+++++')
  console.log(res.data.hasOwnProperty("resultCode"))
  // if (res.data.hasOwnProperty("resultCode")) {
  //   if (res.data.resultCode != 200) {
  //     if (res.data.message) showFailToast(res.data.message);
  //     if (res.data.resultCode == 416) {
  //       router.push({ path: "/login" });
  //     }
  //     if (res.data.data && window.location.hash == "#/login") {
  //       setLocal("token", res.data.data);
  //       axios.defaults.headers["token"] = res.data.data;
  //     }
  //     return Promise.reject(res.data);
  //   }
  // } else {
    if (res.data.code != 200) {
      if (res.data.message) showFailToast(res.data.message);
      if (res.data.code == 208) {
        router.push({ path: "/login" });
      }
      if (res.data.data && window.location.hash == "#/login") {
        setLocal("token", res.data.data);
        axios.defaults.headers["token"] = res.data.data;
      }
      return Promise.reject(res.data);
    }
  // }

  return res.data;
});

export default axios;
