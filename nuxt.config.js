import webpack from 'webpack'
import _ from 'lodash'
import dynamicRoutes from './routes.json'
require('dotenv').config()

import PurgecssPlugin from 'purgecss-webpack-plugin'
import glob from 'glob-all'
import path from 'path'

const routesRepository = require('./api/repository/routes.repository')()
routesRepository.fetchRoutes('en').then((data) => {})

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      }
    ],
    script: []
  },

  // Client side environment variables.
  // @see https://nuxtjs.org/api/configuration-env
  env: {
    defaultLocale: 'en'
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#FF5100'
  },

  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.scss'],

  serverMiddleware: ['~api/api.js'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/contentful',
    '~/plugins/common',
    '~/plugins/eventBus.js',
    '~/plugins/i18n.js',
    // autoloading global components
    '~/plugins/global-components.js',
    '~/plugins/vuex-router-sync'
  ],

  router: {
    // @TODO check!!
    extendRoutes (routes, resolve) {
      _.each(dynamicRoutes, (route) => {
        routes.push({
          path: route.url,
          name: route.id,
          component: resolve(__dirname, `pages/${route.component}.vue`)
        })
      })
    },
    middleware: ['i18n']
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/device',
    '@nuxtjs/router',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
    ['@nuxtjs/pwa', {
        meta: {
            name: false,
            ogType: false,
            ogTitle: false,
            ogDescription: false,
            description: false,
            title: false,
        }
    }],
  ],


  icon: {
      iconSrc: './static/favicon.png'
  },

  styleResources: {
    scss: ["~assets/css/design.scss"]
  },

  /*
   ** Build configuration
   */
  build: {

    extractCSS: {
      allChunks: process.env.NODE_ENV === "production"
    },

    watch: [
      '~/api/'
    ],

    // @TODO keep remove
    babel: {
      plugins: process.env.NODE_ENV === "production" ? ["transform-remove-console"] : [],
      sourceType: 'unambiguous'
    },

    /*
     ** You can extend webpack config here
     */
     // extend(config, ctx) {
    //     if (!ctx.isDev) {
    //       // Remove unused CSS using PurgeCSS. See https://github.com/FullHuman/purgecss
    //       // for more information about PurgeCSS.
    //       config.plugins.push(
    //         new PurgecssPlugin({
    //           paths: glob.sync([
    //             path.join(__dirname, './pages/**/*.vue'),
    //             path.join(__dirname, './layouts/**/*.vue'),
    //             path.join(__dirname, './components/**/*.vue')
    //           ]),
    //           whitelist: ['html', 'body']
    //         })
    //       )
    //     }
    // },

    // @TODO remove lodash, use es6 functions or import lodahs modules.
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ]
  },

  /* TO DO */

  generate: {
    routes: [
      '/'
    ]
  }
}
