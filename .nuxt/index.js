import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '../layouts/error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_workbox_521ee984 from 'nuxt_plugin_workbox_521ee984' // Source: ./workbox.js (mode: 'client')
import nuxt_plugin_nuxticons_ceaa7034 from 'nuxt_plugin_nuxticons_ceaa7034' // Source: ./nuxt-icons.js (mode: 'all')
import nuxt_plugin_cookieuniversalnuxt_1c5f524a from 'nuxt_plugin_cookieuniversalnuxt_1c5f524a' // Source: ./cookie-universal-nuxt.js (mode: 'all')
import nuxt_plugin_router_09a0294d from 'nuxt_plugin_router_09a0294d' // Source: ./router.js (mode: 'all')
import nuxt_plugin_libpluginf33eb774_6f1efd35 from 'nuxt_plugin_libpluginf33eb774_6f1efd35' // Source: ./lib.plugin.f33eb774.js (mode: 'all')
import nuxt_plugin_contentful_cbbecb4c from 'nuxt_plugin_contentful_cbbecb4c' // Source: ../plugins/contentful (mode: 'all')
import nuxt_plugin_common_7195563e from 'nuxt_plugin_common_7195563e' // Source: ../plugins/common (mode: 'all')
import nuxt_plugin_eventBus_aaeb250a from 'nuxt_plugin_eventBus_aaeb250a' // Source: ../plugins/eventBus.js (mode: 'all')
import nuxt_plugin_i18n_1fba523a from 'nuxt_plugin_i18n_1fba523a' // Source: ../plugins/i18n.js (mode: 'all')
import nuxt_plugin_globalcomponents_52ce1226 from 'nuxt_plugin_globalcomponents_52ce1226' // Source: ../plugins/global-components.js (mode: 'all')
import nuxt_plugin_vuexroutersync_91788f0c from 'nuxt_plugin_vuexroutersync_91788f0c' // Source: ../plugins/vuex-router-sync (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp (ssrContext) {
  const router = await createRouter(ssrContext)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  const registerModule = store.registerModule
  store.registerModule = (path, rawModule, options) => registerModule.call(store, path, rawModule, Object.assign({ preserveState: process.client }, options))

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"LimniaSummer","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Test project"},{"http-equiv":"X-UA-Compatible","content":"IE=edge"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"LimniaSummer"},{"hid":"author","name":"author","content":"Velimir Matic"},{"hid":"theme-color","name":"theme-color","content":"#FF5100"}],"script":[],"link":[{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.7b00fde0.json"},{"rel":"shortcut icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_64.31508f.png"},{"rel":"apple-touch-icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_512.31508f.png","sizes":"512x512"}],"style":[],"htmlAttrs":{"lang":"en"}},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  const inject = function (key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Plugin execution

  if (process.client && typeof nuxt_plugin_workbox_521ee984 === 'function') {
    await nuxt_plugin_workbox_521ee984(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxticons_ceaa7034 === 'function') {
    await nuxt_plugin_nuxticons_ceaa7034(app.context, inject)
  }

  if (typeof nuxt_plugin_cookieuniversalnuxt_1c5f524a === 'function') {
    await nuxt_plugin_cookieuniversalnuxt_1c5f524a(app.context, inject)
  }

  if (typeof nuxt_plugin_router_09a0294d === 'function') {
    await nuxt_plugin_router_09a0294d(app.context, inject)
  }

  if (typeof nuxt_plugin_libpluginf33eb774_6f1efd35 === 'function') {
    await nuxt_plugin_libpluginf33eb774_6f1efd35(app.context, inject)
  }

  if (typeof nuxt_plugin_contentful_cbbecb4c === 'function') {
    await nuxt_plugin_contentful_cbbecb4c(app.context, inject)
  }

  if (typeof nuxt_plugin_common_7195563e === 'function') {
    await nuxt_plugin_common_7195563e(app.context, inject)
  }

  if (typeof nuxt_plugin_eventBus_aaeb250a === 'function') {
    await nuxt_plugin_eventBus_aaeb250a(app.context, inject)
  }

  if (typeof nuxt_plugin_i18n_1fba523a === 'function') {
    await nuxt_plugin_i18n_1fba523a(app.context, inject)
  }

  if (typeof nuxt_plugin_globalcomponents_52ce1226 === 'function') {
    await nuxt_plugin_globalcomponents_52ce1226(app.context, inject)
  }

  if (typeof nuxt_plugin_vuexroutersync_91788f0c === 'function') {
    await nuxt_plugin_vuexroutersync_91788f0c(app.context, inject)
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, () => {
        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from, next) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }