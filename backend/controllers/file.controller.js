const Minio = require('minio')
const {v4:uuidv4} = require('uuid')


const minioClient = new Minio.Client({
    endPoint: 'obscontainer',
    port: 9000,
    useSSL: false,
    accessKey: 'MAf75fy6i1BqTMENKaDr',
    secretKey: 'dg1GhxfN8otgrs1KinQQ2YcsiQSXyqxGpVkdJiHN',
  })



// Bucket Operations
async function listAllBuckets(){
    try {
        const bucket = minioClient.listBuckets()
        bucket.then(function(bucketList){
          console.log(bucketList)
        })
    
    } catch (err) {
        console.log(err.message)
    }
}


async function makeUserSpace(){
    const bucketName = uuidv4()
    const exists = minioClient.bucketExists(bucketName)
    exists.then(async function(exist){
        if (exist) return console.log('BucketName exists already!')
        await minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
            if (err) return console.log('Error creating bucket.', err)
            console.log('Bucket created successfully in "us-east-1"')
          })
    })
}

async function deleteUserSpace(bucketName){
    const exists = minioClient.bucketExists(bucketName)
    exists.then(async function(exist){
        if (!exist) return console.log('Bucket does not exist!')
        await minioClient.removeBucket(bucketName)
    })

}


// File Operations

async function uploadFile(bucketName, objectName, filePath){
    const exists = minioClient.bucketExists(bucketName)
    exists.then(async function(exist){
        if (!exist) return console.log('Bucket does not exist!')
        await minioClient.fPutObject(bucketName, objectName, filePath, function(err){
            if (err) return console.log(err)
            console.log('Upload successed!')
    })
})
}

async function downloadFile(bucketName, objectName, filePath){
    minioClient.fGetObject(bucketName, objectName, filePath, function (err) {
        if (err) return console.log(err)
        console.log('Download successed!')
      })
}


async function deleteFile(bucketName, objectName){
    const del = minioClient.removeObject(bucketName, objectName)
    del.then(() => {
        console.log('Delete succed!')
    }).catch((e) => {
    console.log('error', e)
})
}

deleteFile('hello', 'myfolder/iraCodeNerdFont-Light.ttf')


async function listAllFiles(bucketName, directory){
    const data = []
    const stream = minioClient.listObjects(bucketName, directory, true)
    stream.on('data', function (obj) {
        data.push(obj)
    })
    stream.on('end', function (obj) {
        console.log(data)
        return data
    })
    stream.on('error', function (err) {
        return console.log(err.message)
    })
}

async function createFileShareLink(bucketName, fileName, expiry,){
    minioClient.presignedGetObject(bucketName, fileName, expiry, function (err, presignedUrl) {
        if (err) return console.log(err.message)
        console.log(presignedUrl)
    })
}


module.exports = {
    listAllBuckets,
    makeUserSpace,
    deleteUserSpace,
    listAllFiles,
    uploadFile,
    downloadFile,
    deleteFile,
}





  

