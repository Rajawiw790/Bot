const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    Channel: String,
    Message: String,
});

module.exports = mongoose.model("dutyConfig", Schema);
