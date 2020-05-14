import Vue from 'vue'
const env = process.env.NODE_ENV
Vue.prototype.toast = (str) => { // 提示的
  if (env === 'development') return alert(str)
  androids.message(str)
}
Vue.prototype.loginIptBlur = (e) => { // 获取焦点的
  // if (env === 'development') return
  if (e === 2) androids.inputFocus()
  else androids.inputBlur()
}
Vue.prototype.isNull = (val) => { // 判断用户是否已登陆
  return (val === '' || val === null || val === undefined)
}

Vue.prototype.shuffle = (array) => { // 打乱数组，用于乱序单字等等
  let m = array.length,
    t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
Vue.prototype.convertCanvasToImage = (canvas) => { // canvas转图片
  return canvas.toDataURL("image/png");
}
