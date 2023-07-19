<template>
  <div class="product-detail">
    <s-header :name="'商品详情'"></s-header>
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1baeae">
          <van-swipe-item
            v-for="(item, index) in state.detail.skuImageList"
            :key="index"
          >
            <img :src="item.imgUrl" :alt="item.imgName" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="price-desc">
          <div class="price-yuan">¥</div>
          <div class="price">{{ Math.floor(state.detail.price || 0) }}</div>
          <div class="price-yuan">
            {{ ((state.detail.price || 0) % 1).toFixed(2).substring(1, 4) }}
          </div>
          <div class="market-price">&nbsp; &nbsp; 市场价</div>
          <div class="market-price">
            &nbsp; ¥ {{ (state.detail.marketPrice || 0).toFixed(2) }}
          </div>
        </div>
        <div class="product-title text-container">
          {{ state.detail.skuName || "" }}
        </div>
        <div class="product-desc">iTMS - 灵创物运 优选商品</div>
        <!-- <div class="product-price">
          <span>¥{{ state.detail.price || "" }}</span>
        </div> -->
      </div>
      <!-- <van-sticky :offset-top="50" scrollspy> -->
      <div class="van-wrapper">
        <van-tabs :offset-top="44" scrollspy sticky>
          <van-tab class="attr-group" title="参数">
            <p class="good-header">参数</p>
            <van-cell-group class="van-cell-back" inset>
              <van-cell
                v-for="(item, index) in state.detail.skuAttrValueList"
                :title="item.attrName"
                :value="item.attrValue"
              />
            </van-cell-group>
          </van-tab>
          <van-tab class="product-content" title="库存">
            <p class="good-header">库存</p>
            <van-cell-group class="van-cell-back" inset>
              <van-cell
                v-for="(item, index) in state.detail.skuWareList"
                :title="item.wareId + '号仓库'"
                :value="item.stock + ' 件'"
                :label="'销量: ' + item.sale + ' 件'"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="详情">
            <p class="good-header">详情</p>
            <img
              v-for="(item, index) in state.detail.skuPosterList"
              :src="item.imgUrl"
              :alt="item.imgName"
              style="width: 100%; padding: 10px"
            />
            <div
              class="product-content"
              v-html="state.detail.goodsDetailContent || ''"
            />
          </van-tab>
          <!-- <van-tab v-for="index in 8" :title="'选项 ' + index">
              内容 {{ index }}
            </van-tab> -->
        </van-tabs>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon
        icon="cart-o"
        :badge="!cart.count ? '' : cart.count"
        @click="goTo()"
        text="购物车"
      />
      <van-action-bar-button
        type="warning"
        @click="handleAddCart"
        text="加入购物车"
      />
      <van-action-bar-button type="danger" @click="goToCart" text="立即购买" />
    </van-action-bar>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { getDetail } from "@/service/good";
import { addCart } from "@/service/cart";
import sHeader from "@/components/SimpleHeader.vue";
import { showSuccessToast } from "vant";
import { prefix } from "@/common/js/utils";
import {checkCart} from "../service/cart";
const route = useRoute();
const router = useRouter();
const cart = useCartStore();

const state = reactive({
  detail: {
    skuImageList: [],
  },
});

onMounted(async () => {
  const textContainer = document.querySelector(".text-container");
  textContainer.addEventListener("click", function () {
    textContainer.classList.toggle("expanded");
  });
  const { id } = route.params;
  const { data } = await getDetail(id);
  // data.skuImageList = data.skuImageList.map((i) => prefix(i));
  state.detail = data;
  cart.updateCart();
});

nextTick(() => {
  // 一些和DOM有关的东西
  const content = document.querySelector(".detail-content");
  content.scrollTop = 0;
});

const goBack = () => {
  router.go(-1);
};

const goTo = () => {
  router.push({ path: "/cart" });
};

const goToBuy = async () => {
  await addCart( state.detail.id, 1 );
 checkCart(state.detail.id,1);
  await cart.updateCart();
  await router.push({path: "/create-order"});
};

const handleAddCart = async () => {
  const { resultCode } = await addCart(state.detail.id, 1);
  cart.updateCart();
};

const goToCart = async () => {
  alert(state.detail.id)
  const { resultCode } = await addCart(state.detail.id, 1);
  //cart.updateCart();
  const { result } =await checkCart(state.detail.id, 1);
  await cart.updateCart();
  router.push({ path: "/cart" });
};
</script>

<style lang="less">
@import "../common/style/mixin";
.good-header {
  // background: #f9f9f9;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: @primary;
  font-size: 16px;
  font-weight: 500;
}
.van-cell-back {
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.van-wrapper {
  min-height: 100%;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.text-container {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.text-container::after {
  // content: '\25BC';
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  padding: 2px;
  cursor: pointer;
}
.text-container.expanded {
  -webkit-line-clamp: unset;
}
.price-desc {
  padding-top: 10px;
  display: flex;
  // justify-content: space-between;
  // vertical-align: text-bottom;
  align-items: flex-end;
  .price-yuan {
    font-size: 18px;
    color: @orange;
    font-weight: bold;
  }
  .price {
    font-size: 24px;
    color: @orange;
    font-weight: bold;
  }
  .market-price {
    color: #999;
    font-size: 16px;
    // padding-left: 10px;
  }
}
.product-detail {
  s-header {
    background: rgba(255, 255, 255, 0.7);
  }
  .detail-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 10px 10px;
    .boxSizing();
    color: #252525;
    // background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .product-name {
      padding-left: 10px;
      font-size: 14px;
    }
  }
  .detail-content {
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y: auto;
    .detail-swipe-wrap {
      .my-swipe .van-swipe-item {
        img {
          width: 100%;
          // height: 300px;
        }
      }
    }
    .product-info {
      padding: 0 15px;
      margin: 10px 10px;
      background: white;
      border-radius: 20px;
      .product-title {
        // padding: 10px;
        font-size: 16px;
        text-align: left;
        color: #333;
        font-weight: bold;
      }
      .product-desc {
        font-size: 14px;
        text-align: left;
        color: #999;
        padding: 10px 0;
      }
      .product-price {
        padding-bottom: 10px;
        .fj();
        span:nth-child(1) {
          color: #f63515;
          font-size: 22px;
        }
        span:nth-child(2) {
          color: #999;
          font-size: 16px;
        }
      }
    }
    .product-intro {
      width: 100%;
      padding-bottom: 50px;
      ul {
        .fj();
        width: 100%;
        margin: 10px 0;
        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          font-size: 15px;
          border-right: 1px solid #999;
          box-sizing: border-box;
          &:last-child {
            border-right: none;
          }
        }
      }
      .product-content {
        padding: 0 20px;
        img {
          width: 100%;
        }
      }
    }
  }
  .van-action-bar-button--warning {
    background: linear-gradient(to right, #6bd8d8, @primary);
  }
  .van-action-bar-button--danger {
    background: linear-gradient(to right, #0dc3c3, #098888);
  }
}
</style>
