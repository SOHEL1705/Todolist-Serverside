const express = require('express')
var jwt = require("jsonwebtoken");
const router = express.Router()
const fetchuser = require('../middleware/fatchuser')
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
//***ROUTE 1 GET ALL THE Notes*** GET "/api/auth/getuser"

router.get('/fetchallnotes', fetchuser, async (req, res) => {
   
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
   
})
//***ROUTE 2 add new Notes*** POST "/api/auth/addnote"
router.post("/addnote", fetchuser , 
[ body("title" ,'Enter a title') .isLength ({min:5}),
 body("description" , 'describe atleast ').isLength({min:5})],
async (req,res)=>{
    try {
        const { title, description, tag } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// ***ROUTE 3 delete Notes*** DELETE "/api/auth/deletenotes

router.delete("/delete/:id", fetchuser , 
async (req,res)=>{
    let noteUpdate =await Note.findById(req.params.id);
    if(!noteUpdate){return res.status(404).send("Empty")}
    if(noteUpdate.user.toString() !== req.user.id){
        return res.status(401).send("unauthorized status")
    }
    noteUpdate = await Note.findByIdAndDelete(req.params.id)
    res.json({messege:"Items below are DELETED",noteUpdate})
})

//***ROUTE 4 update Notes*** PUT "/api/auth/updatenote
router.put("/update/:id", fetchuser , 
async (req,res)=>{
    const {title,description,tag} = req.body;
    const newNote ={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}

    let noteUpdate =await Note.findById(req.params.id);
    if(!noteUpdate){return res.status(404).send("Empty")}
    if(noteUpdate.user.toString() !== req.user.id){
        return res.status(401).send("unauthorized status")
    }

    noteUpdate = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({noteUpdate})
})


module.exports=router 