define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/cardsFlipNutsData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericUtils,
  htmlUtils,
  cardsFlipNutsData,
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
  function addCardFront(parent, index) {
    debugLog("addCardFront", "index = " + JSON.stringify(index));

    var cardConfigs = cardsFlipNutsData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    debugLog("addCardFront", "cardConfig = " + JSON.stringify(cardConfig));

    var nutType = cardConfig.nutType;

    var classArray = ["flip-nuts", nutType];
    if (cardConfig.auxImage !== undefined) {
      classArray.push("special");
    }
    var id = "flip-nuts-" + index;
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    debugLog(
      "addCardFront",
      "cardFrontNode = " + JSON.stringify(cardFrontNode),
    );

    // card styling.
    var borderColor = genericUtils.darkenColor(cardConfig.color, 50);
    domStyle.set(cardFrontNode, {
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color})`,
      "border-color": borderColor,
    });

    // Title
    htmlUtils.addDiv(
      cardFrontNode,
      ["title"],
      "title-" + index,
      cardConfig.title,
    );

    // top, center images.
    var positionalClasses = ["top", "center"];
    for (var i = 0; i < positionalClasses.length; i++) {
      var positionalClass = positionalClasses[i];
      var imageClasses = [positionalClass, nutType, "flip-nut"];
      htmlUtils.addImage(
        cardFrontNode,
        imageClasses,
        positionalClass + "-" + index,
      );
    }

    // Score, if present.
    if (cardConfig.score !== undefined) {
      var classes = ["score"];
      if (cardConfig.scoreClass != undefined) {
        classes.push(cardConfig.scoreClass);
      }
      htmlUtils.addDiv(
        cardFrontNode,
        classes,
        "score-" + index,
        cardConfig.score + "🪙",
      );
    }

    // Text, if present.
    if (cardConfig.auxImage !== undefined) {
      htmlUtils.addImage(
        cardFrontNode,
        ["aux-image", cardConfig.auxImage],
        "auxImage-" + index,
      );
    }
    return cardFrontNode;
  }

  function addCardBack(parent) {
    var classes = ["back", "flip-nuts"];
    var backNode = htmlUtils.addCard(parent, classes, "back");

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"]);

    var imageNode = htmlUtils.addImage(
      insetNode,
      ["new-squirrel"],
      "new-squirrel",
    );

    htmlUtils.addDiv(insetNode, ["title", "small"], "title-small", "Nut");
    htmlUtils.addDiv(insetNode, ["title", "big"], "title-big", "Enuff");

    return backNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
