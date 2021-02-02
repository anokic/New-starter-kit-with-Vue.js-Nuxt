
/**
 * Check if string is locale.
 * ie. 'en_US' => true,
 * @param  {String}  segment String (url segment).
 * @return {Boolean}
 */
export function isLocale (segment) {
  const localeRegExp = new RegExp(/^[a-z]{2}-[A-Z]{2}$/)
  return localeRegExp.test(segment)
}

/**
 * Get locale from route.
 * @param  {String} route   Route.
 * @param  {String} default A default locale.
 * @return {String}         A locale.
 */
export function getLocale (route, defaultLocale = 'en_US') {
  let locale = defaultLocale
  if (typeof route !== 'string') { return locale }
  // remove leading slash or (|) trailing slash
  route = route.replace(/^\/|\/$/g, '')
  const routeSegments = route.split('/')
  const firstSegment = routeSegments[0]
  if (isLocale(firstSegment)) {
    locale = firstSegment
  }

  return locale
}

/**
 * Get Host name from a URL.
 * @param  {String} url A URL.
 * @return {String}     A Host name.
 */
export function getHostName (url) {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2]
  } else {
    return null
  }
}
