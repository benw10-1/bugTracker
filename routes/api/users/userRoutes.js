const express = require('express')
var router = express.Router()
const { User, Project } = require("C:/Users/benja/Desktop/bugTracker/models/models.js")

router.post("/create", async (req, res) => {
    try {
        let newUser = User({
            
        })
    }
    catch (err) {
        res.status(400).json({
            "status": "error",
            "error": err
        })
    }
})
router.post("/login", async (req, res) => {
    res.redirect("/")
})
router.get("/:user", async (req, res) => {
    console.log(req.params.user)
    res.redirect("/")
}) 

module.exports = router