const express = require('express')
var router = express.Router()
const bcrypt = require("bcrypt")
const salt = 10
const { User, Project } = require("C:/Users/benja/Desktop/bugTracker/models/models.js")

router.post("/create", async (req, res) => {
    try {
        if (!req.session.home) throw "Incorrect origin!"
        // TODO: FILTER ALLOWED CHARACTERS
        if (!req.body || !req.body.password) throw "Data not found!";

        let hashed = bcrypt.hashSync(req.body.password, salt)
        if (hashed) req.body.password = hashed
        let newUser = User(req.body)

        let val = newUser.validateSync()
        if (val) {
            let errors = []
            for (const y in val.errors) {
                errors.push(val.errors[y].properties.message)
            }
            throw errors
        }
        newUser.save()
        res.status(200).json({
            "status": "ok",
            "action": "created account"
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "error": err ?? "Not found"
        })
    }
})
router.post("/login", async (req, res) => {
    try {
        if (!req.session.home) throw "Incorrect origin!"
        if (!req.body || !req.body.password || !req.body.user) throw "Data not found!"
        const userQ = User.findOne({
            $or: [
                { email: req.body.user },
                { username: req.body.user }
            ]
        })
        let foundUser = await userQ.exec()
        if (!foundUser) throw "User not found!"
        let correctPass = bcrypt.compareSync(req.body.password, foundUser.password)
        
        if (!correctPass) throw "Incorrect password!"

        req.session.loggedIn = foundUser._id
        res.status(200).json({
            "status": "ok",
            "action": "logged in"
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "error": err ?? "Not found"
        })
    }
})
router.post("/logout", (req, res) => {

})

router.get("/:user", async (req, res) => {
    res.redirect("/")
}) 

module.exports = router