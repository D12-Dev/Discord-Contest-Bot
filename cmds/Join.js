var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
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
    name: "JoinCommand"
}


async function JoinCommand(Message){
    let EventDoc = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(!EventDoc)return Message.reply("There is no current event to join...")
    if(EventDoc.Participants.includes(Message.member.user.id))return Message.reply("You are already a participant in this event...")
    let BanDoc = await EventBan.findOne({Type: "EventBan", UserID: Message.member.user.id})
    if(BanDoc)return Message.reply("You cannot join because you have been event banned. If you believe this was an unfair ban, please contact an administrator or event manager to be unbanned.")
    if(!Message.member.voiceChannel)return Message.reply("Please join a voice channel to join the event.")
    try{
        await Message.delete()
    }catch(err){
        console.log(err)
    }
    let ConfirmEmbed = new Discord.RichEmbed()
    .setTitle(`Are you sure you would like to join the current event...`)
    .setDescription(`**This will make you a participant and you will be expected to take part... If you would rather spectate and not participate in the event please run the .spec command instead.**`)
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
    
    //console.log(response)
    if(response.first().content.toLowerCase() == "yes" || response.first().content.toLowerCase() == "y" || response.first().content.toLowerCase() == "yeah" || response.first().content.toLowerCase() == "yas" || response.first().content.toLowerCase() == "ye"){
        //let EventChannel = await client.channels.get(EventDoc.EventVoiceChannelID)
        let muteRole = await Message.guild.roles.find(role => role.name === "Event Mute")
        if(EventDoc.EveryoneMuted){
            if(EventDoc.HostId != Message.author.id){
                /*await EventChannel.overwritePermissions(Message.member, {
                    VIEW_CHANNEL: true,
                    CONNECT: false,
                    SPEAK: false
                })*/
               // await Message.member.addRole(muteRole)
               await Message.member.setMute(true, "Event auto mute");
            }
            else{
                /*
                await EventChannel.overwritePermissions(Message.member, {
                    VIEW_CHANNEL: true,
                    CONNECT: false,
                    SPEAK: true
                })  */
            }
        }
        else{
            /*
            await EventChannel.overwritePermissions(Message.member, {
                VIEW_CHANNEL: true,
                CONNECT: false,
                SPEAK: true
            })  */
        }
        if(Message.member.voiceChannel){
            await Message.member.setVoiceChannel(client.channels.get(EventDoc.EventVoiceChannelID))
        }
        await EventDoc.Participants.push(Message.member.user.id)
        await EventDoc.EventQueue.push(Message.member.user.id)
        await EventDoc.save()
        await Message.channel.send("Successfully connected you to the event voice channel, as a participant.")
    }
    else{
        await Message.channel.send("Cancelling confirmication...")
    }
}