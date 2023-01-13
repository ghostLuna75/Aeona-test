const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const crypto = require("crypto");
const config = require("../../config.json");
const webhookClient = new discord.WebhookClient({
  url: "https://discord.com/api/webhooks/971702015086432256/BVY_Bhm49-tn5199ybN8QEXF4XUXncQ-6C68x6vq0DK6Dnt3yWuxnZREPmYINbxxt9i9",
});
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "suggestbot",
      aliases: ["botsuggest"],
      description: `Suggest a new feature for Aeona!`,
      category: "Utility",
      examples: ["suggest Can you add music Please!"],
      cooldown: 60,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    var id = crypto.randomBytes(4).toString("hex");

    if (args.length < 1) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(
              `${message.client.emoji.fail} ${language.suggest1}`
            ),
        ],
      });
    }

    if (args.length < 3) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(
              `${message.client.emoji.fail} ${language.suggest2}`
            ),
        ],
      });
    }

    //args.join(' ').split('').join('')
    let invite = await message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .catch(() => {});

    let report = args.join(" ").split("").join("");
    const embed = new MessageEmbed()
      .setTitle("New Suggestion")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report)
      .addField("User", message.member, true)
      .addField("User username", message.member.user.username, true)
      .addField("User ID", message.member.id, true)
      .addField("User Tag", message.member.user.tag, true)
      .addField("Server", `[${message.guild.name}](${invite || "none "})`, true)
      .addField("Feedback ID:", `#${id}`, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("GREEN");

    const confirmation = new MessageEmbed()
      .setTitle("Bot Suggestions")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `${language.suggest3} Support [**Server**](https://discord.gg/SPcmvDMRrP)`
      )
      .addField("Member", message.member, true)
      .addField("Message", report, true)
      .addField("Suggestion ID:", `#${id}`, true)
      .setFooter({ text: "https://Aeona.xyz/" })
      .setTimestamp()
      .setColor("GREEN");

    webhookClient.send({
      username: "Aeona Suggestions",
      avatarURL: `${message.client.domain}/logo.png`,
      embeds: [embed],
    });

    message.delete().catch(() => {});
    message.author.send(confirmation).catch(() => {});
  }
};
