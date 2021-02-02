/* Module: pages */
import stringify from 'json-stringify-safe'
import framework from '@/plugins/framework'

// STATE -----------------------------------------------------------------------

const state = () => ({
  activePage: null,
  translations: {},
  navigation: [],
  footer: {},
  urls: []
})

// GETTERS ---------------------------------------------------------------------

const getters = {
  getState: state => prop => state[prop],

  getParsedPages: state => state.parsedPages,
  getPages: state => state.pages,

  getUrls: state => state.urls,

  getManyByAttr: state => (type, value, collection = 'urls') =>
    state[collection].filter(page => _.get(page, type) === value),

  getByAttr: state => (type, value, collection = 'urls') =>
    state[collection].find(page => _.get(page, type) === value)
}

// MUTATIONS -------------------------------------------------------------------

const mutations = {
  SET_STATE: (state, { prop, value }) => {
    state[prop] = value
  }
}

// ACTIONS ---------------------------------------------------------------------

const actions = {
  // @TODO create store helper functions.
  SET_STATE ({ commit }, obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        commit('SET_STATE', { prop: key, value: obj[key] })
      }
    }
  },

  async LOAD_FOOTER ({ commit, getters, dispatch }, locale) {
    let footer = await framework.loadByType({
      contentType: 'pageFooter',
      include: 1,
      limit: 1
    })

    footer = JSON.parse(stringify(footer.items[0], null, 2))

    const fullWidthImageReference = framework.parseFields(
      _.get(footer, 'fields.fullWidthImageReference')
    )

    footer.fields.fullWidthImageReference = fullWidthImageReference

    commit('SET_STATE', {
      prop: 'footer',
      value: footer,
      locale
    })
  },

  async LOAD_NAVIGATION ({ commit, getters, dispatch }, locale) {
    let navigation = await framework.loadByType({
      contentType: 'navigation',
      include: 1,
      limit: 1,
      locale
    })

    navigation = JSON.parse(stringify(navigation.items[0], null, 2))
    const urls = getters.getState('urls')

    const parsedNav = framework.parsePage({
      page: navigation,
      collection: urls,
      assign: true,
      debug: true
    })

    commit('SET_STATE', {
      prop: 'navigation',
      value: parsedNav
    })

    return parsedNav
  },

  async LOAD_TRANSLATIONS ({ commit, getters, dispatch }, locale) {
    const translations = await framework.loadByType({
      contentType: 'translation',
      include: 1,
      limit: 1000,
      locale
    })

    const tr = _.mapValues(
      _.mapKeys(translations.items, item => item.fields.title),
      (t, k) => t.fields.translation
    )

    commit('SET_STATE', {
      prop: 'translations',
      value: tr
    })
  }
}

// =============================================================================

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
