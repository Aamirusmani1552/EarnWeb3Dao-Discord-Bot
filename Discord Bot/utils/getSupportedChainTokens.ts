import { Chains } from "../enums/chainsEnum"
import { Tokens } from "../enums/tokenEnum"
import {CommandInteractionOption, CacheType} from "discord.js";

export const supportedTokensOnChain: Record<Chains,Tokens[]> ={
    [Chains.goerli] : [Tokens.eth,Tokens.link],
    [Chains.celoAlfajores]: [Tokens.celo],
    [Chains.matic]: [Tokens.matic,Tokens.link]
}