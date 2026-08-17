define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/screentop/seatColors",
  "javascript/cardsFightData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  seatColors,
  cardsFightData,
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
  function addCardFrontNode(parent, cardConfig) {
    var classes = [
      "front",
      "card",
      "fight",
      "player-" + cardConfig.playerIndex,
    ];
    var cardFrontNode = cards.addCardFront(parent, classes, "card-front");

    var niceZoneNode = htmlUtils.addDiv(
      cardFrontNode,
      ["zone", "nice"],
      "nice-zone",
    );

    var niceImageNode = htmlUtils.addImage(
      niceZoneNode,
      ["squirrel-nice"],
      "nice-image",
    );

    var meanZoneNode = htmlUtils.addDiv(
      cardFrontNode,
      ["zone", "mean"],
      "mean-zone",
    );
    var colorFamily = seatColors.getLightColorFamilyForSeat(
      cardConfig.playerIndex,
    );
    domStyle.set(meanZoneNode, {
      background:
        "linear-gradient(" +
        seatColors.lightenedSeatColors[cardConfig.playerIndex] +
        ", " +
        "#fff" +
        ")",
    });

    var meanImageNode = htmlUtils.addImage(
      meanZoneNode,
      ["squirrel-mean"],
      "mean-image",
    );
    var powImageNode = htmlUtils.addImage(meanZoneNode, ["pow"], "pow-image");
    var meanTextNode = htmlUtils.addDiv(
      powImageNode,
      ["mean-text"],
      "mean-text",
      cardConfig.fightLevel.toString(),
    );

    domStyle.set(cardFrontNode, {
      "border-color": seatColors.seatColors[cardConfig.playerIndex],
    });

    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    var cardConfigs = cardsFightData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    return addCardFrontNode(parent, cardConfig);
  }

  function addCardBack(parent, index) {
    var classes = ["back", "card", "fight", "player-" + index];
    var cardBackNode = htmlUtils.addCard(parent, classes, "card-back");

    var imageNode = htmlUtils.addImage(cardBackNode, ["gloves"], "gloves");

    var colorFamily = seatColors.getMediumColorFamilyForSeat(index);
    domStyle.set(cardBackNode, {
      "border-color": colorFamily.border,
      background:
        "linear-gradient(" +
        colorFamily.gradient1 +
        ", " +
        colorFamily.gradient2 +
        ")",
    });

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardBack: addCardBack,
    addCardFrontAtIndex: addCardFrontAtIndex,
  };
});
