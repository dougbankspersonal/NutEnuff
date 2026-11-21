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
      return 8;
    }

    console.assert(false, "Unknown nut type: " + nutType);
    return 0;
  }

  function getCardText(nutType) {
    if (
      nutType == gameInfo.nutTypes.DoublePeanut ||
      nutType == gameInfo.nutTypes.DoubleAlmond ||
      nutType == gameInfo.nutTypes.DoubleCashew ||
      nutType == gameInfo.nutTypes.DoubleMacadamia
    ) {
      return "2 Nuts: Can't be split";
    }

    if (nutType == gameInfo.nutTypes.BadNut) {
      return "Must be discarded.";
    }

    return null;
  }

  function getBasicConfigForNutType(nutType) {
    var config = {
      title: gameInfo.nutNames[nutType],
      craft: {
        number: gameInfo.getCraftNumber(nutType),
        points: gameInfo.getCraftPoints(nutType),
      },
      color: gameInfo.nutColors[nutType],
      nutType: nutType,
      imageClass: getImageClass(nutType),
      imageCount: getImageCount(nutType),
      text: getCardText(nutType),
      classes: ["nuts", "card"],
    };
    return config;
  }

  var gCardConfigs = null;

  function generateCardConfigs() {
    if (gCardConfigs) {
      return gCardConfigs;
    }

    gCardConfigs = [];

    // Normal nut: "placed" side.
    for (var i = 0; i < gameInfo.nutTypesArray.length; i++) {
      var nutType = gameInfo.nutTypesArray[i];
      var cardConfig = getBasicConfigForNutType(nutType);
      gCardConfigs.push(cardConfig);
    }

    // Normal nut: "thinking about it" side.
    for (var i = 0; i < gameInfo.nutTypesArray.length; i++) {
      var nutType = gameInfo.nutTypesArray[i];
      var cardConfig = getBasicConfigForNutType(nutType);
      cardConfig.classes.push("question");
      cardConfig.classes.push("decorated");
      cardConfig.question = true;
      gCardConfigs.push(cardConfig);
    }

    // Board markers
    var requiredPlacementNutTypes = [
      gameInfo.nutTypes.Cashew,
      gameInfo.nutTypes.Almond,
      gameInfo.nutTypes.Macadamia,
      gameInfo.nutTypes.Pistachio,
      gameInfo.nutTypes.Walnut,
    ];
    // Must be <this nut>
    for (var i = 0; i < requiredPlacementNutTypes.length; i++) {
      var nutType = requiredPlacementNutTypes[i];
      var cardConfig = getBasicConfigForNutType(nutType);
      cardConfig.classes.push("required");
      cardConfig.classes.push("decorated");
      cardConfig.classes.push("space-config");
      cardConfig.required = true;
      gCardConfigs.push(cardConfig);
    }

    var bonusPlacementNutTypes = [
      gameInfo.nutTypes.Peanut,
      gameInfo.nutTypes.Cashew,
      gameInfo.nutTypes.Almond,
      gameInfo.nutTypes.Macadamia,
      gameInfo.nutTypes.Pistachio,
      gameInfo.nutTypes.Walnut,
    ];
    // bonus for "this nut".
    for (var i = 0; i < bonusPlacementNutTypes.length; i++) {
      var nutType = bonusPlacementNutTypes[i];
      var cardConfig = getBasicConfigForNutType(nutType);
      cardConfig.classes.push("bonus");
      cardConfig.classes.push("decorated");
      cardConfig.classes.push("space-config");
      cardConfig.bonus = 5;
      gCardConfigs.push(cardConfig);
    }

    // Must be same or different.
    var cardsEqualConfig = {};
    cardsEqualConfig.classes = ["nuts", "card", "space-config", "equal"];
    cardsEqualConfig.mustMatch = true;
    cardsEqualConfig.color = "#abacab";
    gCardConfigs.push(cardsEqualConfig);

    var cardsNotEqualConfig = {};
    cardsNotEqualConfig.classes = ["nuts", "card", "space-config", "not-equal"];
    cardsNotEqualConfig.mustMatch = false;
    cardsNotEqualConfig.color = "#fe6060";
    gCardConfigs.push(cardsNotEqualConfig);

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
