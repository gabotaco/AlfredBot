const functions = require("../util/functions.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const SearchColumn = functions.GetSearchColumn(args.id || args.member);

    let d = new Date();
    d.setDate(d.getDate() + 7); //add 7 days to date
    const newDeadline = d.toISOString().slice(0, 19).replace("T", " ");

    functions
      .ChangeDeadline(
        bot.con,
        newDeadline,
        SearchColumn,
        args.id || args.member
      )
      .then((res) => {
        functions
          .CheckForActive(bot, SearchColumn, args.id || args.member)
          .then(() => {
            return resolve(res);
          });
      });
  });
};

module.exports.help = {
  name: "7days",
  aliases: ["7d"],
  usage: "<in game id OR discord>",
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
  description: "Set a person's deadline to next week",
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true,
};
