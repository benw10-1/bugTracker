const express = require('express')
var router = express.Router()
const { User, Project } = require("C:/Users/benja/Desktop/bugTracker/models/models.js")
const userFields = [""]

router.post("/create", async (req, res) => {
    try {
        let newUser = User(req.body)
        let val = newUser.validateSync()
        if (val) {
            let errors = []
            for (const y in val.errors) {
                errors.push(val.errors[y].properties.message)
            }
            throw errors
        }
        await newUser.save()
        res.status(200).json({
            "status": "ok",
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
    res.redirect("/")
})
router.get("/:user", async (req, res) => {
    console.log(req.params.user)
    res.redirect("/")
}) 

module.exports = router