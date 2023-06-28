"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const hitSchema = new mongoose_1.Schema({
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
    as: String // ISP
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
const linkSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: (str) => {
                return validator_1.default.isURL(str);
            },
            message: "`{VALUE}` is not a valid URL"
        }
    },
    description: String,
    alias: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hits: [hitSchema] // Store information on all hits
}, { timestamps: true });
const Link = (0, mongoose_1.model)("Link", linkSchema);
exports.default = Link;
