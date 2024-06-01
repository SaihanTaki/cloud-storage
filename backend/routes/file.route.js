const express = require('express')
const fileController = require('../controllers/file.controller')

router = express.Router()

router.post('/uploadfile', fileController.uploadFile)
router.post('/deletefile', fileController.deleteFile)
router.post('/updatefile', fileController.updateFile)
router.post('/downloadfile', fileController.downloadFile)
router.post('/createbucket', fileController.createBucket)
router.post('/listbucket', fileController.listBucket)


module.exports = router