
<template>
  <div class="login">
    <!-- <s-header :name="state.type == 'login' ? '登录' : '注册'" :back="'/home'"></s-header> -->
    <s-header :back="'/home'"></s-header>
    <!-- <img class="logo" src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png" alt=""> -->
    <img class="logo" src="/src/assets/logo.svg" alt="iTMS">
    <div v-if="state.type == 'login'" class="login-body login">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <!-- <div style="margin: 16px;"> -->
        <div>
          <van-button round block color="#1baeae" native-type="submit">登录</van-button>
          <div class="toggle-link-group">
            <div class="link-register" @click="toggle('register')">
              新用户注册
            </div>
            <van-divider :style="{ borderColor: '#1989fa' }" vertical/>
            <div class="link-register" @click="toggle('email')">
              邮箱验证登录
            </div>
            <van-divider :style="{ borderColor: '#1989fa' }" vertical/>
            <div class="link-register" @click="toggle('forget')">
              忘记密码
            </div>
          </div>
        </div>
      </van-form>
    </div>
    <div v-else-if="state.type=='register'" class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username1"
          name="username1"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <!-- <div style="margin: 16px;"> -->
        <div>
          <van-button round block color="#1baeae" native-type="submit">注册</van-button>
          <div class="toggle-link-group">
            <div class="link-login" @click="toggle('login')">
              账户密码登录
            </div>
            <van-divider :style="{ borderColor: '#1989fa' }" vertical/>
            <div class="link-login" @click="toggle('email')">
              邮箱验证登录
            </div>
          </div>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请输入邮箱' }]"
        />
        <!-- <van-field
          v-model="state.password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        /> -->
        <van-field
          v-model="state.code"
          center
          clearable
          label="邮箱验证码"
          placeholder="请输入邮箱验证码"
        >
          <template #button>
            <van-button size="small" type="primary" @click="sendLoginCode">发送验证码</van-button>
          </template>
        </van-field>
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <!-- <div style="margin: 16px;"> -->
        <div>
          <van-button round block color="#1baeae" native-type="submit">登录</van-button>
          <div class="toggle-link-group">
            <div class="link-login" @click="toggle('login')">
              账户密码登录
            </div>
            <van-divider :style="{ borderColor: '#1989fa' }" vertical/>
            <div class="link-login" @click="toggle('register')">
              新用户注册
            </div>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import vueImgVerify from '@/components/VueImageVerify.vue'
import { login, register, sendCode, loginEmail } from '@/service/user'
import { setLocal } from '@/common/js/utils'
import md5 from 'js-md5'
import { showSuccessToast, showFailToast } from 'vant'
const verifyRef = ref(null)
const state = reactive({
  username: '',
  password: '',
  username1: '',
  email: '',
  code: '',
  password1: '',
  type: 'login',
  imgCode: '',
  verify: ''
})

const sendLoginCode = () => {
  console.log('sendCode')
  sendCode({
    "email": state.email
  })
};

// 切换登录和注册两种模式
const toggle = (v) => {
  console.log(v)
  state.type = v
  console.log(state.type)
  state.verify = ''
}

// 提交登录或注册表单
const onSubmit = async (values) => {
  state.imgCode = verifyRef.value.state.imgCode || ''
  if (state.verify.toLowerCase() != state.imgCode.toLowerCase()) {
    showFailToast('验证码有误')
    return
  }
  if (state.type == 'login') {
    const { data } = await login({
      "username": values.username,
      "password": values.password
    })
    console.log(data);
    setLocal('token', data.token)
    // 需要刷新页面，否则 axios.js 文件里的 token 不会被重置
    window.location.href = '/'
  } else if (state.type == 'email') {
    const { data } = await loginEmail({
      "email": values.email,
      "code": values.code
    })
    console.log(data);
    setLocal('token', data.token)
  }else {
    await register({
      "username": values.username1,
      "password": values.password1
    })
    showSuccessToast('注册成功')
    state.type = 'login'
    state.verify = ''
  }
}
</script>

<style lang="less">
  .toggle-link-group {
    padding: 20px 30px;
    // padding-bottom: 6rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    .link-register {
      width: 70px;
      color: var(--van-text-color-2);
    }
    .van-divider {
      transform: rotate(90deg);
      width: 10px;
      height: px;
    }
  }
  .login-body {
    background: #fff;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    padding: 20px 20px;
  }
  .van-field {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    border-radius: 25px;
    height: 50px;
    background: #f9f9f9;
    // overflow: hidden;
  }
  .login {
    // background: #fff;
    // border-top-left-radius: 20px;
    // border-top-right-radius: 20px;
    .logo {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
      width: 120px;
      height: 120px;
      display: block;
      margin: 50px auto 50px;
      padding: 5px;
      background: #fff;
      border-radius: 50%;
      overflow: hidden;
    }
    .logo:hover {
      transform: translateY(-5px);
    }
    .login-body {
      padding: 20px 20px;
    }
    .login {
      .link-register {
        width: 70px;
        font-size: 10px;
        // margin-bottom: 20px;
        color: var(--van-text-color-2);
        display: inline-block;
      }
    }
    .register {
      .link-login {
        width: 70px;
        font-size: 10px;
        // margin-bottom: 20px;
        color: var(--van-text-color-2);
        display: inline-block;
      }
    }
    .verify-bar-area {
      margin-top: 24px;
      .verify-left-bar {
        border-color: #1baeae;
      }
      .verify-move-block {
        background-color: #1baeae;
        color: #fff;
      }
    }
    .verify {
      >div {
        width: 100%;
      }
      display: flex;
      justify-content: center;
      .cerify-code-panel {
        margin-top: 16px;
      }
      .verify-code {
        width: 40%!important;
        float: left!important;
      }
      .verify-code-area {
        float: left!important;
        width: 54%!important;
        margin-left: 14px!important;
        .varify-input-code {
          width: 90px;
          height: 38px!important;
          border: 1px solid #e9e9e9;
          padding-left: 10px;
          font-size: 16px;
        }
        .verify-change-area {
          line-height: 44px;
        }
      }
    }
  }
</style>
