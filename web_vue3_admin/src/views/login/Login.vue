<template>
  <div class="login">
    <loginPanel></loginPanel>
  </div>
</template>

<script setup lang="ts">
import loginPanel from './c-cpns.vue';

</script>


<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/img/loginbg.jpeg');
  background-size: 100% 100%;
}
</style>
