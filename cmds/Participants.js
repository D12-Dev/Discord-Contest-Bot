var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb.js`)
const mongoose = require(`mongoose`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await ParticipantsCommand(Message)
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
    name: "ParticipantsCommand"
}


async function ParticipantsCommand(Message){
  let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
  if(!EventDoc)return Message.reply("There is no current event to join...")
  console.log(EventDoc.Participants.length)
  if(EventDoc.Participants.length == 0)return Message.reply("There are no current participants in this event!")
  let ParticipantString = "⠀\n"
  let ParticipantArray = EventDoc.Participants
  let Count = 1
  await ParticipantArray.forEach(async Participant => {
      ParticipantString = ParticipantString + `${Count}. <@${Participant}>.\n`
      Count++
  })
  let ParticipantEmbed = new Discord.RichEmbed()
  .setTitle(`Participants of current event by ${EventDoc.UserName}...`)
  .addField("**Below are all the participants of this event...**", ParticipantString)
  .setAuthor(client.user.username, client.user.avatarURL)
  .setColor(0x00FFFF)
  .setTimestamp(new Date())
  await Message.channel.send(ParticipantEmbed)
}