const express = require('express')
const api = require("./api/apiRoutes")
var router = express.Router()

router.get("", async (req, res) => {
    // if logged in redirect to projects
    console.log(req.session)
    let context = { page: "Home", loggedIn: req.session.loggedIn}
    if (context.loggedIn)
    res.render("home", context)
})

router.use("/api", api)

router.get("/projects", async (req, res) => {
    // TODO: IF NOT LOGGED IN REDIRECT
    let context = { page: "Projects" }
    res.render("projects", context)
})

module.exports = router