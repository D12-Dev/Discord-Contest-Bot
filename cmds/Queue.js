var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await QueueCommand(Message)
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
    name: "QueueCommand"
}

async function QueueCommand(Message){
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is no current event to join...")
    console.log(EventDoc.EventQueue.length)
    if(EventDoc.EventQueue.length == 0)return Message.reply("There are no more participants in the queue of this event!")
    let ParticipantString = "⠀\n"
    let ParticipantArray = EventDoc.EventQueue
    for(i = 0;i < ParticipantArray.length;i++){
        ParticipantString = ParticipantString + `${i + 1}. <@${ParticipantArray}>.\n`
    }
    let ParticipantEmbed = new Discord.RichEmbed()
    .setTitle(`Participants of current event by ${EventDoc.UserName}...`)
    .setDescription("**Below is the current queue of this event...**")
    .addField("Up next:", ParticipantString)
    .setAuthor(client.user.username, client.user.avatarURL)
    .setColor(0x00FFFF)
    .setTimestamp(new Date())
    await Message.channel.send(ParticipantEmbed)
}