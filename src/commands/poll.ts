import { throws } from "assert";
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
    create(name: string, questions: Question[]): Poll | boolean;
    close(id: number): boolean;
    get(id: number): Poll | boolean;
    vote(id: number, choices: number[]): Poll | boolean;
}
// TODO: Remove error handling in PollService
class PollService implements IPollService {
    private _polls: Poll[];

    constructor(polls: Poll[]) {
        this._polls = polls;
    }

    create(name: string, questions: Question[]): Poll | boolean {
        let poll: Poll = {
            id: this._nextId(),
            name: name,
            questions: questions,
            active: true
        };
        this._polls.push(poll);
        return poll;
    }

    close(id: number): boolean {
        if (this._isValidId(id)) {
            this._polls[id].active = false;
            return true;
        }
        else {
            return false;
        }
    }

    get(id: number): Poll | boolean {
        if (this._isValidId(id)) {
            return this._polls[id];
        }
        else {
            return false;
        }
    }

    vote(id: number, choices: number[]): Poll | boolean {
        return false; // TODO 
    }

    _nextId(): number {
        return this._polls.length;
    }

    _isValidId(id: number): boolean {
        return id >= 0 && id < this._polls.length;
    }
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
