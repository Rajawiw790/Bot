const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    User: String,
    Status: { type: String, default: "off" }, // "in" or "off"
    Since: { type: Number, default: 0 }, // unix timestamp (ms) of last status change
});

module.exports = mongoose.model("dutyStatus", Schema);
