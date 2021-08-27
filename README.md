# Discli

Terminal discord client made in node.js

Do you love discord? Do you love terminals?
Then this is the perfect client for you. log in to you discord account through your terminal with `discli`, a terminal discord client made in node.js using typescript.

NOTE: `discli` is against discord TOS and using discli *can* get you banned, I have yet to be banned for using discli but you run the risk of being banned if you're using `discli` so use at your own discretion.

## Getting started

discli is still in it's early stages so you're gonna need to do a tiny bit of work to get it running.

you're gonna need [node.js](https://nodejs.org/en/) installed, this guide assumes that you already do.

#### 1. clone the repo

go to your desired folder in the terminal and type
```
git clone "https://github.com/itsUrcute/discli"
```
after the repo has been cloned, do
```
cd discli
```

#### 2. make a config file

Use your preferred text editor and make a `config.ts` file inside the `src` directory, the contents of the file should be as follows:
```ts
export const config = {
  token: "your-discord-token-here",
  defaultChannel: "channel-id", // this is the id of the channel you want discli to log in to by default
  prefix: "your-command-prefix" // the prefix you want discli commands to use
}
```
#### 3. Installing dependancies

use npm to install the dependancies (make sure you have npm):
```
npm install
```


#### 4. building discli
build discli with tsc:
```
npx tsc
```

#### 5. running discli
run discli using:
```
npm run start
```

and there you go, you should be seeing the client on your screen in a couple seconds.

### Usage

Currently discli only supports sending messages in guild text channels and jumping between channels.

pressing `enter` or `return` should highlight the text input box for you to send a message and pressing it again should send the message in the channel you're currently in.

by default the client is gonna be in the `defaultChannel` that you set earlier but you can change the channel you're in using the `channel` command

note: here, `/` is a placeholder for your prefix.

`/channel channel-id`: go to a specific channel by id.
`/channel guild name channel-name`: go to a channel in a guild by name.

=====================================================================================================

repo cover art credit: [fikrimochizou](https://www.deviantart.com/fikrimochizou)

having problems?
start an [issue](https://github.com/itsUrcute/discli/issues) on github or contact Urcute#3119 on discord.
