const { addAsync } = require('@awaitjs/express')
const crypto = require('crypto')
const request = require('request-promise-native')
const { Router } = require('express')

const router = addAsync(Router())

const getAppSecretProof = function getAppSecretProof (userAccessToken) {
  const hmac = crypto.createHmac('sha256', process.env.ACCOUNT_KIT_SECRET)
  const data = hmac.update(userAccessToken)
  return data.digest('hex')
}

router.postAsync('/login', async (req, res) => {
  if (req.body.csrf !== res.locals.csrf) {
    return res.status(500).json({
      errors: [ { title: 'Invalid or missing CSRF token' } ]
    })
  }
  const result = {}
  const appAccessToken = [ 'AA', process.env.FB_APP_ID, process.env.ACCOUNT_KIT_SECRET ].join('|')
  const exchangeParams = {
    grant_type: 'authorization_code',
    code: req.body.code,
    access_token: appAccessToken
  }
  const exchangeOptions = {
    uri: res.locals.TokenExchangeBaseURL,
    qs: exchangeParams,
    json: true
  }
  const exchangeData = await request(exchangeOptions)
  result.token = exchangeData.access_token
  const accountOptions = {
    uri: res.locals.MeEndpointBaseURL,
    qs: {
      access_token: exchangeData.access_token,
      appsecret_proof: getAppSecretProof(exchangeData.access_token)
    },
    json: true
  }
  const accountData = await request(accountOptions)
  result.phone = accountData.phone.number
  res.json({ data: result })
})

module.exports = router
