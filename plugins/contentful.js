/**
 * A Contentful Client
 *
 * The reason why we we wrote the import in CommonJS style is that we are going
 * to use this file not only in the browser but also for the application server.
 */
const contentful = require('contentful')
// @TODO require only 'createClient' from contentful.
// const { createClient } = require('contentful')
const contentfulConfig = require('../config/contentfulConfig.json')
// @TODO change the contentful config file from json to js, exporting constants.
// const { SPACE, DELIVERY_TOKEN, PREVIEW_TOKEN } = require('./contentful-config')
const space = contentfulConfig.CTF_SPACE_ID

const accessToken = process.env.environment === 'development'
  ? contentfulConfig.CTF_PREVIEW_TOKEN
  : contentfulConfig.CTF_ACCESS_TOKEN

const host = process.env.environment === 'development'
  ? contentfulConfig.CTF_DEV_HOST
  : contentfulConfig.CTF_PROD_HOST

const config = {
  space,
  accessToken,
  host
}

module.exports = {
  createClient () {
    return contentful.createClient(config)
  }
}
