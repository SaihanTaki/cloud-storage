const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");

const db = require("../models");
const User = db.user;
const Role = db.role;



const verifyRoles = function verifyRoles(roleName){
    return async function(req, res, next){
        // roles = [...roles]
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        } 
    
        if (user.role) {
            await user.populate('role')
        } else {
            return res.status(403).json({message: "User don't have any role"})
        }
        
        try {
            const role = await Role.findOne({name: roleName})
           
            if (!role){
                return res.status(403).json({"message": `${role} is not a valid role`})
            }
          
            if (role.name===user.role.name){
                return next()
            
            } else {
                return res.status(403).json({"message": `User does not have a ${roleName} access`})
            }
            
        } catch (err) {

            return res.status(500).json(err)

        }
    }
}



module.exports = {verifyRoles}