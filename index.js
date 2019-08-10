const { addAsync } = require('@awaitjs/express')
const express = require('express')
const handlebars = require('express-handlebars')
const helmet = require('helmet')
const uuid = require('uuid/v4')

const index = require('./routes/index')
const login = require('./routes/login')

const csrf = uuid()

const server = addAsync(express())

server.set('view engine', '.hbs')
server.engine('.hbs', handlebars({ extname: '.hbs' }))

server.use(helmet())
server.use(express.urlencoded({ extended: true }))

server.use((req, res, next) => {
  res.locals.csrf = csrf
  res.locals.MeEndpointBaseURL = `https://graph.accountkit.com/${process.env.ACCOUNT_KIT_VERSION}/me`
  res.locals.TokenExchangeBaseURL = `https://graph.accountkit.com/${process.env.ACCOUNT_KIT_VERSION}/access_token`
  next()
})

server.use(index)
server.use(login)

server.use((error, req, res, next) => {
  console.error(error.message)
  res.render('error')
})

server.listen(3000, () => {
  console.log('Server listening on localhost:3000...')
})
