const mongoose = require('mongoose')

const EventBansSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Type: String,
    UserID: String,
})
module.exports = mongoose.model("EventBans", EventBansSchema);