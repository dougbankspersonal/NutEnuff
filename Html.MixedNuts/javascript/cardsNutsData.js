define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const gCoinString = "🪙";
  const gPackageString = "📦";

  const peanutBackgroundColor = "#ffe7bb";
  const almondBackgroundColor = "#f98f8f";
  const cashewBackgroundColor = "#a1dbff";
  const macadamiaBackgroundColor = "#dba4ff";
  const walnutBackgroundColor = "rgb(135, 124, 103)";
  const acornBackgroundColor = "rgb(232, 185, 144)";
  const pistachioBackgroundColor = "rgb(168, 225, 193)";

  const raisinBackgroundColor = "#8bf3b1";

  const badNutBackgroundColor = "#9e9e9e";
  const trailMixBackgroundColor = "#927fff";

  const gCardColors = ["#e62495", "#501fe4", "#f3fb0f"];
  const gCardColorsLight = ["#fcb0e8", "#bdb1ff", "#fef3a5"];

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
  const gTrailMixType = "trail-mix";
  const gSnackType = "snack";

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
    Snack: gSnackType,
    TrailMix: gTrailMixType,
  };

  const gDeckToTypeToCountMap = {
    /*
    starter: {
      [gItemTypes.Peanut]: 1,
      [gItemTypes.Almond]: 1,
      [gItemTypes.Cashew]: 1,
      [gItemTypes.DoublePeanut]: 1,
      [gItemTypes.DoubleAlmond]: 1,
    },
    */

    day: {
      [gItemTypes.Peanut]: 11,
      [gItemTypes.Almond]: 8,
      [gItemTypes.Cashew]: 7,
      [gItemTypes.Macadamia]: 4,
      [gItemTypes.Pistachio]: 0,
      [gItemTypes.Raisin]: 0,
      [gItemTypes.BadNut]: 3,
      [gItemTypes.Walnut]: 4,
      [gItemTypes.Acorn]: 5,
      [gItemTypes.Snack]: 0,
      [gItemTypes.DoublePeanut]: 2,
      [gItemTypes.DoubleAlmond]: 2,
      [gItemTypes.DoubleCashew]: 2,
      [gItemTypes.DoubleMacadamia]: 2,
      [gItemTypes.DeluxePeanut]: 0,
      [gItemTypes.DeluxeAlmond]: 0,
      [gItemTypes.DeluxeCashew]: 0,
      [gItemTypes.DeluxeMacadamia]: 0,
      [gItemTypes.DeluxePistachio]: 0,
    },
    afternoon: {
      [gItemTypes.Peanut]: 12,
      [gItemTypes.Almond]: 11,
      [gItemTypes.Cashew]: 10,
      [gItemTypes.Macadamia]: 4,
      [gItemTypes.Pistachio]: 0,
      [gItemTypes.Raisin]: 5,
      [gItemTypes.BadNut]: 3,
      [gItemTypes.Walnut]: 5,
      [gItemTypes.Acorn]: 0,
      [gItemTypes.Snack]: 0,
      [gItemTypes.DoublePeanut]: 0,
      [gItemTypes.DoubleAlmond]: 0,
      [gItemTypes.DoubleCashew]: 0,
      [gItemTypes.DoubleMacadamia]: 0,
      [gItemTypes.DeluxePeanut]: 0,
      [gItemTypes.DeluxeAlmond]: 0,
      [gItemTypes.DeluxeCashew]: 0,
      [gItemTypes.DeluxeMacadamia]: 0,
      [gItemTypes.DeluxePistachio]: 0,
    },
    night: {
      [gItemTypes.Peanut]: 7,
      [gItemTypes.Almond]: 6,
      [gItemTypes.Cashew]: 5,
      [gItemTypes.Macadamia]: 3,
      [gItemTypes.Pistachio]: 7,
      [gItemTypes.Raisin]: 0,
      [gItemTypes.BadNut]: 3,
      [gItemTypes.Walnut]: 4,
      [gItemTypes.Acorn]: 0,
      [gItemTypes.Snack]: 0,
      [gItemTypes.DoublePeanut]: 0,
      [gItemTypes.DoubleAlmond]: 0,
      [gItemTypes.DoubleCashew]: 0,
      [gItemTypes.DoubleMacadamia]: 0,
      [gItemTypes.DeluxePeanut]: 3,
      [gItemTypes.DeluxeAlmond]: 3,
      [gItemTypes.DeluxeCashew]: 3,
      [gItemTypes.DeluxeMacadamia]: 3,
      [gItemTypes.DeluxePistachio]: 3,
    },
  };

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
      itemType: gItemTypes.Almond,
    },
    {
      title: "Cashew",
      cardType: gItemTypes.Cashew,
      color: cashewBackgroundColor,
      craft: {
        number: 3,
        points: 4,
      },
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
      color: pistachioBackgroundColor,
      itemType: gItemTypes.Pistachio,
    },
    {
      title: "Walnut",
      cardType: gWalnut,
      customRendering: {
        useClassToIndexFunction: true,
      },

      color: walnutBackgroundColor,
      itemType: gItemTypes.Walnut,
    },
    {
      title: "Acorn",
      cardType: gAcorn,
      customRendering: {
        useClassToIndexFunction: true,
        points: 2,
        text: "2 " + gCoinString + " if on Desk at game end.",
      },
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
      color: peanutBackgroundColor,
      extraImage: gItemTypes.Peanut,
      itemType: gItemTypes.Peanut,
      fontAdjustment: 0.8,
    },
    {
      title: "Double Almond",
      cardType: gItemTypes.DoubleAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      extraImage: gItemTypes.Almond,
      itemType: gItemTypes.Almond,
      fontAdjustment: 0.8,
      /*
      customRendering: {
        text: gAlmondSpecialString,
      }, */
    },
    {
      title: "Double Cashew",
      cardType: gItemTypes.DoubleCashew,
      color: cashewBackgroundColor,
      /*
      customRendering: {
        text: gCashewSpecialString,
      },*/
      craft: {
        number: 3,
        points: 4,
      },
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
        points: 2,
      },
      classes: ["deluxe"],
      color: peanutBackgroundColor,
      itemType: gItemTypes.Peanut,
      fontAdjustment: 0.8,
    },
    {
      title: "Deluxe Almond",
      cardType: gItemTypes.DeluxeAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      classes: ["deluxe"],
      itemType: gItemTypes.Almond,
      fontAdjustment: 0.8,
      /*
      customRendering: {
        text: gAlmondSpecialString,
      },
      */
    },
    {
      title: "Deluxe Cashew",
      cardType: gItemTypes.DeluxeCashew,
      color: cashewBackgroundColor,
      craft: {
        number: 3,
        points: 4,
      },
      /*
      customRendering: {
        text: gCashewSpecialString,
      },
      */
      classes: ["deluxe"],
      itemType: gItemTypes.Cashew,
      fontAdjustment: 0.8,
    },
    {
      title: "Deluxe Macadamia",
      cardType: gItemTypes.DeluxeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      classes: ["deluxe"],
      itemType: gItemTypes.Macadamia,
      fontAdjustment: 0.6,
    },

    {
      title: "Deluxe Pistachio",
      cardType: gItemTypes.DeluxePistachio,
      color: pistachioBackgroundColor,
      craft: {
        number: 2,
        points: 3,
      },
      classes: ["deluxe"],
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
      color: raisinBackgroundColor,
    },
    {
      title: "Bad Nut",
      cardType: gItemTypes.BadNut,
      craft: {
        number: 0,
        points: -1,
      },
      color: badNutBackgroundColor,
    },
    {
      title: "Trail Mix",
      cardType: gItemTypes.TrailMix,
      customRendering: {
        useClassToIndexFunction: true,
        customText: "<i><b>DIFFERENT</b></i> types.",
        pointsArray: [
          {
            cards: 4,
            points: 5,
          },
          {
            cards: 5,
            points: 7,
          },
          {
            cards: 6,
            points: 10,
          },
          {
            cards: 7,
            points: 13,
          },
        ],
      },
      color: trailMixBackgroundColor,
      itemType: gItemTypes.TrailMix,
    },
    {
      title: "Snack",
      cardType: gItemTypes.Snack,
      customRendering: {
        text: "Immediately discard this and two more cards from your Desk.",
        customRenderingImageClasses: ["discard-2-cards"],
      },
      color: trailMixBackgroundColor,
      itemType: gItemTypes.Snack,
    },
  ];

  var gCardConfigs;

  function getConfigForCardType(cardType) {
    for (var cardConfig of gSharedDeckConfigs) {
      if (cardConfig.cardType === cardType) {
        return cardConfig;
      }
    }
    console.assert(
      false,
      "getConfigForCardType: unexpected cardType: " + cardType,
    );
    return null;
  }

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
    //    var starterCardConfigs = generateCardConfigsForDeck("starter");
    var dayConfigs = generateCardConfigsForDeck("day");
    var afternoonConfigs = generateCardConfigsForDeck("afternoon");
    var nightConfigs = generateCardConfigsForDeck("night");
    debugLog("setupCardConfigs", "nightConfigs:", JSON.stringify(nightConfigs));

    var sum = 0;
    for (var cardConfig of dayConfigs) {
      sum += cardConfig.count;
    }
    debugLog("setupCardConfigs", "dayConfigs sum:", sum);
    sum = 0;
    for (var cardConfig of afternoonConfigs) {
      sum += cardConfig.count;
    }
    debugLog("setupCardConfigs", "afternoonConfigs sum:", sum);
    sum = 0;
    for (var cardConfig of nightConfigs) {
      sum += cardConfig.count;
    }
    debugLog("setupCardConfigs", "nightConfigs sum:", sum);

    //    gCardConfigs = gCardConfigs.concat(starterCardConfigs);
    gCardConfigs = gCardConfigs.concat(dayConfigs);
    gCardConfigs = gCardConfigs.concat(afternoonConfigs);
    gCardConfigs = gCardConfigs.concat(nightConfigs);

    /*
    var trailMixConfig = getConfigForCardType(gItemTypes.TrailMix);
    gCardConfigs.push(trailMixConfig);
    */

    debugLog("setupCardConfigs", "gCardConfigs:", JSON.stringify(gCardConfigs));
  }

  // This returned object becomes the defined value of this module
  return {
    coinString: gCoinString,
    packageString: gPackageString,
    itemTypes: gItemTypes,
    cardColors: gCardColors,
    numCardColors: gCardColors.length,
    cardColorsLight: gCardColorsLight,

    setupCardConfigs: setupCardConfigs,
    getCardConfigs: getCardConfigs,
    getClassesForCardConfig: getClassesForCardConfig,
    getConfigForCardType: getConfigForCardType,
  };
});
