import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'ress'
import './plugins/element.js'
import './plugins/firebase'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
