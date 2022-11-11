import { CommandInteraction, DataResolver, Embed, Interaction, Options, SlashCommandBuilder } from "discord.js";
import { Command } from "../Interfaces/IinteractionCommands";
import {getContract} from "../utils/getContract";
import {Chains} from "../enums/chainsEnum"
import {Tokens} from "../enums/tokenEnum"
import { EmbedBuilder } from "discord.js";
import { supportedTokensOnChain } from "../utils/getSupportedChainTokens";
import { getAddressFromId } from "../utils/getUserAddressFromId";
import { sendTokenToAddress } from "../utils/sendTokenToAddress";
import mongoose from "mongoose";
import { timeLockModel } from "../MongoDb/Models/userInTimeLockModel";
import { ETH_CELO_MATIC_LIMIT, LINK_LIMIT } from "../constants/Limit";

export const faucet:Command = {
    data: new SlashCommandBuilder()
            .setName("faucet")
            .setDescription("Command For Getting Tokens")
            .addStringOption(options=>options
                .setName("chain")
                .setDescription("choose chain")
                .addChoices(
                    { name: 'Goerli', value: Chains.goerli},
                    { name: 'Polygon-mumbai', value: Chains.matic },
                    { name: 'Celo-alfajores', value: Chains.celoAlfajores },
                )
            )
            .addStringOption(option=>option
                .setName("token")
                .setDescription("Token you want")
                .addChoices(
                    { name: 'Eth', value: Tokens.eth },
                    { name: 'Link', value: Tokens.link },
                    { name: 'Matic', value: Tokens.matic },
                    { name: 'Celo', value: Tokens.celo }
                )
            )
            ,
    run: async(interaction: CommandInteraction)=>{
        await interaction.deferReply();
        const address = await getAddressFromId(interaction.user.id);

        const chainInput = interaction.options.get('chain')
        const tokenInput = interaction.options.get('token')
        let chain, token;
        chainInput?.value === "goerli" ? chain = Chains.goerli : chainInput?.value === "celo-alfajores" ? chain = Chains.celoAlfajores : chain = Chains.matic;

        tokenInput?.value === "eth" ? token = Tokens.eth : tokenInput?.value === 'link' ? token = Tokens.link : tokenInput?.value === "celo" ? token = Tokens.celo : token = Tokens.matic

        await interaction.editReply("Checking User TimeLock...");
        const userTimeLock = await timeLockModel.findOne({discordId: interaction.user.id,chain: chain, token: token,address:address});
        if(userTimeLock){
            let date = new Date();
            let timeLockDate = Number(userTimeLock.timeLockPeriod);
            if(date.getTime() < timeLockDate){
                const embed = new EmbedBuilder();
                embed
                .setTitle("Wallet in TimeLock")
                .setDescription(`Please Wait until ${new Date(timeLockDate).toLocaleString()}`)
                .setColor("DarkRed");
                await interaction.channel?.send({embeds: [embed]})
                await interaction.editReply("Oops!")
                return;
            }
        }

        await interaction.editReply("Checking Inputs...");
        if(!chainInput || !tokenInput){
            const embed = new EmbedBuilder();
            embed.setTitle("Did not provide chain or token").setColor(0xff0000);
            await interaction.channel?.send({embeds: [embed]})
            await interaction.editReply("Please try again!",);
            return;
        }

        await interaction.editReply("Checking Tokens support on Chain");
        if(!supportedTokensOnChain[chain].includes(token)){
            const tokens = supportedTokensOnChain[chain];
            let tokensString = tokens.join();
            tokensString = tokensString.split(",").join(", ")
            const embed  = new EmbedBuilder();
            embed
            .setTitle(`Tokens Available on ${chain}:`)
            .setDescription(tokensString.toUpperCase())
            .setColor('Blue');

            await interaction.channel?.send({embeds: [embed]})
            await interaction.editReply("Please try again!",);
            return;
        }

        // checking faucet balance
        await interaction.editReply(`Checking Faucet ${token} Balance...`)
        const contract = await getContract(chain);
        const balance = token === Tokens.eth 
        ? await contract.getFaucetEthBalance() 
        : token === Tokens.celo
        ? await contract.getFaucetCeloBalance()
        : token === Tokens.link
        ? await contract.getFaucetLinkTokenBalance()
        : await contract.getFaucetEthBalance();

        const tokenLimit = (token === Tokens.celo || token === Tokens.eth || token === Tokens.matic) ? ETH_CELO_MATIC_LIMIT : LINK_LIMIT

        if(Number(balance) < Number(tokenLimit)){
            const embed = new EmbedBuilder();
            embed.setTitle("Faucet Empty!")
            .setDescription(`Faucet has low balance for ${token}`)
            .setColor('Yellow');
            interaction.channel?.send({embeds: [embed]});
            return;
        }

        await interaction.editReply(`Sending please wait...`)
        try {
            await sendTokenToAddress(contract,address,chain,interaction,token);
            await interaction.followUp("Tokens has been sent to " + address)
        } catch (error:any) {
            console.log(error)
            await interaction.editReply("An Error Occured!");
        }

    }
}