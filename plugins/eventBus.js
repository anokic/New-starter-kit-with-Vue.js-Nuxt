import Vue from 'vue'

const eventBus = {
  install (Vue) {
    Vue.prototype.$bus = new Vue()
  }
}

Vue.use(eventBus)
