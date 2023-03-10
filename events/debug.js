const muteModel = require("../models/mute");
const Event = require("../structures/Event");
const Discord = require("discord.js");
const config = require("../config.json");
const webhookClient = new Discord.WebhookClient({
  url: "https://discord.com/api/webhooks/971701276888936480/7o7CAK21Y4W4z2xEWqdYiWL24T5o-ljS0nmGQfKs0TPm1g5ISbQqIMbzJ7HJ90suExcW",
});
const logger = require("../utils/logger");
const Maintenance = require("../database/schemas/maintenance");
let number = 1;
module.exports = class extends Event {
  async run(info) {
    let embed;
    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (info.includes("hit")) {
      number = ++number;

      embed = `${info} - ${number}`;
      logger.info(info, { label: "Debug" });

      if (number >= 10) {
        embed = `${info} - ${number} - SAFE MODE REACHED <@710465231779790849>`;
        console.log("Safe mode reached - Turning maintenance mode on.");
        maintenance.toggle = "true";
        await maintenance.save();
        process.exit(1);
      }

      const lmao = new Discord.MessageEmbed()
        .setDescription(embed)
        .setColor("RED");

      webhookClient.send(lmao);
    }
  }
};
