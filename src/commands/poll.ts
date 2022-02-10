import { BaseCommandInteraction, Constants } from "discord.js";
import { ICommand } from "../icommand";

interface Option {
    content: string;
    votes: number;
}

interface Question {
    statement: string;
    options: Option[];
}

interface Poll {
    id: number;
    name: string;
    questions: Question[];
    active: boolean;
}

interface IPollService {
    _polls: Poll[];
    create(name: string, questions: Question[]): void;
    close(id: number): void;
    get(id: number): Poll;
    vote(id: number, choices: number[]): Poll;
}

export const startPoll: ICommand = {
    name: "startpoll",
    description: "Opens a poll",
    options: [
        {
            name: "pollname",
            description: "The name of the poll",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("pollname")?.value;
        await interaction.reply(`NOT IMPLEMENTED: Tried to create poll with name ${name}`);
    }
}

export function getCommands(): ICommand[] {
    return [startPoll];
}
