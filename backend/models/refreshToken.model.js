const mongoose = require('mongoose')
const {v4:uuidv4} = require('uuid')
const config = require("../configs/auth.config")



const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date

})

RefreshTokenSchema.statics.createToken = async function(user) {
    let expiredAt = new Date()

    expiredAt.setSeconds(
        expiredAt.getSeconds() + config.JWT_REFRESH_EXPIRATON
    )


let _token = uuidv4()

let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime()
})

let refreshToken = await _object.save()

return refreshToken.token
}

RefreshTokenSchema.statics.verifyExpiration = function(token) {
    return token.expiryDate.getTime() < new Date().getTime()
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)

module.exports = RefreshToken

