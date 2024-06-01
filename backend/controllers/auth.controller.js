const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require("../configs/auth.config")
const db = require("../models/")
const User = db.user
const Role = db.role


const RefreshToken = require("../models/refreshToken.model")

const signup = async function signup(req, res){

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
   
    

    if (req.body.role){
        const role = await Role.findOne({"name": req.body.role})
        if (!role) return res.status(500).send({"message": `'${req.body.role}' is not a valid role`})
        user.role = role._id 
    }

    try {
        await user.save()
        // login user upon sign up
        const token = user.createAccessToken()
        const refreshToken = await RefreshToken.createToken(user)
        
        return res.status(200).send({ 
            message: "User was registered successfully!",
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: token,
            refreshToken: refreshToken})
        
    } catch (err) {
        return res.status(500).send({message: err})
    }
}


const signin = async function signin(req, res){
    const user = await User.findOne({"email":req.body.email})

    if (!user){
        return res.status(404).send({"message":"user not found!"})
    }

   
    if (!user.checkPassword(req.body.password)){
        return res.status(400).send({"message": "Invalid Password"})
    }

    const token = user.createAccessToken()
    const refreshToken = await RefreshToken.createToken(user)

    return res.status(200).send({
        message: "Login successfull!",
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token,
        refreshToken: refreshToken,
      });


}


const logout = function logout(req, res){
    
}


const catchError = (err, res) => {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
  
    // return res.status(401).send({ message: "Unauthorized!" });
    console.log(err)
    return res.status(401).send(err);
  }


const refreshToken = async function refreshToken(req, res){
    const { refreshToken: requestToken } = req.body

    if (requestToken == null){
        return res.status(403).send({"message": "Refresh Token is required!"})
    }

    try {
        let refreshToken = await RefreshToken.findOne({token: requestToken})

        if (!refreshToken){
            res.status(403).send(({"message": "Refresht token is not in database!"}))
            return
        }

        if (RefreshToken.verifyExpiration(refreshToken)){
            await RefreshToken.findByIdAndDelete(refreshToken._id)
            res.status(403).send({"message":  "Refresh token was expired. Please make a new signin request"})
            return 
        }

        let newAccessToken = jwt.sign({id: refreshToken.user._id}, config.JWT_ACCESS_TOKEN, {expiresIn: config.JWT_ACCESS_EXPIRATON})

        return res.status(200).json({
            "accessToken": newAccessToken,
            "refreshToken": refreshToken.token
        })

    } catch (err) {
        return  catchError(err, res)
    }
}

module.exports = {
    signup,
    signin,
    logout,
    refreshToken
}