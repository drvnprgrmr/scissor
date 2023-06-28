import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import v from "validator"


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
            validator: (str: string) => {
                v.isEmail(str)
            }, 
            message: "`{VALUE}` is not a valid email address"
        },
    },
    //TODO: Track activated accounts
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
    }],

    // Convenience helper to store the total number of hits
    // all links have garnered
    totalHits: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
})


// Hash passwords
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified (or is new)
    if (this.isModified('password')) {
        // Hash password and save it
        this.password = await bcrypt.hash(this.password, 10);
    }

    next()
})

userSchema.methods.validatePassword = async function(password: string) {
    // Compare to check if the password is valid
    const isValid = await bcrypt.compare(password, this.password)

    // Return the result
    return isValid
}


const User = model("User", userSchema)

export default User