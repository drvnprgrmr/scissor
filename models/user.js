const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

const Link = require("./link")

const userSchema =  new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: Link
    }]
})



userSchema.pre("save", async function (next) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10)

    // Hash the session id
    this.sessionId = await bcrypt.hash(this.sessionId, 10)

    next()
})

userSchema.method("validatePassword", async function (password) {
    // Compare to check if the password is valid
    return await bcrypt.compare(password, this.password)
})


const User = model("User", userSchema)