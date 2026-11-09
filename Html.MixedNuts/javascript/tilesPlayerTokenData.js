define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/screentop/seatColors",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (
  domStyle,
  debugLogModule,
  genericUtils,
  htmlUtils,
  seatColors,
  gameInfo,
) {
  var debugLog = debugLogModule.debugLog;

  function configureDieFace(parent, color) {
    var borderColor = genericUtils.darkenColor(color, 50);

    domStyle.set(parent, {
      background: `radial-gradient(#ffffff 50%, ${color}`,
      "border-color": borderColor,
    });

    htmlUtils.addImage(parent, ["squirrel"], "squirrel");
  }

  function getDiceConfig() {
    var diceConfig = [];
    var dieConfig = {
      classes: ["tiles-player-token"],
      faces: [],
    };
    for (let i = 0; i < gameInfo.maxPlayers; i++) {
      var face = {
        callback: (parent) => {
          var color = seatColors.lightenedSeatColors[i];
          configureDieFace(parent, color);
        },
      };
      dieConfig.faces.push(face);
    }
    diceConfig.push(dieConfig);
    return diceConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDiceConfig: getDiceConfig,
  };
});
