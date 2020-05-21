var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
const PrevContestSaves = require(`../models/PrevContest.js`)
const VotesSchema = require(`../models/Votes`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await CurrentVotesCommand(Message)
    }catch(err){
        return console.log(err)
        /*
      console.log(err)
      let botlogschannel = await client.channels.get("676874892850757642");
      let DevErrorEmbed =  new Discord.RichEmbed()
      .setTitle("**An error has occurred! ❌**")
      .setDescription("**"+ err + "**\n\n" + err.stack)
      .setAuthor(client.user.username)
      .setColor(0xFF0000)
      .setTimestamp(new Date())
      await botlogschannel.send(DevErrorEmbed)*/
    }
}
module.exports.help = {
    name: "CurrentVotesCommand"
}


async function CurrentVotesCommand(Message){
    let EventManagerRole = Message.guild.roles.find(role => role.name === "Event Manager")
    if(!EventManagerRole){
        if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
    }
    else{
        if(!Message.member.roles.has(EventManagerRole.id)){
            if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
        }
    }
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is no current event active...")
    if(!EventDoc.VotesHaveBeenOpened)return Message.reply("Votes have not yet been opened... Make sure to run the .openvotes command.")
    if(EventDoc.Participants.length == 0)return Message.reply("There are no current participants in this event!")
    let ParticipantArray = EventDoc.Participants
    let ParticipantEmbed = new Discord.RichEmbed()
    .addField("**Below are all the participants and their vote count of this event...**", `${await GetOrderedParticipants(ParticipantArray, Message)}`)
    .setAuthor(`Votes of current event by ${EventDoc.UserName}...`, client.user.avatarURL)
    .setColor(0x00FFFF)
    .setTimestamp(new Date())
    await Message.channel.send(ParticipantEmbed)
}


async function GetOrderedParticipants(ParticipantArray, Message){
    arr = []
    for(var i = 0;i < ParticipantArray.length;i++){
        let AllVotingDocsOfParticipant = await VotesSchema.countDocuments({Type: "Vote", ParticipantVotedFor: ParticipantArray[i]})
        arr.push([`<@${ParticipantArray[i]}>`, AllVotingDocsOfParticipant]) // probs better way since no api interactions
       // var ParticipantChosen = await Message.guild.members.get(ParticipantArray[i]);
       // arr.push([ParticipantChosen, AllVotingDocsOfParticipant]) // Not sure if pushing an object to the array is gonna work very well butttttttttt
    }
    await arr.sort((a, b) =>  b[1] - a[1])
    let ParticipantString = "⠀\n"
    if(ParticipantArray.length == 0){
        ParticipantString = "No current participants..."
    }
    else{
        for(var x = 0;x < ParticipantArray.length;x++){
            ParticipantString = ParticipantString + `${arr[x][0]} with ${arr[x][1]} vote(s).\n`
        }
    }
    return ParticipantString
}