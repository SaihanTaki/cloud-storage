const express = require('express')
const authController = require('../controllers/auth.controller')

router = express.Router()

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)
router.post('/logout', authController.logout)
router.post('/refreshtoken', authController.refreshToken)

module.exports = router