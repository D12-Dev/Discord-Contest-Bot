var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await UnMuteAllCommand(Message)
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
    name: "UnMuteAllCommand"
}

async function UnMuteAllCommand(Message){
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
    AlreadyEvent.EveryoneMuted = false
    await AlreadyEvent.save()
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)

    await Message.channel.send(`Unmuting ${EventVc.members.size} members in voice channel: ${EventVc}.`)
    let muteRole = Message.guild.roles.find(role => role.name === "Event Mute")
    await EventVc.members.forEach(async member => {
        //if(member.roles.has(muteRole)){
            //await member.removeRole(muteRole)
        //}
        await member.setMute(false, "Event auto mute");
    });
}