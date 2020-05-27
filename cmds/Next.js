var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await NextCommand(Message)
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
    name: "NextCommand"
}


async function NextCommand(Message){
    let EventManagerRole = Message.guild.roles.find(role => role.name === "Event Manager")
    if(!EventManagerRole){
        if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
    }
    else{
        if(!Message.member.roles.has(EventManagerRole.id)){
            if(!Message.member.hasPermission("ADMINISTRATOR"))return Message.reply("You do not have access to this command, you must have the `ADMINISTATOR` permission or the `Event Manager` role.")
        }
    }
    let AlreadyEvent = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!AlreadyEvent)return Message.reply("There is no event currently active...")
    if(AlreadyEvent.EventQueue.length == 0)return Message.reply("There are no more participants currently in the queue")
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)
    //console.log(EventVc.members.size) 
    for (const [key, value] of EventVc.members) {
        console.log(value.user.id + " || " + AlreadyEvent.EventQueue[0])
        if(value.user.id == AlreadyEvent.EventQueue[0]){
            console.log(value.user.id + " is next up")
            await value.setMute(false, "[Event auto mute]");
        }
        else{
            await value.setMute(true, "[Event auto mute]");
        }
    }
    await Message.channel.send(`<@${AlreadyEvent.EventQueue[0]}> is next up, glhf.`)
    await AlreadyEvent.EventQueue.shift()
    AlreadyEvent.EveryoneMuted = true
    await AlreadyEvent.save()
}