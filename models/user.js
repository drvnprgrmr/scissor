const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const { isEmail } = require("validator").default


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
        ref: "Link"
    }]
})



userSchema.pre("save", async function (next) {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hash = await bcrypt.hash(this.password, salt);

    // Save the hashed password
    this.password = hash

    next()
})

userSchema.method("validatePassword", async function (password) {
    // Compare to check if the password is valid
    const isValid = await bcrypt.compare(password, this.password)

    // Return the result
    return isValid
})


const User = model("User", userSchema)

module.exports = User