// 按需全局引入 element-ui
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.getLoading = () => { // 封装的一个加载方法
  console.log(ElementUI)
  let loading = ElementUI.Loading.service({
    lock: true,
    spinner: 'el-icon-loading',
    background: 'rgba(255,255,255, 0.8)'
  });
  return loading
}

