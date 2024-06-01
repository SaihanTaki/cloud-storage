const mongoose = require('mongoose')
const bcrypt = require('bcrypt') 
const validator = require('validator')
const jwt = require('jsonwebtoken')

const config = require("../configs/auth.config")

const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid Email']
  },
  // imagefile: {
  //   type: String,
  //   required: false,
  //   default: 'defaultProfile.jpg'
  // },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference to the Role model (optional)
  }

});

userSchema.pre('save', function(next){
    var user = this

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt){
        if (error) return next(error)

        bcrypt.hash(user.password, salt, function(error, hash){
            if (error) return next(error)

            user.password = hash
            next()
        })
    })
})


// userSchema.pre('save', function(next) {
//   if (!this.role || !mongoose.Types.ObjectId.isValid(this.role)) {
//     return next(new Error('Invalid role reference'));
//   }
//   next();
// });


userSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
  this.options.runValidators = true;
  const data = this.getUpdate();
  if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_WORK_FACTOR);
  }
next()
});


userSchema.methods.checkPassword = function(cadidatePassword){
    return bcrypt.compareSync(cadidatePassword, this.password, function(err, result){
      console.log(result)
      return result
    })
}

userSchema.methods.createAccessToken = function(){
  let user = this
  const token = jwt.sign({id: user._id}, config.JWT_ACCESS_TOKEN, {expiresIn: config.JWT_ACCESS_EXPIRATON})
  return token
}


// userSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id, delete ret.password, delete ret.imagefile;
//   },
// });



userSchema.methods.getResetToken = function(){

}

userSchema.methods.verifyResetToken = function(){

}

module.exports = mongoose.model('User', userSchema);