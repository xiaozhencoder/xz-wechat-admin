<!--suppress ALL -->
<template>
  <div class="login-container flex-center">
    <el-form ref="refloginForm" class="login-form" :model="formInline" :rules="formRules">
      <div class="title-container">
        <h3 class="title text-center">{{ settings.title }}</h3>
      </div>
      <el-form-item prop="username" :rules="formRules.isNotNull">
        <div class="flex-center flex-1">
          <el-input v-model="formInline.username" placeholder="请输入用户名">
            <template #prefix>
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
            </template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item prop="password" :rules="formRules.isNotNull">
        <div class="flex-center flex-1">
          <el-input
            :key="passwordType"
            ref="refPassword"
            v-model="formInline.password"
            :type="passwordType"
            name="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
            </template>

            <template #suffix>
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <div class="tip-message">{{ tipMessage }}</div>
      <el-button :loading="loading" type="primary" class="login-btn" size="default" @click.prevent="handleLogin">
        登 录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import settings from "@/settings"
import md5 from "js-md5"
import { ElMessage } from "element-plus"
import { Calendar, Search } from "@element-plus/icons-vue"
import { ObjTy } from "~/common"
import { useUserStore } from "@/store/user"
//element valid
const formRules = useElement().formRules
//form
let formInline = reactive({
  username: "ls@zall.com",
  password: "a123456",
  grant_type: "password_code"
})
let state: ObjTy = reactive({
  otherQuery: {},
  redirect: undefined
})

/* listen router change  */
const route = useRoute()
let getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  () => route.query,
  (query) => {
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

/*
 *  login relative
 * */
let loading = ref(false)
let tipMessage = ref("")

const refloginForm: any = ref(null)
let handleLogin = () => {
  refloginForm.value.validate((valid: any) => {
    if (valid) {
      loginReq()
    } else {
      return false
    }
  })
}

//use the auto import from vite.config.js of AutoImport
const router = useRouter()

let loginReq = () => {
  loading.value = true
  formInline.password = md5(formInline.password)
  const userStore = useUserStore()
  userStore
    .login(formInline)
    .then(() => {
      router.push({ path: "/" })
    })
    .catch((res) => {
      tipMessage.value = res.msg
      useCommon()
        .sleep(30)
        .then(() => {
          loading.value = false
        })
    })
}
/*
 *  password show or hidden
 * */
let passwordType = ref("password")
const refPassword: any = ref(null)
let showPwd = () => {
  if (passwordType.value === "password") {
    passwordType.value = ""
  } else {
    passwordType.value = "password"
  }
  nextTick(() => {
    refPassword.value.focus()
  })
}
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;

:deep(.el-textarea__inner) {
  background-color: transparent;
}

:deep(.el-input__wrapper) {
  height: 52px;
}
.login-container {
  background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  font-family: "Vibur", cursive;
  font-family: "Abel", sans-serif;
  opacity: 0.95;
  height: 100vh;
  // width: 100%;
  // // background: linear-gradient(to left bottom, hsl(218, 100%, 85%) 0%,hsl(125, 100%, 85%) 100%)
  // background: linear-gradient(to left bottom, hsl(218, 100%, 85%) 0%, hsl(125, 100%, 85%) 100%);
  .login-form {
    width: 25%;
    height: auto;
    border-radius: 5px;
    margin: 2% auto;
    box-shadow: 0 9px 50px hsl(20deg 67% 75% / 31%);
    padding: 4%;
    background-image: linear-gradient(-225deg, #e3fdf5 50%, #ffe6fa 50%);
  }

  .title-container {
    margin: 2% auto 10% auto;
    text-align: center;
    .title {
      font-size: 30px;
      margin: 0px auto 48px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}

.svg-container {
  padding: 0 10px;
  color: $dark_gray;
}

//登录按钮
.login-btn {
  width: 100%;
  height: 52px;
  font-size: 18px;
  margin-top: 28px;
  border-color: #b8f2e6;
  background-color: #b8f2e6;
}

.show-pwd {
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
}
</style>
