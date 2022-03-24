const express = require('express')
<<<<<<< HEAD
const api = require("./api/apiRoutes")
var router = express.Router()

router.get("", async (req, res) => {
    req.session.home = true
    console.log(req.session.loggedIn)
    let context = { page: "Home", loggedIn: req.session.loggedIn}
    if (context.loggedIn) res.redirect("/projects")
    else res.render("home", context)
})

router.use("/api", api)

router.get("/projects", async (req, res) => {
    // TODO: IF NOT LOGGED IN REDIRECT
    console.log(req.session.home)
    req.session.home = false
    let context = { page: "Projects", loggedIn: req.session.loggedIn }
    res.render("projects", context)
})

module.exports = router
=======
var router = express.Router()

module.exports(router)
>>>>>>> c7b882fb1f1cbced50f803bbb3c294582548b685
