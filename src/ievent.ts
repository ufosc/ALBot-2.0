import { Client } from "discord.js";

export interface IEvent {
    name: string;
    once?: boolean;
    execute(...args: any[]): void | Promise<void>;
}