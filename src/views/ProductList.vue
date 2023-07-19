<template>
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goBack"></i>
        <div class="header-search">
          <!-- <i class="nbicon nbSearch"></i> -->
          <van-icon  class="nbSearch"
            name="search" 
          />
          <input type="text" class="search-title" v-model="state.keyword" @keydown.enter="getSearch"/>
        </div>
        <span class="search-btn" @click="getSearch">搜索</span>
      </header>
      <!-- <van-tabs type="card" color="#1baeae" @click-tab="changeTab"> -->
      <van-tabs
        class="custom-tabs"
        type="line"
        color="#1baeae"
        @click-tab="changeTab"
      >
        <van-tab title="推荐" name=""></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="价格" name="price"></van-tab>
      </van-tabs>
    </div>
    <div class="content">
      <van-pull-refresh
        v-model="state.refreshing"
        @refresh="onRefresh"
        class="product-list-refresh"
      >
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="
            state.productList.length ? '没有更多了' : '搜索想要的商品'
          "
          @load="onLoad"
          @offset="10"
        >
          <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
          <template v-if="state.productList.length">
            <div
              class="product-item"
              v-for="(item, index) in state.productList"
              :key="index"
              @click="productDetail(item)"
            >
              <div><img :src="$filters.prefix(item.imgUrl)" /></div>
              <div class="product-info">
                <p class="name">{{ item.title }}</p>
                <p class="subtitle">{{ item.keyword }}</p>
                <span class="price">￥ {{ item.price }}</span>
              </div>
            </div>
          </template>
          <img
            class="empty"
            v-else
            src="https://s.yezgea02.com/1604041313083/kesrtd.png"
            alt="搜索"
          />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { search } from "@/service/good";
import { useSearchStore } from "../stores/search";
const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();
const state = reactive({
  keyword: route.query.keyword || "",
  searchBtn: false,
  seclectActive: false,
  refreshing: false,
  list: [],
  loading: false,
  finished: false,
  productList: [],
  totalPage: 0,
  page: 1,
  orderBy: "",
});
const init = async () => {
  const { categoryId } = route.query;
  category ||= searchStore.categoryId;
  if (!categoryId && !state.keyword) {
    state.finished = true;
    state.loading = false;
    return;
  }
  
  const {
    data,
    data: { content },
  } = await search(state.page, 10, {
    categoryId: categoryId,
    // wareId: categoryId,
    keyword: state.keyword,
    // orderBy: state.orderBy,
  });
  const data1 = {
    "totalCount": 151,
    "pageSize": 10,
    "totalPage": 16,
    "currPage": 1,
    "list": [
        {
            "id": 10159,
            "title": "Apple AirPods 配充电盒",
            "keyword": "苹果蓝牙耳机",
            "imgUrl": "/goods-img/53c9f268-7cd4-4fac-909c-2dc066625655.jpg",
            "price": 1246
        },
        {
            "id": 10160,
            "title": "小米 Redmi AirDots",
            "keyword": "真无线蓝牙耳机|分体式耳机 |收纳充电盒 |蓝牙5.0 |按...",
            "imgUrl": "/goods-img/c47403f1-b706-453b-88d8-2bfdee0316be.jpg",
            "price": 129
        },
        {
            "id": 10166,
            "title": "【自营仓次日达】moloke真无线蓝牙耳机双耳适用于苹果...",
            "keyword": "新蜂精选",
            "imgUrl": "/goods-img/70dc1586-13bd-4b4c-92a9-fe20aa1d531f.jpg",
            "price": 199
        },
        {
            "id": 10175,
            "title": "雷蛇 Razer 北海巨妖标准版X",
            "keyword": "北海巨妖标准版升级款 头戴式游戏耳机 电竞耳麦 7.1 电脑...",
            "imgUrl": "/goods-img/7345c467-6c2d-4f30-a73d-83d675d5208c.jpg",
            "price": 299
        },
        {
            "id": 10179,
            "title": "Apple 采用Lightning/闪电接头的 EarP...",
            "keyword": "耳机",
            "imgUrl": "/goods-img/bf6ccbc4-d0d0-4fbb-b975-4becb9cb38f4.jpg",
            "price": 223
        },
        {
            "id": 10180,
            "title": "Apple AirPods 配充电盒",
            "keyword": "苹果蓝牙耳机",
            "imgUrl": "/goods-img/64768a8d-0664-4b29-88c9-2626578ffbd1.jpg",
            "price": 1246
        },
        {
            "id": 10181,
            "title": "小米 Redmi AirDots",
            "keyword": "真无线蓝牙耳机|分体式耳机 |收纳充电盒 |蓝牙5.0 |按...",
            "imgUrl": "/goods-img/36d0fe8f-aa28-423c-81e7-82cab31b7598.jpg",
            "price": 129
        },
        {
            "id": 10187,
            "title": "【自营仓次日达】moloke真无线蓝牙耳机双耳适用于苹果...",
            "keyword": "新蜂精选",
            "imgUrl": "/goods-img/1e5645d1-24cb-48eb-9aaa-f729fa0db195.jpg",
            "price": 199
        },
        {
            "id": 10196,
            "title": "雷蛇 Razer 北海巨妖标准版X",
            "keyword": "北海巨妖标准版升级款 头戴式游戏耳机 电竞耳麦 7.1 电脑...",
            "imgUrl": "/goods-img/0cc81546-1408-4140-af95-0341a7778b6c.jpg",
            "price": 299
        },
        {
            "id": 10200,
            "title": "Apple 采用Lightning/闪电接头的 EarP...",
            "keyword": "耳机",
            "imgUrl": "/goods-img/7b8bcf01-0abe-4155-b1f4-e57a6b8fc36a.jpg",
            "price": 223
        }
    ]
}

  state.productList = state.productList.concat(content);
  state.totalPage = data.totalPages;
  state.loading = false;
  if (state.page >= data.totalPages) state.finished = true;
};

