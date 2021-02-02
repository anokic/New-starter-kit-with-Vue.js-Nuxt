import _ from 'lodash'
import {
  capitalize,
  sanitize,
  stripHtml
} from '../utils/stringUtils'
import {
  isLocale,
  getLocale
} from '../utils/urlUtils'
// Config
import appConfig from '../config/appConfig'
// import siteConfig from '../config/siteConfig'
import { createClient } from './contentful.js'
const format = require('dateformat')
const marked = require('marked/lib/marked')

// Contentful Client
const client = createClient()

const framework = {
  // @see { stripHtml } from '@/utils/stringUtils'
  stripHtml,

  // @see { isLocale } from '@/utils/urlUtils'
  isLocale,

  // @see { getLocale } from '@/utils/urlUtils'
  getLocale: (route) => {
    return getLocale(route, process.env.defaultLocale)
  },

  // @TODO try not to use / pass store, or just move this to store
  getMasterParent: (page, store) => {
    if (!page) { return }

    if (!page.fields) {
      page = store.getters['pages/getByAttr'](
        'sys.id',
        page.sys.id,
        'urls'
      )

      if (!page.fields.parentPage) {
        return page
      }
    }

    if (!page.fields.parentPage) {
      return store.getters['pages/getByAttr'](
        'fields.slug',
        page.fields.slug,
        'urls'
      )
    }

    return framework.getMasterParent(page.fields.parentPage, store)
  },

  reducePage: (page) => {
    const reducedPage = _.pick(page, [
      'fields',
      'sys.id',
      'sys.type',
      'sys.contentType',
      'sys.linkType',
      'url',
      'parentPage'
    ])

    const rp = _.mapValues(reducedPage, (prop, key) => {
      if (key !== 'fields') { return prop }

      const parsedField = _.mapValues(reducedPage.fields, (field, fieldKey) => {
        if (!_.isObject(field)) { return field }

        if (field.sys && field.sys.type === 'Asset') {
          // single relations
          const reducedAsset = _.pick(field, [
            'fields',
            'sys.type'
          ])
          return reducedAsset
        } else {
          // multiple relations
          return _.mapValues(field, (relation, key) => relation)
        }
      })

      return parsedField
    })

    return rp
  },

  parsePage (opts) {
    let parsedPage = framework.parseFields(opts.page)

    if (opts.assign) {
      parsedPage = framework.assignUrl(opts.page, opts.collection, true)
    } else {
      parsedPage = framework.parseUrl(parsedPage, null, opts.collection, opts.debug)
    }

    parsedPage = framework.reducePage(parsedPage)
    parsedPage = framework.parseRelations(parsedPage, opts.collection, true, 0)

    // parsedPage = framework.parseMeta()
    return parsedPage
  },

  parseFields: (page) => {
    if (!page) { return }

    page.fields = _.mapValues(page.fields, (value, key) => {
      const dateFormat = appConfig.dateFormat

      return _.includes(appConfig.dateFields, key) && !page.dateParsed
        ? format(new Date(value), dateFormat) // DATES
        : _.includes(appConfig.richFields, key)
          ? marked(value) // RICH FIELDS
          : value
    })

    page.dateParsed = true
    return page
  },

  // @TODO check!
  parseMeta: (page) => {
    return page // nice!
    // let entity_type = page.sys.contentType.sys.id
    //
    // page.seo = {};
    // _.each(seoConfig.seo[entity_type], object => {
    //   let val = _.get(page, object.key) != undefined ? _.get(page, object.key) : _.get(siteConfig, object.value);
    //   if (!val) {
    //     val = _.get(page, object.fallback_key);
    //   }
    //   if (object.displaySiteTitle) {
    //     val = object.prependTitle ? siteConfig.defaultTitle + ' - ' + val : val + ' - ' + siteConfig.defaultTitle;
    //   }
    //
    //   page.seo[object.value] = val
    // })
    //
    // return page
  },

  parseRelations (page, collection, merge, iterationKey, debug) {
    iterationKey = iterationKey + 1
    if (iterationKey === 4) { return }

    const reducedPage = framework.reducePage(page)
    const parsed = _.mapValues(reducedPage, (prop, key) => {
      if (key !== 'fields') { return prop }

      const parsedField = _.mapValues(reducedPage.fields, (field, fieldKey) => {
        if (!_.isObject(field)) { return field }

        if (
          (field.sys && field.sys.contentType) ||
          (field.sys && !field.sys.contentType && field.sys.linkType === 'Entry')
        ) {
          // single relations
          return framework.parsePage({
            page: field,
            collection,
            assign: true
          })
        } else {
          // multiple relations
          const obj = _.mapValues(field, (relation, key) => {
            // not relations
            if (!relation.sys) { return relation }

            return framework.parsePage({
              page: relation,
              collection,
              assign: true
            })
          })

          if (obj[0] && obj[0].sys) {
            return _.values(obj)
          } else {
            return obj
          }
        }
      })

      return parsedField
    })

    return parsed
  },

  parseUrl (page, store, collection, debug) {
    if (!page || page.url || page.parsed || !page.sys) {
      return page
    }

    if (!page.sys.contentType) {
      // console.warn('entity is missing the data, trying to find it in the collection...')
      page = _.find(collection, p => p.id === page.sys.id)
    }

    // Home Page
    if (page.fields.isHp) {
      page.url = '/'
      return page
    }

    // Set parent for regular entities
    let parentUrl = process.env.multilanguage ? ('/' + page.sys.locale) : ''
    const entityType = page.sys.contentType.sys.id
    let parentPage = page.fields.parentPage

    if (parentPage && parentPage.sys) {
      parentPage = collection.find(p => p.sys.id === parentPage.sys.id)

      if (parentPage && !parentPage.url) {
        parentPage = framework.parseUrl(parentPage, store, collection)
      }

      if (parentPage) {
        page.parentPage = parentPage
        parentUrl = parentPage.url
      }
    }

    // Get parent for irregular entities
    for (const key in appConfig.irregularEntities) {
      if (entityType === key) {
        const entity = appConfig.irregularEntities[key]
        const prop = Object.keys(entity)[0]
        const value = entity[prop]

        // find parent by property
        // parentPage = store ? (store.getters ? store.getters['pages/getByAttr'](prop, value, "urls") : null) : null;

        if (!parentPage && collection) {
          parentPage = collection.find(page => _.get(page, prop) === value)
        }

        // check if parent is parsed
        if (parentPage && !parentPage.url) {
          parentPage = framework.parseUrl(parentPage, store, collection)
        }

        // set parent page URL
        if (parentPage) {
          page.parentPage = parentPage
          parentUrl = parentPage.url
        }
      }
    }

    const config = appConfig.entities_with_url[entityType]

    if (config) {
      let slug = page.fields.slug || page.fields.title
      slug = sanitize(slug)

      if (config.type === 'query') {
        page.url = `${parentUrl}?${entityType}=${slug}`
        // console.log('QUERY!', page.url)
      } else {
        page.url = `${parentUrl}/${slug}`
      }
    }

    // if (_.includes(Object.keys(appConfig.entities_with_url), entityType)) {
    //     page.fields.slug = page.fields.slug ? sanitize(page.fields.slug) : sanitize(page.fields.title);
    //     page.url = parentUrl + '/' + page.fields.slug
    // }

    page.parsed = true
    return page
  },

  assignUrl (page, collection, debug) {
    if (!page || page.url || !page.sys) {
      return page
    }

    const p = collection.find((p) => {
      const id = p.name || p.id
      return id === page.sys.id
    })

    if (p && p.url) {
      page.url = p.url
    }

    return page
  },

  getPageTemplate: (page) => {
    if (!page || !page.fields) { return 'NotFound' }

    let template = capitalize(page.fields.pageTemplate) ||
      appConfig.pageTemplates[page.sys.contentType.sys.id]

    // handle 404
    if (!template) {
      template = 'NotFound'
    }

    return template
  },

  loadUrls (locale) {
    const promises = []

    for (const [key, value] of Object.entries(appConfig.entities_with_url)) {
      promises.push(client.getEntries({
        locale,
        'include': 2,
        'content_type': key,
        'select': value.fields,
        'limit': 1000,
        'order': 'sys.createdAt'
      }))
    }

    return Promise.all(promises).then((results) => {
      const pagesWithUrl = []

      results.forEach((result) => {
        result.items.forEach((item) => {
          pagesWithUrl.push(item)
        })
      })

      // pagesWithUrl = pagesWithUrl.map((page) => framework.parseUrl(page, null, pagesWithUrl))
      _.each(pagesWithUrl, page => framework.parseUrl(page, null, pagesWithUrl))

      return pagesWithUrl
    })
  },

  loadByType (options) {
    return client.getEntries({
      'locale': options.locale,
      'include': options.includes,
      'content_type': options.contentType,
      'select': options.select || 'fields',
      'limit': options.limit,
      'order': options.order
    })
  },

  loadPage (options) {
    if (!options.id) { return }
    return client
      .getEntry(options.id, {
        locale: options.locale,
        include: options.include || 2
      })
      .catch((err) => {
        console.error('[framework] loadPage', options, err)
      })
  },

  async loadActivePage (options) {
    const locale = framework.getLocale(options.route)

    const page = await framework.loadPage({
      id: options.id,
      locale,
      include: options.include
    })

    return framework.parsePage({
      page,
      collection: options.urls,
      debug: true, // @TODO set debug based on environment
      assign: true
    })
  }

}

export default framework
