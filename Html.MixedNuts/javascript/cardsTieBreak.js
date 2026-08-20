define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/screentop/seatColors",
  "javascript/cardsTieBreakData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  seatColors,
  cardsTieBreakData,
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
      "tie-break",
      "player-" + cardConfig.playerIndex,
    ];
    var cardFrontNode = cards.addCardFront(parent, classes, "card-front");

    var shareZoneNode = htmlUtils.addDiv(
      cardFrontNode,
      ["zone", "zone-0", "nice"],
      "nice-zone",
    );

    var niceTextNode = htmlUtils.addDiv(
      shareZoneNode,
      ["text"],
      "share-text",
      "Share",
    );
    htmlUtils.addImage(shareZoneNode, ["share"], "share-image");

    var fightZoneNode = htmlUtils.addDiv(
      cardFrontNode,
      ["zone", "zone-1", "fight"],
      "fight-zone",
    );

    htmlUtils.addDiv(fightZoneNode, ["text"], "fight-text", "Fight");
    htmlUtils.addImage(fightZoneNode, ["fight"], "fight-image");

    var colorFamily = seatColors.getLightColorFamilyForSeat(
      cardConfig.playerIndex,
    );
    domStyle.set(cardFrontNode, {
      background:
        "linear-gradient(" +
        seatColors.lightenedSeatColors[cardConfig.playerIndex] +
        ", " +
        "#fff" +
        ")",
    });
    domStyle.set(cardFrontNode, {
      "border-color": seatColors.seatColors[cardConfig.playerIndex],
    });

    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    var cardConfigs = cardsTieBreakData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    return addCardFrontNode(parent, cardConfig);
  }

  function addCardBack(parent, index) {
    var classes = ["back", "card", "tie-break", "player-" + index];
    var cardBackNode = htmlUtils.addCard(parent, classes, "card-back");

    var zoneNode;

    for (var i = 0; i < 2; i++) {
      zoneNode = htmlUtils.addDiv(cardBackNode, ["zone", "zone-" + i], "zone");
      htmlUtils.addDiv(
        zoneNode,
        ["cage-match", "text"],
        "cage-match",
        "Cage<br>Match!",
      );
    }

    var colorFamily = seatColors.getMediumColorFamilyForSeat(index);
    domStyle.set(cardBackNode, {
      "border-color": colorFamily.border,
      background:
        "linear-gradient(" +
        colorFamily.gradient2 +
        ", " +
        colorFamily.gradient1 +
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
