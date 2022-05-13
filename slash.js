const Discord = require('discord.js')
const botconfig = require("./botconfig.json")
const request = require('request');

const slash = {
    "commands": {
        [botconfig.RTSServer]: {},
        [botconfig.PIGSServer]: {}
    },
    "baseURI": '',
    "app": {}
}

function optionSort(option1, option2) {
    if (option1.name < option2.name) {
        return -1;
    } else if (option1.name > option2.name) {
        return 1;
    } else {
        return 0;
    }
}

function optionsAreSame(options1, options2) {
    if (options1 == null && options2 == null) {
        return true;
    } else if (options1 == null || options2 == null) {
        return false;
    }

    if (options1.length != options2.length) return false;

    options1.sort(optionSort)
    options2.sort(optionSort)

    for (let i = 0; i < options1.length; i++) {
        if (options1[i].type == options2[i].type &&
            options1[i].name == options2[i].name &&
            options1[i].description == options2[i].description) {
            if (!optionsAreSame(options1[i].options, options2[i].options)) return false;
        } else {
            return false;
        }
    }
    return true;
}

function permsSort(perm1, perm2) {
    return perm1.id - perm2.id
}

function permsAreSame(perms1, perms2) {
    if (perms1 == null && perms2 == null) {
        return true;
    } else if (perms1 == null || perms2 == null) {
        return false;
    }
    if (perms1.length != perms2.length) return false;

    perms1.sort(permsSort)
    perms2.sort(permsSort)

    for (let i = 0; i < perms1.length; i++) {
        if (perms1[i].type != perms2[i].type ||
            perms1[i].id != perms2[i].id ||
            perms1[i].permission != perms2[i].permission) {
                return false;
            }
    }
    return true;
}

