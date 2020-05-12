import Vue from 'vue'
const env = process.env.NODE_ENV
Vue.prototype.toast = (str) => { // 提示的
  if(env === 'development') return alert(str)
  androids.message(str)
}
Vue.prototype.loginIptBlur = (e) => { // 获取焦点的
  if(env === 'development') return
  if (e === 2) androids.inputFocus()
  else androids.inputBlur()
}
Vue.prototype.isNull = (val) => { // 判断用户是否已登陆
  return (val === '' || val === null || val === undefined)
}
