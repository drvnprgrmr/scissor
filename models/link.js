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
    }

}, { timestamps: true })


const Link = model("Link", linkSchema)


module.exports = Link