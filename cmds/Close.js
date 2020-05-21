var Discord = require(`discord.js`)
var client
const mongoose = require(`mongoose`)
const SaveEmbed = require(`../models/SaveEmbedToDb`)
const PrevContestSaves = require(`../models/PrevContest.js`)
const VotesSchema = require(`../models/Votes.js`)
const VotesAndParticipants = new Map()
module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await CloseEventCommand(Message)
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
    name: "CloseCommand"
}


async function CloseEventCommand(Message){
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
    let Channel = await client.channels.get("708411165612441621") //705476558197882920
    let EventChannel = await client.channels.get(AlreadyEvent.TextChannel)
    let EventEmbed = await EventChannel.fetchMessage(AlreadyEvent.EmbedID)
    let ParticipantArray = AlreadyEvent.Participants
    let MEMBEROPENED = await client.fetchUser(AlreadyEvent.UserID)
    if(EventEmbed){
        let EventEnded = new Discord.RichEmbed()
        .setDescription(`**It looks like this event is over ;~; but dont worry! Stick around because we do events almost every month.**`)
        .addField("Winner of this event:", `${await GetWinners(ParticipantArray)}`)
        .addField("A special thanks to all the participants!", `${await GetOrderedParticipants(ParticipantArray, Message)}`)
        .setAuthor(`Event by ${MEMBEROPENED.lastMessage.member.nickname} ended...`, client.user.avatarURL)
        .setColor(0x00FFFF)
        .setTimestamp(new Date())
        await EventEmbed.edit(EventEnded)
    }
    let EventEnded = new Discord.RichEmbed()
    .setDescription(`**It looks like this event is over ;~; but dont worry! Stick around because we do events almost every month.**`)
    .addField("Winner of this event:", `${await GetWinners(ParticipantArray)}`)
    .addField("A special thanks to all the participants!", `${await GetOrderedParticipants(ParticipantArray, Message)}`)
    .setAuthor(`Event by ${MEMBEROPENED.lastMessage.member.nickname} ended...`, client.user.avatarURL)
    .setColor(0x00FFFF)
    .setTimestamp(new Date())
    await Channel.send(EventEnded)
   // }
    if(EventVc){
        await EventVc.delete()
    }
    const PrevContestSaved = new PrevContestSaves({
        _id: mongoose.Types.ObjectId(),
        Type: "PrevSavedEvent",
        UserID: AlreadyEvent.UserID,
        EmbedID: AlreadyEvent.EmbedID,
        EventVoiceChannelID: AlreadyEvent.EventVoiceChannelID,
        TextChannel: AlreadyEvent.TextChannel,
        Participants: AlreadyEvent.Participants
    })
    await PrevContestSaved.save()
    await AlreadyEvent.delete()
    let AllVotingDocs = await VotesSchema.find({Type: "Vote"})
    if(AllVotingDocs){
        AllVotingDocs.forEach(async votingdoc => {
            await votingdoc.delete()
        })
    }
    await Message.channel.send("I have successfully closed the current event!")
}

async function GetWinners(ParticipantArray){
    let HighestAmountOfVotes = 0
    let Winners = []
    for(var i = 0; i < ParticipantArray.length;i++){
        let AllVotingDocsOfParticipant = await VotesSchema.countDocuments({Type: "Vote", ParticipantVotedFor: ParticipantArray[i]})
        console.log(HighestAmountOfVotes + " | " + AllVotingDocsOfParticipant)
        if(HighestAmountOfVotes < AllVotingDocsOfParticipant){
            console.log("New Winner")
            if(Winners.length == 0){
                console.log("First leader")
                HighestAmountOfVotes = AllVotingDocsOfParticipant
                Winners.push(ParticipantArray[i])
            }
            else{
                console.log("OverWrote leaders")
                HighestAmountOfVotes = AllVotingDocsOfParticipant
                Winners = []
                Winners.push(ParticipantArray[i])
            }
        }
        else if(HighestAmountOfVotes == AllVotingDocsOfParticipant){
            if(Winners.length == 0){

            }
            else{
                console.log("A draw winner chosen")
                Winners.push(ParticipantArray[i])
            }
        }
    }
    let WinnersString = ""
    console.log(Winners)
    if(Winners.length > 1){
        await Winners.forEach(async Winner => {
            WinnersString = WinnersString + `\n<@${Winner}> with ${HighestAmountOfVotes} vote(s).` // Trying <@id>
        })
    }
    else if(Winners.length == 0){
        WinnersString = `\nNone`
    }
    else{
        WinnersString = `\n<@${Winners[0]}> with ${HighestAmountOfVotes} vote(s).` // Same here
    }
    return WinnersString
}

async function GetOrderedParticipants(ParticipantArray, Message){
    arr = []
    for(var i = 0;i < ParticipantArray.length;i++){
        let AllVotingDocsOfParticipant = await VotesSchema.countDocuments({Type: "Vote", ParticipantVotedFor: ParticipantArray[i]})
        arr.push([`<@${ParticipantArray[i]}>`, AllVotingDocsOfParticipant]) // probs better way since no api interactions
       // var ParticipantChosen = await Message.guild.members.get(ParticipantArray[i]);
       // arr.push([ParticipantChosen, AllVotingDocsOfParticipant]) // Not sure if pushing an object to the array is gonna work very well butttttttttt
    }
    await arr.sort((a, b) =>  b[1] - a[1])
    let ParticipantString = "⠀\n"
    if(ParticipantArray.length == 0){
        ParticipantString = "No current participants..."
    }
    else{
        for(var x = 0;x < ParticipantArray.length;x++){
            ParticipantString = ParticipantString + `${arr[x][0]} with ${arr[x][1]} vote(s).\n`
        }
    }
    return ParticipantString
}





