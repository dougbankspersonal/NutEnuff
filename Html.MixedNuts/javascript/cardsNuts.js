define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsNutsData",
  "dojo/domReady!",
], function (domStyle, cards, debugLogModule, htmlUtils, cardsNutsData) {
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
    console.assert(Number.isInteger(points), "Points must be an integer");
    var pointsString;
    var pointsPrefix = opt_pointsPrefix ? opt_pointsPrefix : "";
    if (points < 0) {
      pointsString = ` :&nbsp;<div class="negative">${pointsPrefix}${points}</div>`;
    } else {
      pointsString = ` : ${pointsPrefix}${points}`;
    }
    pointsString += "🪙";
    htmlUtils.addDiv(
      parentNode,
      ["colon-and-points"],
      "colonAndPoints",
      pointsString,
    );
  }

  function insertTextNode(parentNode, text) {
    return htmlUtils.addDiv(parentNode, ["text-node"], "textNode", text);
  }

  function renderAcornCustom(parentNode, customRendering) {
    var craftingNode = htmlUtils.addDiv(
      parentNode,
      ["craft-wrapper", "unbroken-row"],
      "craftWrapper",
    );

    addNthSpecialImage(craftingNode, "desk", 0);
    insertSomethingEqualsPointsNode(craftingNode, customRendering.points);
  }

  function renderWalnutCustom(parentNode, _) {
    debugLog("renderWalnutCustom", "Rendering walnut custom");

    for (var i = 0; i < 5; i++) {
      var itemCount = i + 1;
      var points = (itemCount * (itemCount + 1)) / 2;
      addStandardCraftingInfo(
        parentNode,
        cardsNutsData.itemTypes.Walnut,
        itemCount,
        points,
      );
    }
  }

  function renderTrailMixCustom(parentNode, customRendering) {
    insertTextNode(parentNode, customRendering.customText);
    var pointsArray = customRendering.pointsArray;
    for (var i = 0; i < pointsArray.length; i++) {
      var pointsClause = pointsArray[i];
      var itemCount = pointsClause.cards;
      var points = pointsClause.points;
      var wrapperNode = htmlUtils.addDiv(
        parentNode,
        ["craft-wrapper", "unbroken-row"],
        "craftWrapper",
      );
      htmlUtils.addDiv(
        wrapperNode,
        ["trail-mix-card-count"],
        "trailMixCardCount",
        itemCount + " Nuts",
      );
      insertSomethingEqualsPointsNode(wrapperNode, points);
    }
  }

  const gCustomRenderersByClass = {
    [cardsNutsData.itemTypes.Walnut]: renderWalnutCustom,
    [cardsNutsData.itemTypes.Acorn]: renderAcornCustom,
    [cardsNutsData.itemTypes.TrailMix]: renderTrailMixCustom,
  };

  function maybeAddSpacer(parent, opt_index, opt_separator) {
    var separator = opt_separator ? opt_separator : "&nbsp;";

    if (separator && opt_index && opt_index > 0) {
      htmlUtils.addDiv(
        parent,
        ["special-image_spacer"],
        "specialImageSpacer",
        separator,
      );
    }
  }

  function addCollectableItem(parent, itemType) {
    var node = htmlUtils.addImage(
      parent,
      ["collectable-item", itemType],
      "collectable-item",
    );
    domStyle.set(node, {
      height: `${collectableItemSize}px`,
      width: `${collectableItemSize}px`,
    });
    return node;
  }

  function addNthSpecialImage(
    imagesWrapper,
    specialImageClass,
    opt_index,
    opt_separator,
  ) {
    maybeAddSpacer(imagesWrapper, opt_index, opt_separator);

    if (specialImageClass == "card") {
      addCollectableItem(imagesWrapper);
    } else {
      htmlUtils.addImage(
        imagesWrapper,
        ["special-image", specialImageClass, "dark-shadowed"],
        "specialImage",
      );
    }
  }

  function addCustomRendering(parentNode, cardConfig) {
    debugLog("addCustomRendering", "cardConfig = ", JSON.stringify(cardConfig));
    var customRendering = cardConfig.customRendering;
    console.assert(customRendering, "customRendering is null");

    var classes = cardsNutsData.getClassesForCardConfig(cardConfig);
    classes = classes.concat(["custom-rendering-wrapper"]);
    var customRenderingWrapperNode = htmlUtils.addDiv(
      parentNode,
      classes,
      "custom-rendering-wrapper",
    );

    if (customRendering.useClassToIndexFunction) {
      var customRenderer = gCustomRenderersByClass[cardConfig.cardType];
      console.assert(
        customRenderer != null,
        "No custom renderer for " + cardConfig.cardType,
      );
      customRenderer(customRenderingWrapperNode, customRendering);
    } else {
      if (customRendering.customRenderingImageClasses) {
        var customRenderingImagesNode = htmlUtils.addDiv(
          customRenderingWrapperNode,
          ["custom-rendering-images"],
          "customRenderingImages",
        );
        for (
          var i = 0;
          i < customRendering.customRenderingImageClasses.length;
          i++
        ) {
          addNthSpecialImage(
            customRenderingImagesNode,
            customRendering.customRenderingImageClasses[i],
            i,
            customRendering.specialImagesSeparator,
          );
        }
      }
    }

    if (customRendering.text) {
      insertTextNode(customRenderingWrapperNode, customRendering.text);
    }

    debugLog(
      "addCustomRendering",
      "customRendering = ",
      JSON.stringify(customRendering),
    );
    debugLog(
      "addCustomRendering",
      "customRendering.wrapperScale = ",
      JSON.stringify(customRendering.wrapperScale),
    );
    if (customRendering.wrapperScale) {
      var scale = customRendering.wrapperScale;
      debugLog("addCustomRendering", "scale = ", JSON.stringify(scale));
      domStyle.set(customRenderingWrapperNode, {
        zoom: `${scale}`,
      });
    }

    return customRenderingWrapperNode;
  }

  var starterIconsAdded = 0;
  function addStarterIcons(parent) {
    starterIconsAdded += 1;
    var text = "Player " + starterIconsAdded;
    return htmlUtils.addDiv(parent, ["starter-text"], "starterText", text);
  }

  // A display of n fixed-sized items
  function addCollectibleItemSetIndicator(parentNode, itemType, itemCount) {
    var collectableItemSetHeightPx = collectableItemSize;

    console.assert(itemCount > 0, "Item count must be defined");

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
    var imageClass = cardConfig.itemType
      ? cardConfig.itemType
      : cardConfig.cardType;
    debugLog(
      "addCardImage",
      "Doug: cardConfig = " + JSON.stringify(cardConfig),
    );
    debugLog(
      "addCardImage",
      "cornerClass = " +
        imageClass +
        " for cardConfig.title = " +
        cardConfig.title,
    );

    var cardConfigClasses = cardsNutsData.getClassesForCardConfig(cardConfig);
    cardConfigClasses = cardConfigClasses.concat(["image-wrapper"]);
    var imageWrapperNode = htmlUtils.addDiv(
      parent,
      cardConfigClasses,
      "image-wrapper",
    );

    var classes = [dropShadowClass, "component-image"];

    var index0Classes = [...classes, imageClass, "index0"];
    if (cardConfig.extraImage) {
      index0Classes.push("first");
    }

    htmlUtils.addImage(
      imageWrapperNode,
      index0Classes,
      "component-image-first",
    );

    if (cardConfig.extraImage) {
      var index0Classes = [
        ...classes,
        cardConfig.extraImage,
        "index0",
        "second",
      ];
      htmlUtils.addImage(
        imageWrapperNode,
        index0Classes,
        "component-image-second",
      );
    }
  }

  function addCannotBeCraftedNode(parent) {
    var cannotBeCraftedNode = htmlUtils.addDiv(
      parent,
      ["cannot-be-crafted"],
      "cannotBeCrafted",
    );
    var deskNode = htmlUtils.addImage(
      cannotBeCraftedNode,
      ["desk", "dark-shadowed"],
      "desk",
    );
    htmlUtils.addImage(cannotBeCraftedNode, ["no-symbol"], "no-symbol");
    return cannotBeCraftedNode;
  }

  function addStandardCraftingInfo(parentNode, itemType, itemCount, points) {
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
      if (craftConfig.number > 0) {
        var itemType = cardConfig.itemType
          ? cardConfig.itemType
          : cardConfig.cardType;
        addStandardCraftingInfo(
          parentNode,
          itemType,
          craftConfig.number,
          craftConfig.points,
        );
      } else {
        craftingNode = addCannotBeCraftedNode(parentNode);
      }
    }
    return craftingNode;
  }

  function maybeAddStandardFloorPenalty(parentNode, cardConfig) {
    if (cardConfig.floor) {
      var floorWrapperNode = htmlUtils.addDiv(
        parentNode,
        ["floor_wrapper", "unbroken-row"],
        "floorWrapper",
      );
      var floorImageNode = htmlUtils.addImage(
        floorWrapperNode,
        ["floor"],
        "floor",
      );
      insertSomethingEqualsPointsNode(floorWrapperNode, cardConfig.floor);
    }
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

  function addFields(parent, cardConfig, index, indexWithinConfig) {
    var mainWrapper = htmlUtils.addDiv(parent, ["main_wrapper"], "mainWapper");
    // These are the icons in upper left and lower corner of card.
    addCardImage(mainWrapper, cardConfig);

    maybeAddStandardCraftingInfo(mainWrapper, cardConfig);

    maybeAddStandardFloorPenalty(mainWrapper, cardConfig);

    if (cardConfig.customRendering) {
      addCustomRendering(mainWrapper, cardConfig);
    }

    if (cardConfig.deckId == "starter") {
      addStarterIcons(mainWrapper);
    }

    addTitleNode(parent, cardConfig);
  }

  function addCardBack(parent, index, title, extraClasses) {
    debugLog("addCardBack", "index = " + index);
    var classes = extraClasses
      ? ["back", "mixed-nuts", ...extraClasses]
      : ["back", "mixed-nuts"];
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

    htmlUtils.addDiv(insetNode, ["shift"], "shift-" + index, title);

    return backNode;
  }

  function addCardFront(parent, cardConfig, index, opt_indexWithinConfig) {
    debugLog("addCardFront", "cardConfig = " + JSON.stringify(cardConfig));

    var indexWithinConfig =
      opt_indexWithinConfig !== undefined ? opt_indexWithinConfig : 0;

    var idElements = ["mixed-nuts-component", index.toString()];
    var id = idElements.join(".");

    var classArray = [];
    classArray.push("mixed-nuts-component");
    classArray.push(cardConfig.cardType);
    classArray.push(cardConfig.deckId);
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    domStyle.set(cardFrontNode, {
      "border-radius": "20px",
      background: `radial-gradient(#ffffff 50%, ${cardConfig.color}`,
    });

    addFields(cardFrontNode, cardConfig, index, indexWithinConfig);
    return cardFrontNode;
  }

  function addTrailMixCard(parent) {
    var trailMixConfig = cardsNutsData.getConfigForCardType(
      cardsNutsData.itemTypes.TrailMix,
    );

    return addCardFront(parent, trailMixConfig, "trail-mix", 0);
  }

  function addCardFrontAtIndex(parent, index) {
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
    debugLog(
      "addCardFrontAtIndex",
      "cardConfig = " + JSON.stringify(cardConfig),
    );

    var indexWithinConfig = cards.getIndexWithinConfig(cardConfigs, index);

    addCardFront(parent, cardConfig, index, indexWithinConfig);
  }

  var gNumCards = 0;
  function getNumCards() {
    // Wait until we're asked to calculate so system configs can be applied.
    if (gNumCards === 0) {
      for (var cardConfig of cardsNutsData.getCardConfigs()) {
        debugLog("getNumCards", "Doug: cardConfig.title = " + cardConfig.title);
        debugLog(
          "getNumCards",
          "Doug: countConfigs = " + JSON.stringify(cardConfig.countConfigs),
        );
      }

      gNumCards = cards.getNumCardsFromConfigs(cardsNutsData.getCardConfigs());
      debugLog("getNumCards", "Doug: gNumCards = " + gNumCards);
      console.assert(gNumCards > 0, "gNumCards must be greater than 0");
    }
    return gNumCards;
  }

  function getCardConfigByTitle(title) {
    var cardConfigs = cardsNutsData.getCardConfigs();
    for (var i = 0; i < cardConfigs.length; i++) {
      var cardConfig = cardConfigs[i];
      if (cardConfig.title == title) {
        return cardConfig;
      }
    }
    return null;
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    addCardFront: addCardFront,
    addCardFrontAtIndex: addCardFrontAtIndex,
    addCardBack: addCardBack,
    addTrailMixCard: addTrailMixCard,
    getCardConfigByTitle: getCardConfigByTitle,
  };
});
