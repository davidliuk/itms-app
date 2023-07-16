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
  <div class="order-detail-box">
    <s-header :name="'订单详情'" @callback="close"></s-header>
    <div class="order-status">
      <div class="status-item">
        <label>任务单状态：</label>
        <span>{{ state.detail.workStatus }}</span>
      </div>
      <div class="status-item">
        <label>任务单编号：</label>
        <span>{{ state.detail.id }}</span>
      </div>
      <div class="status-item">
        <label>收货人姓名：</label>
        <span>{{ state.detail.name }}</span>
      </div>
      <div class="status-item">
        <label>收货人联系方式：</label>
        <span>{{ state.detail.phone }}</span>
      </div>
      <div class="status-item">
        <label>收货详细地址：</label>
        <span>{{ state.detail.detailAddress }}</span>
      </div>
      <van-button v-if="state.detail.workStatus == 'ASSIGN'" style="margin-bottom: 10px" color="#1baeae" block @click="takeStation(state.detail.orderId)">确认领货</van-button>
      <van-button v-if="state.detail.workStatus == 'RETURN_ASSIGN'" style="margin-bottom: 10px" color="#1baeae" block @click="takeUser(state.detail.orderId)">确认取货</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ state.detail.orderInfo.total_amount }}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>
    <van-card
      v-for="item in state.detail.orderInfo.OrderItem"
      :key="item.sku_id"
      style="background: #fff"
      :num="item.sku_num"
      :price="item.sku_price"
      desc="全场包邮"
      :title="item.goodsName"
      :thumb="$filters.prefix(item.img_url)"
    />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getWorkOrderList,takeReturnWorkOrder,takeWorkOrder} from '@/service/work'
import { showConfirmDialog, showLoadingToast, closeToast, showSuccessToast, closeDialog } from 'vant'
import { useRoute } from 'vue-router'
const route = useRoute()
const state = reactive({
  detail: {},
  showPay: false
})

onMounted(() => {
  init()
})

const init = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });
  const { id } = route.query
  const { data } = await getWorkOrderList(id)
  state.detail = data
  closeToast()
}

const handleConfirmOrder = (id) => {
  showConfirmDialog({
    title: '是否确认订单？',
  }).then(() => {
    confirmOrder(id).then(res => {
      if (res.resultCode == 200) {
        showSuccessToast('确认成功')
        init()
      }
    })
  }).catch(() => {
    // on cancel
  });
}

const close = () => {
  closeDialog
}

const takeStation = (orderId) =>{
  takeWorkOrder(orderId);
  onRefresh();
}
const takeUser = (orderId) =>{
  takeReturnWorkOrder(orderId);
  onRefresh();
}

</script>

<style lang="less" scoped>
  .order-detail-box {
    background: #f7f7f7;
    .order-status {
      background: #fff;
      padding: 20px;
      font-size: 15px;
      .status-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }
        span {

        }
      }
    }
    .order-price {
      background: #fff;
      margin: 20px 0;
      padding: 20px;
      font-size: 15px;
      .price-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }
        span {

        }
      }
    }
    .van-card {
      margin-top: 0;
    }
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
