var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb`)
const PrevContestSaves = require(`../models/PrevContest.js`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await HelpCommand(Message)
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
    name: "HelpCommand"
}

async function HelpCommand(Message){
    let HelpEmbed = new Discord.RichEmbed()
    .setAuthor("ContestBot Help. Page: 1", client.user.avatarURL)
    .setDescription("**Here you can find some information about this bot and how it works.**")
    .addField("General Commands:", "\n\n**.vote <member>** - Gives a vote to a participant, choose wisely though as you can only vote once!\n\n**.join** - Connects you to the current event as a __participant __ (You will be expected to take part).\n\n**.spectate** - Connects you to the current event as a spectator (Meaning you dont have to participate ).\n\n**.leave** - Removes you from the participant list and disconnects you from the voicechannel (If you want to rejoin the voice channel, run the .spectate command).\n\n**.participants** - Shows a list of all current participants that are taking part in the event.\n⠀")
    .setColor(0x94e5ff)
    .setFooter("ContestBot", client.user.avatarURL)
    .setTimestamp(new Date())
    try{
        var SentHelpEmbed = await Message.author.send(HelpEmbed)
    }catch(err){return}
    await SentHelpEmbed.react('⬅️')
    .then(async() => await SentHelpEmbed.react('➡️'))
    .then(async() => await SentHelpEmbed.react('🚫'))
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    var PageNumber = 1
    var MaxPageNumber = 2 // change this depending on how many pages you have
    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === receivedMessage.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === receivedMessage.author.id;
    const deleteFilter = (reaction, user) => reaction.emoji.name === '🚫' && user.id === receivedMessage.author.id;
    const backwards = await SentHelpEmbed.createReactionCollector(backwardsFilter, {time: 100000});
    const forwards = await SentHelpEmbed.createReactionCollector(forwardsFilter, {time: 100000});
    const Delete = await SentHelpEmbed.createReactionCollector(deleteFilter, {time: 100000});
    await backwards.on('collect',async r => {
      if(PageNumber == 1)return //console.log("On Min page")
      PageNumber = PageNumber - 1
      let TurnPageEmbed = new Discord.RichEmbed()
      .setAuthor(`ContestBot Help. Page: ${PageNumber}`, client.user.avatarURL)
      .setDescription("**Here you can find some information about this bot and how it works.**")
      .addField("General Commands:", "\n\n**.vote <member>** - Gives a vote to a participant, choose wisely though as you can only vote once!\n\n**.join** - Connects you to the current event as a __participant __ (You will be expected to take part).\n\n**.spectate** - Connects you to the current event as a spectator (Meaning you dont have to participate ).\n\n**.leave** - Removes you from the participant list and disconnects you from the voicechannel (If you want to rejoin the voice channel, run the .spectate command).\n\n**.participants** - Shows a list of all current participants that are taking part in the event.\n\n**.equeue** - Shows everyone currently in the queue for the event.\n⠀")
      .setColor(0x94e5ff)
      .setFooter("ContestBot", client.user.avatarURL)
      .setTimestamp(new Date())
        await SentHelpEmbed.edit(TurnPageEmbed)
    })
    await forwards.on('collect',async r => {
      if(PageNumber == MaxPageNumber)return //console.log("On max page")
      PageNumber = PageNumber + 1
      let TurnPageEmbed = new Discord.RichEmbed()
      .setAuthor(`ContestBot Help. Page: ${PageNumber}`, client.user.avatarURL)
      .setDescription("**Here you can find some information about this bot and how it works.**")
      .addField("Admin And Event Manager Only:", "\n\n**.openvotes** - This opens the votes for everyone to vote for there favourite participants.\n\n**.closevotes** - Closes all votes for participants.\n\n**.startevent** - Starts an event in which people can join.\n\n**.close** - Closes an event if one is currently active.\n\n**.votes** - Displays all the current votes for all participants.\n\n**.endevent** - Ends the current event and unmutes everyone, however does not close the event fully (like .close)\n\n**.eventban** - Bans a user from joining an event.\n\n**.eventunban** - Unbans the user so they can join events again. UwU\n\n**.eventkick** - Kicks a user from the current event.\n\n**.muteall** - Mutes all members in the current event.\n\n**.unmuteall** - Unmutes all members in the current event.\n\n**.next** - Once the current participant is finished use the command to go on to the next participant. OwO\n\n**.startevent** - Starts the current event and allows the first person to perform.")
      .setColor(0x94e5ff)
      .setFooter("ContestBot", client.user.avatarURL)
      .setTimestamp(new Date())
      await SentHelpEmbed.edit(TurnPageEmbed)
    })
    await Delete.on('collect',async r => {
      try{
        await SentHelpEmbed.delete()
      }catch(err){
        return
      }
    })


    let sendalistofhelpembed = new Discord.RichEmbed()
    .setTitle("Successfully sent some help to your dm's! ✅")
    .setDescription("Sent you some help and information about this bot!")
    .setAuthor(client.user.username, client.user.avatarURL)
    .setColor(0x00ff00)
    .setFooter("ContestBot", client.user.avatarURL)
    .setTimestamp(new Date())
    await Message.channel.send(sendalistofhelpembed);
}