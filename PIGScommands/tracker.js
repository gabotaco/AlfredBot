const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const request = require("request")
const functions = require("../functions.js")

function distanceBetweenCoords(x1, y1, x2, y2) { //Get the distance between two x,y coords
    const differenceInX = x2 - x1
    const differenceInY = y2 - y1

    const whatToSqrt = ((differenceInX * differenceInX) + (differenceInY * differenceInY))
    const answer = Math.sqrt(whatToSqrt)
    return answer
}

const heistLocations = [{
        name: "Cluckin' Bell Farms",
        x: -76.728149414063,
        y: 6221.4399414063,
        DistanceNeeded: 62.1022764898239
    },
    {
        name: "North Senora Freeway Market",
        x: 1733.8681640625,
        y: 6415.50390625,
        DistanceNeeded: 26.3321866694191
    },
    {
        name: "Grapeseed Market",
        x: 1702.5467529297,
        y: 4926.0380859375,
        DistanceNeeded: 36.0121844704344
    },
    {
        name: "Grapeseed Clothing Store",
        x: 1693.3563232422,
        y: 4822.3608398438,
        DistanceNeeded: 24.3374452521752
    },
    {
        name: "Paleto Clothing Store",
        x: 4.5855550765991,
        y: 6512.296875,
        DistanceNeeded: 25.000865906983
    },
    {
        name: "Easty Sandy Shores Market",
        x: 1962.5238037109,
        y: 3744.8000488281,
        DistanceNeeded: 30.7215026409126
    },
    {
        name: "West Sandy Shores Market",
        x: 1395.7299804688,
        y: 3604.4040527344,
        DistanceNeeded: 28.0078194795185
    },
    {
        name: "Harmony Market",
        x: 544.24536132813,
        y: 2668.3439941406,
        DistanceNeeded: 30.2793034405345
    },
    {
        name: "Harmony Clothing Store",
        x: 617.13360595703,
        y: 2760.5522460938,
        DistanceNeeded: 81.750005348401
    },
    {
        name: "Great Chaparral Plaza",
        x: -1101.0592041016,
        y: 2706.7810058594,
        DistanceNeeded: 34.4622181326907
    },
    {
        name: "Grand Senora Desert Market",
        x: 1184.3702392578,
        y: 2702.0246582031,
        DistanceNeeded: 33.8218898869801
    },
    {
        name: "Grand Senora Freeway Market",
        x: 2678.5139160156,
        y: 3285.1535644531,
        DistanceNeeded: 30.9145349988365
    },
    {
        name: "Humane Labs",
        x: 3543.6293945313,
        y: 3760.416015625,
        DistanceNeeded: 185.723204889252
    },
    {
        name: "Palomino Freeway Market",
        x: 2562.0974121094,
        y: 385.45495605469,
        DistanceNeeded: 65.4409475067684
    },
    {
        name: "Murrieta Heights Market",
        x: 1143.2698974609,
        y: -979.85540771484,
        DistanceNeeded: 30.8041015666854
    },
    {
        name: "La Mesa Ammunation",
        x: 844.14031982422,
        y: -1026.8836669922,
        DistanceNeeded: 27.7213362996078
    },
    {
        name: "Cypress Flats Ammunation",
        x: 811.15045166016,
        y: -2154.1484375,
        DistanceNeeded: 39.9280813879945
    },
    {
        name: "Raven Slaughterhouse",
        x: 972.33917236328,
        y: -2125.1721191406,
        DistanceNeeded: 44.7298106425682
    },
    {
        name: "Maze Bank Arena",
        x: -253.15653991699,
        y: -2003.1385498047,
        DistanceNeeded: 67.3037258915841
    },
    {
        name: "Chamberlain Market",
        x: -54.640853881836,
        y: -1758.7200927734,
        DistanceNeeded: 40.9999885959627
    },
    {
        name: "Benny's Motorworks",
        x: -207.19439697266,
        y: -1316.7548828125,
        DistanceNeeded: 36.7474974402387
    },
    {
        name: "Strawberry Market",
        x: 33.063438415527,
        y: -1343.4152832031,
        DistanceNeeded: 36.2844861837204
    },
    {
        name: "Vanilla Unicorn",
        x: 117.16092681885,
        y: -1286.3934326172,
        DistanceNeeded: 46.3179868386937
    },
    {
        name: "Mission Row Police Department",
        x: 443.72067260742,
        y: -979.62176513672,
        DistanceNeeded: 44.9999930859011
    },
    {
        name: "Textile City Clothing Store",
        x: 425.45648193359,
        y: -805.30444335938,
        DistanceNeeded: 24.7999947027191
    },
    {
        name: "Fleeca Bank - Alta",
        x: 313.21166992188,
        y: -281.55590820313,
        DistanceNeeded: 30.8000132627782
    },
    {
        name: "Alta Clothing Store",
        x: 124.66481781006,
        y: -218.6095123291,
        DistanceNeeded: 36.0000048525849
    },
    {
        name: "Pacific Standard",
        x: 254.00982666016,
        y: 220.72286987305,
        DistanceNeeded: 53.5999954960372
    },
    {
        name: "Downtown Vinewood Market",
        x: 223.5436706543,
        y: 176.62329101563,
        DistanceNeeded: 30
    },
    {
        name: "Morningwood Market",
        x: -1488.0456542969,
        y: -380.03112792969,
        DistanceNeeded: 28.8000217227331
    },
    {
        name: "Del Perro Clothing Store",
        x: -1192.4432373047,
        y: -769.20184326172,
        DistanceNeeded: 48.6000115896297
    },
    {
        name: "Del Perro Market",
        x: -1223.6145019531,
        y: -907.39819335938,
        DistanceNeeded: 38.3999766328023
    },
    {
        name: "Vespucci Canals Market",
        x: -821.82550048828,
        y: -1073.2473144531,
        DistanceNeeded: 32.4000604599335
    },
    {
        name: "Little Seoul Market",
        x: -711.30438232422,
        y: -912.45086669922,
        DistanceNeeded: 39.9999822391596
    },
    {
        name: "Little Seoul Ammunation",
        x: -664.81286621094,
        y: -937.60113525391,
        DistanceNeeded: 25.1999985502949
    },
    {
        name: "Richman Glen Market",
        x: -1823.9831542969,
        y: 791.73956298828,
        DistanceNeeded: 26.9999747702059
    },
    {
        name: "Rockford Hills Clothing Store",
        x: -712.322265625,
        y: -154.61956787109,
        DistanceNeeded: 19.3999995179123
    },
    {
        name: "Vangelico Jewelry Store",
        x: -623.06903076172,
        y: -231.90040588379,
        DistanceNeeded: 40.1582472914996
    },
    {
        name: "Burton Clothing Store",
        x: -159.60844421387,
        y: -306.19805908203,
        DistanceNeeded: 39.6000004301791
    },
    {
        name: "Chumash Plaza",
        x: -3154.1611328125,
        y: 1080.5541992188,
        DistanceNeeded: 74.8897062651916
    },
    {
        name: "Chumash Market",
        x: -3242.8142089844,
        y: 1001.2553100586,
        DistanceNeeded: 19.8218076996547
    },
    {
        name: "Headquarters",
        x: 977.08715820313,
        y: -117.98474121094,
        DistanceNeeded: 84.5252302887384
    },

]
let TimesRun = 0
let LastPosition = "None"
let InGameID;
let HeistChannel;
let ServerIP
let ServerPORT
let TrackingPlayerName;

