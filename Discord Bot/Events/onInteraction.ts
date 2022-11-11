import {Interaction} from "discord.js"
import {Commands} from "../Commands/CommandList"

export const onInteraction = async(interaction:Interaction)=>{
    if(interaction.isCommand()){
        for(const Command of Commands){
            if(interaction.commandName === Command.data.name){
                await Command.run(interaction);
                break;
            }
        }
    }
}