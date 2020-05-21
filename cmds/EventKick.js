var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await EventKickCommand(Message)
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
    name: "EventKickCommand"
}


async function EventKickCommand(Message){
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
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)
    let MEMBER = await Message.mentions.members.first() || await Message.guild.members.get(args[0]) || await Message.guild.members.find(user => user.displayName === args[0])
    if(!MEMBER)return await Message.channel.send("Please mention a valid user, within this server.")
    if(MEMBER == Message.member)return Message.reply("You cannot kick yourself from the event! :3")
    if(AlreadyEvent.Participants.includes(MEMBER.user.id)){
        if(MEMBER.voiceChannel == EventVc){
            await MEMBER.setVoiceChannel(null)
        }
        let valueToRemove = Message.member.user.id
        let filteredMembers = await AlreadyEvent.Participants.filter(item => item !== valueToRemove)
        AlreadyEvent.Participants = filteredMembers
        if(AlreadyEvent.EventQueue.includes(Message.member.user.id)){
            let valueToRemove = Message.member.user.id
            let filteredMembers = await AlreadyEvent.EventQueue.filter(item => item !== valueToRemove)
            AlreadyEvent.EventQueue = filteredMembers
        }
        AlreadyEvent.save()
    }
    else{
        if(MEMBER.voiceChannel != EventVc)return Message.reply("They are currently not in the event voice channel.")
        await MEMBER.setVoiceChannel(null)
    }
    await Message.channel.send(`Successfully kicked ${MEMBER} from the event...`)
}