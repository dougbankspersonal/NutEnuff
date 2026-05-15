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
  const pistachioBackgroundColor = "rgb(168, 225, 193)";
  const walnutBackgroundColor = "rgb(135, 124, 103)";
  const acornBackgroundColor = "rgb(232, 185, 144)";

  const peanutBackgroundColor = "#ffe7bb";
  const almondBackgroundColor = "#f98f8f";
  const cashewBackgroundColor = "#a1dbff";
  const macadamiaBackgroundColor = "#dba4ff";
  const badNutBackgroundColor = "#9e9e9e";

  const raisinBackgroundColor = "#8bf3b1";
  const quantunNutBackgroundColor = "#fb80ad";
  const mixedNutsBackgroundColor = "#fdadfd";
  const voteBackgroundColor = "#cec5fb";

  const gCardColors = ["#e62495", "#501fe4", "#f3fb0f"];
  const gCardColorsLight = ["#fcb0e8", "#bdb1ff", "#fef3a5"];

  const gPeanutSpecialString = "<b>Most:</b> +5🪙<br><b>Fewest:</b> -5🪙";
  const gAlmondSpecialString = "<b>Most:</b> +4🪙<br><b>Fewest:</b> -4🪙";
  const gCashewSpecialString = "<b>Most:</b> +3🪙<br><b>Fewest:</b> -3🪙";

  const gPeanut = "peanut";
  const gAlmond = "almond";
  const gCashew = "cashew";
  const gMacadamia = "macadamia";
  const gPistachio = "pistachio";
  const gWalnut = "walnut";
  const gAcorn = "acorn";
  const gDoubleTypePeanut = "double-peanut";
  const gDoubleTypeAlmond = "double-almond";
  const gDoubleTypeCashew = "double-cashew";
  const gDoubleTypeMacadamia = "double-macadamia";

  const gDeluxeTypePeanut = "deluxe-peanut";
  const gDeluxeTypeAlmond = "deluxe-almond";
  const gDeluxeTypeCashew = "deluxe-cashew";
  const gDeluxeTypeMacadamia = "deluxe-macadamia";
  const gDeluxeTypePistachio = "deluxe-pistachio";
  const gSpecialTypeRaisin = "raisin";
  const gBadTypeBadNut = "bad-nut";

  const gItemTypes = {
    Pistachio: gPistachio,
    Peanut: gPeanut,
    Almond: gAlmond,
    Cashew: gCashew,
    Macadamia: gMacadamia,
    Walnut: gWalnut,
    Acorn: gAcorn,
    DoublePeanut: gDoubleTypePeanut,
    DoubleAlmond: gDoubleTypeAlmond,
    DoubleCashew: gDoubleTypeCashew,
    DoubleMacadamia: gDoubleTypeMacadamia,
    DeluxeTypePeanut: gDeluxeTypePeanut,
    DeluxeTypeAlmond: gDeluxeTypeAlmond,
    DeluxeTypeCashew: gDeluxeTypeCashew,
    DeluxeTypeMacadamia: gDeluxeTypeMacadamia,
    DeluxeTypePistachio: gDeluxeTypePistachio,
    Raisin: gSpecialTypeRaisin,
    BadNut: gBadTypeBadNut,
  };

  const gDeckToTypeToCountMap = {
    starter: {
      [gItemTypes.Peanut]: 1,
      [gItemTypes.Almond]: 1,
      [gItemTypes.Cashew]: 1,
      [gItemTypes.DoublePeanut]: 1,
      [gItemTypes.DoubleAlmond]: 1,
    },

    day: {
      [gItemTypes.Peanut]: 20,
      [gItemTypes.Almond]: 14,
      [gItemTypes.Cashew]: 10,
      [gItemTypes.Macadamia]: 4,
      [gItemTypes.Pistachio]: 0,
      [gItemTypes.Walnut]: 3,
      [gItemTypes.Acorn]: 6,
      [gItemTypes.DoublePeanut]: 2,
      [gItemTypes.DoubleAlmond]: 2,
      [gItemTypes.DoubleCashew]: 2,
      [gItemTypes.DoubleMacadamia]: 1,
      [gItemTypes.Raisin]: 3,
      [gItemTypes.BadNut]: 3,
    },
    night: {
      [gItemTypes.Peanut]: 13,
      [gItemTypes.Almond]: 11,
      [gItemTypes.Cashew]: 9,
      [gItemTypes.Macadamia]: 8,
      [gItemTypes.Pistachio]: 7,
      [gItemTypes.Walnut]: 5,
      [gItemTypes.DeluxePeanut]: 4,
      [gItemTypes.DeluxeAlmond]: 4,
      [gItemTypes.DeluxeCashew]: 4,
      [gItemTypes.DeluxeMacadamia]: 4,
      [gItemTypes.DeluxePistachio]: 3,
      [gItemTypes.BadNut]: 4,
    },
  };

  function cardsPerPlayerPerSeason(numPlayers) {
    return 5 * numPlayers + 2;
  }

  function totalCardsPerPlayer(numPlayers) {
    return cardsPerPlayerPerSeason(numPlayers) * 4;
  }

  function addCardCountToConfig(cardConfig, deckId) {
    debugLog(
      "addCardCountToConfig",
      "cardConfig:",
      cardConfig,
      "deckId:",
      deckId,
    );
    var retVal = [];
    var countForDeck = gDeckToTypeToCountMap[deckId];
    console.assert(
      countForDeck,
      "addCardCountToConfig: unexpected deckId: " + deckId,
    );
    debugLog(
      "addCardCountToConfig",
      "countForDeck:",
      JSON.stringify(countForDeck),
    );
    var count = countForDeck[cardConfig.cardType] || 0;

    console.assert(
      count >= 0,
      "generateNutCardDistribution: unexpected count for cardType " +
        cardConfig.cardType,
    );
    debugLog(
      "addCardCountToConfig",
      "count for " + cardConfig.cardType + ":",
      count,
    );

    retVal.push({
      count: count,
    });
    return retVal;
  }

  // Fields:
  // cardType: a unique string iding the type of card. A peanut might be "peanut" and double peanut would be "double-peanut".
  // itemType: for core type of nut.  For peanut, deluxe peanut, and double peanut, it's "peanut".
  // classes: array of extra css classes to aid in rendering common concepts, like "deluxe".
  const gSharedDeckConfigs = [
    // Basic nuts
    {
      title: "Peanut",
      cardType: gItemTypes.Peanut,
      craft: {
        number: 3,
        points: 2,
      },
      customRendering: {
        text: gPeanutSpecialString,
      },
      playType: "nut",
      color: peanutBackgroundColor,
      itemType: gItemTypes.Peanut,
    },
    {
      title: "Almond",
      cardType: gItemTypes.Almond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "nut",
      itemType: gItemTypes.Almond,
      customRendering: {
        text: gAlmondSpecialString,
      },
    },
    {
      title: "Cashew",
      cardType: gItemTypes.Cashew,
      color: cashewBackgroundColor,
      customRendering: {
        text: gCashewSpecialString,
      },
      craft: {
        number: 3,
        points: 4,
      },
      playType: "nut",
      itemType: gItemTypes.Cashew,
    },

    // Higher value nuts.
    {
      title: "Macadamia",
      cardType: gItemTypes.Macadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "nut",
      fontAdjustment: 0.8,
      itemType: gItemTypes.Macadamia,
    },
    {
      title: "Pistachio",
      cardType: gItemTypes.Pistachio,
      craft: {
        number: 2,
        points: 3,
      },
      playType: "nut",
      color: pistachioBackgroundColor,
      itemType: gItemTypes.Pistachio,
    },
    {
      title: "Walnut",
      cardType: gWalnut,
      customRendering: {
        useClassToIndexFunction: true,
      },

      playType: "nut",
      color: walnutBackgroundColor,
      itemType: gItemTypes.Walnut,
    },
    {
      title: "Acorn",
      cardType: gAcorn,
      customRendering: {
        useClassToIndexFunction: true,
        points: 3,
        text: "3 Coins if the Acorn is on Desk.",
      },
      playType: "special",
      color: acornBackgroundColor,
      itemType: gItemTypes.Acorn,
    },

    // Double nuts
    {
      title: "Double Peanut",
      cardType: gItemTypes.DoublePeanut,
      craft: {
        number: 3,
        points: 2,
      },
      playType: "double-nut",
      color: peanutBackgroundColor,
      extraImage: gItemTypes.Peanut,
      itemType: gItemTypes.Peanut,
      fontAdjustment: 0.8,
      customRendering: {
        text: gPeanutSpecialString,
      },
    },
    {
      title: "Double Almond",
      cardType: gItemTypes.DoubleAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "double-nut",
      extraImage: gItemTypes.Almond,
      itemType: gItemTypes.Almond,
      fontAdjustment: 0.8,
      customRendering: {
        text: gAlmondSpecialString,
      },
    },
    {
      title: "Double Cashew",
      cardType: gItemTypes.DoubleCashew,
      color: cashewBackgroundColor,
      customRendering: {
        text: gCashewSpecialString,
      },
      craft: {
        number: 3,
        points: 4,
      },
      playType: "double-nut",
      extraImage: gItemTypes.Cashew,
      itemType: gItemTypes.Cashew,
      fontAdjustment: 0.8,
    },
    {
      title: "Double Macadamia",
      cardType: gItemTypes.DoubleMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "double-nut",
      extraImage: gItemTypes.Macadamia,
      itemType: gItemTypes.Macadamia,
      fontAdjustment: 0.5,
    },
    // Deluxe nuts
    {
      title: "Deluxe Peanut",
      cardType: gItemTypes.DeluxePeanut,
      craft: {
        number: 3,
        points: 3,
      },
      classes: ["deluxe"],
      playType: "deluxe-nut",
      color: peanutBackgroundColor,
      itemType: gItemTypes.Peanut,
      fontAdjustment: 0.8,
      customRendering: {
        text: gPeanutSpecialString,
      },
    },
    {
      title: "Deluxe Almond",
      cardType: gItemTypes.DeluxeAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 4,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gItemTypes.Almond,
      fontAdjustment: 0.8,
      customRendering: {
        text: gAlmondSpecialString,
      },
    },
    {
      title: "Deluxe Cashew",
      cardType: gItemTypes.DeluxeCashew,
      color: cashewBackgroundColor,
      craft: {
        number: 3,
        points: 5,
      },
      customRendering: {
        text: gCashewSpecialString,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gItemTypes.Cashew,
      fontAdjustment: 0.8,
    },
    {
      title: "Deluxe Macadamia",
      cardType: gItemTypes.DeluxeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 8,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gItemTypes.Macadamia,
      fontAdjustment: 0.6,
    },

    {
      title: "Deluxe Pistachio",
      cardType: gItemTypes.DeluxePistachio,
      color: pistachioBackgroundColor,
      craft: {
        number: 2,
        points: 4,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gItemTypes.Pistachio,
      fontAdjustment: 0.6,
    },

    // Specials
    {
      title: "Raisin",
      cardType: gItemTypes.Raisin,
      customRendering: {
        customRenderingImageClasses: ["peanut", "almond", "cashew"],
        specialImagesSeparator: "/",
        text: "May be used as Peanut, Almond, or Cashew.",
      },
      playType: "special",
      color: raisinBackgroundColor,
    },
    {
      title: "Bad Nut",
      cardType: gItemTypes.BadNut,
      customRendering: {
        //        customRenderingImageClasses: ["floor", "bad-nut-floor"],
        //    text: "<b>Final Scoring</b>: Counts as two cards on the Floor, <b><i>but</i></b> a set of 4 Bad Nuts may be removed from the Floor.",
        customRenderingImageClasses: ["floor", "two-cards"],
        specialImagesSeparator: ":",
        text: "<b>Final Scoring</b>: Counts as two cards on the Floor.",
      },
      playType: "bad",
      color: badNutBackgroundColor,
    },
  ];

  var gCardConfigs;

  function addCountConfigInfo(deckId, cardConfigs) {
    for (var cardConfig of cardConfigs) {
      cardConfig.countConfigs = addCardCountToConfig(cardConfig, deckId);
    }
  }

  var gSetupCalled = false;
  function generateCardConfigsForDeck(deckId) {
    // Must be done before doing anything else.
    var newCardConfigs = structuredClone(gSharedDeckConfigs);

    addCountConfigInfo(deckId, newCardConfigs);

    for (var cardConfig of newCardConfigs) {
      var lastIndex = cardConfig.countConfigs.length - 1;
      cardConfig.count = cardConfig.countConfigs[lastIndex].count;
      cardConfig.deckId = deckId;
    }

    return newCardConfigs;
  }

  function getCardConfigs() {
    console.assert(gSetupCalled, "setupCardConfigs not called yet");

    debugLog("getCardConfigs", "gCardConfigs:", JSON.stringify(gCardConfigs));
    debugLog(
      "getCardConfigs",
      "number of cards: ",
      cards.getNumCardsFromConfigs(gCardConfigs),
    );
    return gCardConfigs;
  }

  function getClassesForCardConfig(cardConfig) {
    var classes = [cardConfig.cardType];
    if (cardConfig.classes) {
      classes = classes.concat(cardConfig.classes);
    }
    return classes;
  }

  function setupCardConfigs() {
    console.assert(
      !gSetupCalled,
      "setupCardConfigs should only be called once",
    );
    gSetupCalled = true;
    gCardConfigs = [];
    var dayConfigs = generateCardConfigsForDeck("day");
    var nightConfigs = generateCardConfigsForDeck("night");
    gCardConfigs = gCardConfigs.concat(dayConfigs);
    gCardConfigs = gCardConfigs.concat(nightConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    itemTypes: gItemTypes,
    cardColors: gCardColors,
    numCardColors: gCardColors.length,
    cardColorsLight: gCardColorsLight,

    generateCardConfigsForDeck: generateCardConfigsForDeck,
    setupCardConfigs: setupCardConfigs,
    totalCardsPerPlayer: totalCardsPerPlayer,
    getCardConfigs: getCardConfigs,
    getClassesForCardConfig: getClassesForCardConfig,
  };
});
