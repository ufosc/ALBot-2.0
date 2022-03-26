import { BaseCommandInteraction } from "discord.js";
import Snoowrap from "snoowrap";
import { ICommand } from '../icommand';
import * as config from '../config.json';

const redditScrapingEnabled = config.reddit != null;

interface Post {
    link: string;
    title: string;
    score: number;
}

async function scrapeSubreddit(name: string) {
    const scraper = new Snoowrap({
        userAgent: config.reddit.userAgrent,
        clientId: config.reddit.clientId,
        clientSecret: config.reddit.clientSecret,
        refreshToken: config.reddit.refreshToken
    });

    const topPosts = await scraper.getSubreddit(name).getTop({time: 'week', limit: 3});
    
    let posts: Post[] = [];
    
    topPosts.forEach((post: { url: any; title: any; score: any; }) => {
        posts.push(<Post>{
            link: post.url,
            title: post.title,
            score: post.score
        })
    });
    
    return posts;
}

export const topPost: ICommand = {
    name: 'toppost',
    description: 'Get the top post off r/programming',
    execute: async (interaction: BaseCommandInteraction) => {
        try {
            const posts: Post[] = await scrapeSubreddit('programming');
            await interaction.reply(
                `
                \`\`\`
                ${JSON.stringify(posts,null,2)}
                \`\`\`
                `
            );
        }
        catch (err) {
            await interaction.reply(JSON.stringify(err,null,2));
        }
        return;
    }
}

export function getCommands(): ICommand[] {
    return [topPost];
}