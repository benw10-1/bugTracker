const mongoose = require("mongoose")
loadMongoose().catch(err => {console.log(err)})
async function loadMongoose() {
    await mongoose.connect('mongodb://localhost:27017/test').then((data) => {
        
    })
}
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    about: String,
    projects: Array,
    ID: Number
})
const User = mongoose.model("User", userSchema)

const projectSchema = new mongoose.Schema({
    name: String,
    creator: String,
    bugs: Array,
    contributors: Array,
    ID: Number
})
const Project = mongoose.model("Project", userSchema)

module.exports = { User, Project }