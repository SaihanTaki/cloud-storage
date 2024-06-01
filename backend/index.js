const express = require('express')
const mongoose = require('mongoose')
const Minio = require('minio')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'myuploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })  
const upload = multer({ storage: storage })
const dotenv = require('dotenv')
dotenv.config()



const userRoute = require('./routes/user.route')
const authRoute = require('./routes/auth.route')

const db = require("./models");
const User = db.user;
const Role = db.role;

PORT = process.env.PORT || 3000
MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME
MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD
MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE
// dbURI = `mongodb+srv://admin:${dbPassword}@mydb.lyt94yf.mongodb.net/simple-api?retryWrites=true&w=majority&appName=mydb`
// dbURI = "mongodb://mongo:27017/?serverSelectionTimeoutMS=3000&directConnection=true"
// ${MONGO_USERNAME}:${MONGO_PASSWORD}@authSource admin
// dbURI = "mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/mydb"
dbURI = "mongodb://mongo:27017/mydb"


app = express()

// middleware
app.use(express.json())

// routes
app.use('/user', userRoute)
app.use('/auth', authRoute)


const minioClient = new Minio.Client({
  endPoint: 'obscontainer',
  port: 9000,
  useSSL: false,
  accessKey: 'MAf75fy6i1BqTMENKaDr',
  secretKey: 'dg1GhxfN8otgrs1KinQQ2YcsiQSXyqxGpVkdJiHN',
})

try {
    const bucket = minioClient.listBuckets()
    bucket.then(function(bucketList){
      console.log(bucketList)
    })

} catch (err) {
    console.log(err.message)
}


async function uploadMinio(bucketName, objectName, filePath ){
    await minioClient.fPutObject(bucketName, objectName, filePath, function(err){
        if (err) return console.log(err)
        console.log('Upload successed!')
    })
}
 

uploadMinio('hello', 'myfolde/mycustom.sh', '../.devcontainer/custom.sh')



app.get('/', function(req, res) {
    res.status(200).json({"message":"Hello World!"})
})

app.post('/file', upload.single('file'),  function(req, res){
    console.log(req.file)
})

app.post('/minio', function(req, res){

})



mongoose.connect(dbURI).then(function(){
    console.log("Connected to database!")

    app.listen(PORT, function(){
        console.log(`Server is running on http://localhost:${PORT}`)
    })

    Role.createRoles(db.ROLES)
    console.log("Roles Created")
}).catch(function(e){
    console.log(e)
    console.log("Connection Failed!")
})


