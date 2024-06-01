const express = require('express')
const userController = require('../controllers/user.controller')
const authJWT = require("../middlewares/authJWT")
const verifyRoles = require("../middlewares/verifyRole")
const middlewareUtils = require("../middlewares/utils")

const asyncHandler = middlewareUtils.asyncHandler
const loginRequired = authJWT.verifyToken
const isAdmin = asyncHandler(verifyRoles.verifyRoles("ADMIN"))


router = express.Router()

router.get('/', [loginRequired, isAdmin], userController.getAllUsers)
router.get('/:id', [loginRequired], userController.getUser)
router.put('/:id', [loginRequired], userController.updateUser)
router.delete('/:id', [loginRequired], userController.deleteUser)

module.exports = router