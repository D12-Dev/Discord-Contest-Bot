const Discord = require("discord.js");
var client
const mongoose = require(`mongoose`)

module.exports.run = async (guild, Client) => {
    client = Client
    MakeSettings(guild)
}
module.exports.help = {
    name: "BotAddedToGuildUtil"
}   
    
    
    
async function MakeSettings(guild) {
    if(guild.me.permissions.has("MANAGE_ROLES")){
        if(!guild.roles.find(role => role.name === "Event Manager")){
            await guild.createRole({name:"Event Manager", color: "WHITE"}).then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`)).catch(console.error)
        }
       // if(!guild.roles.find(role => role.name === "Event Mute")){
       //     await guild.createRole({name:"Event Mute", color: "WHITE"}).then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`)).catch(console.error)
       // }
    }
    else{
        console.log("I do not have perms to make roles ;~;")
    }
}