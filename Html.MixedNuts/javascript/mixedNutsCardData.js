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

  const raisinBackgroundColor = "#FF8888";
  const mysteryBackgroundColor = "#FFFF88";
  const quantunNutBackgroundColor = "#FF4488";
  const mixedNutsBackgroundColor = "#FF88FF";
  const voteBackgroundColor = "#aa99ff";

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

  const gSpecialTypeTrailMix = "trail-mix";
  const gSpecialTypeMystery = "mystery";
  const gSpecialTypeQuantumNut = "quantum-nut";
  const gSpecialTypeSnack = "snack";
  const gSpecialTypeVote = "vote";
  const gSpecialTypeRaisin = "raisin";

  const gSpecialTypes = {
    QuantumNut: gSpecialTypeQuantumNut,
    Raisin: gSpecialTypeRaisin,
    Snack: gSpecialTypeSnack,
    TrailMix: gSpecialTypeTrailMix,
    Vote: gSpecialTypeVote,
    Mystery: gSpecialTypeMystery,
  };

  const gBadTypeBadNut = "bad-nut";

  const gDeckToTypeToCountMap = {
    day: {
      [gItemTypes.Peanut]: 17,
      [gItemTypes.Almond]: 14,
      [gItemTypes.Cashew]: 10,
      [gItemTypes.Macadamia]: 4,
      [gItemTypes.Acorn]: 3,
      [gDoubleTypePeanut]: 3,
      [gDoubleTypeAlmond]: 2,
      [gDoubleTypeCashew]: 1,
      [gSpecialTypeRaisin]: 2,
      [gBadTypeBadNut]: 9,
      [gSpecialTypeQuantumNut]: 2,

      /*
      [gSpecialTypeTrailMix]: 1,
      [gSpecialTypeMystery]: 1,
      [gSpecialTypeVote]: 8,
      [gSpecialTypeSnack]: 1,
      */
    },
    night: {
      [gItemTypes.Peanut]: 11,
      [gItemTypes.Almond]: 10,
      [gItemTypes.Cashew]: 8,
      [gItemTypes.Macadamia]: 5,
      [gItemTypes.Pistachio]: 7,
      [gItemTypes.Walnut]: 5,
      [gPremiumTypePeanut]: 4,
      [gPremiumTypeAlmond]: 4,
      [gPremiumTypeCashew]: 3,
      [gPremiumTypeMacadamia]: 5,
      [gSpecialTypeRaisin]: 1,
      [gBadTypeBadNut]: 9,
      [gSpecialTypeQuantumNut]: 2,

      /*
      [gSpecialTypeTrailMix]: 2,
      [gSpecialTypeSnack]: 3,
      [gSpecialTypeMystery]: 3,
      [gSpecialTypeVote]: 11,
      */
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
        text: "Score 3 Coins if the Acorn is on your desk at the end of the game.",
      },
      playType: "special",
      color: acornBackgroundColor,
      itemClass: gAcorn,
    },
    {
      title: "Bad Nut",
      cardClass: gBadTypeBadNut,
      customRendering: {
        text: "Bad Nut cannot be packaged.",
      },
      playType: "bad",
      color: badNutBackgroundColor,
    },
    {
      title: "Raisin",
      cardClass: gSpecialTypeRaisin,
      customRendering: {
        customRenderingImageClasses: ["peanut", "almond", "cashew"],
        specialImagesSeparator: "/",
        text: "May be used as Peanut, Almond, or Cashew.",
      },
      playType: "special",
      color: raisinBackgroundColor,
    },
    {
      title: "Quantum Nut",
      cardClass: gSpecialTypeQuantumNut,
      customRendering: {
        customRenderingImageClasses: ["floor", "double-arrow", "desk"],
        text: "During Production, you may place this card on the floor and place a card from your floor back onto your desk.",
      },
      playType: "special",
      color: quantunNutBackgroundColor,
    },

    // Expansion cards.
    {
      title: "Mystery",
      cardClass: gSpecialTypeMystery,
      customRendering: {
        customRenderingImageClasses: ["desk", "right-arrow", "mystery-card"],
        text: "Upon collecting, draw 2 cards from the current deck: keep one, discard Mystery and the other card.",
      },
      playType: "special",
      color: mysteryBackgroundColor,
    },
    {
      title: "Vote",
      cardClass: gSpecialTypeVote,
      customRendering: {
        customRenderingImageClasses: ["vote"],
      },
      playType: "special",
      color: voteBackgroundColor,
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
