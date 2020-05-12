import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import typing from './modules/typing'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    typing
  },
  getters
})

export default store
