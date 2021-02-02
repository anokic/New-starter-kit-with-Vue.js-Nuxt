const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const routesRoutes = require('./routes/routes.routes')

const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '210mb', extended: true }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res, next) => {
  res.send('API root')
})

app.use('/routes', routesRoutes)
// app.use('/products', productRoutes)
// app.use('/orders', ordersRoutes)

module.exports = {
  path: '/api',
  handler: app
}
