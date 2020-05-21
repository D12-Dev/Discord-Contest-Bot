var Discord = require(`discord.js`)
var client

module.exports.run = async (Message, Client) => {
    client = Client
    try{
      await PrevContestsCommand(Message)
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
    name: "PreviousContestsCommand"
}


async function PrevContestsCommand(Message){
    return Message.reply("This command is not yet finished yet... Please try again at a later time!")


    
}