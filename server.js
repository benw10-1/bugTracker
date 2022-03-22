const express = require("express")

const PORT = 3001
const app = express()

app.use(express.static('statics'))

app.get("/", async (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});