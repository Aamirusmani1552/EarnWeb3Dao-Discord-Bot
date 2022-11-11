import { CommandInteraction, Interaction, User } from "discord.js";
import { Contract} from "ethers";
import { Chains } from "../enums/chainsEnum";
import { Tokens } from "../enums/tokenEnum";
import {timeLockModel} from "../MongoDb/Models/userInTimeLockModel"

export const sendTokenToAddress = async(contract: Contract, address: string, chain: Chains, interaction: CommandInteraction,token: Tokens)=>{
    if(token === Tokens.link){
        const tx =  await contract.withdrawLink(address);
        await tx.wait(1);
        interaction.followUp(`transaction address: ${tx.hash}`);
    }
    else{
        const tx = await contract.withdraw(address);
        await tx.wait(1);
        interaction.followUp(`transaction address: ${tx.hash}`);
    }
    const tommorow = new Date();
    tommorow.setDate(new Date().getDate() + 1);
    timeLockModel.findOneAndUpdate({discordId: interaction.user.id,chain,token,address},
        {
            discordId: interaction.user.id,
            timeLockPeriod: tommorow.getTime().toString(),
            chain,
            token
        },
        {upsert: true}, 
        (err,res)=>{
        if(err){
            interaction.editReply(err.message)
        }
        else{
            console.log("Done!");
        }
    });
}