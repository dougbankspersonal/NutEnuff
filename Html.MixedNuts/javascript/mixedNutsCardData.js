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
  const mysteryBackgroundColor = "#FFFF88";
  const quantunNutBackgroundColor = "#fb80ad";
  const mixedNutsBackgroundColor = "#fdadfd";
  const voteBackgroundColor = "#cec5fb";

  const gCardColors = ["#e62495", "#501fe4", "#f3fb0f"];
  const gCardColorsLight = ["#fcb0e8", "#bdb1ff", "#fef3a5"];

  const CustomTypeText = "Text";
  const CustomTypePtsText = "PtsText";
  const CustomTypeImage = "Image";

  const gCustomTypes = {
    Text: CustomTypeText,
    PtsText: CustomTypePtsText,
    Image: CustomTypeImage,
  };

  const gPeanutSpecialString =
    "<b>Most:</b> +🪙/package<br><b>Fewest:</b> -🪙/package";

  const gAlmondSpecialString = "<b>Most:</b> +5🪙<br><b>Fewest:</b> -5🪙";
  const gCashewSpecialString = "<b>Packaging:</b> Trade 1";
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
    starter: {
      [gItemTypes.Peanut]: 1,
      [gItemTypes.Almond]: 1,
      [gItemTypes.Cashew]: 1,
      [gDoubleTypePeanut]: 1,
      [gDoubleTypeAlmond]: 1,
    },

    day: {
      [gItemTypes.Peanut]: 19,
      [gItemTypes.Almond]: 14,
      [gItemTypes.Cashew]: 10,
      [gItemTypes.Macadamia]: 6,
      [gItemTypes.Pistachio]: 0,
      [gItemTypes.Walnut]: 2,
      [gItemTypes.Acorn]: 6,
      [gDoubleTypePeanut]: 2,
      [gDoubleTypeAlmond]: 2,
      [gDoubleTypeCashew]: 2,
      [gDoubleTypeMacadamia]: 2,
      [gSpecialTypeRaisin]: 2,
      [gBadTypeBadNut]: 3,

      /*
      [gSpecialTypeQuantumNut]: 3,
      [gSpecialTypeSnack]: 2,
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
      [gItemTypes.Macadamia]: 8,
      [gItemTypes.Pistachio]: 7,
      [gItemTypes.Walnut]: 4,
      [gDeluxeTypes.Peanut]: 3,
      [gDeluxeTypes.Almond]: 4,
      [gDeluxeTypes.Cashew]: 4,
      [gDeluxeTypes.Macadamia]: 5,
      [gDeluxeTypes.Pistachio]: 3,
      [gBadTypeBadNut]: 4,

      /*
      [gSpecialTypeQuantumNut]: 2,
      [gSpecialTypeSnack]: 3,
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
      itemType: gWalnut,
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
      itemType: gAcorn,
    },

    // Double nuts
    {
      title: "Double Peanut",
      cardType: gDoubleTypePeanut,
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
      cardType: gDoubleTypeAlmond,
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
      cardType: gDoubleTypeCashew,
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
      cardType: gDoubleTypeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "double-nut",
      fontAdjustment: 0.8,
      extraImage: gItemTypes.Macadamia,
      itemType: gItemTypes.Macadamia,
      fontAdjustment: 0.5,
    },
    // Deluxe nuts
    {
      title: "Deluxe Peanut",
      cardType: gDeluxeTypePeanut,
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
      cardType: gDeluxeTypeAlmond,
      color: almondBackgroundColor,
      craft: {
        number: 3,
        points: 4,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gAlmond,
      fontAdjustment: 0.8,
      customRendering: {
        text: gAlmondSpecialString,
      },
    },
    {
      title: "Deluxe Cashew",
      cardType: gDeluxeTypeCashew,
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
      itemType: gCashew,
      fontAdjustment: 0.8,
    },
    {
      title: "Deluxe Macadamia",
      cardType: gDeluxeTypeMacadamia,
      color: macadamiaBackgroundColor,
      craft: {
        number: 4,
        points: 8,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gMacadamia,
      fontAdjustment: 0.6,
    },

    {
      title: "Deluxe Pistachio",
      cardType: gDeluxeTypePistachio,
      color: pistachioBackgroundColor,
      craft: {
        number: 2,
        points: 4,
      },
      classes: ["deluxe"],
      playType: "nut",
      itemType: gPistachio,
      fontAdjustment: 0.6,
    },

    // Specials
    {
      title: "Raisin",
      cardType: gSpecialTypeRaisin,
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
      cardType: gBadTypeBadNut,
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

    {
      title: "Quantum Nut",
      cardType: gSpecialTypeQuantumNut,
      customRendering: {
        customRenderingImageClasses: ["desk", "double-arrow", "floor"],
        text: "<b>Packaging</b>: swap with a card on the Floor.",
      },
      playType: "special",
      color: quantunNutBackgroundColor,
      fontAdjustment: 0.8,
    },

    // Expansion cards
    {
      title: "Mystery",
      cardType: gSpecialTypeMystery,
      customRendering: {
        customRenderingImageClasses: ["desk", "right-arrow", "mystery-card"],
        text: "Upon collecting, draw 2 cards from the current deck: keep one, discard Mystery and the other card.",
      },
      playType: "special",
      color: mysteryBackgroundColor,
    },
    {
      title: "Vote",
      cardType: gSpecialTypeVote,
      customRendering: {
        customRenderingImageClasses: ["vote"],
      },
      playType: "special",
      color: voteBackgroundColor,
    },
    {
      title: "Trail Mix",
      cardType: gSpecialTypeTrailMix,
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
      cardType: gSpecialTypeSnack,
      playType: "special",
      color: badNutBackgroundColor,
      customRendering: {
        customRenderingImageClasses: ["discard-2-cards"],
        text: "Upon collecting, discard Snack and two more cards from your Desk.",
      },
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
    customTypes: gCustomTypes,
    customTypesArray: gCustomTypesArray,
    specialTypes: gSpecialTypes,
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
