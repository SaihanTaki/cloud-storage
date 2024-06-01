const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
// const db = require("../models");
// const User = db.user;
// const Role = db.role;

const catchError = (err, res) => {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
  
    return res.status(401).send({ message: "Unauthorized!" });

  }


const verifyToken = function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
      }
  
    jwt.verify(token, config.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return catchError(err, res)
      }
    
      req.userId = decoded.id; 
      // will be used to identify the user in the authentication flow (to verify that the authenticated user have requested roles)
      next();
    });
  }

module.exports = {verifyToken}

