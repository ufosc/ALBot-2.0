
# ALBot 2.0 Alpha

Alpha version of ALBot 2.0, the spiritual successor
to ALBot. ALBot 2.0 uses Discord.js to interface with
the Discord API, supplanting ALBot's dependency on the
deprecated Discord.py library.

## Dependencies

The only non-npm managed dependencies are is Node.js.
[Install Node.js here.](https://nodejs.org/en/)
This will also install `npm`.
The necessary versions for `node` and `npm` are:

+ `node`: v16.13.2
+ `npm`: 8.1.2

After installing `node` and `npm`, run the following command:

```bash
npm install
```

### Linting

Running this command will install the node package dependencies.
One of these is ESLint, a linter for Javascript.
If desired, you can install an ESLint extension for your 
development environment to provide code highlighting based on 
the project's linting rules.

+ [Install ESLint Support with VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
+ [Install ESLint Support with Atom](https://atom.io/packages/linter-eslint)
+ [Install ESLint Support with Sublime Text](https://packagecontrol.io/packages/ESLint)

## Building and Testing

To run and test the bot locally, you will need
to set up a bot testing server in Discord. Only you
and the bot need to be in this server.

To Do: Add bot setup, config.json creation,
and all other setup details.

## Architecture

ALBot 2.0's functionality is distributed across several files.
The `index.js` contains the 'main' of the program, and should
be executed using node to launch the bot (`node index.js`).
The `client` object in `index.js`
is the bot - that is, it contains all the functionality as properties.

The commands ALBot can perform are stored in the `commands/` directory.
Each command is stored in its own `.js` file with the name of the command
being the file name (e.g. command `/foo` is in `foo.js`).
Each command file exports a module with the following attributes:
`data`, which maps to a `SlashCommandBuilder` instance with
name and description at minimum;
and an `execute` function which accepts an `interaction` object.
The `execute` function contains the command's functionality.
Dispatching interactions to the proper commands is handled
by the `interactionCreate` event (see `events/interactionCreate.js`).
The commands are loaded into the `client` object at runtime
when the bot is started (see `index.js`).

The bots interactivty is implemented using an event handling
architecture wherein event handlers are specified by modules
in the `events/` directory. Each `.js` file in `events/` implements
a distinct event handler. The naming scheme mimics that of the 
command files: an event `foo` is handled in `foo.js`.
These events are loaded into the `client` object at runtime when
the bot is started.

## Acknowledgement

This project was built with the help of the Discord.js guides.

+ [discord.js](https://discord.js.org/#/)
+ [discord.js guide](https://discordjs.guide/#before-you-begin)