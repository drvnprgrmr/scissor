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
        unique: true,
        trim: true,
        validate: {
            validator: isEmail
        }
    },
    // // Track activated accounts
    // isActivated: {
    //     type: Boolean,
    //     default: false
    // },
    password: {
        type: String,
        required: true
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: "Link"
    }]
})


// Hash passwords
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password')) return next();

    // Hash password and save it
    this.password = await bcrypt.hash(this.password, 10);

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