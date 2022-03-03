import { throws } from "assert";
import { Base, BaseCommandInteraction, Constants, Interaction } from "discord.js";
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
        let choices: string[] = (choicesString as string).split("|").map(s => s.trim());
        let _options: Option[] = [];
        choices.forEach(choice => _options.push({content: choice, votes: 0}));
        let question: Question = {
            statement: questionString as string,
            options: _options
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
            let divider: string = "----------------"
            let messageLines: string[] = ["Open Polls", divider];
            polls.forEach(poll => messageLines.push(`#${poll.id} | ${poll.name}`));
            await interaction.reply(messageLines.join("\n"));
        }
    }
}

const seePoll: ICommand = {
    name: "seepoll",
    description: "See a poll and its questions",
    options: [
        {
            name: "pollid",
            description: "The ID number of the poll",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.INTEGER
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let id = interaction.options.get("pollid")?.value;
        if (id === undefined) {
            await interaction.reply(`Poll not found: bad ID value (ID=${id})`)
            return;
        }

        const _poll: Poll | boolean = pollService.get(id as number);
        if (!_poll) {
            await interaction.reply(`Poll not found: poll with id=${id} could not be found`)
            return;
        }

        const poll: Poll = _poll as Poll;
        let indent: string = "    ";
        let message: string[] = [];
        if (!poll.active) {
            message.push(`${poll.name} [CLOSED]`)
        }
        else {
            message.push(poll.name);
        }
        let questionNum: number = 1;
        for (const question of poll.questions) {
            message.push("\n");
            message.push(`${questionNum}. ${question.statement}`);
            let optionNum: number = 1;
            for (const option of question.options) {
                if (!poll.active) {
                    message.push(`${indent}${optionNum}. ${option.content} (${option.votes})`);
                }
                else {
                    message.push(`${indent}${optionNum}. ${option.content}`);
                }
                optionNum++;
            }
            questionNum++;
        }
        await interaction.reply(message.join("\n"))
    }
}

const closePoll: ICommand = {
    name: "closepoll",
    description: "Close a poll from voting and enable viewing the results",
    options: [
        {
            name: "pollid",
            description: "The ID number of the poll",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.INTEGER
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let id = interaction.options.get("pollid")?.value;
        if (id === undefined) {
            await interaction.reply("Poll not found and closed - id undefined");
        }

        if(pollService.close(id as number)) {
            await interaction.reply(`Poll #${id} closed successfully`);
        }
        else {
            await interaction.reply(`Poll not found and closed - poll with id=${id} could not be found`)
        }
    }
}

export function getCommands(): ICommand[] {
    return [startPoll, polls, seePoll, closePoll];
}
