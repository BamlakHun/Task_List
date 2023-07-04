const express = require('express');
const router = express.Router();    
const users = require("../models/users")
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/authValidator');
const jwt = require('jsonwebtoken');
const requireAuth = require("../middleware/permissions")


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

        const savedUser = await newUser.save();
        //spreads all the saved user data into objects(._doc)
        const userToReturn = { ...savedUser._doc};
        //then delete
        delete userToReturn.password;


        return res.json(userToReturn);

        // user saved in db
       
        
        // return saved user
        return res.json(savedUser);
    }
        catch(err){
            console.log(err);

        // server error 
        res.status(500).send(err.message);
    }

});


router.post("/login", async (req, res) => {
    try {
        const user = await users.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        });

        if (!user) {
            return res.status(400).json({
                error:"Something went wrong with your login credentials"
            });
        }
        const passwordMatch = await bcrypt.compare(
            req.body.password, user.password);

        if(!passwordMatch){
            return res.status(400).json({
                error:"Something went wrong with your login credentials "
            });

        }
             
        const payload = {userId: savedUser._id};
            
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "7d"
               });
       
                res.cookie("access-token", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
       
               });
                       
        const userToReturn = { ...user._doc};
        delete userToReturn.password;

                return res.json({ 
                token: token, 
                user: userToReturn}); // now we no longer have the password returned back
       
               

           // return res.json({ passwordMatch: passwordMatch});

    } catch (err) {
        console.log(err);

        return res.status (500).send(err.message);
        
    }
});

// @router POST/api/auth/current
// @desc got to current authed user
// @access private


router.get("/current", requireAuth, (req, res) => {
    if(!req.user){
        return res.status(401).send("Unauthorized");
    }

        return res.json(req.user);

});

// @router PUT/api/logout
// @desc   Clear cookie and logout
// @access Private

router.put("/logout", requireAuth, async(req, res) => {
    try {
       res.clearCookie("access-token");

       return res.json({success: true});
        
    } catch (err) {
      console.log(err);
       
    }
    return res.status(500).send(err.message);
});



// export router
module.exports = router;