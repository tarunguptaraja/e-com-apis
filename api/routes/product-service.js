const express = require('express');
const router = express.Router()
const Product = require('../model/product')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

router.get('/',async (req, res)=> {

    try{
        const product = await Product.find()
        .then(result => {
            console.log(result)
            res.status(200).json({
                products: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})

router.get('/:id',async (req, res)=> {

    try{
        const product = await Product.findById(req.params.id)
        .then(result =>{
            console.log(result)
            res.status(200).json({
                product: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})

router.post('/',async (req, res)=> {

    try{
        const product = Product({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            description: req.body.description,
            orginalPrice: req.body.orginalPrice,
            offerPrice: req.body.offerPrice,
            ratings: req.body.ratings,
            sizes: req.body.sizes,
            totalLeft: req.body.totalLeft,
            coustmerReviews: req.body.coustmerReviews,
            tags: req.body.tags,
            colors: req.body.colors
        })
        await product.save()
        .then( result =>{
            console.log(result)
            res.status(200).json(result)
        })
        .catch( err=>{
            console.log(err)
            res.status(500).json(err)
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})

// router.put('/:id',async (req, res)=> {
//     const product = await Product.findOneAndUpdate({_id:req.params.id},{
//         _id:req.params.id,
//         name: req.body.name,
//         description: req.body.description,
//         orginalPrice: req.body.orginalPrice,
//         offerPrice: req.body.offerPrice,
//         ratings: req.body.ratings,
//         sizes: req.body.sizes,
//         totalLeft: req.body.totalLeft,
//         coustmerReviews: req.body.coustmerReviews,
//         tags: req.body.tags,
//         colors: req.body.colors
//     })
//     .then(result=>{
//         console.log(result)
//         res.status(200).json(result)
//     })
//     .catch(err =>{
//         console.log(err)
//         res.status(500).json(err)
//     })
// })



router.put('/:id',async (req, res)=> {

    try{
        const product = await Product.findById(req.params.id)
        await product.updateOne({
            _id:req.params.id,
            name: req.body.name,
            description: req.body.description,
            orginalPrice: req.body.orginalPrice,
            offerPrice: req.body.offerPrice,
            ratings: req.body.ratings,
            sizes: req.body.sizes,
            totalLeft: req.body.totalLeft,
            coustmerReviews: req.body.coustmerReviews,
            tags: req.body.tags,
            colors: req.body.colors
        })
        .then(result=>{
            console.log(result)
            res.status(200).json({
                message: "Product Updated Sucessfully",
                result: result
            })
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json(err)
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})


router.delete('/:id', checkAuth, async (req, res)=> {

    try{
        const product = await Product.findById(req.params.id)
        await product.deleteOne({
            _id:req.params.id
        })
        .then(result=>{
            console.log(result)
            res.status(200).json({
                message: "Product Deleted Sucessfully",
                product: result
            })
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json(err)
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})
module.exports = router