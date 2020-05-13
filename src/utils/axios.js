import axios from 'axios'
import Vue from 'vue'
const ip = 'http://xlboy.cn:8988'
const axiosFun = {
  post(src, json) {
    return new Promise(resolve => {
      axios.post(`${ip}${src}`, json)
        .then((response) => {
          resolve(response.data)
        })
    })
  }
}
Vue.prototype.$axios = axiosFun
