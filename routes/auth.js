const express = require('express');
const router = express.Router();    
const users = require("../models/users")
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/authValidator');

// House keeping defingnin route (for ease of understandin)
// @router GET/api/auth/test
// @desc Test the Auth route
// @access public 

router.get("/test", (req, res) => {
    res.send("Auth check if it is working");

});

// @router POST/api/auth/register
// @desc Test the Auth route
// @access public 

router.post("/register", async (req, res) => {

    try{
       const { errors, isValid} = validateRegisterInput(req.body);

        if (!isValid){

            return res.status(400).json(errors);

        }

        //ensure there is no dupliate email address
        const existingEmail = await users.findOne({

        //make sure to detect if there uppercase, lowercase change ( check case sensetivity)
        email: new RegExp("^" + req.body.email + "$", "i")
        
    });

        if (existingEmail) {
            return res.status(400).json({error: "There exists a user with this email"});
        }

        // hash the password with 16 salt 
        const hashedPassword = await bcrypt.hash(req.body.password, 16);
   
        //save user in db
        const newUser = new users({

            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,

        });
        // save the user to the database
        const savedUser = await newUser.save();
        
        // return saved user
        return res.json(savedUser);
    }
        catch(err){
            console.log(err);

        // server error 
        res.status(500).send(err.message);
    }

});


// export router
module.exports = router;