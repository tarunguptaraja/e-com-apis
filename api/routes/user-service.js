const express = require('express');
const router = express.Router()
const User = require('../model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: 'delavs0wi',
  api_key: '621755682927944',
  api_secret: 'ww-N2T3lF3t8aboClQOEI__epxY'
});

router.get('/',async (req, res)=> {

    try{
        const user = await User.find()
        .then(result => {
            console.log(result)
            res.status(200).json({
                users: result
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
        const user = await User.findById(req.params.id)
        .then(result =>{
            console.log(result)
            res.status(200).json({
                user: result
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

router.put('/:id',async (req, res)=> {
    console.log(req.files.profileImg)

    try{
        const imgUrl = req.files.profileImg
        const user = await User.findById(req.params.id)
        await cloudinary.uploader.upload(imgUrl.tempFilePath,(err,result)=>{
            user.updateOne({
                _id: req.params.id,
                email: req.body.email,
                name: req.body.name,
                username: req.body.username,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
                userType: req.body.userType,
                profileImg: result.url
            })
            .then(result => {
                console.log(result)
                res.status(200).json({
                    message: "User Updated Sucessfully",
                    result: result
                })
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json(err)
            })
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})

router.post('/signup', async (req, res) => {
    try {
      const { email, name, username, phoneNumber, password } = req.body;
  
      // Check if the email or username already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }, { phoneNumber }],
      });

       // Email format validation using regular expression
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailRegex)) {
        return res.status(400).json({ error: 'Invalid email format' });
        }

        // Username length validation
        if (username.length > 13) {
        return res.status(400).json({ error: 'Username must not exceed 13 characters' });
        }

        // Password complexity rules
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    
        if (!password.match(passwordRegex)) {
            return res.status(400).json({
            error: 'Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (@#$%^&+=!), no spaces, and be at least 8 characters long',
            });
        }
  
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        } else if(existingUser.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }else{
            return res.status(400).json({ error: 'Phone Number is already in use' });
        }
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 16);
  
      // Create a new user
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        name:name,
        username:username,
        phoneNumber:phoneNumber,
        password: hashedPassword,
        userType: req.body.userType
      });
  
      await newUser.save()
      .then(result => {

        console.log(result)
        delete result.password

        res.status(200).json({ 
            message: 'User registered successfully',
            user: result
        });
      })
      .catch(err =>{
        res.status(500).json(err)
      })
    } catch (error) {
      res.status(500).json({ 
        mgs: 'Error registering user',
        error: error
    });
    }
  });
  

router.post('/login', async (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      // Find the user by email or username
      await User.find({
        $or: [{ email: identifier }, { username: identifier }],
      }).exec()
      .then(users => {
        if(users.length<1){
            res.status(404).json({
                mgs: "User not Found"
            })
        }else{
            const user = users[0]
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or username or password' });
            }

            // Compare the provided password with the hashed password
            bcrypt.compare(password, user.password,(err, passwordMatch)=>{
                if (!passwordMatch) {
                    return res.status(400).json({ error: 'Invalid email or username or password' });
                }else{
                    // Generate a JWT token for authentication
                    const token = jwt.sign({ userId: user._id, email: user.email }, 'tarunguptaraja', {
                        expiresIn: "24h"
                    })
                    res.status(200).json({
                        mgs: "Loged in Successful...",
                        username: user.username,
                        token: token
                    })
                }
            })
        }
      })
      .catch(err =>{
        res.status(500).json(err)
      })
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  
  


module.exports = router