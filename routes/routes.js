const express = require('express')
const api = require("./api/apiRoutes")
var router = express.Router()

router.get("", async (req, res) => {
    let context = { page: "Home" }
    res.render("home", context)
})

router.use("/api", api)

router.get("/projects", async (req, res) => {
    let context = { page: "Projects" }
    res.render("home", context)
})

module.exports = router