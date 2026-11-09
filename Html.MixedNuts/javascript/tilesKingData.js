define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (domStyle, debugLogModule, genericUtils, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  function configureDieFace(parent, nutType) {
    var color = gameInfo.nutColors[nutType];
    var borderColor = genericUtils.darkenColor(color, 50);

    domStyle.set(parent, {
      background: `radial-gradient(#ffffff 50%, ${color}`,
      "border-color": borderColor,
    });

    htmlUtils.addImage(parent, ["crown"], "crown");
    htmlUtils.addImage(parent, ["nut", nutType], "nut");
    htmlUtils.addDiv(
      parent,
      ["reward"],
      "reward",
      gameInfo.getKingPoints(nutType) + gameInfo.coinString,
    );
  }

  function getDiceConfig() {
    var diceConfig = [];

    var dieCount;
    var queryParams = genericUtils.getCommonQueryParams();
    var isScreentop = queryParams.isScreentop;
    var dieClasses = ["tiles-king"];
    if (isScreentop) {
      dieCount = 1;
    } else {
      dieCount = 5;
    }

    for (var i = 0; i < dieCount; i++) {
      var dieConfig = {};
      dieConfig.classes = dieClasses;
      if (queryParams)
        dieConfig.faces = [
          {
            callback: (parent) => {
              configureDieFace(parent, gameInfo.nutTypes.Peanut);
            },
          },
          {
            callback: (parent) => {
              configureDieFace(parent, gameInfo.nutTypes.Almond);
            },
          },
          {
            callback: (parent) => {
              configureDieFace(parent, gameInfo.nutTypes.Cashew);
            },
          },
          {
            callback: (parent) => {
              configureDieFace(parent, gameInfo.nutTypes.Macadamia);
            },
          },
          {
            callback: (parent) => {
              configureDieFace(parent, gameInfo.nutTypes.Walnut);
            },
          },
        ];

      diceConfig.push(dieConfig);
    }
    return diceConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDiceConfig: getDiceConfig,
  };
});
