const Minio = require('minio')
const {v4:uuidv4} = require('uuid')


const minioClient = new Minio.Client({
    endPoint: 'obscontainer',
    port: 9000,
    useSSL: false,
    accessKey: 'MAf75fy6i1BqTMENKaDr',
    secretKey: 'dg1GhxfN8otgrs1KinQQ2YcsiQSXyqxGpVkdJiHN',
  })



// Only Admin
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


// user
async function uploadToBucket(bucketName, objectName, filePath){
    const exists = minioClient.bucketExists(bucketName)
    exists.then(async function(exist){
        if (!exist) return console.log('Bucket does not exist!')
        await minioClient.fPutObject(bucketName, objectName, filePath, function(err){
            if (err) return console.log(err)
            console.log('Upload successed!')
    })
})
}


// listAllBuckets()


module.exports = {
    listAllBuckets,
    makeUserSpace,
    uploadToBucket
}


  

