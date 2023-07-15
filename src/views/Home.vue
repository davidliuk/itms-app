<template>
  <div>
    <header class="home-header wrap" :class="{ active: state.headerScroll }">
      <router-link tag="i" to="./category">
        <i class="nbicon nbmenu2"></i>
      </router-link>
      <div class="header-search" @click="router.push({ path: '/product-list?from=home' })">
        <img src="/src/assets/logo.svg" style="padding-left: 10px;"/>
        <span class="app-name">iTMS</span>
        <i class="iconfont icon-search"></i>
        <router-link
          tag="span"
          class="search-title"
          to="./product-list?from=home"
        />
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!state.isLogin">
        登录
      </router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
    </header>
    <nav-bar />
    <swiper :list="state.newSkuList"></swiper>
    <div class="category-wrapper">
      <div class="category-list">
        <div
          v-for="item in state.categoryList"
          v-bind:key="item.categoryId"
          @click="tips"
        >
          <img :src="item.imgUrl" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="good" v-if="state.newPersonSkuList.length != 0">
      <header class="good-header">新人专享</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in state.newSkuList"
            :key="item.id"
            @click="goToDetail(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.title }}</div>
              <div class="price">¥ {{ item.price }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good">
      <header class="good-header">新品上线</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in state.newSkuList"
            :key="item.id"
            @click="goToDetail(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.skuName }}</div>
              <div class="price-desc">
                <div class="price-yuan">¥</div>
                <div class="price">{{ Math.floor(item.price) }}</div>
                <div class="price-yuan">{{ (item.price % 1).toFixed(2).substring(1, 4) }}</div>
                <div class="market-price">&nbsp; &nbsp; 市场价</div>
                <div class="market-price">&nbsp; ¥ {{ item.marketPrice.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in state.hotSkuList"
            :key="item.id"
            @click="goToDetail(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.title }}</div>
              <div class="price">¥ {{ item.price.toFixed(2) }}</div>
              
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good" :style="{ paddingBottom: '100px' }">
      <header class="good-header">最新推荐</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in state.recommends"
            :key="item.id"
            @click="goToDetail(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.title }}</div>
              <div class="price">¥ {{ item.price }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import swiper from "@/components/Swiper.vue";
import navBar from "@/components/NavBar.vue";
import { getHome } from "@/service/home";
import { getLocal } from "@/common/js/utils";
import { showLoadingToast, closeToast, showToast } from "vant";
import { useCartStore } from "@/stores/cart";
const cart = useCartStore();
const router = useRouter();
const state = reactive({
  swiperList: [], // 轮播图列表
  isLogin: false, // 是否已登录
  headerScroll: false, // 滚动透明判断
  hotSkuList: [],
  newPersonSkuList: [],
  newSkuList: [],
  recommends: [],
  categoryList: [
    {
      name: "灵创超市",
      imgUrl:
        "https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png",
      categoryId: 100001,
    },
    {
      name: "灵创服饰",
      imgUrl:
        "https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png",
      categoryId: 100003,
    },
    // {
    //   name: "全球购",
    //   imgUrl:
    //     "https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png",
    //   categoryId: 100002,
    // },
    {
      name: "灵创生鲜",
      imgUrl:
        "https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png",
      categoryId: 100004,
    },
    {
      name: "灵创到家",
      imgUrl:
        "https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png",
      categoryId: 100005,
    },
    // {
    //   name: "充值缴费",
    //   imgUrl:
    //     "https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png",
    //   categoryId: 100006,
    // },
    // {
    //   name: "9.9元拼",
    //   imgUrl: "https://s.yezgea02.com/1604041127880/9.9%402x.png",
    //   categoryId: 100007,
    // },
    // {
    //   name: "领劵",
    //   imgUrl:
    //     "https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png",
    //   categoryId: 100008,
    // },
    // {
    //   name: "省钱",
    //   imgUrl:
    //     "https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png",
    //   categoryId: 100009,
    // },
    {
      name: "全部",
      imgUrl:
        "https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png",
      categoryId: 100010,
    },
  ],
  loading: true,
});
onMounted(async () => {
  const token = getLocal("token");
  if (token) {
    state.isLogin = true;
    // 获取购物车数据.
    cart.updateCart();
  }
  showLoadingToast({
    message: "加载中...",
    forbidClick: true,
  });
  const { data } = await getHome();
  if (data == null) {
    data = toData;
  }
  state.swiperList = data.carousels;
  state.newSkuList = data.newSkuList;
  if (state.newSkuList != null && state.newSkuList.length % 2 == 1) {
    state.newSkuList.pop();
  }
  state.hotSkuList = data.hotGoodses;
  state.recommends = data.recommendGoodses;
  state.loading = false;
  closeToast();
});

const toData = {
    "newSkuList": [
        {
            "id": 13,
            "createTime": "2021-08-14 05:51:50",
            "updateTime": "2023-04-12 21:23:47",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "蔬菜拼盘",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/shucaipingpan.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 0,
            "sort": 13,
            "skuCode": "0013",
            "price": 50,
            "marketPrice": 70,
            "skuWareList": null
        },
        {
            "id": 12,
            "createTime": "2021-08-14 05:28:16",
            "updateTime": "2023-04-12 21:23:02",
            "param": {},
            "categoryId": 2,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "橘子",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/juzi.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 0,
            "sort": 12,
            "skuCode": "0012",
            "price": 7,
            "marketPrice": 8,
            "skuWareList": null
        },
        {
            "id": 11,
            "createTime": "2021-08-14 05:26:30",
            "updateTime": "2023-04-25 03:36:33",
            "param": {},
            "categoryId": 2,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "苹果",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/pngguo.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 0,
            "sort": 11,
            "skuCode": "0011",
            "price": 5,
            "marketPrice": 7,
            "skuWareList": null
        },
        {
            "id": 10,
            "createTime": "2021-08-14 05:02:56",
            "updateTime": "2023-04-25 04:36:23",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "南瓜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/nangua.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 10,
            "skuCode": "555667",
            "price": 5,
            "marketPrice": 4,
            "skuWareList": null
        },
        {
            "id": 6,
            "createTime": "2021-06-06 02:13:46",
            "updateTime": "2023-04-26 21:39:32",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "丝瓜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/sigua.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 6,
            "skuCode": "0006",
            "price": 3.6,
            "marketPrice": 4.5,
            "skuWareList": null
        },
        {
            "id": 5,
            "createTime": "2021-06-06 02:10:56",
            "updateTime": "2023-04-25 05:34:26",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "土豆",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/tudou.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 5,
            "skuCode": "0005",
            "price": 5.3,
            "marketPrice": 5.9,
            "skuWareList": null
        },
        {
            "id": 4,
            "createTime": "2021-06-06 02:09:42",
            "updateTime": "2023-07-13 10:12:11",
            "param": {},
            "categoryId": 2,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "大蒜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/dasuan.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 0,
            "sort": 4,
            "skuCode": "0004",
            "price": 5.5,
            "marketPrice": 7.8,
            "skuWareList": null
        },
        {
            "id": 3,
            "createTime": "2021-06-06 02:05:57",
            "updateTime": "2023-04-24 19:46:13",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "四季豆",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/sijidou.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 0,
            "sort": 3,
            "skuCode": "0003",
            "price": 3.5,
            "marketPrice": 4.1,
            "skuWareList": null
        }
    ],
    "newPersonSkuList": [
        {
            "id": 5,
            "createTime": "2021-06-06 02:10:56",
            "updateTime": "2023-04-25 05:34:26",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "土豆",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/tudou.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 5,
            "skuCode": "0005",
            "price": 5.3,
            "marketPrice": 5.9,
            "skuWareList": null
        },
        {
            "id": 6,
            "createTime": "2021-06-06 02:13:46",
            "updateTime": "2023-04-26 21:39:32",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "丝瓜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/sigua.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 6,
            "skuCode": "0006",
            "price": 3.6,
            "marketPrice": 4.5,
            "skuWareList": null
        },
        {
            "id": 10,
            "createTime": "2021-08-14 05:02:56",
            "updateTime": "2023-04-25 04:36:23",
            "param": {},
            "categoryId": 1,
            "attrGroupId": 1,
            "supplierId": 0,
            "supplierName": 0,
            "skuType": 0,
            "skuName": "南瓜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/nangua.jpg",
            "perLimit": 5,
            "publishStatus": 1,
            "checkStatus": 1,
            "isNewPerson": 1,
            "sort": 10,
            "skuCode": "555667",
            "price": 5,
            "marketPrice": 4,
            "skuWareList": null
        }
    ],
    "hotSkuList": [
        {
            "id": 1,
            "keyword": "西红柿,新鲜蔬菜",
            "skuType": 0,
            "isNewPerson": 0,
            "categoryId": 1,
            "categoryName": "新鲜蔬菜",
            "imgUrl": "https://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/xihongshi.jpg",
            "title": "西红柿",
            "price": 2.2,
            "stock": null,
            "sale": null,
            "wareId": null,
            "perLimit": 5,
            "hotScore": 0,
            "ruleList": null
        }
    ],
    "categoryList": [
        {
            "id": 1,
            "createTime": "2021-06-06 01:36:18",
            "updateTime": "2023-04-12 21:35:08",
            "param": {},
            "name": "新鲜蔬菜",
            "imgUrl": "\r\nhttps://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/xinxianshucai.jpg",
            "parentId": null,
            "status": null,
            "sort": 1
        },
        {
            "id": 2,
            "createTime": "2021-06-06 01:36:45",
            "updateTime": "2023-04-12 21:35:57",
            "param": {},
            "name": "时令水果",
            "imgUrl": "\r\nhttps://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/shilingshuiguo.jpg",
            "parentId": null,
            "status": null,
            "sort": 2
        },
        {
            "id": 3,
            "createTime": "2021-06-06 01:37:22",
            "updateTime": "2023-04-12 21:35:57",
            "param": {},
            "name": "肉禽蛋品",
            "imgUrl": "\r\nhttps://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/rouqindanpin.jpg",
            "parentId": null,
            "status": null,
            "sort": 3
        },
        {
            "id": 4,
            "createTime": "2021-06-06 01:37:42",
            "updateTime": "2023-04-12 21:35:57",
            "param": {},
            "name": "海鲜水产",
            "imgUrl": "\r\nhttps://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/haixianshuichan.jpg",
            "parentId": null,
            "status": null,
            "sort": 4
        },
        {
            "id": 5,
            "createTime": "2021-06-06 01:38:07",
            "updateTime": "2023-04-12 21:35:08",
            "param": {},
            "name": "速食冻品",
            "imgUrl": "\r\nhttps://ssyx-guigu.oss-cn-beijing.aliyuncs.com/img/sudongshuiping.jpg",
            "parentId": null,
            "status": null,
            "sort": 5
        },
        {
            "id": 6,
            "createTime": "2021-06-06 01:39:14",
            "updateTime": "2021-08-28 18:38:01",
            "param": {},
            "name": "乳品烘焙",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8n6AAjUDAABTGU1xPxg840.png",
            "parentId": null,
            "status": null,
            "sort": 6
        },
        {
            "id": 7,
            "createTime": "2021-06-06 01:39:37",
            "updateTime": "2021-08-28 18:37:37",
            "param": {},
            "name": "面包蛋糕",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8uiAcQ9XAACQof4kpis981.png",
            "parentId": null,
            "status": null,
            "sort": 7
        },
        {
            "id": 8,
            "createTime": "2021-06-06 01:40:05",
            "updateTime": "2021-08-28 18:38:02",
            "param": {},
            "name": "酒饮冲调",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8n6AAjUDAABTGU1xPxg840.png",
            "parentId": null,
            "status": null,
            "sort": 8
        },
        {
            "id": 9,
            "createTime": "2021-06-06 01:40:33",
            "updateTime": "2021-08-28 18:37:54",
            "param": {},
            "name": "休闲零食",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8qaAUO2FAADL_iNj45o145.png",
            "parentId": null,
            "status": null,
            "sort": 10
        },
        {
            "id": 10,
            "createTime": "2021-06-06 01:40:51",
            "updateTime": "2021-08-28 18:36:57",
            "param": {},
            "name": "粮油调味",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8rqAdCTUAACvSp6ekiU197.png",
            "parentId": null,
            "status": null,
            "sort": 10
        },
        {
            "id": 11,
            "createTime": "2021-06-06 01:41:06",
            "updateTime": "2021-08-28 18:37:55",
            "param": {},
            "name": "日用百货",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8qaAUO2FAADL_iNj45o145.png",
            "parentId": null,
            "status": null,
            "sort": 11
        },
        {
            "id": 12,
            "createTime": "2021-06-06 01:41:25",
            "updateTime": "2021-08-28 18:37:40",
            "param": {},
            "name": "鲜花宠物",
            "imgUrl": "http://47.93.148.192:8080/group1/M00/01/95/rBHu8mEq8uiAcQ9XAACQof4kpis981.png",
            "parentId": null,
            "status": null,
            "sort": 12
        }
    ],
    "addressVo": null
}

nextTick(() => {
  document.body.addEventListener("scroll", () => {
    let scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    scrollTop > 100
      ? (state.headerScroll = true)
      : (state.headerScroll = false);
  });
});

const goToDetail = (item) => {
  router.push({ path: `/product/${item.id}` });
};

const tips = () => {
  showToast("敬请期待");
};
</script>

<style lang="less" scoped>
@import "../common/style/mixin";
.home-header {
  position: fixed;
  left: 0;
  top: 0;
  .wh(100%, 50px);
  .fj();
  line-height: 50px;
  padding: 0 15px;
  .boxSizing();
  font-size: 15px;
  color: #fff;
  z-index: 10000;
  .nbmenu2 {
    color: @primary;
  }
  &.active {
    background: @primary;
    .nbmenu2 {
      color: #fff;
    }
    .login {
      color: #fff;
    }
  }

  .header-search {
    display: flex;
    width: 74%;
    line-height: 20px;
    margin: 10px 0;
    padding: 5px 0;
    color: #232326;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    .app-name {
      padding: 0 10px;
      color: @primary;
      font-size: 20px;
      font-weight: bold;
      border-right: 1px solid #666;
    }
    .icon-search {
      padding: 0 10px;
      font-size: 17px;
    }
    .search-title {
      font-size: 12px;
      color: #666;
      line-height: 21px;
    }
  }
  .icon-iconyonghu {
    color: #fff;
    font-size: 22px;
  }
  .login {
    color: @primary;
    line-height: 52px;
    .van-icon-manager-o {
      font-size: 20px;
      vertical-align: -3px;
    }
  }
}
.category-wrapper {
  margin: 10px 10px;
}
.category-list {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 13px;
  background: white;
  border-radius: 20px;
  div {
    display: flex;
    flex-direction: column;
    width: 20%;
    text-align: center;
    img {
      // .wh(36px, 36px);
      width: 36px;
      height: 36px;
      object-fit: cover;
      margin: 13px auto 8px auto;
    }
  }
}
.good {
  .good-header {
    // background: #f9f9f9;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: @primary;
    font-size: 16px;
    font-weight: 500;
  }
  .good-box {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 5px 5px;
    .good-item {
      box-sizing: border-box;
      border-radius: 20px;
      background: white;
      width: 48%;
      // border-bottom: 1px solid #e9e9e9;
      margin-bottom: 10px;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 160px;
        object-fit: cover;
        // width: 120px;
        margin: 0 auto;
      }
      .good-desc {
        // text-align: center;
        font-size: 14px;
        height: 80px;
        padding: 10px 10px;
        .title {
          color: #222333;
          font-weight: bold;
        }
        .price-desc {
          margin-top: 10px;
          display: flex;
          // justify-content: space-between;
          // vertical-align: text-bottom;
          align-items: flex-end;
          .price-yuan {
            font-size: 12px;
            color: @orange;
            font-weight: bold;
          }
          .price {
            font-size: 18px;
            color: @orange;
            font-weight: bold;
          }
          .market-price {
            color: #999;
            font-size: 12px;
            // padding-left: 10px;
          }
        }
      }
      // &:nth-child(2n + 1) {
      //   // border-right: 1px solid #e9e9e9;
      //   margin-right: 2.5px;
      // }
      // &:nth-child(2n) {
      //   // border-right: 1px solid #e9e9e9;
      //   margin-left: 2.5px;
      // }
    }
  }
}
.floor-list {
  width: 100%;
  padding-bottom: 50px;
  .floor-head {
    width: 100%;
    height: 40px;
    background: #f6f6f6;
  }
  .floor-content {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    .boxSizing();
    .floor-category {
      width: 50%;
      padding: 10px;
      border-right: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
      .boxSizing();
      &:nth-child(2n) {
        border-right: none;
      }
      p {
        font-size: 17px;
        color: #333;
        &:nth-child(2) {
          padding: 5px 0;
          font-size: 13px;
          color: @primary;
        }
      }
      .floor-products {
        .fj();
        width: 100%;
        img {
          .wh(65px, 65px);
        }
      }
    }
  }
}
</style>
