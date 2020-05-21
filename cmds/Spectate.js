var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb.js`)
const mongoose = require(`mongoose`)
const EventBan = require(`../models/EventBan`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await JoinCommand(Message)
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
    name: "SpectateCommand"
}


async function JoinCommand(Message){
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is no current event to join...")
    let BanDoc = await EventBan.findOne({Type: "EventBan", UserID: Message.member.user.id})
    if(BanDoc)return Message.reply("You cannot join because you have been event banned. If you believe this was an unfair ban, please contact an administrator or event manager to be unbanned.")
    if(!Message.member.voiceChannel)return Message.reply("Please join a voice channel to spectate the event.")
    try{
        await Message.delete()
    }catch(err){
        console.log(err)
    }   
    //console.log(response)
    let EventChannel = await client.channels.get(EventDoc.EventVoiceChannelID)
    if(EventDoc.EveryoneMuted){
        if(EventDoc.HostId != Message.author.id){
            /*await EventChannel.overwritePermissions(Message.member, {
                VIEW_CHANNEL: true,
                CONNECT: false,
                SPEAK: false
            })*/
            await Message.member.setMute(true, "Event auto mute");
            //await Message.member.addRole(muteRole)
        }
        else{
           /*await EventChannel.overwritePermissions(Message.member, {
                VIEW_CHANNEL: true,
                CONNECT: false,
                SPEAK: true
            })  */
        }
    }
    else{
        /*await EventChannel.overwritePermissions(Message.member, {
            VIEW_CHANNEL: true,
            CONNECT: false,
            SPEAK: true
        })  */
    }
    if(Message.member.voiceChannel){
        await Message.member.setVoiceChannel(client.channels.get(EventDoc.EventVoiceChannelID))
    }
    if(EventDoc.Participants.includes(Message.member.user.id)){
        let ConfirmEmbed = new Discord.RichEmbed()
        .setTitle(`Are you sure you would like to spectate the current event...`)
        .setDescription(`**This will make you no longer a participant...**`)
        .addField("\n\nConfirmication:", "To confirm type \"**yes**\" and to decline either wait or type \"**no**\".")
        .setAuthor(client.user.username)
        .setColor(0x00FFFF)
        .setTimestamp(new Date())
        await Message.channel.send(ConfirmEmbed)
        try {
            var response = await Message.channel.awaitMessages(msg2 => msg2.author == Message.author,
              {
                maxMatches: 1,
                time: 30000,
                errors: ["time"]
              }
            );
        } catch (err) {
            return await Message.channel.send("Cancelling confirmication...");
        }
        if(response.first().content.toLowerCase() == "yes" || response.first().content.toLowerCase() == "y" || response.first().content.toLowerCase() == "yeah" || response.first().content.toLowerCase() == "yas" || response.first().content.toLowerCase() == "ye"){
            let valueToRemove = Message.member.user.id
            let filteredMembers = await EventDoc.Participants.filter(item => item !== valueToRemove)
            EventDoc.Participants = filteredMembers
            if(EventDoc.EventQueue.includes(Message.member.user.id)){
                let valueToRemove = Message.member.user.id
                let filteredMembers = await EventDoc.EventQueue.filter(item => item !== valueToRemove)
                EventDoc.EventQueue = filteredMembers
            }
            await EventDoc.save()
        }
    }
    await Message.channel.send("Successfully connected you to the event voice channel, as a spectator enjoy :3.")

}