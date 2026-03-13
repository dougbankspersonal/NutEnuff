define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "javascript/gameInfo",
  "javascript/mixedNutsCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  systemConfigs,
  gameInfo,
  mixedNutsCardData,
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const dropShadowClass = "drop_shadow";
  const defaultFontSizePx = 36;

  const collectableItemSize = 55;
  const collectableItemInitialRotate = -20;
  const collectableIteFinalRotate = -collectableItemInitialRotate;

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

    htmlUtils.addDiv(
      parentNode,
      ["colon_and_points"],
      "colonAndPoints",
      pointsString,
    );

    htmlUtils.addImage(parentNode, ["coin", "dark-shadowed"], "coin");
  }

  function renderTrailMixCustom(parentNode, customRendering) {
    // Parent is a flex row.
    domStyle.set(parentNode, {
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      "justify-content": "center",
    });

    // Left of row: all 4 nuts in a box, 2 and 2.
    var nutRowsNode = htmlUtils.addDiv(parentNode, ["nut-rows"], "nutRows");
    // First row: peanut plus almond plus.
    var firstRowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "firstRow");
    htmlUtils.addImage(
      firstRowNode,
      ["peanut", "dark-shadowed", "nut-image"],
      "peanut",
    );
    htmlUtils.addDiv(firstRowNode, ["plus"], "plus", "+");
    htmlUtils.addImage(
      firstRowNode,
      ["almond", "dark-shadowed", "nut-image"],
      "almond",
    );
    htmlUtils.addDiv(firstRowNode, ["plus"], "plus", "+");

    // Second row: cashew and macadamia.
    var secondRowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "secondRow");
    htmlUtils.addImage(
      secondRowNode,
      ["cashew", "dark-shadowed", "nut-image"],
      "cashew",
    );
    htmlUtils.addDiv(secondRowNode, ["plus"], "plus", "+");
    htmlUtils.addImage(
      secondRowNode,
      ["macadamia", "dark-shadowed", "nut-image"],
      "macadamia",
    );

    // Right of row: n points node.
    insertSomethingEqualsPointsNode(parentNode, customRendering.points);
  }

  function renderHotSpiceCustom(parentNode, _) {
    // +1 per peanut.
    htmlUtils.addDiv(parentNode, ["plus"], "plus", "+1");
    htmlUtils.addImage(parentNode, ["coin", "dark-shadowed"], "coin");
    htmlUtils.addDiv(parentNode, ["per"], "per", "/");
    htmlUtils.addImage(parentNode, ["peanut", "dark-shadowed"], "peanut");
  }

  function renderAcornCustom(parentNode, customRendering) {
    craftingNode = htmlUtils.addDiv(
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
        mixedNutsCardData.itemTypes.Walnut,
        itemCount,
        points,
      );
    }
  }

  function renderMysteryCustom(parentNode, _) {
    // Desk, arrow, mystery card.
    var deskNode = htmlUtils.addImage(
      cannotBeCraftedNode,
      ["desk", "dark-shadowed"],
      "desk",
    );

    var wrapperNode = htmlUtils.addDiv(
      parentNode,
      ["mystery-card-wrapper"],
      "mysteryCardWrapper",
    );
    htmlUtils.addImage(wrapperNode, ["mystery", "dark-shadowed"], "mystery");
  }

  function renderHoneyRoastedCustom(parentNode, customRendering) {
    // Table maps card type to bonus.
    var nutToBonusMap = customRendering.nutToBonusMap;
    // Parent is a column of rows.
    domStyle.set(parentNode, {
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      "justify-content": "center",
    });

    // Child is nut rows.
    var nutRowsNode = htmlUtils.addDiv(parentNode, ["nut-rows"], "nut-rows");

    for (var nut in nutToBonusMap) {
      // Each row is a row of cells.
      var rowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "nut-row");
      // Add a plus
      htmlUtils.addDiv(rowNode, ["plus"], "plus", "+");
      // Add the nut image.
      htmlUtils.addImage(
        rowNode,
        [nut, "dark-shadowed", "nut-image"],
        nut + "Image",
      );
      // Add an equals and the points.
      insertSomethingEqualsPointsNode(rowNode, nutToBonusMap[nut]);
    }
  }

  const gCustomRenderersByClass = {
    [mixedNutsCardData.specialTypes.TrailMix]: renderTrailMixCustom,
    [mixedNutsCardData.specialTypes.HotSpice]: renderHotSpiceCustom,
    [mixedNutsCardData.specialTypes.HoneyRoasted]: renderHoneyRoastedCustom,
    [mixedNutsCardData.specialTypes.Mystery]: renderMysteryCustom,
    [mixedNutsCardData.itemTypes.Walnut]: renderWalnutCustom,
    [mixedNutsCardData.itemTypes.Acorn]: renderAcornCustom,
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

  function addCollectableItem(parent, itemClass) {
    var node = htmlUtils.addImage(
      parent,
      ["collectable-item", itemClass],
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

    var customRenderingWrapperNode = htmlUtils.addDiv(
      parentNode,
      ["custom-rendering-wrapper", cardConfig.cardClass],
      "custom-rendering-wrapper",
    );

    if (customRendering.useClassToIndexFunction) {
      var customRenderer = gCustomRenderersByClass[cardConfig.cardClass];
      console.assert(
        customRenderer,
        "No custom renderer for " + cardConfig.cardClass,
      );
      customRenderer(customRenderingWrapperNode, customRendering);
    } else {
      if (customRendering.customRenderingImageClasses) {
        for (
          var i = 0;
          i < customRendering.customRenderingImageClasses.length;
          i++
        ) {
          addNthSpecialImage(
            customRenderingWrapperNode,
            customRendering.customRenderingImageClasses[i],
            i,
            customRendering.specialImagesSeparator,
          );
        }
      }
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
      var marginAsPercent = Math.floor((1 - scale) * 50);
      debugLog("addCustomRendering", "scale = ", JSON.stringify(scale));
      domStyle.set(customRenderingWrapperNode, {
        zoom: `${scale}`,
      });
    }

    return customRenderingWrapperNode;
  }

  function addPlayerIndicator(parent, cardConfig, indexWithinConfig) {
    var countConfigs = cardConfig.countConfigs;
    debugLog(
      "Cards",
      "Doug: addPlayerIndicator: indexWithinConfig = " + indexWithinConfig,
    );

    // Handled by the if statement below but just to make it explicit:
    if (!countConfigs || countConfigs.length <= 1) {
      return null;
    }

    // Count configs says, in order of players & increasing card count, for this
    // many players, use this many cards.
    // For 2 players we don't need a count indicator: they always go in.
    // For a 3 player game, we want the delta from 3 to 4 to player to be marked 3+.
    // Etc.
    for (var i = 1; i < countConfigs.length; i++) {
      var previousCountConfig = countConfigs[i - 1];
      var thisCountConfig = countConfigs[i];

      if (
        indexWithinConfig >= previousCountConfig.count &&
        indexWithinConfig < thisCountConfig.count
      ) {
        var playerIndicatorNode = htmlUtils.addDiv(
          parent,
          ["player_indicator"],
          "playerIndicator",
        );
        htmlUtils.addImage(playerIndicatorNode, ["player"], "player");

        var maybePlus =
          thisCountConfig.numPlayers == gameInfo.maxPlayers ? "" : "+";
        htmlUtils.addDiv(
          playerIndicatorNode,
          ["player_count"],
          "playerCount",
          thisCountConfig.numPlayers.toString() + maybePlus,
        );
        return playerIndicatorNode;
      }
    }
    return null;
  }

  // A display of n fixed-sized items
  function addCollectibleItemSetIndicator(parentNode, itemClass, itemCount) {
    var sc = systemConfigs.getSystemConfigs();
    var collectableItemSetWidthPx = sc.cardWidthPx * 0.4;
    var collectableItemSetHeightPx = collectableItemSize;

    console.assert(itemCount > 0, "Item count must be defined");

    var collectableItemSetNode = htmlUtils.addDiv(
      parentNode,
      ["collectable-item-set", itemClass],
      "collectable-item-set",
    );

    domStyle.set(collectableItemSetNode, {
      width: `${collectableItemSetWidthPx}px`,
      height: `${collectableItemSetHeightPx}px`,
    });

    var widthMinusPoofedItem = collectableItemSetWidthPx - collectableItemSize;
    var leftChunk = widthMinusPoofedItem / (itemCount - 1);

    var rotationStep =
      (-collectableItemInitialRotate - collectableItemInitialRotate) /
      (itemCount - 1);
    for (var i = 0; i < itemCount; i++) {
      var childNode = addCollectableItem(collectableItemSetNode, itemClass);
      var cardLeft = i * leftChunk;

      domStyle.set(childNode, {
        left: `${cardLeft}px`,
        rotate: `${collectableItemInitialRotate + rotationStep * i}deg`,
      });
    }

    return collectableItemSetNode;
  }

  function addCardCorners(parent, cardConfig) {
    var cornerClass = cardConfig.itemClass
      ? cardConfig.itemClass
      : cardConfig.cardClass;
    debugLog(
      "addCardCorners",
      "Doug: cardConfig = " + JSON.stringify(cardConfig),
    );
    debugLog(
      "addCardCorners",
      "cornerClass = " +
        cornerClass +
        " for cardConfig.title = " +
        cardConfig.title,
    );

    var classes = [cornerClass, dropShadowClass, "component_image"];

    var index0Classes = [...classes, "index0"];
    var index1Classes = [...classes, "index1"];
    if (cardConfig.extraCorner) {
      index0Classes.push("first");
      index1Classes.push("first");
    }

    htmlUtils.addImage(parent, index0Classes, "component_image");
    htmlUtils.addImage(parent, index1Classes, "component_image");

    if (cardConfig.extraCorner) {
      var index0Classes = [
        ...classes,
        cardConfig.extraCorner,
        "index0",
        "second",
      ];
      var index1Classes = [
        ...classes,
        cardConfig.extraCorner,
        "index1",
        "second",
      ];
      htmlUtils.addImage(parent, index0Classes, "component_image");
      htmlUtils.addImage(parent, index1Classes, "component_image");
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

  function addStandardCraftingInfo(parentNode, itemClass, itemCount, points) {
    craftingNode = htmlUtils.addDiv(
      parentNode,
      ["craft-wrapper", "unbroken-row"],
      "craftWrapper",
    );

    addCollectibleItemSetIndicator(craftingNode, itemClass, itemCount);
    insertSomethingEqualsPointsNode(craftingNode, points);
  }

  function maybeAddStandardCraftingInfo(parentNode, cardConfig) {
    var craftingNode = null;
    if (cardConfig.craft) {
      var craftConfig = cardConfig.craft;
      if (craftConfig.number > 0) {
        var itemClass = cardConfig.itemClass
          ? cardConfig.itemClass
          : cardConfig.cardClass;
        addStandardCraftingInfo(
          parentNode,
          itemClass,
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

  function addFields(parent, cardConfig, indexWithinConfig) {
    // These are the icons in upper left and lower corner of card.
    addCardCorners(parent, cardConfig);
    addPlayerIndicator(parent, cardConfig, indexWithinConfig);

    var mainWrapper = htmlUtils.addDiv(parent, ["main_wrapper"], "mainWapper");
    if (cardConfig.title) {
      var imageNode = htmlUtils.addDiv(
        mainWrapper,
        ["title"],
        "title",
        cardConfig.title,
      );
      var fontSize = defaultFontSizePx;
      if (cardConfig.fontAdjustment) {
        fontSize = Math.floor(fontSize * cardConfig.fontAdjustment);
      }
      domStyle.set(imageNode, "font-size", `${fontSize}px`);
    }

    maybeAddStandardCraftingInfo(mainWrapper, cardConfig);

    if (cardConfig.customRendering) {
      addCustomRendering(mainWrapper, cardConfig);
    }

    maybeAddStandardFloorPenalty(mainWrapper, cardConfig);
  }

  function addCardBack(parent, index, extraClasses) {
    var classes = extraClasses
      ? ["back", "mixed-nuts", ...extraClasses]
      : ["back", "mixed-nuts"];
    var backNode = htmlUtils.addCard(parent, classes, "back-" + index);

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset-" + index);

    var imageNode = htmlUtils.addImage(
      insetNode,
      ["mixed-nuts"],
      "mixed-nuts-back-image-" + index,
    );
    htmlUtils.addDiv(
      insetNode,
      ["title", "small"],
      "title-small-" + index,
      "Mixed",
    );
    htmlUtils.addDiv(insetNode, ["title", "big"], "title-big-" + index, "Nuts");

    return backNode;
  }

  function addCardFront(parent, cardConfig, index, opt_indexWithinConfig) {
    var indexWithinConfig =
      opt_indexWithinConfig !== undefined ? opt_indexWithinConfig : 0;

    var idElements = ["mixed-nuts-component", index.toString()];
    var id = idElements.join(".");

    var classArray = [];
    classArray.push("mixed-nuts-component");
    classArray.push(cardConfig.cardClass);
    classArray.push(cardConfig.deckId);
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    var gradient = `linear-gradient(
      to bottom,
      ${cardConfig.color} 0%,
      white 15%,
      white 85%,
      ${cardConfig.color} 100%
    )`;

    domStyle.set(cardFrontNode, {
      background: gradient,
    });

    addFields(cardFrontNode, cardConfig, indexWithinConfig);
    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: index = " + index,
    );
    var cardConfigs = mixedNutsCardData.getCardConfigs();
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
      for (cardConfig of mixedNutsCardData.getCardConfigs()) {
        debugLog("getNumCards", "Doug: cardConfig.title = " + cardConfig.title);
        debugLog(
          "getNumCards",
          "Doug: countConfigs = " + JSON.stringify(cardConfig.countConfigs),
        );
      }

      gNumCards = cards.getNumCardsFromConfigs(
        mixedNutsCardData.getCardConfigs(),
      );
      debugLog("getNumCards", "Doug: gNumCards = " + gNumCards);

      // While we're here: how many in a game?  We only use 3 specials.
      var specialCount = 0;
      var cardsPerGameByPlayer = {};
      for (cardConfig of mixedNutsCardData.getCardConfigs()) {
        var countConfigs = cardConfig.countConfigs;
        if (cardConfig.playType == "special") {
          specialCount += 1;
          if (specialCount > 3) {
            debugLog("getNumCards", "Doug: skipping " + cardConfig.title);
            continue;
          }
        }
        debugLog("getNumCards", "Doug: counting " + cardConfig.title);
        for (var i = 0; i < countConfigs.length; i++) {
          var countConfig = countConfigs[i];
          var numPlayers = countConfig.numPlayers;
          var numCards = countConfig.count;
          if (!cardsPerGameByPlayer[numPlayers]) {
            cardsPerGameByPlayer[numPlayers] = 0;
          }
          cardsPerGameByPlayer[numPlayers] += numCards;
        }
      }
      debugLog(
        "getNumCards",
        "How many cards are put into the deck in a real game: all the basics plus 3 specials: ",
        JSON.stringify(cardsPerGameByPlayer),
      );

      var cardsNeededByPlayer = {};
      for (
        var numPlayers = 2;
        numPlayers <= gameInfo.maxPlayers;
        numPlayers++
      ) {
        cardsNeededByPlayer[numPlayers] =
          mixedNutsCardData.totalCardsPerPlayer(numPlayers);
      }
      debugLog(
        "getNumCards",
        "How many cards are dealt out of the deck in a real game: some multiple of num players plus remainder: ",
        JSON.stringify(cardsNeededByPlayer),
      );
    }
    return gNumCards;
  }

  function getCardConfigByTitle(title) {
    var cardConfigs = mixedNutsCardData.getCardConfigs();
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
    getCardConfigByTitle: getCardConfigByTitle,
  };
});
