const express = require('express')
var router = express.Router()
const { Op } = require("sequelize")

const { User, Project } = require("../../../models/models")

router.post("/create", async (req, res) => {
    try {
        // if (!req.session.home) throw "Incorrect origin!"
        // TODO: FILTER ALLOWED CHARACTERS
        if (!req.body || !req.body.password) throw "Data not found!"
        let newUser = await User.create(req.body)
        req.session.loggedIn = newUser.id
        delete newUser.password
        res.status(200).json({
            "status": "ok",
            "action": "created account",
            "data": newUser
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": err.fields ?? err
        })
    }
})
// TODO Update
router.post("/login", async (req, res) => {
    try {
        // if (!req.session.home) throw "Incorrect origin!"
        if (!req.body || !req.body.password || !req.body.user) throw "Data not found!"
        
        let foundUser = await User.findOne({
            where: {
                [Op.or]: {
                    email: req.body.user,
                    username: req.body.user
                }
            }
        })

        if (!foundUser) throw "User not found!"
        let correctPass = await foundUser.checkPassword(req.body.password)
        
        if (!correctPass) throw "Incorrect password!"
        req.session.save(() => {
            req.session.loggedIn = foundUser
            res.status(200).json({
                "status": "ok",
                "action": "logged in"
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": err
        })
    }
})
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end()
        })
    } 
    else res.status(404).end()
})

router.get("/:user", async (req, res) => {
    res.end()
}) 

module.exports = router