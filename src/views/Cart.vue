
<template>
  <div class="cart-box">
    <s-header :name="'购物车'" :noback="true">
    </s-header>

    <div class="cart-body">
      <van-checkbox-group @change="groupChange(state.result)" v-model="state.result" ref="checkboxGroup">
        <van-swipe-cell :right-width="50" v-for="(item, index) in state.list" :key="index">
          <div class="good-item">
            <van-checkbox :name="item.cartItemId" />
            <div class="good-img"><img :src="$filters.prefix(item.cartSkuImg)" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.cartSkuName }}</span>
                <span>x{{ item.cartSkuNum }}</span>
              </div>
              <div class="good-btn">
                <div class="price">¥{{ (item.cartSkuSellingPrice * item.cartSkuNum).toFixed(2)}}</div>
                <!--                计数器-->
                <van-stepper
                  integer
                  :min="1"

                  :model-value="item.cartSkuNum"
                  :name="item.cartItemId"
                  async-change
                  @change="onChange"
                />
                <!--                计数器-->
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteGood(item.cartItemId)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="state.list.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      button-type="primary"
      @submit="onSubmit"
    >
      <van-checkbox @click="allCheck" v-model:checked="state.checkAll">全选</van-checkbox>
      <van-button plain type="danger" size="mini" style="margin-left: 10px">删除</van-button>
    </van-submit-bar>


    <div class="empty" v-if="!state.list.length">
      <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button round color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
    </div>
    <nav-bar></nav-bar>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { showToast, showLoadingToast, closeToast, showFailToast } from 'vant'
import navBar from '@/components/NavBar.vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getCart, deleteCartItem, modifyCart } from '@/service/cart'
import {confirmOrders} from "../service/order";

const router = useRouter()
const cart = useCartStore()
const state = reactive({
  checked: false,
  list: [],
  all: false,
  result: [],
  checkAll: true
})

onMounted(() => {
  init()
})

//  初始化所有调出购物车redis中所有的商品
const init = async () => {
  showLoadingToast({ message: '加载中...', forbidClick: true });
  // const { data } = await getCart({ pageNumber: 1 })
  const { data } = await getCart()
  setTimeout(200)
  state.list = data.map(item => {
    return{
      // data里调用是skuId，state的list里面调用是cartItemId
      cartItemId:item.skuId,
      cartSkuName:item.skuName,
      cartSkuNum:item.skuNum,
      cartSkuImg:item.imgUrl,
      cartSkuSellingPrice:item.cartPrice,
    }
  })
  // console.log("@@@state.list");

  state.result = data.map(item => item.skuId)
  closeToast()
}
//  初始化所有调出购物车redis中所有的商品
// 计算总价
const total = computed(() => {
  let sum = 0
  let _list = state.list.filter(item => state.result.includes(item.cartItemId))
  console.log(state.result);
  _list.forEach(item => {
    sum += item.cartSkuNum * item.cartSkuSellingPrice
  })
  console.log(sum);
  return sum
})
// 计算总价

const goBack = () => {
  router.go(-1)
}

const goTo = () => {
  router.push({ path: '/home' })
}

const onChange = async (value, detail) => {
  // value是这个商品的用户选择的数量
  // detail是这个商品的skuId

  // if (value > 5) {
  //   showFailToast('超出单个商品的最大购买数量')
  //   return
  // }
  if (value < 1) {
    showFailToast('商品不得小于0')
    return
  }
  /**
   * 这里的操作是因为，后面修改购物车后，手动添加的计步器的数据，为了防止数据不对
   * 这边做一个拦截处理，如果点击的时候，购物车单项的 goodsCount 等于点击的计步器数字，
   * 那么就不再进行修改操作
  */
  if (state.list.find(item => item.cartItemId == detail.name)?.cartSkuNum == value) return
  showLoadingToast({ message: '修改中...', forbidClick: true });
  const params = {
    cartItemId: detail.name,
    goodsCount: value
  }
  // await modifyCart(params)
  /**
   * 修改完成后，没有请求购物车列表，是因为闪烁的问题，
   * 这边手动给操作的购物车商品修改数据
  */
  state.list.forEach(item => {
    if (item.cartItemId == detail.name) {
      item.cartSkuNum = value
    }
  })
  closeToast()
}

const onSubmit = async () => {
  if (state.result.length == 0) {
    showFailToast('请选择商品进行结算')
    return
  }
  const params = JSON.stringify(state.result)
  router.push({ path: '/create-order', query: { cartItemIds: params } })
}

const deleteGood = async (id) => {
  await deleteCartItem(id)
  cart.updateCart()
  init()
}

const groupChange = (result) => {
  if (result.length == state.list.length) {
    state.checkAll = true
  } else {
    state.checkAll = false
  }
  state.result = result
}

const allCheck = () => {
  if (!state.checkAll) {
    state.result = state.list.map(item => item.cartItemId)
  } else {
    state.result = []
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .cart-box {
    .cart-header {
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
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
      margin: 16px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 64px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>
