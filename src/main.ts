import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)
import router from "./router"

//import element-plus
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/es/locale/lang/zh-cn"
app.use(ElementPlus, { locale: zhCn })

import "@/styles/index.scss" // global css

// global mixin
// import elementMixin from '@/mixins/elementMixin'
// app.mixin(elementMixin)
// import commonMixin from '@/mixins/commonMixin'
// app.mixin(commonMixin)
// import routerMixin from '@/mixins/routerMixin'
// app.mixin(routerMixin)
// //import axios req
// import axiosReq from '@/utils/axiosReq'
// app.config.globalProperties.$axiosReq = axiosReq

//import svg-icon doc in  https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md
import "virtual:svg-icons-register"

//global mount moment-mini
// import $momentMini from 'moment-mini'
// app.config.globalProperties.$momentMini = $momentMini
//import global directive
import directive from "@/directive"
directive(app)
//import router  intercept
import "./permission"

import SvgIcon from "@/components/SvgIcon/SvgIcon.vue"
import XzInput from "@/components/XzComm/XzInput/index.vue"
import XzSelect from "@/components/XzComm/XzSelect/index.vue"
import XzSearch from "@/components/XzComm/XzSearch/index.vue"
import XzTable from "@/components/XzComm/XzTable/index.vue"
app.component("XzInput", XzInput)
app.component("XzSelect", XzSelect)
app.component("XzSearch", XzSearch)
app.component("XzTable", XzTable)
app.component("SvgIcon", SvgIcon)

import { showNotify } from "@/utils"
app.config.globalProperties.$showNotify = showNotify

//error log  collection
import errorLog from "@/hooks/useErrorLog"
errorLog()

//pinia
import { createPinia } from "pinia"

console.log(import.meta.env)

app.use(createPinia())

app.use(router).mount("#app")
