<template>
  <div class="login-panel">
    <div class="login-header">
      <h1>Haze后台管理系统</h1>
      <p>欢迎回来，请{{ activeTab === 'account' ? '登录您的账号' : '使用手机号登录' }}</p>
    </div>

    <div class="tab-container">
      <div class="tab-item" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">
        <el-icon>
          <Avatar />
        </el-icon>
        <span class="tab-text">账号登录</span>
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'mobile' }" @click="activeTab = 'mobile'">
        <el-icon>
          <Cellphone />
        </el-icon>
        <span class="tab-text">手机登录</span>
      </div>
    </div>

    <el-form :model="loginForm" :rules="rules" :status-icon="true" ref="loginFormRef" class="login-form">
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'account'" key="account">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" class="custom-input" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password
              class="custom-input" />
          </el-form-item>
        </div>
        <div v-else key="mobile">
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号" prefix-icon="Iphone"
              class="custom-input"></el-input>
          </el-form-item>
          <el-form-item prop="smsCode">
            <el-input v-model="loginForm.smsCode" placeholder="请输入验证码" prefix-icon="Message"
              class="custom-input cus-input">
              <template #append>
                <el-button size="small" type='primary' :disabled="countdown > 0" @click="sendSmsCode">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
      </transition>

      <div class="login-options" v-if="activeTab === 'account'">
        <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
        <el-link type="primary" :underline="false">忘记密码?</el-link>
      </div>

      <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">
        {{ activeTab === 'account' ? '登 录' : '手机号登录' }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import router from "@/router";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import loginStore from "@/store/login/login";
import { LocalCache } from '@/utils/cache';


const activeTab = ref<'account' | 'mobile'>('account')
const countdown = ref(0)
const loading = ref(false)
const loginFormRef = ref<FormInstance>()
const rememberPwd = ref(!!LocalCache.get('rememberPwd'))
watch(() => rememberPwd.value, (newValue) => {
  LocalCache.set('rememberPwd', newValue ? 'true' : 'false')
})
const userLoginStore = loginStore();
const CACHE_NAME = 'username'
const CACHE_PASSWORD = 'password'
const loginForm = reactive({
  username: LocalCache.get(CACHE_NAME) ?? '',
  password: LocalCache.get(CACHE_PASSWORD) ?? '',
  phone: '',
  smsCode: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  smsCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
})

const sendSmsCode = () => {
  loginFormRef.value?.validateField('phone', (valid) => {
    if (valid) {
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) clearInterval(timer)
      }, 1000)
    }
  })
}

const handleLogin = () => {
  loading.value = true
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      if (activeTab.value == 'account') {//账号登录
        console.log('账号登录')
        const username = loginForm.username;
        const password = loginForm.password;
        console.log(username, password);
        console.log(rememberPwd.value)
        userLoginStore.loginAccountLogin({ username, password })
          .then(() => {
            console.log('登录成功')
            // 判断是否记住密码
            if (rememberPwd.value) {
              LocalCache.set(CACHE_NAME, username)
              LocalCache.set(CACHE_PASSWORD, password)
            } else {
              LocalCache.remove(CACHE_NAME)
              LocalCache.remove(CACHE_PASSWORD)
            }
          })
          .catch((error) => {
            console.error('登录失败:', error) // 捕获并打印错误
          })
        router.push('/main')

      } else {//手机号登录
        const phone = loginForm.phone;
        const smsCode = loginForm.smsCode;
        console.log(phone, smsCode)
        console.log('手机号登录')

      }
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
      }, 1500)
    } else {
      loading.value = false
    }
  })
}
</script>

<style lang="less" scoped>
.login-panel {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

  .login-header {
    margin-bottom: 30px;
    text-align: center;

    h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      font-size: 14px;
      color: #999;
    }
  }

  .tab-container {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;

    .tab-item {
      padding: 12px 0;
      cursor: pointer;
      color: #666;
      font-size: 16px;
      transition: all 0.3s;
      position: relative;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex: 1;
      display: flex;

      .tab-text {
        margin-left: 10px;
      }

      &.active {
        color: #409eff;
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background-color: #409eff;
          border-radius: 1px;
        }
      }
    }
  }

  .login-form {
    .custom-input {
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        padding: 1px 15px;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 0 1px #c0c4cc inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #409eff inset;
        }
      }

      :deep(.el-input__inner) {
        height: 42px;
        line-height: 42px;
      }
    }

    .cus-input {
      :deep(.el-input__wrapper) {
        border-bottom-right-radius: 0 !important;
        border-top-right-radius: 0 !important;
      }

    }

    .el-form-item {
      margin-bottom: 22px;
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .login-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    border-radius: 8px;
    margin-top: 10px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
