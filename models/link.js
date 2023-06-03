const { Schema, model } = require("mongoose")
const { isURL } = require("validator").default


// const hitSchema = new Schema({
//     date: {
//         type: Date,
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ["click", "scan"],
//     }
// })

const linkSchema = new Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: isURL
        }
    },
    description: String, // Optional description of link
    alias: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    clicks: {
        type: Number,
        min: 0,
        default: 0
    },
    scans: {
        type: Number,
        min: 0,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })


const Link = model("Link", linkSchema)


module.exports = Link