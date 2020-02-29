const express = require('express')

const router = express.Router()

router.get('/list', function(req, res, next) {
  res.json('user list...')
})

router.get('/detail', function(req, res, next) {
    res.json('user detail...')
  })

module.exports = router