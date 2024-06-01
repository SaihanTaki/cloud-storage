const dotenv = require('dotenv')

dotenv.config()

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN
const JWT_REFRESH_TOKEN = process.env.JWT_RESET_TOKEN
const JWT_ACCESS_EXPIRATON = 30
const JWT_REFRESH_EXPIRATON =  60

module.exports = {
    JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN,
    JWT_ACCESS_EXPIRATON,
    JWT_REFRESH_EXPIRATON
}

