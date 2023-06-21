const { Schema, model } = require("mongoose")
const { isURL } = require("validator").default


const hitSchema = new Schema({
    type: {
        type: String,
        enum: ["click", "scan"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    // From browser
    ip: String,
    referrer: String,

    // External IP API
    country: String,
    city: String,
    timezone: String,
    isp: String
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