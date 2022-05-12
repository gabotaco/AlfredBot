<h1 align="center">
    <img src="https://images-ext-2.discordapp.net/external/HqrnkRhwDjsW2S9mnyt3YqDQz7mILSqBCtQMKAYrlw8/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/472060657081122818/2f6cf525ce0897f75dea6565815ae8d7.png" alt="Alfred" width="250"></a>
  <br>
  Alfred Bot
  <br>
</h1>

<h4 align="center">
    A Discord bot to assist managment of RTS and PIGS
</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Badass-brightgreen?style=for-the-badge" alt="Badass">
  <img src="https://img.shields.io/badge/IQ-215-important?style=for-the-badge" alt="Smart">
</p>
<p align="center">
  <a href="#breakdown">Breakdown</a> •
    <a href="#commands">Commands</a> •
  <a href="#installation">Installation</a>
</p>

# Breakdown

## Processing Commands
The index.js file is where everything is brought together. Inside of this file is where Alfred logs in, registers all the slash commands, and registers loads command logic. When Alfred detects a message, he processes it to check for the correct prefix (in this case a '.') and then tries to find the specified command in either the Discord servers folder (RTScommands for RTS Discord and PIGScommands for PIGS Discord) or the Bothcommands folder. If it finds the specified command it will run the function inside of that file.

## Random Files

In this section I will just quickly explain files that you can easily ignore and don't worry about. This way I can go into more detail about more important files

Of course ignore the .gitignore. This is used so that I can keep Google sheets details private and things that could be used by you to gain access to private data.