module.exports.run = async (bot, message, args) => {
    HeistChannel = message.guild.channels.get("539643307001905162") //Gets heist channel

    if (args[0].toLowerCase() == "stop") { //wants to stop
        message.channel.send("Stopped tracking. Please wait for the command itself to say that it has stopped (this could take a minute).")
        botconfig.Tracking = false; //set tracking to false
        return;
    }

    if (!args[1]) return message.channel.send(".tracker [party leader in game id] [server number]") //Not enough info after arg

    InGameID = args[0] //Current in game ID

    const Response = await functions.GetServerIPandPort(args[1])
    ServerPORT = Response[1]
    ServerIP = Response[0]

    if (!botconfig.Tracking) { //If bot isn't tracking
        botconfig.Tracking = true; //set tracking to true
        TimesRun = 0; //Times run to 0
        LastPosition = "None"; //Last position to None
        getPlayerLocation() //Start tracking
    } else if (botconfig.Tracking) return message.channel.send("Someone is already being tracked.") //Tracking is true so don't do anything
}

function getPlayerLocation() {
    if (!botconfig.Tracking) { //If tracking is false
        HeistChannel.send(`No longer tracking ${TrackingPlayerName}.`) //say no longer tracking
        return; //End function
    }

    TimesRun++ //Increase times run

    if (TimesRun == 180) { //If ran 180 times
        botconfig.Tracking = false; //Stop tracking
        HeistChannel.send("No longer tracking the player.")
        return; //End function
    }

    request(`http://${ServerIP}:3012${ServerPORT}/status/map/positions.json`, function (error, response, body) { //Get players on server
        if (!error) { //No error
            let foundPerson = false; //Haven't found person

            body = JSON.parse(body) //parse body

            body.players.forEach(player => { //Loop through all players
                if (player[2].toString() == InGameID) { //if in game ID is equal to the one told to search
                    TrackingPlayerName = player[0] //Set player name
                    foundPerson = true; //found person

                    if (TimesRun == 1) HeistChannel.send(`Started tracking **${player[0]}**`) //If first time tracking

                    let currentCoords = player[3] //Current coords is the player

                    let closeToAnything = false; //Not close to anything

                    heistLocations.forEach(coords => { //Go through all positions
                        if (coords.DistanceNeeded > distanceBetweenCoords(currentCoords.x, currentCoords.y, coords.x, coords.y)) { //if closer to coords than distance needed
                            closeToAnything = true; //set close to anything
                            LastPosition = coords.name //Set last position to the current position

                            if (coords.name != LastPosition) { //If the name is not the same as the last position
                                let playersThere = []; //Get players there

                                HeistChannel.send(`**${player[0]}** is currently at **${coords.name}**`) //say where they are

                                let alreadyThere = new Discord.RichEmbed()
                                    .setTitle(`People at ${coords.name}.`)
                                    .setColor("RANDOM")

                                body.players.forEach(player => { //Go through all players
                                    let personCoords = player[3] //Get their coords

                                    if (personCoords) { //if they have coords
                                        if (coords.DistanceNeeded > distanceBetweenCoords(personCoords.x, personCoords.y, coords.x, coords.y)) { //If they are close to the place
                                            alreadyThere.addField(player[0], player[2], true) //Add to embed
                                            playersThere.push(player[2]) //Add to array
                                        }
                                    }


                                })
                                if (alreadyThere.fields[0]) { //If theres more than just the person
                                    HeistChannel.send(alreadyThere).then(msg => { //Send embed
                                        checkForNewPlayers(msg, coords, playersThere) //Check for more arriving players
                                    })
                                }

                            }
                        }
                    });
                    if (!closeToAnything && LastPosition != "transit") { //If the player isn't close to a heighst location and the last position isn't transit
                        HeistChannel.send(`**${player[0]}** is currently in transit`) //say they are in transit
                        LastPosition = "transit" //set last position to transit
                    }
                }
            });
            if (!foundPerson) { //If didn't find the player
                botconfig.Tracking = false; //Stop tracking
                HeistChannel.send("That person isn't in the server")
                return;
            }
            setTimeout(() => {
                getPlayerLocation(); //after 20000 ms get the heist leaders position
            }, 20000);
        } else { //Error getting server
            botconfig.Tracking = false; //Stop tracking
            return HeistChannel.send("Server is offline") //end command
        }
    });
}

