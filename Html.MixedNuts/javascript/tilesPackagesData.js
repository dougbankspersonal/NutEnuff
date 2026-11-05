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

    htmlUtils.addImage(parent, ["package"], "package");
    htmlUtils.addImage(parent, ["nut", nutType], "nut");
    htmlUtils.addDiv(
      parent,
      ["reward"],
      "reward",
      gameInfo.getCraftPoints(nutType) + gameInfo.coinString,
    );
  }

  function getDiceConfig() {
    var diceConfig = [];

    var dieConfig = {};
    dieConfig.classes = ["tiles-packages"];
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
    return diceConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDiceConfig: getDiceConfig,
  };
});
