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

  const gDeluxeTypePeanut = "deluxe-peanut";
  const gDeluxeTypeAlmond = "deluxe-almond";
  const gDeluxeTypeCashew = "deluxe-cashew";
  const gDeluxeTypeMacadamia = "deluxe-macadamia";
  const gDeluxeTypePistachio = "deluxe-pistachio";

  const gDeluxeTypes = {
    Peanut: gDeluxeTypePeanut,
    Almond: gDeluxeTypeAlmond,
    Cashew: gDeluxeTypeCashew,
    Macadamia: gDeluxeTypeMacadamia,
    Pistachio: gDeluxeTypePistachio,
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
      [gItemTypes.Peanut]: 18,
      [gItemTypes.Almond]: 13,
      [gItemTypes.Cashew]: 10,
      [gItemTypes.Macadamia]: 5,
      [gItemTypes.Pistachio]: 4,
      [gSpecialTypeRaisin]: 2,
      [gBadTypeBadNut]: 3,
      [gItemTypes.Walnut]: 2,
      [gItemTypes.Acorn]: 6,
      [gSpecialTypeQuantumNut]: 2,
      [gDoubleTypePeanut]: 2,
      [gDoubleTypeAlmond]: 2,
      [gDoubleTypeCashew]: 2,
      [gDoubleTypeMacadamia]: 1,

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
      [gItemTypes.Cashew]: 9,
      [gItemTypes.Macadamia]: 7,
      [gItemTypes.Pistachio]: 6,
      [gBadTypeBadNut]: 4,
      [gItemTypes.Walnut]: 4,
      [gSpecialTypeQuantumNut]: 2,
      [gDeluxeTypePeanut]: 3,
      [gDeluxeTypeAlmond]: 4,
      [gDeluxeTypeCashew]: 4,
      [gDeluxeTypePistachio]: 4,
      [gDeluxeTypeMacadamia]: 4,

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
      cardClass: gItemTypes.Peanut,
      craft: {
        number: 3,
        points: 2,
      },
      playType: "nut",
      color: peanutBackgroundColor,
      itemClass: gItemTypes.Peanut,
    },
    {
      title: "Almond",
      cardClass: gItemTypes.Almond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "nut",
      itemClass: gItemTypes.Almond,
    },
    {
      title: "Cashew",
      cardClass: gItemTypes.Cashew,
      color: cashewBackgroundColor,

      craft: {
        number: 3,
        points: 4,
      },
      playType: "nut",
      itemClass: gItemTypes.Cashew,
    },
    {
      title: "Macadamia",
      cardClass: gItemTypes.Macadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "nut",
      fontAdjustment: 0.8,
      itemClass: gItemTypes.Macadamia,
    },
    {
      title: "Pistachio",
      cardClass: gItemTypes.Pistachio,
      craft: {
        number: 2,
        points: 3,
      },
      playType: "nut",
      color: pistachioBackgroundColor,
      itemClass: gItemTypes.Pistachio,
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
      title: "Bad Nut",
      cardClass: gBadTypeBadNut,
      customRendering: {
        customRenderingImageClasses: ["floor", "two-cards"],
        specialImagesSeparator: ":",
        text: "Cannot be packaged.<p>Counts as two cards on the floor.",
      },
      playType: "bad",
      color: badNutBackgroundColor,
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
        text: "3 Coins if the Acorn is on Desk.",
      },
      playType: "special",
      color: acornBackgroundColor,
      itemClass: gAcorn,
    },
    {
      title: "Quantum Nut",
      cardClass: gSpecialTypeQuantumNut,
      customRendering: {
        customRenderingImageClasses: ["floor", "double-arrow", "desk"],
        text: "Production: may place on the Floor and move a card from the Floor back to Desk.",
      },
      playType: "special",
      color: quantunNutBackgroundColor,
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
    // Deluxe nuts
    {
      title: "Deluxe Peanut",
      cardClass: gDeluxeTypePeanut,
      craft: {
        number: 3,
        points: 2,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "deluxe-nut",
      color: peanutBackgroundColor,
      extraCorner: "plus-coin-corner",
      itemClass: gItemTypes.Peanut,
    },
    {
      title: "Deluxe Almond",
      cardClass: gDeluxeTypeAlmond,
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
      title: "Deluxe Cashew",
      cardClass: gDeluxeTypeCashew,
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
      title: "Deluxe Macadamia",
      cardClass: gDeluxeTypeMacadamia,
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

    {
      title: "Deluxe Pistachio",
      cardClass: gDeluxeTypePistachio,
      color: pistachioBackgroundColor,
      craft: {
        number: 2,
        points: 3,
      },
      customRendering: {
        customRenderingImageClasses: ["plus-coin"],
      },
      playType: "nut",
      extraCorner: "plus-coin-corner",
      fontAdjustment: 0.8,
      itemClass: gPistachio,
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
