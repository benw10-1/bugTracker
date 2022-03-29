const express = require("express")
const api = require("./api/apiRoutes")
var router = express.Router()

router.get("", async (req, res) => {
    req.session.home = true
    let context = { page: "Home", loggedIn: req.session.loggedIn}
    if (req.session.loggedIn) res.redirect("/projects")
    else res.render("home", context)
})

router.use("/api", api)

router.get("/projects", async (req, res) => {
    // TODO: IF NOT LOGGED IN REDIRECT)
    if (!req.session.loggedIn) res.redirect("/")
    req.session.home = false
    let context = { page: "Projects", loggedIn: req.session.loggedIn }
    res.render("projects", context)
})

module.exports = router
