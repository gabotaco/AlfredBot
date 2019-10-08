const botconfig = require("../botconfig.json"); //handy info
const {
    google
} = require('googleapis'); //allows you to use googles api
const authentication = require("../authentication"); //Imports functions from authentication file

module.exports.run = async (bot, message, args) => {
    if (message.author.id != "404650985529540618" && message.author.id != "330000865215643658") return message.channel.send("Nice try..") //has to be rock or gabo

    authentication.authenticate().then(async (auth) => {
        bot.con.query(`SELECT * FROM members, rts, pigs WHERE members.in_game_id = pigs.in_game_id AND members.in_game_id = rts.in_game_id`, function (err, result, fields) { //get everything from all tables
            if (err) return console.log(err)

            let HiredValues = [] //store hired people
            let FiredValues = [] //store fired people
            
            result.forEach(member => { //go through all members
                if (member.company == "fired") {
                    FiredValues.push([member.in_game_name, member.in_game_id, member.pigs_total_vouchers, member.pigs_total_money, member.rts_total_vouchers, member.rts_total_money, new Date(member.deadline).toDateString()]) //if fired add to array to add to spreadsheet later
                } else {
                    HiredValues.push([member.in_game_name, member.in_game_id, member.company, member.rts_total_vouchers, member.rts_total_money, member.pigs_total_vouchers, member.pigs_total_money, new Date(member.deadline).toDateString()]) //hired add their data to array to be added to spreadsheet later
                }
            });

            const sheets = google.sheets({ //specify sheets
                version: 'v4',
                auth
            });
    
            sheets.spreadsheets.values.batchClear({ //clear the range 
                auth: auth,
                spreadsheetId: botconfig.RCSheet,
                resource: {
                    ranges: [
                        [`B5:I244`],
                        [`L5:R733`]
                    ]
                }
            }, function (err, response) { //done
                if (err) return console.log(err)
                sheets.spreadsheets.values.append({ //append all the hired people
                    auth: auth,
                    spreadsheetId: botconfig.RCSheet,
                    range: "B5:I244",
                    valueInputOption: "RAW",
                    insertDataOption: "OVERWRITE",
                    includeValuesInResponse: false,
                    resource: {
                        majorDimension: "ROWS",
                        values: HiredValues
                    }
                }, function (err, response) {
                    if (err) return console.log(err)
        
                    message.channel.send("Updated hired values")
                })
        
                sheets.spreadsheets.values.append({ //append all the fired people
                    auth: auth,
                    spreadsheetId: botconfig.RCSheet,
                    range: "L5:R733",
                    valueInputOption: "RAW",
                    insertDataOption: "OVERWRITE",
                    includeValuesInResponse: false,
                    resource: {
                        majorDimension: "ROWS",
                        values: FiredValues
                    }
                }, function (err, response) {
                    if (err) return console.log(err)
        
                    message.channel.send("Updated fired values")
                })
            })
    
            
        })
        
        
    })
}

module.exports.help = {
    name: "export",
    usage: "",
    description: "Say Hi",
    permission: "ADMINISTRATOR"
}