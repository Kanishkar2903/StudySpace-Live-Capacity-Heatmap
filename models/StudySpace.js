const mongoose = require("mongoose");

const studySpaceSchema = new mongoose.Schema({
    buildingName: {
        type: String,
        required: true
    },

    zone: {
        type: String,
        required: true
    },

    totalSeats: {
        type: Number,
        required: true
    },

    occupiedSeats: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Available", "Moderate", "Full"],
        default: "Available"
    }
});

module.exports = mongoose.model("StudySpace", studySpaceSchema);