The biggest thing to ignore is the "components" folder, "lib/google" folder, google.d.ts, and google.js. These are all files necessary to allow Alfred to use the google assistant api. I didn't write any of these files so I couldn't tell you with absolute certainty how they work. You can find the original project [here](https://github.com/endoplasmic/google-assistant/tree/2ca9d2f7f3b883ff90ad3f52ca2cea6eba4777aa)


## External Files

This section is dedicated to external files outside of commands that are used to assist the program.

Lets start simple. There are 2 html files for Alfred. These are the voucher pictures for each company and I use them to render the image for each individual person. If you view the source for the html files you will see a lot of {{double curly brackets}}. This is where I insert the data specific to the member before processing the file and sending the result to Discord.

The next external file is "authentication.js". This file is what allows me to use the Google Sheets API without having to log in every time. We used Google Sheets for keeping track of member data but now it is only used for exporting company info and bennys channel. This file simply gets authorization details using client secrets and a client token obtained from Google. The file is commented to explain what everything does.

The last file is the biggest external file which is functions.js. The reason I have functions.js is because a lot of the commands do the same thing. And because every command has it's own file I have to make an external file to import functions shared between them. This was especially helpful for when we worked with Google Sheets. This allows me to make changes without having to go to each file. I can make one change in one place.

# Commands
Each command has helpful descriptions of what they do and what arguments they take. The general format goes:
```js
// Imports and constants
module.exports.run = async (bot, args) => { // command logic
    return new Promise((resolve, reject) => { // returns a   promise
        
        resolve("This is what is sent")
        // or
        resolve(["send", "multiple", "things"])
        // or
        reject("This is an error")
    })
}

module.exports.help = {
    name: "COMMAND_NAME", // .COMMAND_NAME
    aliases: ["cmd_name", "cmd_nme"], //.cmd_name, .cmd_nme 
    usage: "<required> [optional arg]",
    description: "A helpful description",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS], // who can use it
    slash: true, // if command is slash
    args: [], // arguments as described in usage (view other commands for examples, this is in discords slash command format with an added parse function)
    hidden: false, // if response should be hidden
    slow: false // if command takes a while to respond
}
```

# Database

The Holy Spirit of this whole project. This allows us to easily keep track of everyone while also keeping commands quick.

The database has 6 tables. managers, members, payout, pigs, rts, and applicants.

## managers

The manager table keeps a list of every manager and how many vouchers they have collected for each company.

This table has 6 columns. discord_id, rts_cashout, total_money, rts_cashout_worth, pigs_cashout, and pigs_cashout_worth

## members

The members table keeps track of every member in the company, both fired and hired. 

This table has 9 columns. in_game_id, discord_id, in_game_name, company, deadline, fire_reason, last_turnin, num and warnings

## payout

The payout table keeps track of every payout made by a manager. 

This table has 7 columns. manager_id, player_id, current_company, vouchers_turned_in, time, payed_money, primary

## pigs

The pigs table keeps track of member stats for the pigs company. 

This table has 3 columns. in_game_id, pigs_total_vouchers, and pigs_total_money

## rts

The rts table keeps track of member stats for the rts company.

This table has 3 columns. in_game_id, rts_total_vouchers, and rts_total_money

# Installation

To clone and run this bot, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Gabolicious/AlfredBot.git

# Install dependencies
$ npm install
```

Inside the repository create a file called `botconfig.json`. Obviously I can't show you exactly what my botconfig looks like but this is the bare essentials.

```json
{
    "YesResponses": [
        "Yes.",
        "Most likely",
        "There is a small chance",
        "Yes- definitely",
        "You may rely on it",
        "It is decidedly so.",
        "Signs point to yes.",
        "Without a doubt.",
        "As I see it yes.",
        "Outlook good.",
        "Well yes. You didn't know that? 😂",
        "Of course."
    ],    "NoResponses": [
        "No.",
        "Never ever ever",
        "Very doubtful",
        "Don't count on it.",
        "No. Nonononononono FUCK NO!",
        "You wish.",
        "Nah fam",
        "My reply is no.",
        "My sources say no."
    ],
    "PIGSServer": "487285826544205845",
    "RTSServer": "447157938390433792",
    "PIGSSignMeUpIndex": 13,
    "RTSSignMeUpIndex": 14,
    "ApplicationInGameIDIndex": 5,
    "ApplicationStartingRow": 2,
    "ApplicationWhyIndex": 16,
    "ApplicationAnythingIndex": 18,
    "ApplicationRefferalCode": 19,
    "ApplicationRefferalStatus": 20,
    "ApplicationRefferalStatusColumn": "U",
    "ApplicationRefferalCodeColumn": "T",
    "ApplicationPlayTimeIndex": 10,
    "ApplicationDiscordIndex": 3,
    "ApplicationInGameNameIndex": 4,
    "PIGSManagementCatagoryID": "487289620804141088",
    "RTSManagementCatagoryID": "454231796905803776",
    "GaboID": "330000865215643658",
    "RockID": "404650985529540618",
    "ActiveServers": [
        {
            "url": "tycoon-w8r4q4.users.cfx.re",
            "name": "OS"
        },
        {
            "url": "tycoon-2epova.users.cfx.re",
            "name": "2"
        },
        {
            "url": "tycoon-2epovd.users.cfx.re",
            "name": "3"
        },
        {
            "url": "tycoon-wdrypd.users.cfx.re",
            "name": "4"
        },
        {
            "url": "tycoon-njyvop.users.cfx.re",
            "name": "5"
        },
        {
            "url": "tycoon-2r4588.users.cfx.re",
            "name": "6"
        },
        {
            "url": "tycoon-npl5oy.users.cfx.re",
            "name": "7"
        },
        {
            "url": "tycoon-2vzlde.users.cfx.re",
            "name": "8"
        },
        {
            "url": "tycoon-wmapod.users.cfx.re",
            "name": "9"
        },
        {
            "url": "tycoon-wxjpge.users.cfx.re",
            "name": "A"
        }
    ],
    "PIGSRoles": {
        "GuestRole": "526487757695090691",
        "InactiveRole": "576784981024571412",
        "UnavailableRole": "573159277817233418",
        "EdgyRole": "498885132468486175",
        "BotRole": "487289216968032256"
    },
    "RTSRoles": {
        "GuestRole": "483292098976546819",
        "InactiveRole": "583745333591277590",
        "UnavailableRole": "576787272142422021",
        "BotRole": "455014608810541068",
        "FiveMRole": "475029760930611200"
    },
    "PIGSLogs": "569674770816172043",
    "RTSLogs": "569683812028645386",
    "OWNERS": [{"id": "447494569173712898", "server": "rts"}, {"id": "447493627791409173", "server": "rts"}, {"id": "487286138529120256", "server": "pigs"}, {"id": "530765121522499584", "server":"pigs"}],
    "MANAGERS": [{"id": "453982220907184128", "server": "rts"}, {"id": "529643022866972684", "server": "rts"}, {"id": "487288337065836558", "server": "pigs"}, {"id": "529644127734988821", "server": "pigs"}],
    "EMPLOYEES": [{"id": "526203890639699968", "server": "rts"}, {"id": "483297370482933760", "server": "rts"}, {"id": "526160668882239508", "server": "pigs"}, {"id": "562991083882151937", "server": "pigs"}],
    "MEMBERS": [{"id": "483292098976546819", "server": "rts"}, {"id": "526487757695090691", "server": "pigs"}],
    "ApplicationRange": "A2:U500",
    "RTSWelcome": "447500215357014026",
    "PIGSWelcome": "487285826544205849",
    "PIGSOneWordStory": "576434701124894735",
    "prefix": {
        "PIGS": ".",
        "RTS": "."
    },
    "RTSCEOSpamChannel": "536639000463540256",
    "RTSPublicBotCommandsChannel": "483312512217907220",
    "RTSBotCommandsChannel": "472054525172383744",
    "RTSBennysChannel": "472410321475338246",
    "PIGSBotCommandsChannel": "488149666249048064",
    "PIGSVoucherChannel": "487621053494067200",
    "RTSVoucherChannel": "588099364497653780",
    "RTSManagers": [
        "225564356140728320",
        "440831788240338944",
        "266153125507891200",
        "221228768461586442",
        "298433145928286209"
    ],
    "PIGSManagers": [
        "209736326432423937",
        "203930869847687177",
        "330015505211457551",
        "394694336127696897"
    ],
    "GlitchDetectorID": "71676578244857856"
}
```
That's the project.