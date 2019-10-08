const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
//ID's of all rank roles
const hustlerID = "488021473361920010"
const pickpocketID = "488021509458362368"
const thiefID = "488021491649085441"
const lawlessID = "488021525233139724"
const mastermindID = "488021546036625414"
const overlordID = "526214202621427724"
const rtsfamilyID = "526160668882239508"
const initiateID = "453564342290612251"
const leadfootID = "453564406673047552"
const wheelman = "453564426302390284"
const legendaryID = "453564453628280835"
const speeddemonID = "453564481075806219"
const pigsfamilyID = "526203890639699968"

module.exports.run = async (bot, message, args) => {
    if (message) { //if theres a message
        var person = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member; //get person by first mention or first arg or message author
        if (!person) return message.channel.send("You must specify a discord member.")
        if (args[0] && person == message.member) return message.channel.send("Couldn't find specified member")
        if (message.guild.id == botconfig.PIGSServer) {
            var alwaysKeep = ["576784981024571412", "487288337065836558", "572838338470346757", "546071134961926148", "529644127734988821", "539250396653289492", "518527151960752131", "520761019841118219", "511347144683290624", "498885132468486175", "495359477701410816", "493805677546831872", "511148681681174528", "487289181685678090", "491992119049977867", "490261228585746433", "526107078838714368", "489242068770619403", "510237061719261194", "513844670611193866", "516802932260470825", "516803056222994442", "487288297421406208", "487623401247342613", "492446479554838528", "487286418855428096", "495650147754311690", "499007548993568768", "487289216968032256", "539240789809692691", "501822882071052308", "530765121522499584", "487286138529120256"]
            var employeeID = "562991083882151937"
            var GuestRole = botconfig.PIGSGuestRole
            var InactiveRole = botconfig.PIGSInavtiveRole
            var FamilyID = rtsfamilyID
        } else if (message.guild.id == botconfig.RTSServer) {
            var alwaysKeep = ["453982220907184128", "503224065906180106", "529643022866972684", "472023222674784259", "481486784858030090", "480730660105879580", "479082117154996235", "478955377619370004", "478393923656482827", "478393609540861952", "477115908888723467", "475029760930611200", "475393112915574821", "472386249341272064", "449404264545255446", "471671084392120351", "454190936843354113", "454474803529646111", "477463794965020673", "453917732254121997", "458376796921004052", "453570994985238528", "448681738953162752", "453563912097497110", "472143712655245322", "482902573179731969", "447493627791409173", "453999831434919948", "453744160923713548", "472133586745688075", "455014608810541068", "472145541091033123", "447494569173712898"]
            var employeeID = "483297370482933760"
            var GuestRole = botconfig.RTSGuestRole
            var InactiveRole = botconfig.RTSInavtiveRole
            var FamilyID = pigsfamilyID
        }
    } else { // no message
        return;
    }

    if (person.roles) { //person has roles
        await person.roles.forEach(async element => { //go through all roles
            if (!alwaysKeep.includes(element.id)) await person.removeRole(element.id) //If the current role isn't in the always keep array then remove it 
        });
    }


    await person.addRole(GuestRole) //add guest role

    var MemberDetails = await functions.GetMemberDetails(bot, "discord_id", person.id) //get member details with message.channel


    if (MemberDetails) { //if member is in database
        if (MemberDetails.company == "fired") return message.channel.send("Guest role."); //if fired stop

        const D1 = new Date(MemberDetails.deadline) //check deadline
        const D2 = new Date()
        const D3 = D2 - D1 //difference between two dates
        if (D3 <= 0) { //if its not past their deadline
            if (person.roles.has(InactiveRole)) await person.removeRole(InactiveRole) //if they have inactive role remove it
        } else { //past their deadline
            if (!person.roles.has(InactiveRole)) await person.addRole(InactiveRole) //if they don't have inactive role add it
        }

        if (person.id != "404650985529540618") await person.setNickname(MemberDetails.in_game_name) //set nickname to in game name

        if (person.roles.has(GuestRole)) await person.removeRole(GuestRole) //if they have guest role remove it

        await person.addRole(employeeID) //add employee role

        //If they are a rank then add the rank role
        if (message.guild.id == botconfig.PIGSServer) { //in pigs server
            if (MemberDetails.company == "rts") { //rts
                await person.addRole(FamilyID)
                if (message) await message.channel.send(`Gave ${person} the RTS family role`)

            } else if (MemberDetails.pigs_total_vouchers < 6000 && !person.roles.has(hustlerID)) { //hustler
                foundRole = true;
                await person.addRole(hustlerID)

                if (message) await message.channel.send(`Gave ${person} the hustler role`)
            } else if (MemberDetails.pigs_total_vouchers < 18000 && !person.roles.has(pickpocketID)) {
                foundRole = true;
                await person.addRole(pickpocketID)

                if (message) await message.channel.send(`Gave ${person} the pickpocket role`)
            } else if (MemberDetails.pigs_total_vouchers < 38000 && !person.roles.has(thiefID)) {
                foundRole = true;
                await person.addRole(thiefID)

                if (message) await message.channel.send(`Gave ${person} the thief role`)
            } else if (MemberDetails.pigs_total_vouchers < 68000 && !person.roles.has(lawlessID)) {
                foundRole = true;
                await person.addRole(lawlessID)

                if (message) await message.channel.send(`Gave ${person} the lawless role`)
            } else if (MemberDetails.pigs_total_vouchers < 150000 && !person.roles.has(mastermindID)) {
                foundRole = true;
                await person.addRole(mastermindID)

                if (message) await message.channel.send(`Gave ${person} the mastermind role`)
            } else if (!person.roles.has(overlordID)) {
                foundRole = true;
                await person.addRole(overlordID)
                if (message) await message.channel.send(`Gave ${person} the overlord role`)
            }
        } else { //rts discord
            if (MemberDetails.company == "pigs") { //in pigs
                await person.addRole(FamilyID)
                if (message) await message.channel.send(`Gave ${person} the PIGS family role`)
            } else if (MemberDetails.rts_total_vouchers < 9600 && !person.roles.has(initiateID)) {
                foundRole = true;
                await person.addRole(initiateID)
                if (message) await message.channel.send(`Gave ${person} the initiate role`)

            } else if (MemberDetails.rts_total_vouchers < 24000 && !person.roles.has(leadfootID)) {
                foundRole = true;
                await person.addRole(leadfootID)

                if (message) await message.channel.send(`Gave ${person} the lead foot role`)
            } else if (MemberDetails.rts_total_vouchers < 52800 && !person.roles.has(wheelman)) {
                foundRole = true;
                await person.addRole(wheelman)

                if (message) await message.channel.send(`Gave ${person} the wheelman role`)
            } else if (MemberDetails.rts_total_vouchers < 117600 && !person.roles.has(legendaryID)) {
                foundRole = true;
                await person.addRole(legendaryID)

                if (message) await message.channel.send(`Gave ${person} the legendary role`)
            } else if (!person.roles.has(speeddemonID)) {
                foundRole = true;
                await person.addRole(speeddemonID)

                if (message) await message.channel.send(`Gave ${person} the speed demon role`)
            }
        }
    } else {
        return message.channel.send("Guest role.")
    }
}

module.exports.help = {
    name: "roles",
    usage: "{person}",
    description: "Refresh roles",
    permission: "SEND_MESSAGES"
}