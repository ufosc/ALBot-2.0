import { throws } from "assert";
import { BaseCommandInteraction, Constants, Interaction } from "discord.js";
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
// TODO: Improve error handling in PollService
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

    getAll(): Poll[] {
        return this._polls;
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

// Initialize empty at startup
const pollService = new PollService([]);

const startPoll: ICommand = {
    name: "startpoll",
    description: "Opens a poll",
    options: [
        {
            name: "pollname",
            description: "The name of the poll",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "question",
            description: "The poll's question",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "choices",
            description: "The question's choices. Format like this: option 1|option 2|option 3",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("pollname")?.value;
        let questionString = interaction.options.get("question")?.value;
        let choicesString = interaction.options.get("choices")?.value;
        // TODO: Parse choicesString into options
        let question: Question = {
            statement: questionString as string,
            options: []
        }
        pollService.create(name as string, [question]);
        await interaction.reply(`Created poll with name ${name}`);
    }
}

const polls: ICommand = {
    name: "polls",
    description: "See polls",
    execute: async (interaction: BaseCommandInteraction) => {
        let polls: Poll[] = pollService.getAll();
        if (polls.length == 0) {
            await interaction.reply("There are no polls right now!")
        }
        else {
            let messageLines: string[] = ["Open Polls:"];
            polls.forEach(poll => messageLines.push(`# ${poll.id}: ${poll.name}`));
            await interaction.reply(messageLines.join("\n"));
        }
    }
}

export function getCommands(): ICommand[] {
    return [startPoll, polls];
}
