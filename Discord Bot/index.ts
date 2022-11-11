import Discord, { ClientOptions, GatewayIntentBits, Message, Partials } from "discord.js";
import dotenv from "dotenv"
import { onInteraction } from "./Events/onInteraction";
import { onReady } from "./Events/onReady";
import { connectDb } from "./MongoDb/connect";
import { validateEnv } from "./MongoDb/validateENV";
dotenv.config();

(async () => {
    // return if environment variables are null
    if (!validateEnv()) return;

    // client options for discord client
    const options:ClientOptions = {
        intents:[
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    }

    // discord client
    const Client = new Discord.Client(options);
    
    Client.on("ready", async() => await onReady(Client));

    Client.on(
        "interactionCreate",
        async (interaction) => await onInteraction(interaction)
      );
  
    // connection to database
    try {
        await connectDb(process.env.MONGO_URI as string)

        // client/bot login to discord
        await Client.login(process.env.TOKEN);
    } catch (error) {
        console.log(error)
    }

  })();