// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import data from './data'  // 封装好的初始数据


// 引入全局样式
import '@/assets/css/index.scss'
// 设置 js中可以访问 $cdn
import {$cdn} from '@/config'

Vue.prototype.$cdn = $cdn

// axios
import  '@/utils/axios.js'
// 一些公共方法的js
import  '@/utils/public.js'

// 全局引入按需引入UI库 vant、element-ui....
import '@/plugins/vant'
import '@/plugins/element-ui'
import '@/plugins/v-charts'
// import '@/plugins/vconsole'


// 移动端适配--里面需要改个定时器的延时秒数，300ms的TimeOut定时器注释掉
import 'lib-flexible/flexible.js'

// filters
import './filters'

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  data: {
    ...data,
    eventHub: new Vue()
  },
  render: h => h(App)
})
