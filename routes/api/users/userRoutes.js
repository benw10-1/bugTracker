const express = require('express')
var router = express.Router()
const bcrypt = require("bcrypt")
const salt = 10
const plen = 11
const { User, Project } = require("C:/Users/benja/Desktop/bugTracker/models/models.js")

router.post("/create", async (req, res) => {
    try {
        if (!req.body || !req.body.password) throw "Data not found!";
        if (req.body.password.length !== plen) throw "Password not correct length";

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
        if (!req.body || !req.body.password || !req.body.user) throw "Data not found!";
        if (req.body.password.length !== plen) throw "Password not correct length";
        const userQ = User.findOne({
            $or: [
                { email: req.body.user },
                { username: req.body.user }
            ]
        })
        foundUser = await userQ.exec()
        console.log(foundUser)
        if (!foundUser) throw "User not found!"
        let correctPass = bcrypt.compareSync(req.body.password, foundUser.password)
        
        if (!correctPass) throw "Incorrect password!"

        // start session and send cookie

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
router.get("/:user", async (req, res) => {
    console.log(req.params.user)
    res.redirect("/")
}) 

module.exports = router