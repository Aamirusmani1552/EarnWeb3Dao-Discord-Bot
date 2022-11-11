import { Client} from "discord.js";
import { Routes } from "discord-api-types/v9";
import {REST} from "@discordjs/rest"
import { Commands } from "../Commands/CommandList";

export const onReady = async(Client: Client)=>{
    const rest = new REST({version: '9'})
    rest.setToken(process.env.TOKEN as string)

    const commandsData = Commands.map(c=>c.data.toJSON());

    await rest.put(
        Routes.applicationGuildCommands(
            Client.user?.id || "id",
            process.env.GUILD_ID as string
        ),
        {
            body: commandsData
        }
    )
    console.log("discord ready!")
}