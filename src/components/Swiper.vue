<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
    <van-swipe-item v-for="(item, index) in list" :key="index">
      <img :src="item.imgUrl" alt="" @click="goTo(item.id)" />
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
defineProps({
  list: Array,
});
const router = useRouter();
const goTo = (id) => {
  // window.open(url);
  router.push({ path: `/product/${id}` });
};
</script>

<style lang="less" scoped>
.my-swipe {
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}
</style>
