import Vue from 'vue'
import VueI18n from 'vue-i18n'
import siteConfig from '@/config/siteConfig'

Vue.use(VueI18n)

export default ({ app, store }) => {
  const messages = {}
  siteConfig.locales.forEach((locale, i) => {
    messages[locale] = store.state.pages.translations[locale]
  })

  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: siteConfig.defaultLocale,
    silentTranslationWarn: true,
    messages
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${app.i18n.locale}/${link}`
  }
}
