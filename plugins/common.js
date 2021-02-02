// Common functions
import Vue from 'vue'
import {
  capitalize,
  convertToSlug,
  stripHtml
} from '@/utils/stringUtils'
import {
  getHostName
} from '@/utils/urlUtils'
const removeDiacritics = require('diacritics').remove

Vue.mixin({
  methods: {
    getImage (model, key, size, mobileSize) {
      if (!model || !_.isObject(model)) {
        return size ? model + size : model
      }

      // check if the model is asset
      const isImage = model.sys && model.sys.type === 'Asset'
      if (!isImage && !model.fields) { return }

      let img = isImage ? model : model.fields[key]

      img = _.isArray(img) ? img[0].file.url
        : img && img.fields.file ? img.fields.file.url
          : null

      if (this.$device && this.$device.isMobile) {
        size = mobileSize || '?w=480'
      }

      img = size ? img + size : img

      if (this.$webp) {
        img += '&fm=webp'
      }

      return img + '&q=80'
    },

    // @see { stripHtml } from '@/utils/stringUtils'
    stripHtml,

    getAttribute (model, key) {
      let value = false
      const attrs = (model && model.fields) || {}

      if (key in attrs) {
        value = attrs[key]

        if (value === 0) {
          value = false
        }
      }

      return value
    }
  }
})

const common = {
  install (options) {
    /* eslint-disable */

    /**
     * Number.prototype.formatMoney - description
     * usage: (123456789.12345).formatMoney(2, '.', ',');
     */
    Number.prototype.formatMoney = function(c, d, t) {
      var n = this,
          c = isNaN(c = Math.abs(c)) ? 0 : c,
          d = d == undefined ? '.' : d,
          t = t == undefined ? ',' : t,
          s = n < 0 ? '-' : '',
          i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
          j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(
        c).slice(2) : '');
    };

    // @TODO use { sanitize } from '@/utils/stringUtils'
    String.prototype.sanitize = function() {
      if (!this) { return }
      const g = removeDiacritics(this)
      return g
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
    }

    // @TODO use { capitalize } from '@/utils/stringUtils'
    String.prototype.capitalize = function() {
      if (typeof this !== 'string') { return this }
      return this.charAt(0).toUpperCase() + this.slice(1)
    }

    // @TODO maybe use { stripHtml } from '@/utils/stringUtils'
    String.prototype.stripHtml = function() {
      if (typeof this !== 'string') { return this }
      var tmp = document.createElement('DIV')
      tmp.innerHTML = this
      return tmp.textContent || tmp.innerText || ''
    }

    /* eslint-enable */

    // @see '/utils/stringUtils.js#convertToSlug'
    Vue.prototype.convertToSlug = convertToSlug

    // @see '/utils/stringUtils.js#capitalize'
    Vue.prototype.capitalize = capitalize

    // @see { getHostName } from '@/utils/urlUtils'
    Vue.prototype.getHostName = getHostName

    // USE LIKE THIS --> this.loadImage(imgUrl).then(() => {});
    Vue.prototype.loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => { resolve(url) }
        img.onerror = () => { reject(url) }
        img.src = url
      })
    }

    // @TODO try not to overuse lodash; move to utils; refactor the code;
    Vue.prototype.getUniqueValues = (collection, filterName) => {
      collection = collection.filter(Boolean)
      if (!collection.length) { return }

      const unique = _.uniq(
        _.map(collection, (val, key) => val.fields[filterName])
          .filter(model => model || _.isNumber(model))
      ).sort()

      return unique
    }

    // USE LIKE THIS --> this.loadImages([imgUrls]).then(() => {});
    Vue.prototype.loadImages = (options) => {
      let imageCount = 0
      const images = []

      if (!options.urls) {
        options.callback && options.callback()
        return
      }

      options.urls.forEach((src) => { // for each image url
        const image = new Image()
        image.src = src

        image.onload = () => {
          imageCount += 1
          if (imageCount === options.urls.length) {
            // have all loaded ????
            options.callback && options.callback()
            return images
          }
        }
        images.push(image) // add loading image to images array
      })
    }
  }
}

Vue.use(common)