function checkForNewPlayers(msg, location, playersThere) {
    request(`http://${ServerIP}:3012${ServerPORT}/status/map/positions.json`, function (error, response, body) { //Get players
        if (error) return;
        
        body = JSON.parse(body)
        let alreadyThere = new Discord.RichEmbed() //new embed that has same color and title as previous one
            .setColor(msg.embeds[0].color)
            .setTitle(msg.embeds[0].title)

        msg.embeds[0].fields.forEach(element => { //GO through all old embed fields and add it to the new embed
            alreadyThere.addField(element.name, element.value, true)
        });
        let NewPeople = false;
        body.players.forEach(player => { //Go through all players on the server
            if (!playersThere.includes(player[2])) { //If theres there doesn't include the player in the server
                let personCoords = player[3] //Get that players coords

                if (personCoords) { //If they have coords
                    if (location.DistanceNeeded > distanceBetweenCoords(personCoords.x, personCoords.y, location.x, location.y)) { //Check if they are at the same location
                        alreadyThere.addField(player[0], player[2], true) //add to embed
                        playersThere.push(player[2]) //add to array
                        NewPeople = true;
                    }
                }
            }
        })
        if (alreadyThere.fields[0]) { //if at least one person
            msg.edit(alreadyThere).then(msg => { //Edit the old embed with new one
                if (NewPeople) { //if people are still coming
                    setTimeout(() => {
                        checkForNewPlayers(msg, location, playersThere) //after 15000ms check for more new players
                    }, 15000);
                }

            })

        }
    })
}

module.exports.help = {
    name: "tracker",
    usage: "[in game id] [server]",
    description: "Track someone",
    permission: "SEND_MESSAGES"
}