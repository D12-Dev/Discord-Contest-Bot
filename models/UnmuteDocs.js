const mongoose = require('mongoose')

const EventsMuteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Type: String,
    UserID: String
})
module.exports = mongoose.model("EventMutes", EventsMuteSchema);