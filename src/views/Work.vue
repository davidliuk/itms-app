<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
  <div class="work-box">
    <s-header :name="'我的任务单'" :back="'/user'"></s-header>
    <van-tabs @click-tab="onChangeTab" :color="'#1baeae'" :title-active-color="'#1baeae'" class="work-tab" v-model="state.status">
      <van-tab size="large" title="全部" name="ALL" ></van-tab>
      <van-tab title="待分站领货" name="ASSIGN"></van-tab>
      <van-tab title="配送中" name="TAKE"></van-tab>
      <van-tab title="已完成配送" name="RECEIVE"></van-tab>
      <van-tab title="待上门取货" name="RETURN_ASSIGN"></van-tab>
      <van-tab title="待分站入库" name="RETURN_TAKE"></van-tab>
      <van-tab title="已完成取货" name="RETURN_STATION"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="work-list-refresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          @load="onLoad"
          @offset="10"
          finished-text="没有更多了"
        >
          <div
              v-for="(item, id) in state.list"
              :key="id"
              class="work-item-box"
          >
              <div class="work-item-header">
                <span>下单时间：{{ item.createTime }}</span>
                <span>{{ item.workStatus }}</span>
              </div>
                 <van-card
                  v-for="sku in item.orderInfo.orderItemList"
                  :key="sku.id"
                  style="background: #fff"
                  :num="sku.skuNum"
                  :price="sku.skuPrice"
                  desc="全场包邮"
                  :title="sku.skuName"
                  :thumb="$filters.prefix(sku.imgUrl)"
                 >
                 </van-card>
              <div class="work-item-button">
                <span v-if="item.workStatus === 'ASSIGN'" style="margin-right: 0">
                  <van-button round @click="takeStation(item.orderId)">确认领货</van-button>
                </span>
                <span v-if="item.workStatus === 'RETURN_ASSIGN'">
                  <van-button round  @click="takeUser(item.orderId)">确认取货</van-button>
                </span>
              </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive} from 'vue';
import sHeader from '@/components/SimpleHeader.vue'
import {getWorkOrderList, takeReturnWorkOrder, takeWorkOrder, getOrderInfo} from '@/service/work'
import { useRouter } from 'vue-router'
import {getUserInfo} from "@/service/user";
import workOrder from "@/views/WorkOrder.vue";

const router = useRouter()
const state = reactive({
  courierInfo:{},
  status: 'ALL',
  loading: false,
  finished: false,
  refreshing: false,
  itemLoading:false,
  list: [],
  orderItem:[],
  page: 1,
  totalPage: 0
})

const getCourier = async () => {
  const { data } = await getUserInfo()
  state.courierInfo = data.courierInfo
  console.log(data)
}

const loadData = async () => {
  await getCourier()
  if(state.status === 'ALL'){
    const { data } = await getWorkOrderList(
        state.page,
        10,
        { workType:null,workStatus: null,courierId:state.courierInfo.id })
    for (const workOrder of data.records) {
      workOrder.orderInfo = await getItem(workOrder.orderId);
    }
    state.list = state.list.concat(data.records)
    state.totalPage = data.pages
  }else {
    const { data } = await getWorkOrderList(
        state.page,
        1,
        { workType:null,workStatus: state.status,courierId:state.courierInfo.id })
    for (const workOrder of data.records) {
      workOrder.orderInfo = await getItem(workOrder.orderId);
    }
    state.list = state.list.concat(data.records)
    state.totalPage = data.pages
  }
  state.loading = false;
  if (state.page >= state.totalPage) state.finished = true
}

const onChangeTab = ({ name }) => {
  // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
  state.status = name
  onRefresh()
}

// const goTo = (id) => {
//   router.push({ path: '/workOrder-detail', query: { id } })
// }

const goBack = () => {
  router.go(-1)
}

const onLoad = () => {
  if (!state.refreshing && state.page < state.totalPage) {
    console.log(state.page)
    console.log(state.totalPage)
    state.page = state.page + 1
  }
  if (state.refreshing) {
    state.list = [];
    state.refreshing = false;
  }
  loadData()
}

const onRefresh = () => {
  state.refreshing = true
  state.finished = false
  state.loading = true
  state.page = 1
  onLoad()
}

const getItem = async(orderId) =>{
  const { data } = await getOrderInfo(orderId)
  // return data.orderItemList ? state.orderItem : null
  return data
}

const takeStation = (orderId) =>{
  console.log(orderId);
  console.log('--------------')
  takeWorkOrder(orderId);
  onRefresh();
}
const takeUser = (orderId) =>{
  takeReturnWorkOrder(orderId);
  onRefresh();
}

</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .work-box {
    .work-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .work-name {
        font-size: 14px;
      }
    }
    .work-tab {
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .skeleton {
      margin-top: 60px;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 34px;
    }
    .work-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .work-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .work-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
        .work-item-button {
          margin-top: 10px;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
