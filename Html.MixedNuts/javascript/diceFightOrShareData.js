define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
], function (cards, debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  var gTokenDiceConfigs = null;

  function generateShareFightDieConfigForPlayer(playerIndex) {
    // Implement the logic to generate the share fight die config for a player
    // This is a placeholder implementation and should be replaced with actual logic
    var dieConfig = {};
    dieConfig.classes = ["share-fight-die", "player-" + playerIndex];

    var dieFaces = [
      {
        classes: ["face", "share"],
        imageClasses: ["share"],
        text: "Share",
      },
      {
        classes: ["face", "fight"],
        imageClasses: ["fight"],
        text: "Fight",
      },
    ];

    dieConfig.faces = dieFaces;
    return dieConfig;
  }

  function generateTokenDiceConfigs() {
    if (gTokenDiceConfigs !== null) {
      return;
    }
    gTokenDiceConfigs = [];

    for (var i = 0; i < gameInfo.maxPlayers; i++) {
      var shareFightDieConfig = generateShareFightDieConfigForPlayer(i);
      gTokenDiceConfigs.push(shareFightDieConfig);
    }
  }

  function getTokenDiceConfigs() {
    generateTokenDiceConfigs();
    return gTokenDiceConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getTokenDiceConfigs: getTokenDiceConfigs,
  };
});
