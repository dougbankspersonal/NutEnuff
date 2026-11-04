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
  function getImageClass(nutType) {
    if (nutType == gameInfo.nutTypes.DoublePeanut) {
      return gameInfo.nutTypes.Peanut;
    }
    if (nutType == gameInfo.nutTypes.DoubleAlmond) {
      return gameInfo.nutTypes.Almond;
    }
    if (nutType == gameInfo.nutTypes.DoubleCashew) {
      return gameInfo.nutTypes.Cashew;
    }
    if (nutType == gameInfo.nutTypes.DoubleMacadamia) {
      return gameInfo.nutTypes.Macadamia;
    }
    return nutType;
  }

  function getImageCount(nutType) {
    if (
      nutType == gameInfo.nutTypes.DoublePeanut ||
      nutType == gameInfo.nutTypes.DoubleAlmond ||
      nutType == gameInfo.nutTypes.DoubleCashew ||
      nutType == gameInfo.nutTypes.DoubleMacadamia
    ) {
      return 2;
    }
    return 1;
  }

  function getCraftNumber(nutType) {
    if (
      nutType == gameInfo.nutTypes.Macadamia ||
      nutType == gameInfo.nutTypes.DoubleMacadamia
    ) {
      return 7;
    }
    if (nutType == gameInfo.nutTypes.Walnut) {
      return 2;
    }
    return 3;
  }

  function getCraftPoints(nutType) {
    if (
      nutType == gameInfo.nutTypes.Macadamia ||
      nutType == gameInfo.nutTypes.DoubleMacadamia
    ) {
      return 7;
    }

    if (
      nutType == gameInfo.nutTypes.Peanut ||
      nutType == gameInfo.nutTypes.DoublePeanut
    ) {
      return 2;
    }
    if (
      nutType == gameInfo.nutTypes.Almond ||
      nutType == gameInfo.nutTypes.Walnut ||
      nutType == gameInfo.nutTypes.DoubleAlmond
    ) {
      return 3;
    }
    if (
      nutType == gameInfo.nutTypes.Cashew ||
      nutType == gameInfo.nutTypes.DoubleCashew
    ) {
      return 4;
    }
    return 0;
  }

  function getCardCount(nutType) {
    if (nutType == gameInfo.nutTypes.Peanut) {
      return 24;
    }
    if (nutType == gameInfo.nutTypes.DoublePeanut) {
      return 3;
    }
    if (nutType == gameInfo.nutTypes.Almond) {
      return 19;
    }
    if (nutType == gameInfo.nutTypes.DoubleAlmond) {
      return 3;
    }
    if (nutType == gameInfo.nutTypes.Cashew) {
      return 15;
    }
    if (nutType == gameInfo.nutTypes.DoubleCashew) {
      return 3;
    }

    if (nutType == gameInfo.nutTypes.Macadamia) {
      return 13;
    }
    if (nutType == gameInfo.nutTypes.DoubleMacadamia) {
      return 2;
    }
    if (nutType == gameInfo.nutTypes.Walnut) {
      return 10;
    }
    if (nutType == gameInfo.nutTypes.BadNut) {
      return 7;
    }

    console.assert(false, "Unknown nut type: " + nutType);
    return 0;
  }

  function getCardText(nutType) {
    if (nutType == gameInfo.nutTypes.DoublePeanut) {
      return "Counts as 2 Peanuts<br>Cannot be split";
    }
    if (nutType == gameInfo.nutTypes.DoubleAlmond) {
      return "Counts as 2 Almonds<br>Cannot be split";
    }
    if (nutType == gameInfo.nutTypes.DoubleCashew) {
      return "Counts as 2 Cashews<br>Cannot be split";
    }
    if (nutType == gameInfo.nutTypes.DoubleMacadamia) {
      return "Counts as 2 Macadamias<br>Cannot be split";
    }
    return null;
  }

  function getConfigForCardType(nutType) {
    var config = {
      title: gameInfo.nutNames[nutType],
      craft: {
        number: getCraftNumber(nutType),
        points: getCraftPoints(nutType),
      },
      color: gameInfo.nutColors[nutType],
      cardType: nutType,
      imageClass: getImageClass(nutType),
      imageCount: getImageCount(nutType),
      count: getCardCount(nutType),
      text: getCardText(nutType),
    };

    return config;
  }

  var gCardConfigs = null;

  function generateCardConfigs() {
    if (gCardConfigs) {
      return gCardConfigs;
    }

    gCardConfigs = [];

    for (var i = 0; i < gameInfo.nutTypesArray.length; i++) {
      var nutType = gameInfo.nutTypesArray[i];
      var cardConfig = getConfigForCardType(nutType);
      gCardConfigs.push(cardConfig);
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();
    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();

    debugLog("getNumCards", "gCardConfigs = " + JSON.stringify(gCardConfigs));

    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