const goBack = () => {
  router.go(-1);
};

const productDetail = (item) => {
  router.push({ path: `/product/${item.id}` });
};

const getSearch = () => {
  onRefresh();
};

const onLoad = () => {
  if (!state.refreshing && state.page < state.totalPage) {
    state.page = state.page + 1;
  }
  if (state.refreshing) {
    state.productList = [];
    state.refreshing = false;
  }
  init();
};

const onRefresh = () => {
  state.refreshing = true;
  state.finished = false;
  state.loading = true;
  state.page = 1;
  onLoad();
};

const changeTab = ({ name }) => {
  console.log("name", name);
  state.orderBy = name;
  onRefresh();
};
</script>

<style lang="less" scoped>
.custom-tabs {
  width: 100%;
  padding-top: 10px;
  background: white;
  border-radius: 20px;
}
@import "../common/style/mixin";
.product-list-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: #f7f7f7;
  .category-header {
    .fj();
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .boxSizing();
    font-size: 15px;
    color: #656771;
    z-index: 10000;
    &.active {
      background: @primary;
    }
    .icon-left {
      font-size: 25px;
      font-weight: bold;
    }
    .header-search {
      display: flex;
      width: 76%;
      line-height: 20px;
      margin: 10px 0;
      padding: 5px 0;
      color: #232326;
      background: #fff;
      // background: #f7f7f7;
      .borderRadius(20px);
      .nbSearch {
        padding: 2px 5px 0 20px;
        font-size: 17px;
      }
      .search-title {
        font-size: 12px;
        color: #666;
        background: #fff;
        // background: #f7f7f7;
      }
    }
    .icon-More {
      font-size: 20px;
    }
    .search-btn {
      height: 28px;
      margin: 8px 0;
      line-height: 28px;
      padding: 0 5px;
      color: #fff;
      background: @primary;
      .borderRadius(5px);
      margin-top: 10px;
    }
  }
  // van-tabs {
  //   .borderRadius(20px);
  // }
}
.content {
  height: calc(~"(100vh - 70px)");
  overflow: hidden;
  overflow-y: scroll;
  // margin-top: 78px;
  margin-top: 100px;
}
.product-list-refresh {
  .product-item {
    .fj();
    width: 100%;
    height: 140px;
    padding: 10px 10px;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    div {
      width: 120px;
      height: 120px;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 140px;
        height: 120px;
        // padding: 0 10px;
        .boxSizing();
      }
    }
    .product-info {
      width: 56%;
      height: 120px;
      padding: 5px;
      text-align: left;
      .boxSizing();
      p {
        margin: 0;
      }
      .name {
        width: 100%;
        // max-height: 40px;
        line-height: 20px;
        font-size: 15px;
        color: #333;
        // white-space: nowrap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle {
        width: 100%;
        max-height: 20px;
        padding: 10px 10;
        line-height: 25px;
        font-size: 13px;
        color: #999;
        overflow: hidden;
      }
      .price {
        color: @primary;
        font-size: 16px;
      }
    }
  }
  .empty {
    display: block;
    width: 150px;
    margin: 50px auto 20px;
  }
}
</style>