slash.init = async (client) => {
    slash.app = await client.fetchApplication()
    slash.baseURI = `https://discord.com/api/v8/applications/${slash.app.id}`
    slash.createAPIMessage = async (interaction, content, options) => {
        const {
            data,
            files
        } = await Discord.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content,
            options
        ).resolveData().resolveFiles()
        return {
            ...data,
            files
        }
    }

    slash.reply = async (interaction, response, command) => {
        return new Promise(async (resolve, reject) => {
            if (command.help.slow) {
                return slash.edit(interaction, response, command);
            }
            let data = {
                content: response
            }
            if (typeof response === 'object') {
                if (response.messageOptions) {
                    data = await slash.createAPIMessage(interaction, response.message, response.messageOptions)
                } else {
                    data = await slash.createAPIMessage(interaction, response)
                }
            }
            if (command.help.hidden) {
                data.flags = 64;
            }

            request.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
                body: {
                    type: 4,
                    data: data
                },
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, res, body) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                if (!body) return;
                if (body.message == "You are being rate limited.") {
                    console.log(`Timeout for ${body.retry_after} seconds`);
                    setTimeout(() => {
                        slash.reply(interaction, response, command)
                    }, body.retry_after * 1000);
                    return;
                }
                return resolve(body)
            })
        })
    }

    slash.edit = async (interaction, response, command) => {
        return new Promise(async (resolve, reject) => {
            let data = {
                content: response
            }
            if (typeof response === 'object') {
                if (response.messageOptions) {
                    data = await slash.createAPIMessage(interaction, response.message, response.messageOptions)
                } else {
                    data = await slash.createAPIMessage(interaction, response)
                }
            }
            if (command.help.hidden) {
                data.flags = 64;
            }

            request.patch(`https://discord.com/api/v8/webhooks/${slash.app.id}/${interaction.token}/messages/@original`, {
                body: data,
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, res, body) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                if (!body) return;

                if (body.message == "You are being rate limited.") {
                    console.log(`Timeout for ${body.retry_after} seconds`);
                    setTimeout(() => {
                        slash.edit(interaction, response, command)
                    }, body.retry_after * 1000);
                    return;
                }
                return resolve(body)
            })
        })
    }

    slash.follow = async (interaction, response, command) => {
        return new Promise(async (resolve, reject) => {
            let data = {
                content: response
            }
            if (typeof response === 'object') {
                if (response.messageOptions) {
                    data = await slash.createAPIMessage(interaction, response.message, response.messageOptions)
                } else {
                    data = await slash.createAPIMessage(interaction, response)
                }
            }
            if (command.help.hidden) {
                data.flags = 64;
            }

            request.post(`https://discord.com/api/v8/webhooks/${slash.app.id}/${interaction.token}`, {
                body: data,
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, res, body) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                if (!body) return;

                if (body.message == "You are being rate limited.") {
                    console.log(`Timeout for ${body.retry_after} seconds`);
                    setTimeout(() => {
                        slash.follow(interaction, response, command)
                    }, body.retry_after * 1000);
                    return;
                }
                return resolve(body)
            })
        })
    }

    slash.defer = async (interaction) => {
        return new Promise(async (resolve, reject) => {
            request.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
                body: {
                    type: 5
                },
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, res, body) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                if (!body) return;

                if (body.message == "You are being rate limited.") {
                    console.log(`Timeout for ${body.retry_after} seconds`);
                    setTimeout(() => {
                        slash.defer(interaction)
                    }, body.retry_after * 1000);
                    return;
                }
                return resolve(body)
            })
        })
    }

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const {
            guild_id,
            channel_id
        } = interaction;

        const {
            name,
            options
        } = interaction.data;
        const {
            id
        } = interaction.member.user

        const command = slash.commands[guild_id][name.toLowerCase()]
        if (command) {
            const args = {
                "guild_id": guild_id,
                "channel_id": channel_id,
                "author_id": id,
                "slash": true
            }
            if (options) {
                function handleArgs(suppliedArgs) {
                    if (!suppliedArgs) return;
                    for (const option of suppliedArgs) {
                        if (option.type == 2) {
                            args.sub_command_group = option.name
                            handleArgs(option.options)
                        } else if (option.type == 1) {
                            args.sub_command = option.name
                            handleArgs(option.options)
                        } else {
                            const {
                                name,
                                value
                            } = option
                            args[name] = value
                        }
                    }
                }
                handleArgs(options)
            }

            console.log(`SLASH ${command.help.name}`);

            if (command.help.slow) {
                slash.defer(interaction)
            }

            command.run(client, args).then((response) => {
                if (Array.isArray(response)) {
                    slash.reply(interaction, response[0], command)
                    for (let i = 1; i < response.length; i++) {
                        slash.follow(interaction, response[i], command)
                    }
                } else {
                    slash.reply(interaction, response, command)
                }
            }).catch((err) => {
                slash.reply(interaction, `There was an error. Gabo says ${err}`, command)
            })
        } else {
            console.log(`Couldn't find command ${name.toLowerCase()}!`);
            console.log(slash.commands[guild_id]);
        }
    })
    console.log("Slash initalized");
}

function handleOptions(args) {
    const options = []
    if (!args) return [];
    args.forEach(arg => {
        if (arg.type == 2 || arg.type == 1) {
            options.push({
                type: arg.type,
                name: arg.name,
                description: arg.description,
                options: handleOptions(arg.options)
            })
        } else {
            options.push({
                type: arg.type,
                name: arg.name,
                description: arg.description,
                required: arg.required,
                choices: arg.choices
            })
        }
    });
    return options;
}

