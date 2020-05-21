var Discord = require(`discord.js`)
var client
const SaveEmbed = require(`../models/SaveEmbedToDb.js`)
const mongoose = require(`mongoose`)
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await OpenEventCommand(Message)
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
    name: "OpenEventCommand"
}


async function OpenEventCommand(Message){
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
    if(AlreadyEvent)return Message.reply("There is already an event active. Please do .close to close the current event.")
    let PosEventInChannel = client.channels.get('708411002945011836') // Events channel to post in.  709287158116122647
    if(!PosEventInChannel)return Message.channel.send("No channel to post event in! Ask D12 to set one up!")
    let EventEmbed = new Discord.RichEmbed()
    .setDescription(`**To join the event type .join and you be connected and included in the event.**`)
    .addField("\n\nWhat if I dont want to participate?", "⠀\nIf you **do not** want to participate in the event but you still want to hear all the amazing talent, type .spec and you will be able to watch the event.")
    .setAuthor(`${Message.member.displayName} has opened an event!`, client.user.avatarURL)
    .setColor(0x00FFFF)
    .setTimestamp(new Date())
    EventEmbed = await PosEventInChannel.send(EventEmbed)
    const defaultRole = Message.guild.roles.find(role => role.name === "@everyone");
    var category = Message.guild.channels.get("705488561452875809") // 705488561452875809
    if(!category){
        try{
            category = await Message.guild.createChannel("Events", {type: "category"})
        }catch(err){
            console.log(err)
            return console.log("Failed to create a category for events!")
        }
    }
    await Message.guild.createChannel("Event Room", {type: 'voice'})         .then(async channel => {
        const SavingEmbedToDb = new SaveEmbed({
            _id: mongoose.Types.ObjectId(),
            Type: "EventOpenEmbed",
            UserID: Message.member.user.id,
            EmbedID: EventEmbed.id,
            EventVoiceChannelID: channel.id,
            TextChannel: PosEventInChannel.id,
            Participants: [],
            VotesOpen: false,
            VotesHaveBeenOpened: false,
            HostId: Message.author.id,
            EveryoneMuted: false,
            EventInProgress: false,
            EventQueue: [],
            EventHasStarted: false
          })
        await SavingEmbedToDb.save() 
        await channel.setParent(category)
        await channel.overwritePermissions(defaultRole, {
            VIEW_CHANNEL: true,
            CONNECT: false,
        })
    })
    
    return await Message.channel.send("Successfully started an event")
}