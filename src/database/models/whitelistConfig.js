const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    ReviewChannel: String,
    Role: String,
});

module.exports = mongoose.model("whitelistConfig", Schema);
