// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import common from '../static/js/commonFun'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyLoad from 'vue-lazyload'
import api from './js/api.js'
import sdk from './js/sdk/market.1.0.js'
import axios from 'axios'
import wxConfig from '../static/js/wxShare'
import fastclick from 'fastclick' // 解决移动端click 300ms问题

Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyLoad, {
  error: '/static/images/empty.png', // 添加图片
  loading: '/static/images/loading.gif', // 添加图片
  attempt: 3,
  preLoad: 2
})
Vue.config.productionTip = false
require('../static/mock')
require('../static/js/flexible')
require('../static/css/reset.css')
require('swiper/dist/css/swiper.css')
/* eslint-disable no-new */
Vue.prototype.common = common
Vue.prototype.api = api
Vue.prototype.sdk = sdk
Vue.prototype.axios = axios
Vue.prototype.wxConfig = wxConfig
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
fastclick.attach(document.body)
