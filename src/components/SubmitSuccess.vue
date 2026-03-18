<template>
  <div class="success-container">
    <div class="content">
      <van-icon name="checked" size="80" color="#07c160" />
      <h2 class="title">提交成功</h2>
      <p class="desc">您的预约信息已成功提交</p>
      <p class="desc">请留意后续通知，如有疑问请联系客服</p>
      
      <!-- <div class="btn-group">
        <van-button type="primary" block @click="goHome">返回首页</van-button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped lang="less">
.success-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px;

  .content {
    text-align: center;
    width: 100%;

    .title {
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 24px;
      color: #333;
    }

    .desc {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }

    .btn-group {
      margin-top: 40px;
      padding: 0 20px;
    }
  }
}
</style>
