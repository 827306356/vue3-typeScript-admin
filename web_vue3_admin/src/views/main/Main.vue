<template>
  <div class="main">

    <div class="mb-4">
      <el-button @click="loginOut">退出登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalCache } from '@/utils/cache';
import { TOKEN } from "@/global/constants";
import router from '@/router'


const loginOut = () => {
  LocalCache.remove(TOKEN)
  router.push('/login')
}


</script>


<style lang="less" scoped>
.main {}
</style>
