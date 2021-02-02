export default async function (ctx, inject) {
  const icons = {"64x64":"/_nuxt/icons/icon_64.31508f.png","120x120":"/_nuxt/icons/icon_120.31508f.png","144x144":"/_nuxt/icons/icon_144.31508f.png","152x152":"/_nuxt/icons/icon_152.31508f.png","192x192":"/_nuxt/icons/icon_192.31508f.png","384x384":"/_nuxt/icons/icon_384.31508f.png","512x512":"/_nuxt/icons/icon_512.31508f.png"}
  const getIcon = size => icons[size + 'x' + size] || ''
  inject('icon', getIcon)
}
