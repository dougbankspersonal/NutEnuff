define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsNutsAndBoxesData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  cardsNutsAndBoxesData,
) {
  var debugLog = debugLogModule.debugLog;

  function addPackageZone(parent, packageType) {
    var zoneNode = htmlUtils.addDiv(
      parent,
      ["zone", "package", packageType],
      "package-zone",
    );
    htmlUtils.addImage(zoneNode, ["package", packageType], "package-image");
    htmlUtils.addDiv(
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
    htmlUtils.addDiv(
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
    htmlUtils.addImage(zoneNode, [nutType], "nut-image");
    htmlUtils.addDiv(
      zoneNode,
      ["title"],
      "nut-title",
      cardsNutsAndBoxesData.nutNames[nutType],
    );
    return zoneNode;
  }

  function addCardFront(parent, cardConfig, index) {
    debugLog("addCardFront", "cardConfig = " + JSON.stringify(cardConfig));

    var idElements = ["nuts", index.toString()];
    var id = idElements.join(".");

    var classArray = ["nut-enuff", cardConfig.nutType, cardConfig.packageType];
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    domStyle.set(cardFrontNode, {
      "border-radius": "20px",
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color}`,
    });

    addNutZone(cardFrontNode, cardConfig.nutType);
    addPackageZone(cardFrontNode, cardConfig.packageType);
    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    var cardConfigs = cardsNutsAndBoxesData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    addCardFront(parent, cardConfig, index);
  }

  function addCardBack(parent, index) {
    debugLog("addCardBack", "NE parent = " + JSON.stringify(parent));
    debugLog("addCardBack", "NE index = " + index);
    var classes = ["back", "nut-enuff"];
    var backNode = htmlUtils.addCard(parent, classes, "back-" + index);
    debugLog("addCardBack", "NE backNode = " + JSON.stringify(backNode));

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset-" + index);

    htmlUtils.addImage(
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

    debugLog("addCardBack", "NE returning = " + JSON.stringify(backNode));
    return backNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFrontAtIndex: addCardFrontAtIndex,
    addCardBack: addCardBack,
  };
});
