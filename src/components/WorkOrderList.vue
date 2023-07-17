<template>
  <div class="workOrder-card">
    <div class="header">
      <div class="title">我的任务单</div>
      <div class="link" @click="goTo('/work')">详情></div>
    </div>
    <div class="content">
      <div @click="goToDetail('ASSIGN')" class="item">
        <div class="icon" >
          <van-icon name="cash-o" size="28" />
        </div>
        <div class="text">待分站领货</div>
      </div>
      <div @click="goToDetail('TAKE')" class="item">
        <div class="icon">
          <van-icon name="logistics" size="28" />
        </div>
        <div class="text">配送中</div>
      </div>
      <div @click="goToDetail('RETURN_ASSIGN')" class="item">
        <div class="icon">
          <van-icon name="comment-o" size="28" />
        </div>
        <div class="text">待上门取货</div>
      </div>
      <div @click="goToDetail('ALL')" class="item">
        <div class="icon">
          <van-icon name="exchange" size="28" />
        </div>
        <div class="text">全部</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goTo = (r, query) => {
  router.push({ path: r, query: query || {} });
};
const goToDetail = (status) =>{
  router.push({ path: '/workOrder', query:  {status}  })
}
</script>

<style>
.workOrder-card {
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.link {
  color: #999;
  font-size: 12px;
}

.content {
  display: flex;
  justify-content: space-around;
}

.item {
  text-align: center;
}

.icon {
  margin-bottom: 5px;
}

.text {
  font-size: 12px;
}
</style>
