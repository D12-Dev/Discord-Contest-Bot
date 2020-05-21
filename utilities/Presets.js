var Discord = require(`discord.js`)
var client

module.exports.run = async (Client) => {
    client = Client
    try{
      await MakePresets()
    }catch(err){
        return 
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
    name: "PresetsUtil"
}


async function MakePresets(){
    client.guilds.forEach(async guild => {
       if(guild.me.permissions.has("MANAGE_ROLES")){
        if(!guild.roles.find(role => role.name === "Event Manager")){
            await guild.createRole({name:"Event Manager", color: "WHITE"}).then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`)).catch(console.error)
        }
       // if(!guild.roles.find(role => role.name === "Event Mute")){
       //     await guild.createRole({name:"Event Mute", color: "WHITE"}).then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`)).catch(console.error)
      //  }
       }
       else{
           console.log("I do not have perms to make roles ;~;")
       }
    });
}