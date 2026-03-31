const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    rating: {
        type: Number
    },
    description: {
        type: String
    },
    menu: {
        type: [String]
    },
    coordinates: {
        type: [Number]
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("Location", locationSchema);