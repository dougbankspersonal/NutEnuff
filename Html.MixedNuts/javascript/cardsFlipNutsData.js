define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const gCommonNutInstances = 3;
  const gSpecialNutInstances = 1;

  const gSpecialNutString = "No Bust/No Danger/Flip Again";

  var gCardConfigs = null;

  function generateCardConfigs() {
    if (gCardConfigs != null) {
      return;
    }

    gCardConfigs = [];
    for (var i = 0; i < gameInfo.nutTypesArray.length; i++) {
      var nutType = gameInfo.nutTypesArray[i];
      var config = {
        nutType: nutType,
        title: gameInfo.nutNames[nutType],
        color: gameInfo.nutColors[nutType],
        count: gCommonNutInstances,
      };
      gCardConfigs.push(config);
    }

    gCardConfigs.push({
      nutType: gameInfo.specialNutTypes.Acorn,
      title: gameInfo.nutNames[gameInfo.specialNutTypes.Acorn],
      color: gameInfo.nutColors[gameInfo.specialNutTypes.Acorn],
      count: gSpecialNutInstances,
      score: 5,
      scoreClass: "gain",
      auxImage: "no-bust-flip-again",
    });
    gCardConfigs.push({
      nutType: gameInfo.specialNutTypes.BadNut,
      title: gameInfo.nutNames[gameInfo.specialNutTypes.BadNut],
      color: gameInfo.nutColors[gameInfo.specialNutTypes.BadNut],
      count: gSpecialNutInstances,
      score: -1,
      scoreClass: "loss",
      auxImage: "no-bust-flip-again",
    });

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();

    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
