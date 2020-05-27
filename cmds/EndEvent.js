var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await EndEventCommand(Message)
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
    name: "EndEventCommand"
}


async function EndEventCommand(Message){
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
    if(!AlreadyEvent.EventInProgress)return Message.reply("There is not an event in progress...")
    if(AlreadyEvent.EventQueue.length != 0){
        let ConfirmEmbed = new Discord.RichEmbed()
        .setTitle(`Are you sure you would like to end the current event...`)
        .setDescription(`**There are still people that have not yet had a turn, if you end the event, they will not be able to have there turn until re-opened.**`)
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
        
        }
        else{
            return await Message.channel.send("Cancelling confirmication...");
        }
    }
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)
    

    await Message.channel.send(`Unmuting and ending event in voice channel: ${EventVc}.`)
    for (const [key, value] of EventVc.members) {
      await value.setMute(false, "[Event auto mute]");
    }
    AlreadyEvent.EventInProgress = false
    AlreadyEvent.EveryoneMuted = false // Can be changed if you want everyone to be muted after end aswell.
    await AlreadyEvent.save()
    await Message.channel.send(`Event successfully ended... T-T. If this was a mistake, re-enable the event with .startevent.`)
}