const mongoose = require('mongoose')

const VotesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Type: String,
    UserID: String,
    ParticipantVotedFor: String
})
module.exports = mongoose.model("Votes", VotesSchema);