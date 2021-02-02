import storeModules from '@/store/modules'
import framework from '@/plugins/framework'
import dynamicRoutes from '@/routes.json'

// ACTIONS
export const actions = {
  async nuxtServerInit ({ dispatch, commit, state }, { req }) {

    const acceptHeader = req.headers.accept
    dispatch('app/SET_STATE', {
      webp: _.includes(acceptHeader, 'webp')
    })

    dispatch('pages/SET_STATE', {
      urls: dynamicRoutes
    })

    const route = state.route.path
    const locale = framework.getLocale(route)

    await dispatch('pages/LOAD_TRANSLATIONS', locale)
    await dispatch('pages/LOAD_NAVIGATION', locale)
    await dispatch('pages/LOAD_FOOTER', locale)
  }
}

// PLUGINS
// export const plugins = []

// MODULES
export const modules = storeModules
