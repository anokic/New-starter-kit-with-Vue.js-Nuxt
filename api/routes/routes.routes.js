const express = require('express')
const router = express.Router()
const routesRepository = require('../repository/routes.repository')()

router.get('/generate', async (req, res, next) => {
  try {
    res.send(await routesRepository.fetchRoutes())
  } catch (err) {
    next(err)
  }
})

module.exports = router
