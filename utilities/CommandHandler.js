
var client

module.exports.run = async (Message, Client) => {
    client = Client
    CommandHandler(Message, client)
}
module.exports.help = {
    name: "CommandHandler"
}   
    

async function CommandHandler(Message, client){
    let fullcommand = Message.content.substr(1);
    let splitCommand = fullcommand.split(" ");
    let primaryCommand = splitCommand[0].toLowerCase()
    let args = splitCommand.slice(1);
    if(primaryCommand == "vote"){
        let cmd = await client.commands.get("VoteCommand")
        return await cmd.run(Message, args, client)
    }
    if(primaryCommand == "help"){
        let cmd = await client.commands.get("HelpCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "participants" || primaryCommand == "contestants"){
        let cmd = await client.commands.get("ParticipantsCommand")
        return await cmd.run(Message, client)
    }    
    else if(primaryCommand == "spec" || primaryCommand == "spectate"){
        let cmd = await client.commands.get("SpectateCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "votes" || primaryCommand == "currentvotes"){
        let cmd = await client.commands.get("CurrentVotesCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "closeevent" || primaryCommand == "close"){
        let cmd = await client.commands.get("CloseCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "closevote" || primaryCommand == "stopvote" || primaryCommand == "stopvotes" || primaryCommand == "closevotes"){
        let cmd = await client.commands.get("StopVoteCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "join"){
        let cmd = await client.commands.get("JoinCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "leave"){
        let cmd = await client.commands.get("LeaveCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "startvote" || primaryCommand == "startvotes" || primaryCommand == "openvotes"){
        let cmd = await client.commands.get("StartVoteCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "previous" || primaryCommand == "previouscontests" || primaryCommand == "prevcon" || primaryCommand == "prevcontests"){
        let cmd = await client.commands.get("PreviousContestsCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "openevent" || primaryCommand == "eventopen"){
        let cmd = await client.commands.get("OpenEventCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "equeue" || primaryCommand == "eq" || primaryCommand == "eventq" || primaryCommand == "eventqueue"){
        let cmd = await client.commands.get("QueueCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "startevent" || primaryCommand == "eventstart"){
        let cmd = await client.commands.get("StartEventCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "stopevent" || primaryCommand == "eventstop" || primaryCommand == "eventend" || primaryCommand == "endevent"){
        let cmd = await client.commands.get("EndEventCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "unmuteall" || primaryCommand == "allunmute" ){
        let cmd = await client.commands.get("UnMuteAllCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "next" || primaryCommand == "nextcontestant"){
        let cmd = await client.commands.get("NextCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "muteall" || primaryCommand == "allmute"){
        let cmd = await client.commands.get("MuteAllCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "eventban" || primaryCommand == "eban"){
        let cmd = await client.commands.get("EventBanCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "eventunban" || primaryCommand == "eunban"){
        let cmd = await client.commands.get("EventUnbanCommand")
        return await cmd.run(Message, client)
    }
    else if(primaryCommand == "eventkick" || primaryCommand == "ekick"){
        let cmd = await client.commands.get("EventKickCommand")
        return await cmd.run(Message, client)
    }
}