const Discord = require("discord.js");
var client
const mongoose = require(`mongoose`)
const UnmuteDocSchema = require(`../models/UnmuteDocs`)
module.exports.run = async (member, Client) => {
    client = Client
    MakeUnmuteDoc(member)
}
module.exports.help = {
    name: "MakeUnmuteDocUtil"
}   
    
async function MakeUnmuteDoc(member){
    let EventMute = new UnmuteDocSchema({
        _id: mongoose.Types.ObjectId(),
        Type: "EventMute",
        UserID: member.id
    })
    await EventMute.save()
    console.log("Made an Unmute doc")
}