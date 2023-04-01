const functions = require("../util/functions.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const SearchColumn = functions.GetSearchColumn(args.id || args.member);

    bot.con.query(
      `UPDATE members SET deadline = DATE_ADD(deadline, INTERVAL 7 DAY) WHERE ${SearchColumn}='${
        args.id || args.member
      }'`,
      function (err, result, fields) {
        //adds 7 days to deadline
        if (err) {
          console.log(err);
          return reject("There was an error updating the deadline");
        } else {
          functions
            .CheckForActive(bot, SearchColumn, args.id || args.member)
            .then(() => {
              return resolve("Updated deadline");
            });
        }
      }
    );
  });
};

module.exports.help = {
  name: "addweek",
  aliases: ["aw"],
  usage: "<in game id OR discord>",
  description: "Add a week to a person's deadline",
  args: [
    {
      name: "id",
      description: "Set a persons deadline using their id",
      type: 1,
      options: [
        {
          name: "id",
          description: "Their in game id or discord id",
          type: 4,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            if (message.mentions.members.first())
              args[0] = message.mentions.members.first().id;
            return args[0];
          },
        },
      ],
    },
    {
      name: "discord",
      description: "Set a persons deadline using their discord",
      type: 1,
      options: [
        {
          name: "member",
          description: "the other discord user",
          type: 6,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            if (message.mentions.members.first())
              args[0] = message.mentions.members.first().id;
            return args[0];
          },
        },
      ],
    },
  ],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true,
};
