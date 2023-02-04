
const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
  res.render('realTimeProducts.handlebars', { style: 'users.css' })
})

module.exports = router
