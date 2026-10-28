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
  const gCommonNutInstances = 3;
  const gSpecialNutInstances = 1;

  const gSpecialNutString = "No Bust/No Danger/Flip Again";

  const almondBackgroundColor = "#f98f8f";
  const cashewBackgroundColor = "#a1dbff";
  const hazelnutBackgroundColor = "#dba4ff";
  const pistachioBackgroundColor = "rgb(155, 224, 161)";
  const peanutBackgroundColor = "#f8e6c1";
  const walnutBackgroundColor = "rgb(241, 186, 83)";

  const acornBackgroundColor = "rgb(243, 243, 60)";
  const badNutBackgroundColor = "rgb(88, 88, 88)";

  const gNutTypes = {
    Almond: "almond",
    Cashew: "cashew",
    Hazelnut: "hazelnut",
    Pistachio: "pistachio",
    Peanut: "peanut",
    Walnut: "walnut",
  };

  const gSpecialNutTypes = {
    Acorn: "acorn",
    BadNut: "bad-nut",
  };

  const gNutNames = {
    [gNutTypes.Almond]: "Almond",
    [gNutTypes.Cashew]: "Cashew",
    [gNutTypes.Hazelnut]: "Hazelnut",
    [gNutTypes.Peanut]: "Peanut",
    [gNutTypes.Pistachio]: "Pistachio",
    [gNutTypes.Walnut]: "Walnut",
    [gSpecialNutTypes.Acorn]: "Acorn",
    [gSpecialNutTypes.BadNut]: "Bad Nut",
  };

  const gNutColors = {
    [gNutTypes.Almond]: almondBackgroundColor,
    [gNutTypes.Cashew]: cashewBackgroundColor,
    [gNutTypes.Hazelnut]: hazelnutBackgroundColor,
    [gNutTypes.Pistachio]: pistachioBackgroundColor,
    [gNutTypes.Peanut]: peanutBackgroundColor,
    [gNutTypes.Walnut]: walnutBackgroundColor,
    [gSpecialNutTypes.Acorn]: acornBackgroundColor,
    [gSpecialNutTypes.BadNut]: badNutBackgroundColor,
  };

  const gNutTypesArray = Object.values(gNutTypes);
  const gSpecialNutTypesArray = Object.values(gSpecialNutTypes);

  var gCardConfigs = null;

  function generateCardConfigs() {
    if (gCardConfigs != null) {
      return;
    }

    gCardConfigs = [];
    for (var i = 0; i < gNutTypesArray.length; i++) {
      var nutType = gNutTypesArray[i];
      var config = {
        nutType: nutType,
        title: gNutNames[nutType],
        color: gNutColors[nutType],
        count: gCommonNutInstances,
      };
      gCardConfigs.push(config);
    }

    gCardConfigs.push({
      nutType: gSpecialNutTypes.Acorn,
      title: gNutNames[gSpecialNutTypes.Acorn],
      color: gNutColors[gSpecialNutTypes.Acorn],
      count: gSpecialNutInstances,
      score: 5,
      scoreClass: "gain",
      auxImage: "no-bust-flip-again",
    });
    gCardConfigs.push({
      nutType: gSpecialNutTypes.BadNut,
      title: gNutNames[gSpecialNutTypes.BadNut],
      color: gNutColors[gSpecialNutTypes.BadNut],
      count: gSpecialNutInstances,
      score: -1,
      scoreClass: "loss",
      auxImage: "no-bust-flip-again",
    });

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();

    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    nutTypes: gNutTypes,
    specialNutTypes: gSpecialNutTypes,
    nutTypesArray: gNutTypesArray,
    specialNutTypesArray: gSpecialNutTypesArray,
    nutNames: gNutNames,

    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
