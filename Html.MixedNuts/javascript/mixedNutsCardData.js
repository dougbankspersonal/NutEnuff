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
  const gUseUniformDeckConfig = true;

  const basicBorderColor = "#5c4033";
  const macadamiaBorderColor = "#2c1810";
  const badNutBorderColor = "#aa3002";
  const specialBorderColor = "#ffee00";

  const peanutBackgroundColor = "#f5deb3";
  const almondBackgroundColor = "#deb887";
  const cashewBackgroundColor = "#d2a679";
  const macadamiaBackgroundColor = "#a9745d";
  const badNutBackgroundColor = "#e6b3a1";

  const wrappingPaperBackgroundColor = "#FF8844";
  const elfMagicBackgroundColor = "#FF8888";
  const broomBackgroundColor = "#FFFF88";
  const glovesBackgroundColor = "#FF4488";
  const cyborgBackgroundColor = "#FF88FF";
  const coffeeBreakBackgroundColor = "#884444";
  const satinBackgroundColor = "#FFCC44";

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

  const gNutTypePeanut = "peanut";
  const gNutTypeAlmond = "almond";
  const gNutTypeCashew = "cashew";
  const gNutTypeMacadamia = "macadamia";

  const gNutTypes = {
    Peanut: gNutTypePeanut,
    Almond: gNutTypeAlmond,
    Cashew: gNutTypeCashew,
    Macadamia: gNutTypeMacadamia,
  };

  const gNutTypesArray = Object.keys(gNutTypes);

  const gSpecialTypeHoneyRoasted = "honey-roasted";
  const gSpecialTypeRaisin = "raisin";
  const gSpecialTypeGloves = "gloves";
  const gSpecialTypeMixedNuts = "mixed-nuts";
  const gSpecialTypeCoffeeBreak = "coffee-break";
  const gSpecialTypeHotSpice = "hot-spice";

  const gSpecialTypes = {
    HoneyRoasted: gSpecialTypeHoneyRoasted,
    Raisin: gSpecialTypeRaisin,
    Gloves: gSpecialTypeGloves,
    MixedNuts: gSpecialTypeMixedNuts,
    CoffeeBreak: gSpecialTypeCoffeeBreak,
    HotSpice: gSpecialTypeHotSpice,
  };

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
  const gSpecialCardCount = gCountPerSpecialCard * gSpecialTypesArray.length;

  const gLeftoverCardCount = 5;
  const gNutCardCount =
    gLeftoverCardCount + gDeckTotalMin - gBadNutCount - gSpecialCardCount;
  // This should be divided amoung the nut types but not evenly: cheaper nuts get more cards.
  // Working backwards: 4 possible macadamia packages, plus 3 slop.
  const gMacadamiaCardCount = 19;
  // Then the rest just do some kinda scaling.
  const gNonSpecialNutCardCount = gNutCardCount - gMacadamiaCardCount;
  const gPeanutCardCount = Math.floor(gNonSpecialNutCardCount * 0.4);
  const gAlmondCardCount = Math.floor(gNonSpecialNutCardCount * 0.3333);
  const gCashewCardCount = Math.floor(gNonSpecialNutCardCount * 0.2666);

  const gNutClassToCardCount = {
    [gNutTypes.Peanut]: gPeanutCardCount,
    [gNutTypes.Almond]: gAlmondCardCount,
    [gNutTypes.Cashew]: gCashewCardCount,
    [gNutTypes.Macadamia]: gMacadamiaCardCount,
  };

  const gNutClassToDenominatorMap = {
    [gNutTypes.Peanut]: 3,
    [gNutTypes.Almond]: 3.8,
    [gNutTypes.Cashew]: 4.6,
    [gNutTypes.Macadamia]: 6.2,
  };

  const gConfiguredDeckSpecialCounts = [
    {
      numPlayers: 2,
      count: 1,
    },
    {
      numPlayers: 3,
      count: 2,
    },
    {
      numPlayers: 4,
      count: 3,
    },
    {
      numPlayers: 5,
      count: 3,
    },
  ];

  const gUniformDeckSpecialCounts = [
    {
      count: gCountPerSpecialCard,
    },
  ];

  const gConfiguredDeckBadCounts = [
    {
      numPlayers: 2,
      count: 1,
    },
    {
      numPlayers: 3,
      count: 2,
    },
    {
      numPlayers: 4,
      count: 3,
    },
    {
      numPlayers: 5,
      count: 3,
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

  function generateNutCardDistribution(cardConfig) {
    var retVal = [];
    if (gUseUniformDeckConfig) {
      var count = gNutClassToCardCount[cardConfig.class];
      console.assert(
        count > 0,
        "generateNutCardDistribution: unexpected count for class " +
          cardConfig.class
      );
      retVal.push({
        count: count,
      });
    } else {
      var denominator = gNutClassToDenominatorMap[cardConfig.class];
      console.assert(
        denominator > 0,
        "generateNutCardDistribution: unexpected denominator for class " +
          cardConfig.class
      );
      for (var i = gMinPlayers; i <= gMaxPlayers; i++) {
        retVal.push({
          numPlayers: i,
          count: Math.ceil(totalCardsPerPlayer(i) / denominator),
        });
      }
    }
    return retVal;
  }

  function generateBadCardDistribution() {
    if (gUseUniformDeckConfig) {
      return gUniformDeckBadCounts;
    } else {
      return gConfiguredDeckBadCounts;
    }
  }

  function generateSpecialCardDistribution() {
    if (gUseUniformDeckConfig) {
      return gUniformDeckSpecialCounts;
    } else {
      return gConfiguredDeckSpecialCounts;
    }
  }

  const gSharedDeckConfigs = [
    {
      title: "Peanut",
      class: "peanut",
      craft: {
        number: 3,
        points: 2,
      },
      playType: "nut",
      color: peanutBackgroundColor,
      borderColor: basicBorderColor,
    },
    {
      title: "Almond",
      class: "almond",
      color: almondBackgroundColor,
      borderColor: basicBorderColor,
      craft: {
        number: 3,
        points: 3,
      },
      playType: "nut",
    },
    {
      title: "Cashew",
      class: "cashew",
      color: cashewBackgroundColor,
      borderColor: basicBorderColor,

      craft: {
        number: 3,
        points: 4,
      },
      playType: "nut",
    },
    {
      title: "Macadamia",
      class: "macadamia",
      color: macadamiaBackgroundColor,
      borderColor: macadamiaBorderColor,
      craft: {
        number: 4,
        points: 7,
      },
      playType: "nut",
      fontAdjustment: 0.8,
    },
    {
      title: "Bad Nut",
      class: "bad-nut",
      craft: {
        number: 0,
        points: 0,
      },
      floor: -2,
      playType: "bad",
      color: badNutBackgroundColor,
      borderColor: badNutBorderColor,
    },
    {
      title: "Honey Roasted",
      class: "honey-roasted",
      customRendering: {
        useClassToIndexFunction: true,
        nutToBonusMap: {
          peanut: 1,
          almond: 2,
          cashew: 3,
          macadamia: 4,
        },
        wrapperScale: 0.6,
      },
      playType: "special",
      color: wrappingPaperBackgroundColor,
      borderColor: specialBorderColor,
    },
    {
      title: "Raisin",
      class: "raisin",
      customRendering: {
        customRenderingImageClasses: ["peanut", "almond", "cashew"],
        specialImagesSeparator: "/",
      },
      playType: "special",
      color: elfMagicBackgroundColor,
      borderColor: specialBorderColor,
    },
    {
      title: "Gloves",
      class: "gloves",
      playType: "special",
      customRendering: {
        customRenderingImageClasses: ["floor", "right-arrow", "desk"],
      },
      color: glovesBackgroundColor,
      borderColor: specialBorderColor,
    },
    {
      title: "Mixed Nuts",
      class: "mixed-nuts",
      customRendering: {
        points: 5,
        useClassToIndexFunction: true,
        wrapperScale: 0.8,
      },
      playType: "special",
      color: cyborgBackgroundColor,
      borderColor: specialBorderColor,
    },
    {
      title: "Coffee Break",
      class: "coffee-break",
      customRendering: {
        customRenderingImageClasses: ["desk", "double-arrow", "desk"],
      },
      playType: "special",
      color: coffeeBreakBackgroundColor,
      borderColor: specialBorderColor,
    },
    {
      title: "Hot Spice",
      class: "hot-spice",
      customRendering: {
        points: 1,
        useClassToIndexFunction: true,
      },
      playType: "special",
      color: satinBackgroundColor,
      borderColor: specialBorderColor,
    },

    /* Deprecated.
    Squirrel: hard to say if it's good or bad.  Seems like with exploding cards almost always
    good.
    Broom: since stuff on floor is at most 2 points it's just not that interesting.

    {
      title: "Squirrel",
      class: "squirrel",
      playType: "bad",
      color: badNutBackgroundColor,
      borderColor: badNutBorderColor,
      customRendering: {
        customRenderingImageClasses: ["discard-nut-n-times"],
      },
    },
    {
      title: "Broom",
      class: "broom",
      customRendering: {
        customRenderingImageClasses: ["floor", "right-arrow", "no-symbol"],
      },
      playType: "special",
      color: broomBackgroundColor,
      borderColor: specialBorderColor,
    },
    */
  ];

  var gCardConfigs;

  function addCountConfigInfo() {
    for (var cardConfig of gCardConfigs) {
      if (cardConfig.playType === "nut") {
        cardConfig.countConfigs = generateNutCardDistribution(cardConfig);
      } else if (cardConfig.playType === "bad") {
        cardConfig.countConfigs = generateBadCardDistribution();
      } else {
        cardConfig.countConfigs = generateSpecialCardDistribution();
      }
    }
  }

  var gSetupCalled = false;
  function setupCardConfigs() {
    console.assert(!gSetupCalled, "setupCardConfigs called more than once");
    gSetupCalled = true;
    // Must be done before doing anything else.
    //    gCardConfigs = structuredClone(gUniformDeckCardConfigs);
    gCardConfigs = structuredClone(gSharedDeckConfigs);

    addCountConfigInfo(gCardConfigs);

    for (var cardConfig of gCardConfigs) {
      var lastIndex = cardConfig.countConfigs.length - 1;
      cardConfig.count = cardConfig.countConfigs[lastIndex].count;
    }
  }

  function getCardConfigs() {
    console.assert(gSetupCalled, "setupCardConfigs not called yet");

    debugLog("getCardConfigs", "gCardConfigs:", JSON.stringify(gCardConfigs));
    debugLog("getCardConfigs", "gDeckTotalMin:", gDeckTotalMin);
    debugLog(
      "getCardConfigs",
      "number of cards: ",
      cards.getNumCardsFromConfigs(gCardConfigs)
    );
    return gCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    customTypes: gCustomTypes,
    customTypesArray: gCustomTypesArray,

    setupCardConfigs: setupCardConfigs,
    totalCardsPerPlayer: totalCardsPerPlayer,
    getCardConfigs: getCardConfigs,
  };
});
