const fs = require('fs')
const path = require('path')
const framework = require('../../plugins/framework').default
// const name = require('../../ecosystem.config').apps[0].name
// const shellExec = require('shell-exec')

const RoutesRepository = () => {
  /**
   * Create a route for a Contentful entity.
   * @param  {Object} entity Contentful entity.
   * @return {Object}        A route object.
   */
  this.generateRoute = (entity) => {
    return {
      url: entity.url,
      id: entity.sys.id,
      component: framework.getPageTemplate(entity),
      title: entity.fields.title
      // inFooter: entity.fields.inFooter,
      // orderInFooter: entity.fields.orderInFooter
    }
  }

  this.fetchRoutes = async (data, forceRestart) => {
    const routes = []

    // CMS URLs (contentful)
    const cmsItems = await framework.loadUrls()
    cmsItems.forEach((item) => {
      routes.push(this.generateRoute(item))
    })

    fs.writeFile(
      path.join(__dirname, '../../routes.json'),
      JSON.stringify(routes),
      function (err) {
        if (forceRestart) {
          // const shellExec = require('shell-exec')
          // @TODO secure this action.
          // @TODO remove hardcoded path.
          // shellExec('cd /home/markorajevic/sites/r7 && npm run build && pm2 restart ' + name)
          //   .then(console.log)
          //   .catch(console.log)
        }

        if (err) {
          throw err
        }
      }
    )

    return routes
  }

  return this
}

module.exports = RoutesRepository
