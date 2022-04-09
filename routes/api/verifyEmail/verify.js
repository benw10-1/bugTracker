const express = require('express')
var router = express.Router()
const { User } = require("../../../models/models")

router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id
        if (!id) throw "No verify ID"
        let verified = await User.update({
            emailCode: null
        },
        {
            where: {
                emailCode: id
            }
        })
        if (verified[0] === 0) throw "Code not valid: " + id
        let context = {
            "status": "ok",
            "action": "verified"
        }
        res.redirect("/login")
    }
    catch (err) {
        console.log(err)
        let context = {
            "status": "error",
            error: err
        }
        // render page since it will be link so tell user verification failed
        // login redirects to projects if logged in with no message
        // if not verified on projects page can't create projects and theres a banner telling you so
        // res.render("login", context)
        res.redirect("/")
    }
})

module.exports = router