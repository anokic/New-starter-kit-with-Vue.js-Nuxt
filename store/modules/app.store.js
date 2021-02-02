/* Module: app */

const state = () => ({
  defaultTitle: 'Nesto nesto',
  scrollTop: 0,
  width: 0,
  height: 0,
  webp: false,
  scrolled: false,
  scrollStart: false,
  menuOpen: false,
  myAccountPopUp: false,
  mouseX: 0,
  mouseY: 0,
  cursorBounds: null,
  mouseDown: false,
  currentScene: false,
  whiteNav: false,
  blackLogo: false,
  blackNav: false,
  addedProduct: null,
  notification: null,
  showLoader: false
})

const actions = {
  SET_STATE ({ commit }, obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        commit('SET_STATE', { prop: key, value: obj[key] })
      }
    }
  }
}

const mutations = {
  SET_STATE: (state, { prop, value }) => {
    state[prop] = value
  }
}

const getters = {
  getState: state => prop => state[prop]
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
