define([
  "sharedJavascript/debugLog",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gCardConfigs = null;

  const gNumFightLevels = 3;

  function setupCardConfigs() {
    console.assert(
      gCardConfigs === null,
      "setupCardConfigs called more than once",
    );

    gCardConfigs = [];
    for (var i = 0; i < gameInfo.maxPlayers; i++) {
      for (var j = 0; j < gNumFightLevels; j++) {
        gCardConfigs.push({
          playerIndex: i,
          fightLevel: j + 1,
        });
      }
    }

    return gCardConfigs;
  }

  function getNumCards() {
    console.assert(
      gCardConfigs !== null,
      "getNumCards called before setupCardConfigs",
    );
    return gCardConfigs.length;
  }

  function getCardConfigs() {
    console.assert(
      gCardConfigs !== null,
      "getCardConfigs called before setupCardConfigs",
    );
    return gCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    setupCardConfigs: setupCardConfigs,
    getNumCards: getNumCards,
    getCardConfigs: getCardConfigs,
  };
});
