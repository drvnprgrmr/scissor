"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
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
            validator: (str) => {
                validator_1.default.isEmail(str);
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
            type: mongoose_1.Schema.Types.ObjectId,
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
});
// Hash passwords
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified (or is new)
    if (this.isModified('password')) {
        // Hash password and save it
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
userSchema.methods.validatePassword = async function (password) {
    // Compare to check if the password is valid
    const isValid = await bcrypt_1.default.compare(password, this.password);
    // Return the result
    return isValid;
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
