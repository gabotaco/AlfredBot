const botconfig = require("./botconfig.json")
const {
    google
} = require('googleapis'); //allows you to use googles api
const Discord = require("discord.js")

module.exports = {
    /**
     * @summary Takes a string and converts it to a number even if it has commas or dollar signs
     * @param {String} number The string you want to turn into an int
     * @returns {Number} Converted number
     */
    ConvertNumber: function (number) {
        if (!number) number = "0"; //if its null then set to "0"

        if (number.includes(",")) { //if it has a comma
            number = number.replace(/,/g, "") //replace all commas with nothing
        }

        if (number.includes("$")) { //if it has a dollar sign
            number = number.replace(/\$/g, "") //replace all dollar signs with nothing
        }

        number = parseInt(number); //Parse the string into a Number

        return number;
    },

    /**
     * @summary Gets the index of the search column and the id for use in spreadsheets
     * @param {Discord.Message} message The original message
     * @param {Array<String>} args args provided with command
     * @returns {[Number, String]} [SearchColumn, ID]
     */
    GetIDAndSearchColumn: function (message, args) {
        const Response = [];
        if (!args[0]) return Response
        if (message.mentions.members.first()) args[0] = message.mentions.members.first().id; //If theres a message mention then the first arg is the mention id instead of the mention

        if (args[0].length > 6) { //if the ID is longer than 6 chars
            Response.push("discord_id"); //index 0 is the index of discord ids in the rts spreadsheet
            Response.push(args[0]) //index 1 is the provided ID
        } else if (args[0]) { //if its less than or equal to 6 chars and isn't null
            Response.push("in_game_id"); //index 0 is the index of in game id's
            Response.push(args[0])
        }

        return Response;
    },

    /**
     * @summary Changes the deadline for a member
     * @param {Discord.Client} bot The Discord bot
     * @param {String} Deadline New deadline for the user
     * @param {String} column The column with the ID    
     * @param {String} ID The ID of the user
     * @param {Discord.GuildChannel} channel Discord channel to send messages
     */
    ChangeDeadline: function (bot, Deadline, column, id, channel) {
        bot.con.query(`UPDATE members SET deadline = '${Deadline}' WHERE ${column}='${id}'`, function (err, result, fields) {
            if (err) console.log(err)
            else if (result.affectedRows == 0) return channel.send("Unable to find that member")
            else {
                channel.send(`Set deadline to ${Deadline}`)
            }
        })
    },

    /**
     * @summary Gets the server IP and port number when a user types in a server number
     * @param {String} ServerNumber Specified server number
     * @returns {[String, Number]} [Server IP, Last server Port number]
     */
    GetServerIPandPort: function (ServerNumber) {
        let server = parseInt(ServerNumber) //convert the string to an int

        if (ServerNumber.toLowerCase() == "a") { //if the server number is A
            var serverIP = "na.tycoon.community" //ip is na
            server = 5 //last port number is 5
        } else if (server > 1 && server < 6) { //if the server number is higher than 1 and less than 6
            var serverIP = "server.tycoon.community" //server ip is server. and last port number is the same provided in the servernumber
        } else if (server == 0) { //if they say server 0
            var serverIP = "server.tycoon.community" //server ip is server.
            server = 1 //last port number is 1
        } else if (server > 6) { //if the number is higher than 6
            var serverIP = "na.tycoon.community" //na.
            server -= 5 //last port number is that number minues 5
        } else { //any other server
            var serverIP = "na.tycoon.community" //na.
            server = 0 //server port is 0
        }

        return [serverIP, server]
    },

    /**
     * @summary Takes all the number of players on each server and makes it into a message. technically they are already sorted
     * @param {[[String,String]]} PlayersArray [[Num of players, server port]]
     * @returns {String} Sentence about how many players are on
     */
    SortPlayersOnServers: function (PlayersArray) {
        let PlayersEmbed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("Players")

        for (let i = 0; i < PlayersArray.length; i++) { //go through all of them
            //if (PlayersArray[i][0] > 0) {
            PlayersEmbed.addField(`Server ${PlayersArray[i][1]}`, `${PlayersArray[i][0]} ${PlayersArray[i][0] == "1" ? "player" : "players"}`, true) //Adds the server
            //}
        }

        return PlayersEmbed
        /* All one sentence
        const MostPlayers = PlayersArray[0][0] //first one is highest
        let NewMessage = `There's currently ${MostPlayers} ${(MostPlayers == "1")?"player":"players"} on server ${PlayersArray[0][1]}` //make a message
        let NextPlayers
        for (let i = 1; i < PlayersArray.length; i++) { //loop through all servers excluding mostPlayers one
            if (PlayersArray[i][0] == MostPlayers) { //if its just as high as most players then add the server to the end of the message
                NewMessage += ` and ${PlayersArray[i][1]}`
            }
            else if (PlayersArray[i][0] > 0) { //if theres at least 1 player
                if (!NextPlayers) { //if null
                    NextPlayers = PlayersArray[i][0] //next largest ammount

                    NewMessage += `, ${NextPlayers} ${(NextPlayers == "1")?"player":"players"} on server ${PlayersArray[i][1]}` //add the new ammount to message
                } else {
                    if (NextPlayers == PlayersArray[i][0]) { //if same as next largest
                        NewMessage += ` and ${PlayersArray[i][1]}`  //add to end
                    } else {
                        NextPlayers = PlayersArray[i][0] //if greater than zero but less than next largest make next largest this
                        NewMessage += `, ${NextPlayers} ${(NextPlayers == "1")?"player":"players"} on server ${PlayersArray[i][1]}` //add new ammount to message
                    }
                }
            }
        }
        NewMessage = NewMessage.replace(/,([^,]*)$/, " and" + '$1'); //replace the last comma with an and. its fucking crazy i know
        return NewMessage;
        */
    },
    /**
     * @callback RowCallback
     * @param {Array<String>} row The row
     */

    /**
     * @summary Loop through all rows in range and run a function
     * @param {OAuth2Client} auth Google auth
     * @param {String} SpreadsheetID The spreadsheet 
     * @param {String} Range Range
     * @param {Discord.GuildChannel} channel The channel
     * @param {RowCallback} callback What to do for each row
     */
    ProcessAllInRange: function (auth, SpreadsheetID, Range, channel, callback) {
        return new Promise(resolve => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            sheets.spreadsheets.values.get({
                spreadsheetId: SpreadsheetID,
                range: Range,
            }, (err, res) => {
                if (err) {
                    channel.send('The API returned an ' + err);
                    return;
                }

                const rows = res.data.values;
                if (rows.length) {
                    rows.map((row) => { //for each row in rows run the callback function with the row
                        callback(row)
                    })
                    resolve();
                }

            })
        })
    },

    /**
     * @summary Gets the details for the member with the ID in the search column
     * @param {OAuth2Client} auth For spreadsheets
     * @param {String} SpreadsheetID ID of the spreadsheet to search
     * @param {String} Range Range with their info
     * @param {Number} SearchColumn What column their ID will be in
     * @param {String} ID Their ID
     * @param {Discord.GuildChannel} channel Discord channel
     * @returns {Object} Their entire row in the range
     */
    GetMemberDetails: function (bot, channel, Column, ID) {
        return new Promise(resolve => {
            bot.con.query(`SELECT * FROM members, rts, pigs WHERE members.${Column} = '${ID}' AND members.in_game_id = pigs.in_game_id AND members.in_game_id = rts.in_game_id`, function (err, result, fields) {
                if (err) console.log(err)
                resolve(result[0])
            })
        })

    },

    /**
     * @summary Gets the voucher log sheet name for the manager
     * @param {OAuth2Client} auth Sheets
     * @param {String} SpreadsheetID CompanySheet name
     * @param {String} Range Range of the names
     * @param {String} ID ID of manager
     * @param {Discord.GuildChannel} channel Discord channel
     */
    GetAppSheetName: function (auth, SpreadsheetID, Range, ID, channel) {
        return new Promise(resolve => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            sheets.spreadsheets.values.get({
                spreadsheetId: SpreadsheetID,
                range: Range,
            }, (err, res) => {
                if (err) return channel.send('The API returned an ' + err);

                const rows = res.data.values;
                if (rows.length) { //If there is any data values
                    rows.map((row) => {
                        if (row[0] == ID) resolve(row[1]) //If found the managers sheet resolve with the name
                    })
                }
            })
        })
    },

    /**
     * @callback ApplicantCallback
     * @param {Array<String>} row Row with all applicant data
     * @param {Number} rowIndex Row number in the appsheet
     */
    /**
     * @summary Finds all the info about an applicant
     * @param {OAuth2Client} auth Sheets
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} ID Member ID
     * @param {Number} SearchColumn Column with the ID
     * @param {Number} CompanyIndex Index of the sign me up column
     * @param {ApplicantCallback} callback What to run when finding member
     */
    FindApplicant: function (auth, channel, ID, SearchColumn, CompanyIndex, callback) {
        return new Promise(resolve => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            sheets.spreadsheets.values.get({
                spreadsheetId: botconfig.Applications,
                range: botconfig.ApplicationRange,
            }, (err, res) => {
                if (err) return channel.send('The API returned an ' + err);

                const rows = res.data.values;
                if (rows.length) {
                    rows.map(async (row) => {
                        if (ID == "") { //If they don't specify an ID
                            if ((row[SearchColumn] == "Under review" || row[SearchColumn] == "") && row[CompanyIndex] == "Sign me up!") { //If their status is Under review or no status and the applicant applied for the company
                                await callback(row, rows.indexOf(row) + botconfig.ApplicationStartingRow)
                            }
                        } else {
                            if (row[SearchColumn] == ID && row[CompanyIndex] == "Sign me up!") { //If its the right applicant for the right company
                                await callback(row, rows.indexOf(row) + botconfig.ApplicationStartingRow);
                            }
                        }
                    })
                    resolve();
                }
            })
        })
    },

    /**
     * @summary Updates the status of an applicant
     * @param {OAuth2Client} auth Sheets
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} ID The ID of the applicant
     * @param {Number} CompanyIndex The sign me up column index
     * @param {String} Status What to change their status too
     */
    UpdateApplicantStatus: function (auth, channel, ID, CompanyIndex, Status) {
        return new Promise(async resolve => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            await this.FindApplicant(auth, channel, ID, botconfig.ApplicationInGameIDIndex, CompanyIndex, async function (row, RowIndex) { //Find all applicants with the ID
                return new Promise(resolve => {
                    sheets.spreadsheets.values.update({
                        auth: auth,
                        spreadsheetId: botconfig.Applications,
                        range: `A${RowIndex}:A${RowIndex}`,
                        valueInputOption: "USER_ENTERED",
                        resource: {
                            majorDimension: "COLUMNS",
                            values: [
                                [Status]
                            ] //Change column A in RowIndex to the status
                        }
                    }, (err, response) => {
                        if (err) {
                            channel.send('The API returned an error: ' + err);
                            return;
                        } else {
                            channel.send(`Marked applicant as ${Status}`)
                            resolve()
                        }
                    })
                })
            })
            resolve();
        })
    },

    /**
     * @summary Delete member from a sheet in the range
     * @param {OAuth2Client} auth Sheets
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} SpreadsheetID ID of spreadsheet to remove member from
     * @param {Number} SearchColumn What column the ID should be in
     * @param {String} SearchRange What range the column and ID is in
     * @param {Number} SearchStartingRow What row the range starts on
     * @param {String} ID The ID of the member
     */
    RemoveMember: function (auth, channel, SpreadsheetID, SearchColumn, SearchRange, SearchStartingRow, ID) {
        const sheets = google.sheets({
            version: 'v4',
            auth
        });

        sheets.spreadsheets.values.get({
            spreadsheetId: SpreadsheetID,
            range: SearchRange,
        }, (err, res) => {
            if (err) {
                channel.send('The API returned an ' + err);
                return;
            }

            const rows = res.data.values;
            if (rows.length) {
                rows.map((row) => {
                    if (row[SearchColumn] == ID) { //Found member
                        const RowIndex = rows.indexOf(row) + SearchStartingRow //Get the index of the row
                        if (SpreadsheetID == botconfig.PIGSSheet) { //Searching in PIGSSheet
                            sheets.spreadsheets.values.batchClear({
                                auth: auth,
                                spreadsheetId: SpreadsheetID,
                                resource: {
                                    ranges: [
                                        [`B${RowIndex}:C${RowIndex}`], //remove all data in column B-C, F-T, X-X
                                        [`F${RowIndex}:T${RowIndex}`],
                                        [`X${RowIndex}:X${RowIndex}`]
                                    ]
                                }
                            })
                        } else if (SpreadsheetID == botconfig.RTSSheet) { //Searching in RTS sheet
                            sheets.spreadsheets.values.batchClear({
                                auth: auth,
                                spreadsheetId: botconfig.RTSSheet,
                                resource: {
                                    ranges: [
                                        [`B${RowIndex}:C${RowIndex}`], //remove all data in column B-C, F-P, R-R, T-T
                                        [`F${RowIndex}:P${RowIndex}`],
                                        [`R${RowIndex}:R${RowIndex}`],
                                        [`T${RowIndex}:T${RowIndex}`]
                                    ]
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    /**
     * @summary Adds member details to range
     * @param {OAuth2Client} auth Google Sheets
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} SpreadsheetID Spreadsheet id
     * @param {String} Range Range to add member to
     * @param {Number} StartingRow What row the range starts on
     * @param {Array<String>} MemberData What data to put into the row
     * @param {Discord.Client} bot The discord bot
     */
    AddMember: function (auth, channel, SpreadsheetID, Range, StartingRow, MemberData, bot) {
        const sheets = google.sheets({
            version: 'v4',
            auth
        });

        sheets.spreadsheets.values.get({
            spreadsheetId: SpreadsheetID,
            range: Range,
        }, (err, res) => {
            if (err) return channel.send('The API returned an ' + err);

            const rows = res.data.values;
            if (rows.length) {
                let FoundRow = false;
                rows.map((row) => {
                    if (!row[1] && !FoundRow) { //If the row is empty and haven't found another empty row
                        FoundRow = true;

                        const RowIndex = rows.indexOf(row) + StartingRow;

                        if (SpreadsheetID == botconfig.PIGSSheet) { //Searching in PIGS
                            sheets.spreadsheets.values.batchUpdate({
                                auth: auth,
                                spreadsheetId: SpreadsheetID,
                                resource: {
                                    valueInputOption: "USER_ENTERED",
                                    data: [ //Adds all this data
                                        {
                                            range: `B${RowIndex}:C${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.PIGSEmployeeRangeDiscordIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeInGameNameIndex]]
                                            ]
                                        },
                                        {
                                            range: `F${RowIndex}:T${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.PIGSEmployeeRangeInGameIDIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeNotesIndex]],
                                                [],
                                                [MemberData[botconfig.PIGSEmployeeRangeHelperIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeEarnedBeforeIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeTurnedInBeforeIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeVouchersDonatedBeforeIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeCashDonationsIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeHustlerVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangePickPocketVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeThiefVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeLawlessVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeMastermindVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeOverlordVouchersIndex]],
                                                [MemberData[botconfig.PIGSEmployeeRangeDonatedVouchersIndex]]
                                            ]
                                        },


                                        {
                                            range: `X${RowIndex}:X${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.PIGSEmployeeRangeDeadlineIndex]]
                                            ]
                                        }
                                    ]
                                }

                            }, (err, response) => {
                                if (err) return channel.send(err)
                                else {
                                    channel.send(`${MemberData[botconfig.PIGSEmployeeRangeInGameNameIndex]} has been moved!`)
                                    bot.BothCommands.get("roles").run(bot, null, [MemberData[botconfig.PIGSEmployeeRangeDiscordIndex]]) //Run roles command for person
                                }
                            })
                        } else if (SpreadsheetID == botconfig.RTSSheet) { //If RTS sheet
                            sheets.spreadsheets.values.batchUpdate({
                                auth: auth,
                                spreadsheetId: SpreadsheetID,
                                resource: {
                                    valueInputOption: "USER_ENTERED",
                                    data: [ //Adds member
                                        {
                                            range: `B${RowIndex}:C${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.RTSEmployeeRangeDiscordIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeInGameNameIndex]]
                                            ]
                                        },

                                        {
                                            range: `F${RowIndex}:P${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.RTSEmployeeRangeInGameIDIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeNotesIndex]],
                                                [],
                                                [MemberData[botconfig.RTSEmployeeRangeHelpersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangePreVouchersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangePreMoneyIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeInitiateVouchersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeLeadfootVouchersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeWheelmanVouchersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeLegendaryVouchersIndex]],
                                                [MemberData[botconfig.RTSEmployeeRangeSpeeddemonVouchersIndex]]
                                            ]
                                        },

                                        {
                                            range: `R${RowIndex}:R${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.RTSEmployeeRangeDonationsIndex]]
                                            ]
                                        },
                                        {
                                            range: `T${RowIndex}:T${RowIndex}`,
                                            majorDimension: "COLUMNS",
                                            values: [
                                                [MemberData[botconfig.RTSEmployeeRangeDeadlineIndex]]
                                            ]
                                        }
                                    ]
                                }

                            }, (err, response) => {
                                if (err) return channel.send(err)
                                channel.send(`${MemberData[botconfig.RTSEmployeeRangeInGameNameIndex]} has been moved!`)
                                bot.BothCommands.get("roles").run(bot, null, [MemberData[botconfig.RTSEmployeeRangeDiscordIndex]])

                            })
                        }
                    }
                })
            }

        })
    },

    /**
     * @summary Gets the discord of an applicant
     * @param {OAuth2Client} auth Sheets Auth
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} ID Member ID
     * @param {Number} SignMeUpIndex Index of Sign Me Up! in application sheet
     * @returns {String} Either discord ID or the string they typed in application if not found
     */
    GetDiscordFromID: async function (auth, channel, ID, SignMeUpIndex) {
        return new Promise(async resolve => {
            let Discord;
            await this.FindApplicant(auth, channel, ID, botconfig.ApplicationInGameIDIndex, SignMeUpIndex, async function (row) { //Find applicant
                return new Promise(res => {
                    let Discriminator = row[botconfig.ApplicationDiscordIndex].split("#")[1] //Gets the discrim number
                    let Username = row[botconfig.ApplicationDiscordIndex].split("#")[0].replace(/\s/g, '') //Gets the username without any spaces
                    Discord = row[botconfig.ApplicationDiscordIndex] //sets discord variable
                    channel.guild.members.forEach(element => { //search in server members
                        if (element.user.discriminator == Discriminator && element.user.username.replace(/\s/g, '').toLowerCase() == Username.toLowerCase()) { //if the member discrim = app discrim and the username without spaces and lowercase = username lowercase
                            resolve(element.id) //resolves with ID
                        }
                    });
                    res()
                })
            })
            resolve(Discord)
        })
    },

    /**
     * @summary Replaces all pending payouts with clear so that it doesn't show up in .cashout
     * @param {OAuth2Client} auth Google Sheets
     * @param {String} ID Member ID
     * @param {Discord.GuildChannel} channel Discord channel
     * @param {String} VoucherID The Spreadsheet ID of voucher log
     */
    PayManager: async function (bot, ID, channel) {
        bot.con.query(`UPDATE managers SET total_money = total_money + cashout_worth WHERE discord_id = '${ID}'`, function (err, result, fields) {
            if (err) return console.log(err)
            bot.con.query(`UPDATE managers SET cashout = '0', cashout_worth = '0' WHERE discord_id = '${ID}'`, function (err, result, fields) {
                if (err) console.log(err)
                if (result.affectedRows == 1) {
                    channel.send("Paid.")
                } else {
                    channel.send("Couldn't find that manager")
                }
            })
        })

    },

    /**
     * @summary Adds a payout to the voucher logs for the manager
     * @param {OAuth2Client} auth Google Sheets
     * @param {String} SpreadsheetID Google sheet id
     * @param {String} AppSheetName Manager App Sheet Name
     * @param {Array<String>} MemberData Member data
     * @param {Number} voucherAmount Amount of vouchers
     * @param {Discord.GuildChannel} channel 
     * @returns {Array<String>} [newrank, isRankingUp, moneyOwe, overflow, newDeadline, LastRow]
     */
    AddPayoutToVoucherLogs: function (auth, SpreadsheetID, AppSheetName, MemberData, voucherAmount, channel) {
        return new Promise(resolve => {
            if (SpreadsheetID == botconfig.PIGSVoucher) {
                var employeeName = MemberData[botconfig.PIGSEmployeeRangeInGameNameIndex]
                var employeeRank = MemberData[botconfig.PIGSEmployeeRangeRankIndex]
                var employeeUntilNext = MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex]
                var currentDeadline = MemberData[botconfig.PIGSEmployeeRangeDeadlineIndex]
            } else if (SpreadsheetID == botconfig.RTSVoucher) {
                var employeeName = MemberData[botconfig.RTSEmployeeRangeInGameNameIndex]
                var employeeRank = MemberData[botconfig.RTSEmployeeRangeRankIndex]
                var employeeUntilNext = MemberData[botconfig.RTSEmployeeRangeUntilNextIndex]
                var currentDeadline = MemberData[botconfig.RTSEmployeeRangeDeadlineIndex]
            }
            const d = new Date()
            const date = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` //timestamp

            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            sheets.spreadsheets.values.get({
                spreadsheetId: SpreadsheetID,
                range: `${AppSheetName}!${botconfig.VoucherRange}`,
            }, (err, res) => {
                if (err) return channel.send('The API returned a ' + err);

                const rows = res.data.values;
                if (rows.length) {
                    let LastRow;
                    let FoundRow = false;
                    rows.map(row => {
                        if (!row[botconfig.VoucherRankUp] && !FoundRow) { //If empty row and haven't found an empty row
                            FoundRow = true;
                            LastRow = rows.indexOf(row) + botconfig.VoucherRangeStartingRow //set last row to that row number
                        }
                    })

                    if (!LastRow) LastRow = rows.length + botconfig.VoucherRangeStartingRow //if didn't find last row then its at the end of the range

                    sheets.spreadsheets.values.batchUpdate({
                        auth: auth,
                        spreadsheetId: SpreadsheetID,
                        resource: {
                            valueInputOption: "USER_ENTERED",
                            data: [ //Adds the payout

                                {
                                    range: `${AppSheetName}!A${LastRow}:D${LastRow}`,
                                    majorDimension: "COLUMNS",
                                    values: [
                                        [employeeName],
                                        [employeeRank],
                                        [voucherAmount],
                                        [employeeUntilNext]
                                    ]
                                },

                                {
                                    range: `${AppSheetName}!G${LastRow}:H${LastRow}`,
                                    majorDimension: "COLUMNS",
                                    values: [
                                        [currentDeadline],
                                        ["Pending"]
                                    ]
                                },

                                {
                                    range: `${AppSheetName}!P${LastRow}:Q${LastRow}`,
                                    majorDimension: "COLUMNS",
                                    values: [
                                        [date],
                                        [new Date().toDateString()]
                                    ]
                                }
                            ]
                        }
                    }, (err, response) => {
                        if (err) {
                            channel.send('The API returned an error: ' + err);
                            return;
                        } else { //Successful update
                            sheets.spreadsheets.values.get({
                                spreadsheetId: SpreadsheetID,
                                range: `${AppSheetName}!A${LastRow}:O${LastRow}`, //Gets the payout info that google sheets calculated
                            }, (err, res) => {
                                if (err) return channel.send('The API returned an ' + err);
                                const rows = res.data.values;
                                if (rows.length) {
                                    let newrank;

                                    rows.map((row) => { //I mean kinda useless cause its one row but i mean doesn't change anythin to take it out
                                        switch (row[botconfig.VoucherRankIndex].toLowerCase()) { //gets the rank and figures out the next rank
                                            case "hustler":
                                                newrank = "PickPocket"
                                                break;
                                            case "pickpocket":
                                                newrank = "Thief"
                                                break;
                                            case "thief":
                                                newrank = "Lawless"
                                                break;
                                            case "lawless":
                                                newrank = "Mastermind"
                                                break;
                                            case "mastermind":
                                                newrank = "Overlord"
                                                break;
                                            case "initiate":
                                                newrank = "Lead Foot"
                                                break;
                                            case "lead foot":
                                                newrank = "Wheelman";
                                                break;
                                            case "wheelman":
                                                newrank = "Legendary";
                                                break;
                                            case "legendary":
                                                newrank = "Speed Demon";
                                                break;
                                        }
                                        isRankingUp = row[botconfig.VoucherRankUp]; //Data about payout
                                        moneyOwe = row[botconfig.VoucherMoneyOwe];
                                        overflow = row[botconfig.VoucherOverflow]
                                        newDeadline = row[botconfig.VoucherNewDeadline]
                                    })

                                    let paidEmbed = new Discord.RichEmbed()
                                        .addField("Money", moneyOwe)
                                        .addField("Rank up?", isRankingUp)
                                        .setTitle(`Payout for ${employeeName}`)

                                    if (isRankingUp == "YES") {
                                        paidEmbed.addField("Rank up to", newrank)
                                        paidEmbed.setColor("GREEN")
                                    } else {
                                        paidEmbed.setColor("RED")
                                    }

                                    channel.send(paidEmbed)

                                    const PayoutInfo = [newrank, isRankingUp, moneyOwe, overflow, newDeadline, LastRow]
                                    resolve(PayoutInfo);
                                }
                            })
                        }

                    });
                }
            })
        })
    },

    /**
     * @summary Gets the row number of the member
     * @param {OAuth2Client} auth Google Sheets
     * @param {Number} SearchColumn Column index with ID
     * @param {String} ID Member ID
     * @param {String} SpreadsheetID Sheet ID
     * @param {String} Range Range with Member
     * @param {Number} StartingRow Starting row number of range
     * @returns {Number} The row with the member
     */
    GetMemberRow: function (auth, SearchColumn, ID, SpreadsheetID, Range, StartingRow) {
        return new Promise(resolve => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });

            sheets.spreadsheets.values.get({
                spreadsheetId: SpreadsheetID,
                range: Range,
            }, (err, res) => {
                if (err) return channel.send('The API returned an ' + err);

                const rows = res.data.values;
                if (rows.length) { //if there are rows
                    let currentRow = StartingRow;
                    rows.map((row) => {
                        if (row[SearchColumn] == ID) { //if found person
                            resolve(currentRow); //Resolve with row
                        }
                        currentRow++; //increase row
                    })
                    resolve(null) //if didn't find one then return null
                }

            })
        })

    },

    /**
     * @summary Get the ranks of everyone in company and fired
     * @param {OAuth2Client} auth Google Sheets
     * @param {String} SpreadsheetID Sheets ID
     * @param {String} Range Range of members
     * @param {Number} TotalVoucherColumnIndex Index of column with the total vouchers
     * @param {Number} InGameNameIndex Index with in game name
     * @param {Discord.GuildChannel} channel Channel
     * @returns {Array<Array<Number,String>>} [Total vouchers, In Game name] sorted from most to least total vouchers
     */
    GetRanks: function (auth, SpreadsheetID, Range, TotalVoucherColumnIndex, InGameNameIndex, channel) {
        let ConvertNumber = this.ConvertNumber //javascript b dumb sometimes
        return new Promise(async resolve => {
            let TotalVouchers = []
            await this.ProcessAllInRange(auth, SpreadsheetID, Range, channel, function (row) {
                if (row[InGameNameIndex]) { //If theres a member
                    TotalVouchers.push([ConvertNumber(row[TotalVoucherColumnIndex]), row[InGameNameIndex]]) //Add member and total vouchers to array
                }
            })

            TotalVouchers.sort(sortFunction); //Sort it from highest to least
            function sortFunction(a, b) {
                if (a[0] == b[0]) {
                    return 0;
                } else {
                    return (a[0] > b[0]) ? -1 : 1;
                }
            }
            resolve(TotalVouchers) //Resolve array
        })
    },

    /**
     * @summary Removes a payout from sheet
     * @param {OAuth2Client} auth Google Sheets
     * @param {String} SpreadsheetID Sheet ID
     * @param {String} AppSheetName App sheet of manager
     * @param {Number} Row Row of payout
     */
    RemovePayout: function (auth, SpreadsheetID, AppSheetName, Row) {
        const sheets = google.sheets({
            version: 'v4',
            auth
        });

        sheets.spreadsheets.values.batchClear({
            auth: auth,
            spreadsheetId: SpreadsheetID,
            resource: {
                ranges: [
                    [`${AppSheetName}!A${Row}:D${Row}`],
                    [`${AppSheetName}!G${Row}:H${Row}`],
                ]
            }
        })
    },

    /**
     * @summary Adds the payout to member sheet
     * @param {OAuth2Client} auth Google Sheets
     * @param {Discord.GuildChannel} channel Discord Channel
     * @param {String} SpreadsheetID Sheet ID
     * @param {String} Range Range of sheet
     * @param {Number} StartingRow Starting row of Range
     * @param {String} Column1 Character of column to put voucher1 amount
     * @param {String} Voucher1 Num of vouchers in first column
     * @param {Number} SearchColumn Search column with ID
     * @param {String} ID ID of member
     * @param {String} Deadline Their new deadline
     * @param {String} DeadlineColumn Column to put deadline
     * @param {String} Column2 Character of column to put voucher 2 amount (not required)
     * @param {String} Voucher2 Num of vouchers to put in second column (not required)
     */
    AddPayoutToSheet: async function (auth, channel, SpreadsheetID, Range, StartingRow, Column1, Voucher1, SearchColumn, ID, Deadline, DeadlineColumn, Column2, Voucher2) {
        const sheets = google.sheets({
            version: 'v4',
            auth
        });

        const Row = await this.GetMemberRow(auth, SearchColumn, ID, SpreadsheetID, Range, StartingRow)

        await this.ChangeDeadline(auth, channel, SpreadsheetID, Range, StartingRow, SearchColumn, ID, Deadline, DeadlineColumn)

        if (Column2 && Voucher2) { //If they ranked up
            return new Promise(async resolve => {
                sheets.spreadsheets.values.batchUpdate({ //adds the date as well
                    auth: auth,
                    spreadsheetId: SpreadsheetID,
                    resource: {
                        valueInputOption: "USER_ENTERED",
                        data: [ //add voucher data
                            {
                                range: `${Column1}${Row}:${Column2}${Row}`,
                                majorDimension: "COLUMNS",
                                values: [
                                    [Voucher1],
                                    [Voucher2]
                                ]
                            }
                        ]
                    }
                }, (err, response) => {
                    if (err) {
                        channel.send('The API returned an error: ' + err);
                        return;
                    } else {
                        channel.send("Success!")
                        resolve()

                    }

                });
            })
        } else { //Didn't rank up
            return new Promise(async resolve => {
                sheets.spreadsheets.values.batchUpdate({
                    auth: auth,
                    spreadsheetId: SpreadsheetID,
                    resource: {
                        valueInputOption: "USER_ENTERED",
                        data: [ //just the one voucher amount
                            {
                                range: `${Column1}${Row}:${Column1}${Row}`,
                                majorDimension: "COLUMNS",
                                values: [
                                    [Voucher1]
                                ]
                            }
                        ]
                    }
                }, (err, response) => {
                    if (err) {
                        channel.send('The API returned an error: ' + err);
                        return;
                    } else {
                        channel.send("Success!")
                        resolve();
                    }
                });
            })
        }
    },
    numberWithCommas: function (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}