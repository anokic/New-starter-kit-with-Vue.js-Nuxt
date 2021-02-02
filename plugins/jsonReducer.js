/* eslint-disable */
// unfinished file, probably not used
import _ from 'lodash'
import appConfig from './../config/appConfig'

let arrayOfKeys
let arrayOfKeptFields

const jsonReducer = {
  findAndReduce (obj, index) {
    if (!obj) { return null }

    if (index < arrayOfKeys.length) {
      if (!_.isArray(obj)) {
        return _.mapValues(obj, (o, key) => {
          if (key === arrayOfKeys[index]) {
            return framework.findAndReduce(o, index + 1)
          } else {
            return o
          }
        })
      } else {
        return _.map(obj, (o, i) => framework.findAndReduce(o, index + 1))
      }
    } else {
      return _.mapValues(obj, (o, k) => {
        // return _.includes(arrayOfKeptFields, k) ? o : null
        if (_.includes(arrayOfKeptFields, k)) {
          return o
        } else {
          return
        }
      })
    }
  },

  reduceFields (reducedPages, pageKey) {
    let pageToReduce = appConfig.pagesToReduce.find(pageToReduce =>
      pageToReduce.page === pageKey)

    if (pageToReduce) {
      _.forEach(pageToReduce.fieldsToReduce, (fieldToReduce) => {
        arrayOfKeptFields = fieldToReduce.fieldsToKeep
        arrayOfKeys = _.split(fieldToReduce.path, '.')

        reducedPages = framework.findAndReduce(reducedPages, 0)
      })

      return reducedPages
    } else {
      console.error(`COULD NOT FIND AN OBJECT WITH PROPERTY page='${pageKey}'`)
      return null
    }
  }
}

export default jsonReducer
