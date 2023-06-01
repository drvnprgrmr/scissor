const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const { isEmail } = require("validator").default

const Link = require("./link")

const userSchema =  new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: isEmail
        }
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
    
    next()
})

userSchema.method("validatePassword", async function (password) {
    // Compare to check if the password is valid
    return await bcrypt.compare(password, this.password)
})


const User = model("User", userSchema)

module.exports = User