const mongoose = require("mongoose")
loadMongoose().catch(err => {console.log(err)})
async function loadMongoose() {
    await mongoose.connect('mongodb://localhost:27017/test').then((data) => {
        
    })
}
const projectSchema = new mongoose.Schema({
    name: String,
    creator: Array ,
    bugs: Array,
    contributors: Array,
})
const Project = mongoose.model("Project", projectSchema)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        minLength: [2, "Min length of 2 enforced!"],
        maxlength: [24, "Max length of 24 enforced!"],
    },
    email: {
        type: String,
        lowercase: true,
        minLength: [5, "Min length of 5 enforced!"],
        maxlength: [64, "Max length of 64 enforced!"],
        required: '{PATH} is required!'
    },
    username: {
        type: String,
        minLength: [4, "Min length of 4 enforced!"],
        maxlength: [20, "Max length of 20 enforced!"],
        required: '{PATH} is required!'
    },
    password: {
        type: String,
        minLength: [60, "Min length of 60 enforced!"],
        maxlength: [60, "Max length of 60 enforced!"],
        required: '{PATH} is required!'
    },
    about: String,
    projects: Array,
})

const User = mongoose.model("User", userSchema)

module.exports = { User, Project }