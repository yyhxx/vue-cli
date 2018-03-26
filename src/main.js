// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



//引入rem
import '@/utils/rem'

//引入百度地图
import BMap from 'BMap'

// 引入axios
import service from "@/utils/request"
Vue.prototype.$http = service

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
