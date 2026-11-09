define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/cardsNutsData",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericUtils,
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
  const defaultFontSizePx = 24;

  const collectibleItemSize = 55;

  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
  // A display of n fixed-sized items
  function addCollectibleItemSetIndicator(parentNode, itemType, itemCount) {
    var collectibleItemSetHeightPx = collectibleItemSize;

    debugLog(
      "addCollectibleItemSetIndicator",
      "itemType = " + itemType + ", itemCount = " + itemCount,
    );

    if (itemCount == 0) {
      return null;
    }

    var collectibleItemSetNode = htmlUtils.addDiv(
      parentNode,
      ["collectible-item-set"],
      "collectible-item-set",
    );

    for (var i = 0; i < itemCount; i++) {
      htmlUtils.addImage(
        collectibleItemSetNode,
        [
          itemType,
          "nut",
          "dark-shadowed",
          "collectible-item",
          "index-" + (i % 2),
        ],
        "item + i",
      );
    }

    return collectibleItemSetNode;
  }

  function addCardImageNode(parent, cardConfig) {
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
      var imageClasses = [dropShadowClass, "component-image", imageClass];
      if (imageCount > 1) {
        imageClasses.push("image-" + i);
      }

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
    htmlUtils.addDiv(craftingNode, ["separator"], "separator", "/");
    htmlUtils.addDiv(
      craftingNode,
      ["points"],
      "points",
      points.toString() + gameInfo.coinString,
    );
  }

  function maybeAddStandardCraftingNode(parentNode, cardConfig) {
    var craftingNode = null;
    if (cardConfig.craft && cardConfig.craft.points != 0) {
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

  function addTextNode(parent, cardConfig) {
    if (cardConfig.text) {
      debugLog("addTextNode", "cardConfig = " + JSON.stringify(cardConfig));
      var textNode = htmlUtils.addDiv(
        parent,
        ["text"],
        "text",
        cardConfig.text,
      );
      return textNode;
    }
    return null;
  }

  function addFields(parent, cardConfig) {
    var mainWrapper = htmlUtils.addDiv(parent, ["main-wrapper"], "mainWapper");
    // These are the icons in upper left and lower corner of card.
    addCardImageNode(mainWrapper, cardConfig);
    maybeAddStandardCraftingNode(mainWrapper, cardConfig);
    addTextNode(mainWrapper, cardConfig);

    addTitleNode(parent, cardConfig);
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

  function getBorderColor(cardConfig) {
    if (
      cardConfig.nutType == gameInfo.nutTypes.DoublePeanut ||
      cardConfig.nutType == gameInfo.nutTypes.DoubleAlmond ||
      cardConfig.nutType == gameInfo.nutTypes.DoubleCashew ||
      cardConfig.nutType == gameInfo.nutTypes.DoubleMacadamia
    ) {
      return "#ffed64";
    }

    var nutColor = gameInfo.nutColors[cardConfig.nutType];
    var adjustedColor = genericUtils.darkenColor(nutColor, 50);
    return adjustedColor;
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
    classArray.push(cardConfig.nutType);
    var cardFrontNode = cards.addCardFront(parent, classArray, id);
    var borderColor = getBorderColor(cardConfig);
    domStyle.set(cardFrontNode, {
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color}`,
      "border-color": borderColor,
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
