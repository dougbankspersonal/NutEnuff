define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------

  const peanutBackgroundColor = "#ffe7bb";
  const almondBackgroundColor = "#f98f8f";
  const cashewBackgroundColor = "#a1dbff";
  const macadamiaBackgroundColor = "#dba4ff";
  const pistachioBackgroundColor = "rgb(168, 225, 193)";

  const gPeanut = "peanut";
  const gAlmond = "almond";
  const gCashew = "cashew";
  const gMacadamia = "macadamia";
  const gPistachio = "pistachio";

  const gNutTypes = {
    Peanut: gPeanut,
    Almond: gAlmond,
    Cashew: gCashew,
    Macadamia: gMacadamia,
    Pistachio: gPistachio,
  };

  const gNutNames = {
    [gPeanut]: "Peanut",
    [gAlmond]: "Almond",
    [gCashew]: "Cashew",
    [gMacadamia]: "Macadamia",
    [gPistachio]: "Pistachio",
  };

  const gNutTypesArray = Object.values(gNutTypes);

  const gThreeOfAKind = "package-0";
  const gTwoPair = "package-1";
  const gFourDifferent = "package-2";
  const gTwoAndThree = "package-3";
  const gFiveDifferent = "package-4";
  const gFourOfAKind = "package-5";
  const gFiveOfAKind = "package-6";

  const gPackageTypes = {
    ThreeOfAKind: gThreeOfAKind,
    TwoPair: gTwoPair,
    FourDifferent: gFourDifferent,
    TwoAndThree: gTwoAndThree,
    FiveDifferent: gFiveDifferent,
    FourOfAKind: gFourOfAKind,
    FiveOfAKind: gFiveOfAKind,
  };

  const gPackageTypesArray = Object.values(gPackageTypes);

  const gPackageDetails = {
    [gThreeOfAKind]: {
      title: "The Mini",
      text: "3",
      reward: 4,
    },
    [gTwoPair]: {
      title: "The Double-Double",
      text: "2/2",
      reward: 5,
    },
    [gFourDifferent]: {
      title: "The Quartet",
      text: "1/1/1/1",
      reward: 5,
    },
    [gTwoAndThree]: {
      title: "The Full House",
      text: "2/3",
      reward: 6,
    },
    [gFiveDifferent]: {
      title: "The Full Sampler",
      text: "1/1/1/1/1",
      reward: 7,
    },
    [gFourOfAKind]: {
      title: "The Junior Jumbo",
      text: "4",
      reward: 8,
    },
    [gFiveOfAKind]: {
      title: "The Super Jumbo",
      text: "5",
      reward: 11,
    },
  };

  var gSetupCalled = false;
  var gCardConfigs = [];
  var gNumCopies = 2;

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

  function setupCardConfigs() {
    console.assert(
      !gSetupCalled,
      "setupCardConfigs should only be called once",
    );
    gSetupCalled = true;
    gCardConfigs = [];

    for (var i = 0; i < gNutTypesArray.length; i++) {
      for (var j = 0; j < gPackageTypesArray.length; j++) {
        for (var k = 0; k < gNumCopies; k++) {
          var config = {
            nutType: gNutTypesArray[i],
            packageType: gPackageTypesArray[j],
          };
          gCardConfigs.push(config);
        }
      }
    }
    return gCardConfigs;
  }

  function getNumCards() {
    return gCardConfigs.length;
  }

  // This returned object becomes the defined value of this module
  return {
    nutTypes: gNutTypes,
    nutNames: gNutNames,
    packageTypes: gPackageTypes,
    packageDetails: gPackageDetails,

    setupCardConfigs: setupCardConfigs,
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
