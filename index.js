const uuid = require('uuid/v4')
const express = require('express')
const handlebars = require('express-handlebars')

const csrf = uuid()
const MeEndpointBaseURL = `https://graph.accountkit.com/${process.env.ACCOUNT_KIT_VERSION}/me`
const TokenExchangeBaseURL = `https://graph.accountkit.com/${process.env.ACCOUNT_KIT_VERSION}/access_token`

const server = express()

server.set('view engine', '.hbs')
server.engine('.hbs', handlebars({ extname: '.hbs' }))

server.use(express.urlencoded({ extended: true }))

server.get('/signin', (req, res) => {
  res.render('signin', {
    csrf,
    appId: process.env.FB_APP_ID,
    version: process.env.ACCOUNT_KIT_VERSION
  })
})

server.post('/signin', (req, res) => {
  res.render('home')
})

server.listen(3000, () => {
  console.log('Server listening on localhost:3000...')
})
