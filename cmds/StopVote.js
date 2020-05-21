var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb.js`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await StopVotingCommand(Message)
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
    name: "StopVoteCommand"
}


async function StopVotingCommand(Message){
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
    if(!EventDoc)return Message.reply("There is not a current event to end votes for...")
    if(!EventDoc.VotesOpen)return Message.reply("Votes are already closed, to open the votes, run the command .startvotes.")
    EventDoc.VotesOpen = false
    await EventDoc.save()
    await Message.channel.send("I have successfully closed the votes!")
}