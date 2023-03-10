module.exports = {
  // Stauts config
  display_status: "idle", // online | idle | invisible | dnd
  options: {
    type: "dynamic", // dynamic | static
  },
  static: {
    // Only if options.stype = static
    message: `πΊπ¦ | Russia, stop the war!`,
    type: "WATCHING", // PLAYING | STREAMING | LISTENING | WATCHING
  },
  dates: {
    // Special dates for change status [Date Format: MM-DD]. If null = no special dates.
    "02-14": [
      // Array
      {
        message: `Happy valentine's! β€οΈ`,
        type: "PLAYING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
      {
        message: `Can you be my valentine? β€οΈ`,
        type: "PLAYING",
      },
    ],
    "05-13": [
      {
        message: `Happy birthday Discord! β€οΈ`,
        type: "PLAYING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
    ],
    "03-22": [
      {
        message: `Happy birthday Luna! π`,
        type: "PLAYING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
    ],
    "01-01": [
      {
        message: `Happy birthday Lav! π¦΄`,
        type: "PLAYING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
    ],
    "01-22": [
      {
        message: `Happy birthday Arbuz! π`,
        type: "PLAYING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
    ],
    "04-30": [
      {
        message: ` heaven... Goodbye Grandma... π―οΈ`,
        type: "WATCHING", // PLAYING | STREAMING | LISTENING | WATCHING
      },
    ],
  },
  dynamic: [
    {
      message: `with your heart π`,
      type: "PLAYING",
    },
    {
      message: `with over {{ members }} users {{ emoji }}`,
      type: "PLAYING",
    },
    {
      message: `the haters hate {{ emoji }}`,
      type: "WATCHING",
    },
    {
      message: `you (turn around) πͺ`,
      type: "WATCHING",
    },
    {
      message: `grass grow π±`,
      type: "WATCHING",
    },
    {
      message: `over {{ servers }} servers {{ emoji }}`,
      type: "WATCHING",
    },
    {
      message: `DΓ©jΓ  vu πΆ`,
      type: "WATCHING",
    },
    {
      message: `the world crumble π€―`,
      type: "WATCHING",
    },
    {
      message: `over you from above πΌ`,
      type: "WATCHING",
    },
    {
      message: `your conversations {{ emoji }}`,
      type: "LISTENING",
    },
    {
      message: `Mahou Shoujo Site {{ emoji }}`,
      type: "WATCHING",
    },
    {
      message: `Youtube {{ emoji }}`,
      type: "WATCHING",
    },
    {
      message: `exploits β`,
      type: "WATCHING",
    },
    {
      message: `new slash commands (/)`,
      type: "WATCHING",
    },
  ],
  emojis: [
    "π",
    "π",
    "π",
    "π",
    "π₯³",
    "π",
    "π",
    "π",
    "π",
    "π₯°",
    "π",
    "π€―",
    "π€©",
    "π",
    "π",
    "βΊοΈ",
    "π",
    "π",
    "π³",
    "π",
    "π",
    "π±",
    "π₯΅",
    "πΆβπ«οΈ",
    "π€",
    "π΄",
    "( Ν‘Β° ΝΚ Ν‘Β°)",
  ], // Smirk is here ;D. Idea by Luna_CatArt#4514. Pls don't ask XD
};
