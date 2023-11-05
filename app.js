const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const productService = require('./api/routes/product-service')
const userService = require('./api/routes/user-service')

const url = "mongodb+srv://tarunguptaraja:tarunguptaraja@fakecluster.h33xd3b.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url)
const con = mongoose.connection

con.on('open',function(){
    console.log("Connection with DB Successful...")
})
con.on('error',function(){
    console.log("Connection with DB is not Successful...")
})

app.use(fileUpload({
    useTempFiles: true
}))

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.use('/products', productService)
app.use('/users', userService)

app.use((req,res,next)=>{
    res.status(200).json({
        success: true,
        responseCode: 200,
        description: 'App Started...',
        info: null
    })
})

module.exports = app