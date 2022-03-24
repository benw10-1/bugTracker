const express = require('express')
var router = express.Router()
const users = require("./users/userRoutes")

router.get("/", async (req, res) => {
    res.redirect("/")
})
router.get("/projects", async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/")
        return
    }
    res.json({"HI": "asd"})
})
router.use("/user", users)

module.exports = router