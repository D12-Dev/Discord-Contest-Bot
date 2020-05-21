const mongoose = require('mongoose')

const EventsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Type: String,
    UserID: String,
    EmbedID: String,
    EventVoiceChannelID: String,
    TextChannel: String,
    Participants: Array,
    VotesOpen: Boolean,
    VotesHaveBeenOpened: Boolean,
    HostId: String,
    EveryoneMuted: Boolean,
    EventInProgress: Boolean,
    EventQueue: Array,
    EventHasStarted: Boolean
})
module.exports = mongoose.model("Events", EventsSchema);