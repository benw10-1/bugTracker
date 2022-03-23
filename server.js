const express = require("express")
const handlebars = require('express-handlebars')
const PORT = 3001
const app = express()
const hdbx = handlebars.engine()

const mainRoute = require("./routes/routes")

app.use(express.static('statics'))
app.engine("handlebars", hdbx)
app.set("view engine", "handlebars")
app.set("views", "./views")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", mainRoute)

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});