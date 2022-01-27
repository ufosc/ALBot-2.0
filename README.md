
# ALBot 2.0 Alpha

Alpha version of ALBot 2.0, the spiritual successor
to ALBot. ALBot 2.0 uses Discord.js to interface with
the Discord API, supplanting ALBot's dependency on the
deprecated Discord.py library.

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