var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await StartEventCommand(Message)
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
    name: "StartEventCommand"
}


async function StartEventCommand(Message){
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
    if(AlreadyEvent.EventInProgress)return Message.reply("There is already an event in progress...")
    //console.log(AlreadyEvent.Participants.length)
    if(AlreadyEvent.Participants.length < 2)return Message.reply("To be able to start an event, there must be a mininum of 2 participants.")
    if(AlreadyEvent.EventQueue.length < 1)return Message.reply("To be able to start an event, there must be a mininum of 1 more person in the queue.")
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)

    await Message.channel.send(`Muting and Starting event in voice channel: ${EventVc}.`)
    //let MuteRole = Message.guild.roles.find(role => role.name === "Event Mute")
    await EventVc.members.forEach(async (member) => {
        //if(EventVc.members[i] == Message.member)return
        if(member.user.id == AlreadyEvent.EventQueue[0]){
        }
        else{
            await member.setMute(true, "Event auto mute");
           // await member.addRole(MuteRole)
        }
    });
    AlreadyEvent.EventInProgress = true
    AlreadyEvent.EventHasStarted = true
    AlreadyEvent.EveryoneMuted = true

    await Message.channel.send(`Started current event and <@${AlreadyEvent.EventQueue[0]}> is up first! glhf...`)
    AlreadyEvent.EventQueue.shift()
    await AlreadyEvent.save()
}



