const removeDiacritics = require('diacritics').remove

export function capitalize (str) {
  if (typeof str !== 'string') { return str }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function sanitize (str) {
  if (!str) { return }
  const g = removeDiacritics(str)
  return g
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export function stripHtml (str) {
  if (typeof str !== 'string') { return '' }
  return str
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/^\s+|\s+$/gm, '')
}

export function convertToSlug (str) {
  return str ? str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '') : null
}
