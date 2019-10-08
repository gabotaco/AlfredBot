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
  <img src="https://img.shields.io/badge/IQ-215-important?style=for-the-badge">
</p>
<p align="center">
  <a href="#breakdown">Breakdown</a> •
    <a href="#commands">Commands</a> •

  <a href="#installation">Installation</a>
</p>

# Breakdown

## Processing Commands
I could go on for days about how every single thing works with Alfred. Due to the fact that I don't have days I'll give you all a quick rundown.

The index.js file is where the magic begins. This is the file that brings everything together. Inside of this file is where I login Alfred and connect all the other files to him for use in Discord. When Alfred detects a message he then processes it to check for the correct prefix (in this case a '.') and then tries to find the specified command in either the Discord servers folder (RTScommands for RTS Discord and PIGScommands for PIGS Discord) or the Bothcommands folder. If it finds the specified command it will run the function inside of that file. Of course these functions could be in index.js but it is significantly easier to have them in a folder rather than literal thousands of lines of code in a single file.

## Random Files

In this section I will just quickly explain files that you can easily ignore and don't worry about. This way I can go into more detail about more important files

Of course ignore the .gitignore. This is used so that I can keep Google sheets details private and things that could be used by you to gain access to private data.

The biggest thing to ignore is the "components" folder, "lib/google" folder, google.d.ts, and google.js. These are all files necessary to allow Alfred to use the google assistant api. I didn't write any of these files so I couldn't tell you with absolute certainty how they work. You can find the original project [here](https://github.com/endoplasmic/google-assistant/tree/2ca9d2f7f3b883ff90ad3f52ca2cea6eba4777aa)


## External Files

This section is dedicated to external files outside of commands that are used to assist the program.

Lets start simple. There are 2 html files for Alfred. These are simply the voucher pictures for each company and I use them to render the image for each individual person. If you view the source for the html files you will see a lot of {{double curly brackets}}. This is where I insert the data specific to the member before processing the file and sending the result to Discord.

The next external file I will be looking at is "authentication.js". This file is what allows me to use the Google Sheets API without having to log in every time. We used to use Google Sheets for keeping track of member data but now it is only used for applications and exporting company info. This file simply gets authorization details using client secrets and a client token obtained from Google. The file is commented to explain what everything does.

The last file is the biggest external file which is functions.js. The reason I have functions.js is because a lot of the commands do the same thing. And because every command has it's own file I have to make an external one to import functions. This was especially helpful for when we worked with Google Sheets. This allows me to make changes without having to go to each file. I can make one change in one place.

# Commands

Here I will be saying what each command does. If you want to know how it works each file has comments.

## Bothcommands

### 7days.js

This command sets a members deadline to next week regardless of what their current deadline is.

### 8ball.js

Allows you to ask a yes or no question and it will respond with a random answer.

### addweek.js

This command adds a week to the member deadline. Unlike 7days.js this one does care about current deadline

### answers.js

Get an applicants answers

### applicants.js

Get a list of unprocessed applicants

### ask.js

This command uses Google Assistant. You can ask for the weather or do math or do anything that Google can do. Really cool and it can talk

### available.js

This command marks a manager as available and removes the unavailable role.

### botinfo.js

Returns basic info about Alfred

### cashout.js

Gets the number of vouchers a manager has collected and how much money they gave to members since the last time the CEO has paid them

### catto.js

Returns a random picture of a cat

### clear.js

Deletes the specified amount of messages. Usefull for bulk deleting

### coinflip.js

Flips a coin

### contacted.js

Mark an applicant as contacted

### deadline.js

Get a members current deadline

### discord.js

Returns an applicants Discord

### doggo.js

Returns a random picture of a dog

### employees.js

Get the number of employees in the company

### export.js

Exports the company data to a spreadsheet that can be shared with others

### fire.js

Fire a member

### firereason.js

Get the firereason of a member

### fix.js

Fix a members discord id, in game name, or in game id in the database

### handbook.js

Returns the link to the company handbook

### hello.js

Say hello in a random language

### help.js

Get a list of commands you can do

### hire.js

Hire a member

### inactives.js

Get a list of all the inactive members in the company

### invite.js

Get a Discord invite to the other company server

### names.js

Get the names of hired members in the specified server and what their job is

### paid.js

Clear a managers cashout.

### payout.js

Get the amount to pay a member for their vouchers and then add that data to the database

### pigs.js

Swap a member to PIGS

### players.js

Get a list of how many hired members are in each server

### rejected.js

Mark an applicant as rejected

### roles.js

Reset a members roles and add the correct ones

### rts.js

Swap a member to RTS

### say.js

Make Alfred speak whatever you want

### serverinfo.js

Get information about the server

### status.js

Get the status of your application

### top10.js

Get a list of the top 10 members in the company

### ud.js

Search urban dictionary for words

### unavailable.js

Mark a manager as unavailable

## PIGScommands

### active.js

Get a list of how many people are heisting on each server

### calculate.js

Figure out how much stolen money you need to get the specified amount of vouchers

### divide.js

Sends "-------------------------------------------------------" to the channel to seperate messages

### kys.js

Assigns the "edgy" role

### nextrank.js

Figure out how much more stolen money you need to rank up

### vouchers.js

Get your voucher card

### warn.js

Warn a member

### warnlevel.js

Check your warn level

### warthogs.js

Assigns the "warthogs" role

## RTScommands

### ats.js

Assigns the ats role

### ets2.js

Assigns the ets2 role

### mods.js

Search for mods to vehicles

### owo.js

Assigns the nsfw role

### turnins.js 

Assigns the vouchers role

### voucher.js

Get your voucher card for RTS

# Database

The God of this whole project. This allows us to easily keep track of everyone while also keeping processing down.

The database has 5 tables. managers, members, payout, pigs, and rts.

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

Inside the repository create botconfig.json. Obviously I can't show you exactly what my botconfig looks like but this is the bare essentials.

```json
{
    "token": "YOUR-BOT-TOKEN",
    "prefixes": {}
}
```

