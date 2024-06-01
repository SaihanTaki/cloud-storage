const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure unique role names
    enum: ["ADMIN", "EDITOR", "VIEWER"]
  }
});




RoleSchema.methods.toString = function(){
  return this.name
}

RoleSchema.statics.createRoles =  async function(roles){

  for(let i=0; i<roles.length; i++){
    role = roles[i].toUpperCase()
    roleExist = await this.findOne({name: role})
    if(!roleExist){
      let roleName = role
      const _obj = new this({name: roleName})
      await _obj.save()
    }
  }
  
  return 
}
  

module.exports = mongoose.model('Role', RoleSchema);
