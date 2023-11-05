const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization
        const verify = jwt.verify(token, "tarunguptaraja")
        console.log(verify)
        next()
    }catch(err){
        return res.status(500).json({
            mgs: "Invalid Token!!"
        })
    }
}