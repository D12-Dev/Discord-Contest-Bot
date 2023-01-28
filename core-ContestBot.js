//This is the offical shadow and summer discord bot, version: 2.0 {Experimental}.
const Discord = require("discord.js");
const mongoose = require('mongoose')
const client = new Discord.Client();
const SaveEmbed = require(`./models/SaveEmbedToDb.js`)
const VotesSchema = require(`./models/Votes.js`)
const UnmuteDocSchema = require(`./models/UnmuteDocs.js`)
const {TOKEN, MongoUrl, PREFIX} = require('./config')
mongoose.connect(MongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.commands = new Discord.Collection();
client.utilities = new Discord.Collection();
const fs = require("fs")
fs.readdir("./cmds/", (err, files) => {
  if(err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0)return console.log("No Cmds to load!")
  console.log(`Loading ${jsfiles.length} cmds!`)
  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    client.commands.set(props.help.name, props)
    console.log("Loaded cmd: " + f)
  });
});
fs.readdir("./utilities/", (err, files) => {
    if(err) console.error(err);
  
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0)return console.log("No utilities to load!")
    console.log(`Loading ${jsfiles.length} utilities!`)
    jsfiles.forEach((f, i) => {
      let props = require(`./utilities/${f}`);
      client.utilities.set(props.help.name, props)
      console.log("Loaded utility: " + f)
    });
  });

client.on('ready', async() => {
    console.log("Connected as " + client.user.tag)
    await client.user.setActivity(".help")
    let MakePresets = await client.utilities.get("PresetsUtil")
    await MakePresets.run(client)
});


client.on('message', async(Message) =>{
    if (Message.author.bot) return;
    if(Message.channel.type === "dm") return;
    if (!Message.guild) return;
    if (Message.content.startsWith(PREFIX)) {
        await processCommand(Message);
    }
})

async function processCommand(Message) {
    try{
        let Util = client.utilities.get("CommandHandler")
        Util.run(Message, client)
    }catch(err){
        console.log(err)
        return
    }
}
client.on("guildCreate",async(guild) => {
    let Util = client.utilities.get("BotAddedToGuildUtil")
    await Util.run(guild, client)
})
 /// UnmuteUtil

client.on('voiceStateUpdate', async(oldMember, newMember) => {
    if(oldMember.voiceChannel == newMember.voiceChannel)return
    let AlreadyEvent = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(oldMember.voiceChannel == undefined){
        // Unmute them if they have an unmute doc.
        let MuteDoc = await UnmuteDocSchema.findOne({UserID: newMember.id})
        if(MuteDoc){
            await newMember.setMute(false, "[Event Auto Mute]")
            return await MuteDoc.delete()
        }
    }
    if(!AlreadyEvent)return
    let EventVc = await client.channels.get(AlreadyEvent.EventVoiceChannelID)
    if(newMember.voiceChannel == undefined){
        /// Make unmute doc because they joined
        let Util = await client.utilities.get("MakeUnmuteDocUtil")
        return await Util.run(newMember, client)
    }
    if(oldMember.voiceChannel == EventVc){
        let Util = await client.utilities.get("UnmuteUtil")
        return await Util.run(newMember, client)
    }
})









client.login(TOKEN)

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DEPRECATED////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

/*client.on('guildMemberUpdate', async (oldMember, newMember) => {  
    let oldvoteschema = await VotesSchema.findOne({Type: "Vote", UserName: oldMember.displayName})
    if(oldvoteschema){
        if(oldvoteschema.UserName != newMember.displayName){
            oldvoteschema.UserName = newMember.displayName
            oldvoteschema.save()
        }
    }
    let oldParticipantSchema = await SaveEmbed.findOne({Type: "EventOpenEmbed", UserName: oldMember.displayName})
    if(oldParticipantSchema){
        if(oldParticipantSchema.UserName != newMember.displayName){
            oldParticipantSchema.UserName = newMember.displayName
            await oldParticipantSchema.save()
        }
    }
    oldParticipantSchema = await SaveEmbed.findOne({Type: "EventOpenEmbed"})
    if(oldMember.displayName != newMember.displayName){
        if(!oldParticipantSchema)return
        if(oldParticipantSchema.Participants.includes(oldMember.displayName)){
            const valueToRemove = oldMember.displayName
            const filteredMembers = oldParticipantSchema.Participants.filter(item => item !== valueToRemove)
            oldParticipantSchema.Participants = filteredMembers
            await oldParticipantSchema.save()
            oldParticipantSchema.Participants.push(newMember.displayName)
            await oldParticipantSchema.save()
        }
    }
});*/

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DEPRECATED////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

