
<template>
  <div class="user-box">
    <s-header :name="'我的'"></s-header>
    <van-skeleton title :avatar="true" :row="3" :loading="state.loading">
      <div class="user-info">
        <div class="info">
          <img :src="state.user.avatar"/>
          <div class="user-desc">
            <span>昵称：{{ state.user.nickName }}</span>
            <span>账户：{{ state.user.username }}</span>
            <span class="name">个性签名：{{ state.user.introduction }}</span>
          </div>
        </div>
      </div>
    </van-skeleton>
    <ul class="user-list">
      <order-list></order-list>
      <!-- <work-order-list></work-order-list> -->

      <div>
        <li class="van-hairline--bottom" @click="goTo('/setting')">
          <span>账号管理</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/address', { from: 'mine' })">
          <span>地址管理</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/collect')">
          <span>我的收藏</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/footprint')">
          <span>我的足迹</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="logout()">
          <span>账户退出</span>
          <van-icon name="arrow" />
        </li>
      </div>
      <!-- <li class="van-hairline--bottom" @click="goTo('/address', { from: 'mine' })">
        <span>地址管理</span>
        <van-icon name="arrow" />
      </li> -->
    </ul>
    <nav-bar></nav-bar>
  </div>
</template>

<script setup>
import { reactive, onMounted, toRefs } from 'vue'
import navBar from '@/components/NavBar.vue'
import sHeader from '@/components/SimpleHeader.vue'
import OrderList from '@/components/OrderList.vue'
import WorkOrderList from '@/components/WorkOrderList.vue'
import { getUserInfo } from '@/service/user'
import { useRouter } from 'vue-router'
import { logout } from '@/service/user'
const router = useRouter()
const state = reactive({
  user: {},
  loading: true
})

onMounted(async () => {
  const { data } = await getUserInfo()
  state.user = data
  state.loading = false
  console.log(data)
})

const goBack = () => {
  router.go(-1)
}

const goTo = (r, query) => {
  router.push({ path: r, query: query || {} })
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .order {
    // border-bottom: 1px solid #dcdcdc;
    background: #fff;
    border-radius: 20px;
    // margin: 20px 20px;
    h2 {
      color: #252525;
      padding-left: 10px;
    }
  }
  .user-box {
    .user-header {
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
      .user-name {
        font-size: 14px;
      }
    }
    .user-info {
      width: 94%;
      margin: 10px;
      height: 115px;
      background: linear-gradient(90deg, @primary, #51c7c7);
      box-shadow: 0 2px 5px #269090;
      border-radius: 6px;
      .info {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 25px 20px;
        .boxSizing();
        img {
          .wh(60px, 60px);
          border-radius: 50%;
          margin-top: 4px;
        }
        .user-desc {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          line-height: 20px;
          font-size: 14px;
          color: #fff;
          span {
            color: #fff;
            font-size: 14px;
            padding: 2px 0;
          }
        }
        .account-setting {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 13px;
          color: #fff;
          .van-icon-setting-o {
            font-size: 16px;
            vertical-align: -3px;
            margin-right: 4px;
          }
        }
      }
    }
    .user-list {
      // padding: 0 20px;
      margin-top: 20px;
      background: rgba(245, 245, 245);
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      padding: 20px 20px;
      height: 72vh;
      li {
        margin: 10px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .van-icon-arrow {
          margin-top: 13px;
        }
      }
      div {
        background: #fff;
        border-radius: 20px;
        margin-top: 10px;
        padding: 5px 10px;
      }
    }
  }
</style>
