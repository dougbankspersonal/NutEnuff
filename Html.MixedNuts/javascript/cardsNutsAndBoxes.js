define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "javascript/cardsNutsAndBoxesData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  systemConfigs,
  cardsNutsAndBoxesData,
) {
  var debugLog = debugLogModule.debugLog;

  function addPackageZone(parent, packageType) {
    var zoneNode = htmlUtils.addDiv(
      parent,
      ["zone", "package"],
      "package-zone",
    );
    var packageImageNode = htmlUtils.addImage(
      zoneNode,
      ["package", packageType],
      "package-image",
    );
    var textAndRewardNode = htmlUtils.addDiv(
      zoneNode,
      ["text-and-reward"],
      "package-text",
      "<span class=text>" +
        cardsNutsAndBoxesData.packageDetails[packageType].text +
        "</span>" +
        "<span class=colon>: </span>" +
        "<span class=reward>" +
        cardsNutsAndBoxesData.packageDetails[packageType].reward.toString() +
        "</span>" +
        "<span class=coin>" +
        "🪙" +
        "</span>",
    );
    var titleNode = htmlUtils.addDiv(
      zoneNode,
      ["title"],
      "package-title",
      cardsNutsAndBoxesData.packageDetails[packageType].title,
    );
    return zoneNode;
  }

  function addNutZone(parent, nutType) {
    var zoneNode = htmlUtils.addDiv(
      parent,
      ["zone", "nut", nutType],
      "nut-zone",
    );
    var nutImageNode = htmlUtils.addImage(zoneNode, [nutType], "nut-image");
    var titleNode = htmlUtils.addDiv(
      zoneNode,
      ["title"],
      "nut-title",
      cardsNutsAndBoxesData.nutNames[nutType],
    );
    return zoneNode;
  }

  function addCardFront(parent, cardConfig, index) {
    debugLog("addCardFront", "cardConfig = " + JSON.stringify(cardConfig));

    var idElements = ["mixed-nuts-component", index.toString()];
    var id = idElements.join(".");

    var classArray = ["nut-enuff", cardConfig.nutType];
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    domStyle.set(cardFrontNode, {
      "border-radius": "20px",
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color}`,
    });

    addNutZone(cardFrontNode, cardConfig.nutType, index);
    addPackageZone(cardFrontNode, cardConfig.packageType, index);
    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    var cardConfigs = cardsNutsAndBoxesData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    addCardFront(parent, cardConfig, index);
  }

  function addCardBack(parent, index) {
    debugLog("addCardBack", "index = " + index);
    var classes = ["back", "nut-enuff"];
    var backNode = htmlUtils.addCard(parent, classes, "back-" + index);

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset-" + index);

    var imageNode = htmlUtils.addImage(
      insetNode,
      ["squirrel"],
      "mixed-nuts-back-image-" + index,
    );

    htmlUtils.addDiv(
      insetNode,
      ["title", "small"],
      "title-small-" + index,
      "Nut",
    );
    htmlUtils.addDiv(
      insetNode,
      ["title", "big"],
      "title-big-" + index,
      "Enuff",
    );

    return backNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFrontAtIndex: addCardFrontAtIndex,
    addCardBack: addCardBack,
  };
});
