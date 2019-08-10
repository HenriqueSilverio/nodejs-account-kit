const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
  res.render('signin', {
    csrf: res.locals.csrf,
    appId: process.env.FB_APP_ID,
    version: process.env.ACCOUNT_KIT_VERSION
  })
})

module.exports = router
