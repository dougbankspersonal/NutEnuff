define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (domStyle, debugLogModule, genericUtils, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  function colorDiv(parent, color) {
    var borderColor = genericUtils.darkenColor(color, 50);

    domStyle.set(parent, {
      background: `radial-gradient(#ffffff 50%, ${color}`,
      "border-color": borderColor,
    });
  }

  function addDiscardFace(parent) {
    colorDiv(parent, "#bbbbbb");
    htmlUtils.addImage(parent, ["discard"], "discard");
    htmlUtils.addDiv(parent, ["reward"], "reward", "-1" + gameInfo.coinString);

    htmlUtils.addDiv(parent, ["counter-box"], "counter-box");
  }

  function configureDieFace(parent, nutType) {
    colorDiv(parent, gameInfo.nutColors[nutType]);

    htmlUtils.addImage(parent, ["package"], "package");
    htmlUtils.addImage(parent, ["nut", nutType], "nut");
    htmlUtils.addDiv(
      parent,
      ["reward"],
      "reward",
      gameInfo.getCraftPoints(nutType) + gameInfo.coinString,
    );
    htmlUtils.addDiv(parent, ["counter-box"], "counter-box");
  }

  function getDiceConfig() {
    var diceConfig = [];

    var queryParams = genericUtils.getCommonQueryParams();
    var isScreentop = queryParams.isScreentop;
    var dieCount;
    if (isScreentop) {
      dieCount = 1;
    } else {
      dieCount = 2;
    }

    const nutsWithPackageCounters = [
      gameInfo.nutTypes.Peanut,
      gameInfo.nutTypes.Almond,
      gameInfo.nutTypes.Cashew,
      gameInfo.nutTypes.Macadamia,
      gameInfo.nutTypes.Walnut,
    ];

    for (let i = 0; i < dieCount; i++) {
      var dieConfig = {};
      dieConfig.classes = ["ctr-counter-package", "index-" + i];
      var faces = [];
      for (let j = 0; j < nutsWithPackageCounters.length; j++) {
        let nutType = nutsWithPackageCounters[j];
        faces.push({
          callback: (parent) => {
            configureDieFace(parent, nutType);
          },
        });
      }
      faces.push({
        callback: (parent) => {
          addDiscardFace(parent);
        },
      });

      dieConfig.faces = faces;
      diceConfig.push(dieConfig);
    }
    return diceConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDiceConfig: getDiceConfig,
  };
});
