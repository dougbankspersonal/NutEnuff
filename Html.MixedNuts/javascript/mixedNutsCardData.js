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
  const pistachioBackgroundColor = "#238f52ff";
  const walnutBackgroundColor = "#4b3c1fff";
  const acornBackgroundColor = "#7e420aff";

  const peanutBackgroundColor = "#f5deb3";
  const almondBackgroundColor = "#deb887";
  const cashewBackgroundColor = "#d2a679";
  const macadamiaBackgroundColor = "#a9745d";
  const badNutBackgroundColor = "#e6b3a1";

  const honeyRoastedBackgroundColor = "#FF8844";
  const raisinBackgroundColor = "#FF8888";
  const mysteryBackgroundColor = "#FFFF88";
  const glovesBackgroundColor = "#FF4488";
  const mixedNutsBackgroundColor = "#FF88FF";
  const coffeeBreakBackgroundColor = "#884444";
  const hotSpiceBackgroundColor = "#FFCC44";

  const CustomTypeText = "Text";
  const CustomTypePtsText = "PtsText";
  const CustomTypeImage = "Image";

  const gCustomTypes = {
    Text: CustomTypeText,
    PtsText: CustomTypePtsText,
    Image: CustomTypeImage,
  };

  const gCustomTypesArray = Object.keys(gCustomTypes);
  const gMinPlayers = 2;
  const gMaxPlayers = 5;

  const gPeanut = "peanut";
  const gAlmond = "almond";
  const gCashew = "cashew";
  const gMacadamia = "macadamia";
  const gPistachio = "pistachio";
  const gWalnut = "walnut";
  const gAcorn = "acorn";

  const gItemTypes = {
    Pistachio: gPistachio,
    Peanut: gPeanut,
    Almond: gAlmond,
    Cashew: gCashew,
    Macadamia: gMacadamia,
    Walnut: gWalnut,
    Acorn: gAcorn,
  };

  const gDoubleTypePeanut = "double-peanut";
  const gDoubleTypeAlmond = "double-almond";
  const gDoubleTypeCashew = "double-cashew";
  const gDoubleTypeMacadamia = "double-macadamia";

  const gDoubleTypes = {
    Peanut: gDoubleTypePeanut,
    Almond: gDoubleTypeAlmond,
    Cashew: gDoubleTypeCashew,
    Macadamia: gDoubleTypeMacadamia,
  };

  const gPremiumTypePeanut = "premium-peanut";
  const gPremiumTypeAlmond = "premium-almond";
  const gPremiumTypeCashew = "premium-cashew";
  const gPremiumTypeMacadamia = "premium-macadamia";

  const gPremiumTypes = {
    Peanut: gPremiumTypePeanut,
    Almond: gPremiumTypeAlmond,
    Cashew: gPremiumTypeCashew,
    Macadamia: gPremiumTypeMacadamia,
  };

  const gSpecialTypeCoffeeBreak = "coffee-break";
  const gSpecialTypeGloves = "gloves";
  const gSpecialTypeHoneyRoasted = "honey-roasted";
  const gSpecialTypeHotSpice = "hot-spice";
  const gSpecialTypeTrailMix = "trail-mix";
  const gSpecialTypeMystery = "mystery";
  const gSpecialTypeRaisin = "raisin";
  const gSpecialTypeSnack = "snack";

  const gSpecialTypes = {
    CoffeeBreak: gSpecialTypeCoffeeBreak,
    Gloves: gSpecialTypeGloves,
    HoneyRoasted: gSpecialTypeHoneyRoasted,
    HotSpice: gSpecialTypeHotSpice,
    TrailMix: gSpecialTypeTrailMix,
    Mystery: gSpecialTypeMystery,
    Raisin: gSpecialTypeRaisin,
    Snack: gSpecialTypeSnack,
  };

  const gBadTypeBadNut = "bad-nut";

  const gSpecialTypesArray = Object.keys(gSpecialTypes);

  // Some math around numbers for uniform deck.
  const baseCardsPerPlayerPerSeason = 5;
  const explodingCardsPerPlayerSeason1 = 5;
  const explodingCardsPerPlayerSeason2 = 6;
  const explodingCardsPerPlayerSeason3 = 6;
  const explodingCardsPerPlayerSeason4 = 7;

  const gDeckTotalMin =
    gMaxPlayers *
    (explodingCardsPerPlayerSeason1 +
      explodingCardsPerPlayerSeason2 +
      explodingCardsPerPlayerSeason3 +
      explodingCardsPerPlayerSeason4);

  const gBadNutCount = 6;
  const gCountPerSpecialCard = 2;

  const gDeckToTypeToCountMap = {
    day: {
      [gSpecialTypeRaisin]: 2,
      [gItemTypes.Peanut]: 15,
      [gItemTypes.Almond]: 12,
      [gItemTypes.Cashew]: 9,
      [gItemTypes.Macadamia]: 4,
      [gItemTypes.Acorn]: 3,
      [gDoubleTypePeanut]: 6,
      [gDoubleTypeAlmond]: 4,
      [gDoubleTypeCashew]: 2,
      [gDoubleTypeMacadamia]: 1,
      [gSpecialTypeSnack]: 1,
      [gSpecialTypeTrailMix]: 1,
      [gBadTypeBadNut]: 2,
      [gSpecialTypeMystery]: 1,
    },
    night: {
      [gItemTypes.Pistachio]: 7,
      [gSpecialTypeRaisin]: 1,
      [gItemTypes.Peanut]: 9,
      [gItemTypes.Almond]: 8,
      [gItemTypes.Cashew]: 6,
      [gItemTypes.Macadamia]: 5,
      [gSpecialTypeSnack]: 3,
      [gSpecialTypeTrailMix]: 2,
      [gBadTypeBadNut]: 5,
      [gBadTypeBadNut]: 5,
      [gPremiumTypePeanut]: 4,
      [gPremiumTypeAlmond]: 4,
      [gPremiumTypeCashew]: 3,
      [gPremiumTypeMacadamia]: 5,
      [gSpecialTypeMystery]: 3,
      [gWalnut]: 5,
    },
  };

  const gUniformDeckSpecialCounts = [
    {
      count: gCountPerSpecialCard,
    },
  ];

  const gUniformDeckBadCounts = [
    {
      count: gBadNutCount,
    },
  ];

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
    var count = countForDeck[cardConfig.cardClass] || 0;

    console.assert(
      count >= 0,
      "generateNutCardDistribution: unexpected count for cardClass " +
        cardConfig.cardClass,
    );
    debugLog(
      "addCardCountToConfig",
      "count for " + cardConfig.cardClass + ":",
      count,
    );

    retVal.push({
      count: count,
    });
    return retVal;
  }

  function generateBadCardDistribution() {
    return gUniformDeckBadCounts;
  }

  function generateSpecialCardDistribution() {
    return gUniformDeckSpecialCounts;
  }

  const gSharedDeckConfigs = [
    // Basic nuts
    {
      title: "Peanut",
      cardClass: gPeanut,
      craft: {
        number: 3,
        points: 2,
      },
      playType: "nut",
      color: peanutBackgroundColor,
      itemClass: gPeanut,
    },
    {
      title: "Almond",
      cardClass: gAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "nut",
      itemClass: gAlmond,
    },
    {
      title: "Cashew",
      cardClass: gCashew,
      color: cashewBackgroundColor,

      craft: {
        number: 3,
        points: 4,
      },
      playType: "nut",
      itemClass: gCashew,
    },
    {
      title: "Macadamia",
      cardClass: gMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "nut",
      fontAdjustment: 0.8,
      itemClass: gMacadamia,
    },

    // Double nuts
    {
      title: "Peanut x 2",
      cardClass: gDoubleTypePeanut,
      craft: {
        number: 3,
        points: 2,
      },
      playType: "double-nut",
      color: peanutBackgroundColor,
      extraCorner: gItemTypes.Peanut,
      itemClass: gItemTypes.Peanut,
    },
    {
      title: "Almond x 2",
      cardClass: gDoubleTypeAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "double-nut",
      extraCorner: gItemTypes.Almond,
      itemClass: gItemTypes.Almond,
    },
    {
      title: "Cashew x 2",
      cardClass: gDoubleTypeCashew,
      color: cashewBackgroundColor,

      craft: {
        number: 3,
        points: 4,
      },
      playType: "double-nut",
      extraCorner: gItemTypes.Cashew,
      itemClass: gItemTypes.Cashew,
    },
    {
      title: "Macadamia x 2",
      cardClass: gDoubleTypeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "double-nut",
      fontAdjustment: 0.8,
      extraCorner: gItemTypes.Macadamia,
      itemClass: gItemTypes.Macadamia,
    },

    // Premium nuts
    {
      title: "Premium Peanut",
      cardClass: gPremiumTypePeanut,
      craft: {
        number: 3,
        points: 2,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "premium-nut",
      color: peanutBackgroundColor,
      extraCorner: "plus-coin-corner",
      itemClass: gItemTypes.Peanut,
    },
    {
      title: "Premium Almond",
      cardClass: gPremiumTypeAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "nut",
      extraCorner: "plus-coin-corner",
      itemClass: gAlmond,
    },
    {
      title: "Premium Cashew",
      cardClass: gPremiumTypeCashew,
      color: cashewBackgroundColor,

      craft: {
        number: 3,
        points: 4,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "nut",
      extraCorner: "plus-coin-corner",
      itemClass: gCashew,
    },
    {
      title: "Premium Macadamia",
      cardClass: gPremiumTypeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "nut",
      extraCorner: "plus-coin-corner",
      fontAdjustment: 0.8,
      itemClass: gMacadamia,
    },

    // Special nuts
    {
      title: "Pistachio",
      cardClass: gPistachio,
      craft: {
        number: 2,
        points: 6,
      },
      playType: "nut",
      color: pistachioBackgroundColor,
      itemClass: gPistachio,
    },

    {
      title: "Walnut",
      cardClass: gWalnut,
      customRendering: {
        useClassToIndexFunction: true,
      },

      playType: "nut",
      color: walnutBackgroundColor,
      itemClass: gWalnut,
    },
    {
      title: "Acorn",
      cardClass: gAcorn,
      customRendering: {
        useClassToIndexFunction: true,
        points: 3,
      },
      playType: "special",
      color: acornBackgroundColor,
      itemClass: gAcorn,
    },
    {
      title: "Bad Nut",
      cardClass: gBadTypeBadNut,
      floor: -2,
      playType: "bad",
      color: badNutBackgroundColor,
    },
    {
      title: "Mystery",
      cardClass: gSpecialTypeMystery,
      customRendering: {
        customRenderingImageClasses: ["desk", "right-arrow", "mystery-card"],
      },
      playType: "special",
      color: mysteryBackgroundColor,
    },
    {
      title: "Honey Roasted",
      cardClass: gSpecialTypeHoneyRoasted,
      customRendering: {
        nutToBonusMap: {
          peanut: 1,
          almond: 2,
          cashew: 3,
          macadamia: 4,
        },
        wrapperScale: 0.6,
      },
      playType: "special",
      color: honeyRoastedBackgroundColor,
    },
    {
      title: "Raisin",
      cardClass: gSpecialTypeRaisin,
      customRendering: {
        customRenderingImageClasses: ["peanut", "almond", "cashew"],
        specialImagesSeparator: "/",
      },
      playType: "special",
      color: raisinBackgroundColor,
    },
    {
      title: "Gloves",
      cardClass: gSpecialTypeGloves,
      playType: "special",
      customRendering: {
        customRenderingImageClasses: ["floor", "right-arrow", "desk"],
      },
      color: glovesBackgroundColor,
    },
    {
      title: "Trail Mix",
      cardClass: gSpecialTypeTrailMix,
      customRendering: {
        points: 5,
        useClassToIndexFunction: true,
        wrapperScale: 0.8,
      },
      playType: "special",
      color: mixedNutsBackgroundColor,
    },
    {
      title: "Coffee Break",
      cardClass: gSpecialTypeCoffeeBreak,
      customRendering: {
        customRenderingImageClasses: ["desk", "double-arrow", "desk"],
      },
      playType: "special",
      color: coffeeBreakBackgroundColor,
    },
    {
      title: "Hot Spice",
      cardClass: gSpecialTypeHotSpice,
      customRendering: {
        points: 1,
        useClassToIndexFunction: true,
      },
      playType: "special",
      color: hotSpiceBackgroundColor,
    },

    {
      title: "Snack",
      cardClass: gSpecialTypeSnack,
      playType: "special",
      color: badNutBackgroundColor,
      customRendering: {
        customRenderingImageClasses: ["discard-2-cards"],
      },
    },
  ];

  var gCardConfigs;

  function addCountConfigInfo(deckId) {
    for (var cardConfig of gCardConfigs) {
      cardConfig.countConfigs = addCardCountToConfig(cardConfig, deckId);
    }
  }

  var gSetupCalled = false;
  function setupCardConfigs(deckId) {
    console.assert(!gSetupCalled, "setupCardConfigs called more than once");
    gSetupCalled = true;
    // Must be done before doing anything else.
    //    gCardConfigs = structuredClone(gUniformDeckCardConfigs);
    gCardConfigs = structuredClone(gSharedDeckConfigs);

    addCountConfigInfo(deckId);

    for (var cardConfig of gCardConfigs) {
      var lastIndex = cardConfig.countConfigs.length - 1;
      cardConfig.count = cardConfig.countConfigs[lastIndex].count;
      cardConfig.deckId = deckId;
    }
  }

  function getCardConfigs() {
    console.assert(gSetupCalled, "setupCardConfigs not called yet");

    debugLog("getCardConfigs", "gCardConfigs:", JSON.stringify(gCardConfigs));
    debugLog("getCardConfigs", "gDeckTotalMin:", gDeckTotalMin);
    debugLog(
      "getCardConfigs",
      "number of cards: ",
      cards.getNumCardsFromConfigs(gCardConfigs),
    );
    return gCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    customTypes: gCustomTypes,
    customTypesArray: gCustomTypesArray,
    specialTypes: gSpecialTypes,
    itemTypes: gItemTypes,

    setupCardConfigs: setupCardConfigs,
    totalCardsPerPlayer: totalCardsPerPlayer,
    getCardConfigs: getCardConfigs,
  };
});
