var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await LeaveCommand(Message)
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
    name: "LeaveCommand"
}


async function LeaveCommand(Message){
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is no current event to join...")
    if(!EventDoc.Participants.includes(Message.member.user.id))return Message.reply("You are not a participant in this event...")
    //if(!Message.member.voiceChannel)return Message.reply("Please join a voice channel to join the event.")
    let ConfirmEmbed = new Discord.RichEmbed()
    .setTitle(`Are you sure you would like to leave the current event...`)
    .setDescription(`**WARNING: This will remove you from the participant list. This command is only meant for people who cannot participate in the event after joining the event as a participant...**`)
    .addField("\n\nConfirmication:", "To confirm type \"**yes**\" and to decline either wait or type \"**no**\".")
    .setAuthor(client.user.username)
    .setColor(0x00FFFF)
    .setTimestamp(new Date())
    await Message.channel.send(ConfirmEmbed)
    try {
        var response = await Message.channel.awaitMessages(msg2 => msg2.author != client.user,
          {
            maxMatches: 1,
            time: 30000,
            errors: ["time"]
          }
        );
    } catch (err) {
        return await Message.channel.send("Cancelling confirmication...");
    }
    
    //console.log(response)
    if(response.first().content.toLowerCase() == "yes" || response.first().content.toLowerCase() == "y" || response.first().content.toLowerCase() == "yeah" || response.first().content.toLowerCase() == "yas" || response.first().content.toLowerCase() == "ye"){
        if(EventDoc.Participants.includes(Message.member.user.id)){
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
        if(Message.member.voiceChannel){
            Message.member.setVoiceChannel(null)
        }
        //let EventChannel = await client.channels.get(EventDoc.EventVoiceChannelID)
       /* await EventChannel.overwritePermissions(Message.member, {
            VIEW_CHANNEL: true,
            CONNECT: false,
            SPEAK: false
        })*/
        //await Message.member.setMute(false, "Event auto mute");
        await Message.channel.send("Successfully removed you from the event participant list and disconnected you from the voice channel, if you would still want to listen to the event, run the command .spec.")
    }
    else{
        await Message.channel.send("Cancelling confirmication...")
    } 
}