slash.addCommands = (slashCommands) => {
    let enabledCommands = {}
    let enabledPerms = {}
    if (slashCommands.guild == "rts") {
        var guildID = botconfig.RTSServer
    } else {
        var guildID = botconfig.PIGSServer
    }
    if (slashCommands.guild == "GLOBAL") {
        request.get(`${slash.baseURI}/commands`, {
            headers: {
                "Authorization": `Bot ${process.env.BOT_TOKEN}`
            },
            json: true
        }, (err, response, globalCommands) => {
            if (err) throw err;
            globalCommands.forEach(cmd => {
                enabledCommands[cmd.name] = cmd
            });

            request.get(`${slash.baseURI}/guilds/${botconfig.RTSServer}/commands/permissions`, {
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, response, rtsPerms) => {
                if (err) throw err;
                enabledPerms['rts'] = {}
                rtsPerms.forEach(rtsPerm => {
                    enabledPerms['rts'][rtsPerm.id] = rtsPerm.permissions
                });

                request.get(`${slash.baseURI}/guilds/${botconfig.PIGSServer}/commands/permissions`, {
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, pigsPerms) => {
                    if (err) throw err;
                    enabledPerms['pigs'] = {}
                    pigsPerms.forEach(pigPerm => {
                        enabledPerms['pigs'][pigPerm.id] = pigPerm.permissions
                    });
                    addCommand(0)
                })
            })
        })
    } else {
        request.get(`${slash.baseURI}/guilds/${guildID}/commands`, {
            headers: {
                "Authorization": `Bot ${process.env.BOT_TOKEN}`
            },
            json: true
        }, (err, response, guildCommands) => {
            if (err) throw err;
            guildCommands.forEach(cmd => {
                enabledCommands[cmd.name] = cmd
            });

            request.get(`${slash.baseURI}/guilds/${guildID}/commands/permissions`, {
                headers: {
                    "Authorization": `Bot ${process.env.BOT_TOKEN}`
                },
                json: true
            }, (err, response, guildPerms) => {
                if (err) throw err;
                enabledPerms[slashCommands.guild] = {}
                guildPerms.forEach(guildPerm => {
                    enabledPerms[slashCommands.guild][guildPerm.id] = guildPerm.permissions
                });
                addCommand(0)

            })

        })
    }

    function addCommand(i) {
        const command = slashCommands.commands[i];
        if (!command) {
            return cleanUp();
        }

        let enabledCommand;
        if (slashCommands.guild == "GLOBAL") {
            const cmdOptions = handleOptions(command.help.args)
            if (enabledCommands[command.help.name]) {
                enabledCommand = enabledCommands[command.help.name]
                if (enabledCommand.name != command.help.name ||
                    enabledCommand.description != command.help.description ||
                    enabledCommand.default_permission ||
                    !optionsAreSame(enabledCommand.options, cmdOptions)) {
                    // Update
                    request.patch(`${slash.baseURI}/commands/${enabledCommand.id}`, {
                        body: {
                            name: command.help.name,
                            description: command.help.description,
                            options: cmdOptions,
                            default_permission: false
                        },
                        headers: {
                            "Authorization": `Bot ${process.env.BOT_TOKEN}`
                        },
                        json: true
                    }, (err, response, cmd) => {
                        if (err) throw err;
                        if (cmd.message == "You are being rate limited.") {
                            console.log(`Timeout for ${cmd.retry_after} seconds`);
                            setTimeout(() => {
                                addCommand(i)
                            }, cmd.retry_after * 1000);
                            return;
                        }
                        enabledCommand = cmd;
                        checkPermissions();
                    })
                } else {
                    checkPermissions();
                }

                function checkPermissions() {
                    const rtscmdPermissions = [{
                            type: 2,
                            id: botconfig.GaboID,
                            permission: true
                        },
                        {
                            type: 2,
                            id: botconfig.RockID,
                            permission: true
                        }
                    ]
                    const pigscmdPermissions = [{
                            type: 2,
                            id: botconfig.GaboID,
                            permission: true
                        },
                        {
                            type: 2,
                            id: botconfig.RockID,
                            permission: true
                        }
                    ]
                    command.help.permission.forEach(role => {
                        if (role.server == "rts") {
                            rtscmdPermissions.push({
                                type: 1,
                                id: role.id,
                                permission: true
                            })
                        } else {
                            pigscmdPermissions.push({
                                type: 1,
                                id: role.id,
                                permission: true
                            })
                        }
                    });

                    const pigsValid = permsAreSame(pigscmdPermissions, enabledPerms['pigs'][enabledCommand.id]);
                    const rtsValid = permsAreSame(rtscmdPermissions, enabledPerms['rts'][enabledCommand.id])

                    if (pigsValid && rtsValid) {
                        slash.commands[botconfig.RTSServer][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };
                        slash.commands[botconfig.PIGSServer][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };

                        console.log(`Registered GLOBAL /${enabledCommand.name}`)
                        delete enabledCommands[command.help.name];
                        addCommand(i + 1)
                    } else if (pigsValid && !rtsValid) {
                        slash.commands[botconfig.PIGSServer][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };
                        addPermissions('rts')
                    } else if (!pigsValid && rtsValid) {
                        slash.commands[botconfig.RTSServer][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };
                        addPermissions('pigs')
                    } else {
                        addPermissions('global')
                    }
                }
            } else {
                // Create
                request.post(`${slash.baseURI}/commands`, {
                    body: {
                        name: command.help.name,
                        description: command.help.description,
                        options: cmdOptions,
                        default_permission: false
                    },
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, cmd) => {
                    if (err) throw err;
                    if (cmd.message == "You are being rate limited.") {
                        console.log(`Timeout for ${cmd.retry_after} seconds`);
                        setTimeout(() => {
                            addCommand(i)
                        }, cmd.retry_after * 1000);
                        return;
                    }
                    enabledCommand = cmd;
                    addPermissions('global');
                })
            }
        } else {
            const cmdOptions = handleOptions(command.help.args)

            if (enabledCommands[command.help.name]) {
                enabledCommand = enabledCommands[command.help.name]
                if (enabledCommand.name != command.help.name ||
                    enabledCommand.description != command.help.description ||
                    enabledCommand.default_permission ||
                    !optionsAreSame(enabledCommand.options, cmdOptions)) {
                    // Update
                    request.patch(`${slash.baseURI}/guilds/${guildID}/commands/${enabledCommand.id}`, {
                        body: {
                            name: command.help.name,
                            description: command.help.description,
                            options: cmdOptions,
                            default_permission: false
                        },
                        headers: {
                            "Authorization": `Bot ${process.env.BOT_TOKEN}`
                        },
                        json: true
                    }, (err, response, cmd) => {
                        if (err) throw err;
                        if (cmd.message == "You are being rate limited.") {
                            console.log(`Timeout for ${cmd.retry_after} seconds`);
                            setTimeout(() => {
                                addCommand(i)
                            }, cmd.retry_after * 1000);
                            return;
                        }
                        enabledCommand = cmd;
                        checkPermissions();
                    })
                } else {
                    checkPermissions();
                }

                function checkPermissions() {
                    const cmdPermissions = [{
                            type: 2,
                            id: botconfig.GaboID,
                            permission: true
                        },
                        {
                            type: 2,
                            id: botconfig.RockID,
                            permission: true
                        }
                    ]
                    command.help.permission.forEach(role => {
                        if (role.server == slashCommands.guild) {
                            cmdPermissions.push({
                                type: 1,
                                id: role.id,
                                permission: true
                            })
                        }
                    });

                    if (permsAreSame(cmdPermissions, enabledPerms[slashCommands.guild][enabledCommand.id])) {
                        slash.commands[guildID][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };

                        console.log(`Registered ${slashCommands.guild} /${enabledCommand.name}`)
                        delete enabledCommands[command.help.name];
                        addCommand(i + 1)
                    } else {
                        addPermissions(slashCommands.guild)
                    }
                }
            } else {
                // Create
                request.post(`${slash.baseURI}/guilds/${guildID}/commands`, {
                    body: {
                        name: command.help.name,
                        description: command.help.description,
                        options: cmdOptions,
                        default_permission: false
                    },
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, cmd) => {
                    if (err) throw err;
                    if (cmd.message == "You are being rate limited.") {
                        console.log(`Timeout for ${cmd.retry_after} seconds`);
                        setTimeout(() => {
                            addCommand(i)
                        }, cmd.retry_after * 1000);
                        return;
                    }
                    enabledCommand = cmd;
                    addPermissions(slashCommands.guild);
                })
            }
        }

        function addPermissions(server) {
            const rtscmdPermissions = [{
                    type: 2,
                    id: botconfig.GaboID,
                    permission: true
                },
                {
                    type: 2,
                    id: botconfig.RockID,
                    permission: true
                }
            ]
            const pigscmdPermissions = [
                {
                    type: 2,
                    id: botconfig.GaboID,
                    permission: true
                },
                {
                    type: 2,
                    id: botconfig.RockID,
                    permission: true
                }
            ]
            command.help.permission.forEach(role => {
                if (role.server == "rts") {
                    rtscmdPermissions.push({
                        type: 1,
                        id: role.id,
                        permission: true
                    })
                } else {
                    pigscmdPermissions.push({
                        type: 1,
                        id: role.id,
                        permission: true
                    })
                }
            });

            if (server == 'global') {
                request.put(`${slash.baseURI}/guilds/${botconfig.RTSServer}/commands/${enabledCommand.id}/permissions`, {
                    body: {
                        permissions: rtscmdPermissions
                    },
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, body) => {
                    if (err) throw err;
                    if (body.message == "You are being rate limited.") {
                        console.log(`Timeout for ${body.retry_after} seconds`);
                        setTimeout(() => {
                            addPermissions('global')
                        }, body.retry_after * 1000);
                        return;
                    }
                    slash.commands[botconfig.RTSServer][enabledCommand.name] = {
                        ...command,
                        id: enabledCommand.id
                    };
                    request.put(`${slash.baseURI}/guilds/${botconfig.PIGSServer}/commands/${enabledCommand.id}/permissions`, {
                        body: {
                            permissions: pigscmdPermissions
                        },
                        headers: {
                            "Authorization": `Bot ${process.env.BOT_TOKEN}`
                        },
                        json: true
                    }, (err, response, cmd) => {
                        if (err) throw err;
                        if (cmd.message == "You are being rate limited.") {
                            console.log(`Timeout for ${cmd.retry_after} seconds`);
                            setTimeout(() => {
                                addPermissions('pigs')
                            }, cmd.retry_after * 1000);
                            return;
                        }
                        slash.commands[botconfig.PIGSServer][enabledCommand.name] = {
                            ...command,
                            id: enabledCommand.id
                        };

                        console.log(`Updated global perms and registered ${slashCommands.guild} /${enabledCommand.name}`)
                        delete enabledCommands[command.help.name];
                        addCommand(i + 1)
                    })
                })
            } else if (server == 'pigs') {
                request.put(`${slash.baseURI}/guilds/${botconfig.PIGSServer}/commands/${enabledCommand.id}/permissions`, {
                    body: {
                        permissions: pigscmdPermissions
                    },
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, body) => {
                    if (err) throw err;
                    if (body.message == "You are being rate limited.") {
                        console.log(`Timeout for ${body.retry_after} seconds`);
                        setTimeout(() => {
                            addPermissions('pigs')
                        }, body.retry_after * 1000);
                        return;
                    }
                    slash.commands[botconfig.PIGSServer][enabledCommand.name] = {
                        ...command,
                        id: enabledCommand.id
                    };

                    console.log(`Updated pigs perms and registered ${slashCommands.guild} /${enabledCommand.name}`)
                    delete enabledCommands[command.help.name];
                    addCommand(i + 1)
                })
            } else {
                request.put(`${slash.baseURI}/guilds/${botconfig.RTSServer}/commands/${enabledCommand.id}/permissions`, {
                    body: {
                        permissions: rtscmdPermissions
                    },
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, body) => {
                    if (err) throw err;
                    if (body.message == "You are being rate limited.") {
                        console.log(`Timeout for ${body.retry_after} seconds`);
                        setTimeout(() => {
                            addPermissions('rts')
                        }, body.retry_after * 1000);
                        return;
                    }
                    slash.commands[botconfig.RTSServer][enabledCommand.name] = {
                        ...command,
                        id: enabledCommand.id
                    };

                    console.log(`Updated rts perms and registered ${slashCommands.guild} /${enabledCommand.name}`)
                    delete enabledCommands[command.help.name];

                    addCommand(i + 1)
                })
            }
        }
    }

    function cleanUp() {
        for (const cmdName in enabledCommands) {
            const id = enabledCommands[cmdName].id;
            console.log(`DELETING ${cmdName}`);
            if (slashCommands.guild == 'GLOBAL') {
                request.delete(`${slash.baseURI}/commands/${id}`, {
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, body) => {
                    if (err) throw err;
                })
            } else {
                request.delete(`${slash.baseURI}/guilds/${guildID}/commands/${id}`, {
                    headers: {
                        "Authorization": `Bot ${process.env.BOT_TOKEN}`
                    },
                    json: true
                }, (err, response, body) => {
                    if (err) throw err;
                })
            }
        }

        console.log(`Finished registering ${slashCommands.guild} slash commands`);
    }
}

module.exports = slash;