import Vue from 'vue'
import App from '@/App.vue'
import router from './router/index'
import storeRoot from './store'
import Vuex from 'vuex'
import { sync } from "vuex-router-sync"
import './assets/styles.css'

Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store(storeRoot)
sync(store, router);

new Vue({
  render: h => h(App),
  router,
  store  
}).$mount('#app')
