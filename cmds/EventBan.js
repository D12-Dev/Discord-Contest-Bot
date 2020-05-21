var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
const EventBan = require(`../models/EventBan`)
const mongoose = require(`mongoose`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await EventBanCommand(Message)
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
    name: "EventBanCommand"
}


async function EventBanCommand(Message){
    let EventManagerRole = Message.guild.roles.find(role => role.name === "Event Manager")
    if(!EventManagerRole){
        if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
    }
    else{
        if(!Message.member.roles.has(EventManagerRole.id)){
            if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
        }
    }
    let MEMBER = await Message.mentions.members.first() || await Message.guild.members.get(args[0]) || await Message.guild.members.find(user => user.displayName === args[0])
    if(!MEMBER)return await Message.channel.send("Please mention a valid user, within this server.")
    if(MEMBER == Message.member)return Message.reply("You cannot event ban yourself! :3")
    const SavingBanToDB = new EventBan({
        _id: mongoose.Types.ObjectId(),
        Type: "EventBan",
        UserID: MEMBER.user.id,
    })
    await SavingBanToDB.save()
    await Message.channel.send(`Banned <@${MEMBER.user.id}> from server events. ;~;`)
}