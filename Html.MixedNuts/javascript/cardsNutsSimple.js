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
    return imageWrapperNode;
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

  function addFields(parent, cardConfig) {
    debugLog("addFields", "cardConfig = " + JSON.stringify(cardConfig));

    if (cardConfig.mustMatch !== undefined) {
      if (cardConfig.mustMatch) {
        htmlUtils.addDiv(
          parent,
          ["must-match", "equal", "decorated"],
          "must-match",
          "=",
        );
      } else {
        htmlUtils.addDiv(
          parent,
          ["must-match", "not-equal", "decorated"],
          "must-match",
          "≠",
        );
      }
      return;
    }

    var mainWrapper = htmlUtils.addDiv(parent, ["main-wrapper"], "mainWapper");
    // These are the icons in upper left and lower corner of card.
    addCardImageNode(mainWrapper, cardConfig);
    addTitleNode(parent, cardConfig);

    if (cardConfig.question) {
      htmlUtils.addDiv(parent, ["space-config", "question"], "question", "?");
    }
    if (cardConfig.required) {
      htmlUtils.addDiv(parent, ["space-config", "required"], "required", "!");
    }
    if (cardConfig.bonus) {
      htmlUtils.addDiv(
        parent,
        ["space-config", "bonus"],
        "bonus",
        `+${cardConfig.bonus}` + gameInfo.coinString,
      );
    }
  }

  function addCardBack(parent) {
    debugLog("addCardBack", "in addCardBack");
    var classes = ["back", "nuts"];
    var backNode = htmlUtils.addCard(parent, classes, "back");

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset");

    var imageNode = htmlUtils.addImage(insetNode, ["squirrel"], "squirrel");

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

    var baseColor = cardConfig.color;
    var adjustedColor = genericUtils.darkenColor(baseColor, 50);
    return adjustedColor;
  }

  function addCardFront(parent, index) {
    var cardConfigs = cardsNutsData.getCardConfigs();
    console.assert(cardConfigs, "cardConfigs is null");
    console.assert(parent, "parent is null");
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    debugLog(
      "addCardFront",
      "simple: cardConfig = " + JSON.stringify(cardConfig),
    );

    var idElements = ["nuts", index.toString()];
    var id = idElements.join(".");

    var classArray = cardConfig.classes;

    var cardFrontNode = cards.addCardFront(parent, classArray, id);
    var borderColor = getBorderColor(cardConfig);
    if (cardConfig.question) {
      borderColor = "#ffff00";
    }
    var bgColor1 = "#ffffff";
    var bgColor2 = cardConfig.color;
    if (cardConfig.required) {
      bgColor1 += "88";
      bgColor2 += "88";
    }
    debugLog(
      "addCardFront",
      "bgColor1 = " + bgColor1 + ", bgColor2 = " + bgColor2,
    );

    domStyle.set(cardFrontNode, {
      background: `radial-gradient(${bgColor1} 50%, ${bgColor2})`,
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
