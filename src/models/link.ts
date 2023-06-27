import { Schema, model } from "mongoose"
import { isURL } from "validator"

const hitSchema = new Schema({
    type: {
        type: String,
        enum: ["click", "scan"],
        required: true
    },
    // From browser
    ip: String,
    referrer: String,

    // External IP API
    country: String,
    city: String,
    timezone: String,
    as: String  // ISP
}, {
    timestamps: { createdAt: true, updatedAt: false }
})

const linkSchema = new Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: isURL
        }
    },
    description: String,  // Optional description of link
    alias: {
        type: String,
        required: true,
        unique: true,  // Create a unique index
        immutable: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hits: [hitSchema]  // Store information on all hits

}, { timestamps: true })


const Link = model("Link", linkSchema)


module.exports = Link