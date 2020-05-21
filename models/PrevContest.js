const mongoose = require('mongoose')

const PrevEventsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Type: String,
    UserID: String,
    EmbedID: String,
    EventVoiceChannelID: String,
    TextChannel: String,
    Participants: Array
})
module.exports = mongoose.model("PrevEvents", PrevEventsSchema);