var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb.js`)
const VotesSchema = require(`../models/Votes.js`)
const mongoose = require(`mongoose`)
module.exports.run = async (Message, args, Client) => {
    client = Client
    try{
      await VoteCommand(Message, args)
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
    name: "VoteCommand"
}


async function VoteCommand(Message, args){
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is not a current event to vote for...")
    if(!EventDoc.VotesOpen)return Message.channel.send("Votes are currently closed, please wait for a event manager to open votes.")
    let VoteDoc = await VotesSchema.findOne({Type: "Vote", UserID: Message.member.user.id})
    if(VoteDoc)return Message.reply("You have already voted for a participant already!")
    let ParticipantVotedFor = await Message.mentions.members.first() || await Message.guild.members.get(args[0]) || await Message.guild.members.find(user => user.displayName === args[0])
    if(!ParticipantVotedFor)return await Message.channel.send("Please mention a valid user, within this server.")
    if(ParticipantVotedFor == Message.member)return Message.reply("You cannot vote for yourself! :3")
    if(!EventDoc.Participants.includes(ParticipantVotedFor.user.id))return Message.reply("That is not a valid participant. Type .participants to see all the current participants...")
    let EventChannel = await client.channels.get(EventDoc.EventVoiceChannelID)
    if(Message.member.voiceChannel != EventChannel)return Message.reply("You must be in the event voice channel to be able to vote for a participant.")
    let VoteForDoc = new VotesSchema({
      _id: mongoose.Types.ObjectId(),
      Type: "Vote",
      UserID: Message.member.user.id,
      ParticipantVotedFor: ParticipantVotedFor.user.id
    })
    await VoteForDoc.save()
    await Message.channel.send("You have successfully voted for participant `" + ParticipantVotedFor.displayName + "`.")
}
