define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsNutsData",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  cardsNutsData,
  gameInfo,
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const dropShadowClass = "drop_shadow";
  const defaultFontSizePx = 32;

  const collectableItemSize = 55;

  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
  // We already have a parent wrapper.
  // add in a "= n" node and a coin image.
  // Returns nothing.
  function insertSomethingEqualsPointsNode(
    parentNode,
    points,
    opt_pointsPrefix,
  ) {
    debugLog("insertSomethingEqualsPointsNode", "points = ", points);

    console.assert(Number.isInteger(points), "Points must be an integer");
    var pointsString;
    var pointsPrefix = opt_pointsPrefix ? opt_pointsPrefix : "";
    if (points < 0) {
      pointsString = `<div class="negative">${pointsPrefix}${points}</div>`;
    } else {
      pointsString = ` : ${pointsPrefix}${points}`;
    }
    pointsString += gameInfo.coinString;
    htmlUtils.addDiv(
      parentNode,
      ["colon-and-points"],
      "colonAndPoints",
      pointsString,
    );
  }

  // A display of n fixed-sized items
  function addCollectibleItemSetIndicator(parentNode, itemType, itemCount) {
    var collectableItemSetHeightPx = collectableItemSize;

    debugLog(
      "addCollectibleItemSetIndicator",
      "itemType = " + itemType + ", itemCount = " + itemCount,
    );

    if (itemCount == 0) {
      return null;
    }

    var collectableItemSetNode = htmlUtils.addDiv(
      parentNode,
      ["collectable-item-set"],
      "collectable-item-set",
    );

    domStyle.set(collectableItemSetNode, {
      height: `${collectableItemSetHeightPx}px`,
    });

    htmlUtils.addDiv(
      collectableItemSetNode,
      ["set-count"],
      "set-count",
      itemCount,
    );

    htmlUtils.addImage(
      collectableItemSetNode,
      [itemType, "nut", "dark-shadowed"],
      "item",
    );

    return collectableItemSetNode;
  }

  function addCardImage(parent, cardConfig) {
    var imageClass = cardConfig.imageClass;
    var imageCount = cardConfig.imageCount;

    debugLog(
      "addCardImage",
      "Doug: cardConfig = " + JSON.stringify(cardConfig),
    );

    var imageWrapperNode = htmlUtils.addDiv(
      parent,
      ["image-wrapper"],
      "image-wrapper",
    );

    for (var i = 0; i < imageCount; i++) {
      var imageClasses = [
        dropShadowClass,
        "component-image",
        imageClass,
        "image-" + i,
      ];

      htmlUtils.addImage(imageWrapperNode, imageClasses, "image-" + i);
    }
  }

  function addStandardCraftingInfo(parentNode, itemType, itemCount, points) {
    debugLog(
      "addStandardCraftingInfo",
      "itemType = " +
        itemType +
        ", itemCount = " +
        itemCount +
        ", points = " +
        points,
    );
    var craftingNode = htmlUtils.addDiv(
      parentNode,
      ["craft-wrapper", "unbroken-row"],
      "craftWrapper",
    );

    addCollectibleItemSetIndicator(craftingNode, itemType, itemCount);
    insertSomethingEqualsPointsNode(craftingNode, points);
  }

  function maybeAddStandardCraftingInfo(parentNode, cardConfig) {
    var craftingNode = null;
    if (cardConfig.craft) {
      var craftConfig = cardConfig.craft;
      var imageClass = cardConfig.imageClass;
      addStandardCraftingInfo(
        parentNode,
        imageClass,
        craftConfig.number,
        craftConfig.points,
      );
    }
    return craftingNode;
  }

  function addTitleNode(parent, cardConfig) {
    if (cardConfig.title) {
      var titleOuterWrapperNode = htmlUtils.addDiv(
        parent,
        ["title-outer-wrapper"],
        "title-outer-wrapper",
      );
      var titleInnerWrapperNode = htmlUtils.addDiv(
        titleOuterWrapperNode,
        ["title-inner-wrapper"],
        "title-inner-wrapper",
      );

      /*
      var colorIndex = index % cardsNutsData.numCardColors;
      var titleColor = cardsNutsData.cardColors[colorIndex];
      var titleColorLight = cardsNutsData.cardColorsLight[colorIndex];
      */
      var titleBorderColor = cardConfig.color;
      console.assert(
        titleBorderColor,
        "titleBorderColor is null for cardConfig.title = " + cardConfig.title,
      );
      var titleBackgroundColor = htmlUtils.blendHexColors(
        titleBorderColor,
        "#ffffff",
        0.5,
      );

      domStyle.set(titleInnerWrapperNode, {
        "border-color": titleBorderColor,
        background: titleBackgroundColor,
      });

      var titleNode = htmlUtils.addDiv(
        titleInnerWrapperNode,
        ["title"],
        "title",
        cardConfig.title,
      );
      var fontSize = defaultFontSizePx;
      if (cardConfig.fontAdjustment) {
        fontSize = Math.floor(fontSize * cardConfig.fontAdjustment);
      }
      domStyle.set(titleNode, {
        "font-size": `${fontSize}px`,
      });
    }
  }

  function addCardText(parent, cardConfig) {
    if (cardConfig.text) {
      var textNode = htmlUtils.addDiv(
        parent,
        ["card-text"],
        "card-text",
        cardConfig.text,
      );
    }
  }

  function addFields(parent, cardConfig) {
    var mainWrapper = htmlUtils.addDiv(parent, ["main_wrapper"], "mainWapper");
    // These are the icons in upper left and lower corner of card.
    addCardImage(mainWrapper, cardConfig);

    maybeAddStandardCraftingInfo(mainWrapper, cardConfig);

    addTitleNode(parent, cardConfig);
    addCardText(parent, cardConfig);
  }

  function addCardBack(parent) {
    debugLog("addCardBack", "in addCardBack");
    var classes = ["back", "nuts"];
    var backNode = htmlUtils.addCard(parent, classes, "back");

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset");

    var imageNode = htmlUtils.addImage(insetNode, ["squirrel"], "squirrel");

    htmlUtils.addDiv(insetNode, ["title", "small"], "title-small", "Nut");
    htmlUtils.addDiv(insetNode, ["title", "big"], "title-big", "Enuff");

    return backNode;
  }

  function addCardFront(parent, index) {
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: index = " + index,
    );
    var cardConfigs = cardsNutsData.getCardConfigs();
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: cardConfigs = " + JSON.stringify(cardConfigs),
    );

    console.assert(cardConfigs, "cardConfigs is null");
    console.assert(parent, "parent is null");
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    debugLog("addCardFront", "cardConfig = " + JSON.stringify(cardConfig));

    var idElements = ["nuts", index.toString()];
    var id = idElements.join(".");

    var classArray = [];
    classArray.push("nuts");
    classArray.push(cardConfig.cardType);
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    domStyle.set(cardFrontNode, {
      "border-radius": "20px",
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color}`,
    });

    addFields(cardFrontNode, cardConfig);
    return cardFrontNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
