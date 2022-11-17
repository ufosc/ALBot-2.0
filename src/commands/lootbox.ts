import { BaseCommandInteraction, Constants, InteractionCollector} from "discord.js";
import { ICommand } from "../icommand";
import animalList from "../animals.json"
import userData from "../userstats.json"
import { userInfo } from "os";

const util = require("util");
const data = require('../userstats.json');

const LB_Trinkets: ICommand = {
    name: "lb-trinkets",
    description: "Displays your trinkets",
    execute: async (interaction: BaseCommandInteraction) => {
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === String(interaction.user.id)) {
                await interaction.reply(JSON.stringify(data.users[i].trinkets));
                break;
            }
        }
    }
}

const LB_Roll: ICommand = {
    name: "lb-open",
    description: "Open a shiny new lootbox!",
    execute: async (interaction: BaseCommandInteraction) => {
        const items = animalList.animals
        const user_id = String(interaction.user.id);

        // Check if user has rolled today
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === user_id) {
                let currentDate = Math.floor(Date.now() / 86_400_000);
                
                // if a day has not yet past
                if (data.users[i].hasOwnProperty("lastrolldate") 
                && data.users[i].lastrolldate == currentDate) {
                    await interaction.reply("You can only roll once a day. Please try again tomorrow!");
                    return;
                }
                data.users[i].lastrolldate = currentDate;
            }    
        }

        // Randomly generate index
        let output = ""
        let myItem = Math.floor(Math.random() * items.length);
        let myRarity = Math.floor(Math.random() * 100) + 1;
        let rank = getRarity();
        output += `You found a ${rank} ${items[myItem]}!\n`;
    

        // if user has never used command before, initialize user in data

        if (!Object.values(data.users)) {
            let trinket_list: Array<String> = [];
            const user = {
                id: user_id,
                trinkets: trinket_list
            }
            data.users.push(user);
        }
        
        // give user their trinket :)
        
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === user_id) {
                data.users[i].trinkets.push(`${rank} ${items[myItem]}`);
                break;
            }    
        }
        
        // const writeFile = util.promisify(fs.writeFile);
        const fs = require('fs');
        
        fs.writeFile('src/userstats.json', JSON.stringify(data, null, 4), (err:any) => {
            if (err) {
                
            }
            else {
                interaction.reply(output);
            }
        })

    }
}

export function getCommands(): ICommand[] {
    return [LB_Roll, LB_Trinkets];
};

function getRarity() {
    const random = parseInt(Date.now().toString().slice(-2)); // random hehehe
    let rank : string;
    console.log(random);
             if (random <= 40) rank = "⚪";     // 40% Chance
        else if (random <= 70) rank = "🟢";     // 30% Chance
        else if (random <= 85) rank = "🔵";     // 15% Chance
        else if (random <= 95) rank = "🟣";     // 10% Chance
        else if (random <= 99) rank = "🟡";     // 4% Chance
        else rank = "✨";                         // 1% Chance

    return rank;
}