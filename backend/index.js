const express = require('express')
const mongoose = require('mongoose')
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




app.get('/', function(req, res) {
    res.status(200).json({"message":"Hello World!"})
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


