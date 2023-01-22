const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fatchuser')

const Signeture = "0000000"

//create a user using : POST "/api/auth/Createuser" no authentication ***ROUTE 1***
router.post("/Createuser",[
  // name must be at least 5 chars long
  body("name", "Enter valid Name").isLength({ min: 5 }),
    // email must be an email
  body("email", "Enter valid Email").isEmail(),
    // password must be at least 5 chars long
  body("password", "password should atleat contain 5 char").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
     let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
        // checking for already existing users (user or email)
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "User already Exists" });
      }
      //bcrypt password secure
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password,salt)
      //to create a new users
      user = await User.create({
        name: req.body.name,
        password: securedPassword,
        email: req.body.email,
      });

      //token initialized 
      const data = {
        user:{
            id:user.id
        }
      }
      const authSigneture = jwt.sign(data,Signeture);
      success=true
      res.json({success,authSigneture});

    } catch (error) {
      console.log(error.message);
      res.status(500).send("there is some error ");
    }
  }
);
// POST '/api/auth/login'authentication***Route 2***
router.post("/login",[
    // email must be an email
    body("email", "Enter valid Email").isEmail(),
    // password must be filled 
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    
    // Finds the validation errors in this request and wraps them in an object
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
 }


 const {email,password} = req.body;

 try {
     let user =await  User.findOne({email});
     if(!user){
       success = false;
         return res.status(400).json({error:"invalid  Email or Password"})
 
     }
     const comparePassword = await bcrypt.compare(password,user.password);
     if(!comparePassword){
       success = false;
         return res.status(400).json({success,error:"invalid  Email or Password"})
     }
     const data = {
         user:{
             id:user.id
         }
       }
       const authSigneture = jwt.sign(data,Signeture);
       success = true;
       res.json({success,authSigneture});
 
 } catch (error) {
     console.log(error.message);
     res.status(500).send("there is some error ");
 }
})

// POST'/api/auth/getuser' user details for login users login required ***ROUTES 3***
// router.post("/getuser",fetchuser,  async (req, res) => {
// try {
//     userid = req.user.id;
//     const user = await user.findbyid(userid).select("-password");
//     res.send(user)
// } catch (error) {
//     console.log(error.message);
//     res.status(500).send("there is some error ");
    
// }
//   })

router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router





module.exports = router;
