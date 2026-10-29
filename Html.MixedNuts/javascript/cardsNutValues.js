define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsNutValuesData",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, cardsNutValuesData, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var configs = cardsNutValuesData.getCardConfigs();
    var config = cards.getCardConfigAtIndex(configs, index);

    var cardFrontNode = cards.addCardFront(
      parent,
      ["nut-values"],
      "index-" + index,
    );

    console.assert(config.nutTypeArray, "config.nutTypeArray is not defined");
    console.assert(
      config.nutTypeArray.length == cardsNutValuesData.pointsArray.length,
      "config.nutTypeArray length does not match pointValues length",
    );

    var tableNode = htmlUtils.addDiv(
      cardFrontNode,
      ["table"],
      "nut-value-table",
    );

    for (var i = 0; i < config.nutTypeArray.length; i++) {
      var nutType = config.nutTypeArray[i];
      var points = cardsNutValuesData.pointsArray[i];
      var nutColor = gameInfo.nutColors[nutType];

      // Add your logic here to display the nut type and points
      var rowNode = htmlUtils.addDiv(tableNode, ["nut-value-row"], "");
      htmlUtils.styleWithColor(rowNode, nutColor);

      var nutNode = htmlUtils.addImage(rowNode, ["nut", nutType], "nut");
      var pointsNode = htmlUtils.addDiv(
        rowNode,
        ["points"],
        "points",
        ": " + points + gameInfo.coinString,
      );

      if (points == 0) {
        htmlUtils.addDiv(rowNode, ["colon"], "colon", ": ");
        htmlUtils.addImage(rowNode, ["pseudo-image", "no-bust"], "no-bust");
      }
    }
    return cardFrontNode;
  }

  function addCardBack(parent) {
    var classes = ["back", "nut-values"];
    var cardBackNode = htmlUtils.addCard(parent, classes, "back");

    htmlUtils.addDiv(cardBackNode, ["title", "title-0"], "title-0", "Nut");
    htmlUtils.addDiv(cardBackNode, ["title", "title-1"], "title-1", "Values");
    htmlUtils.addDiv(
      cardBackNode,
      ["title", "coin"],
      "coin",
      gameInfo.coinString,
    );

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
